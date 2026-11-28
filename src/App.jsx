import { useEffect, useState } from 'react'
import SettingsModal from './components/SettingsModal.jsx'
import AuthModal from './components/AuthModal.jsx'
import BunnyScene from './components/BunnyScene.jsx'
import { loadConfig, saveConfig, normalizeConfig, getBreakMinutes, getEarnedStats, getCountdownInfo, formatMoney, formatSmall } from './lib/pay.js'
import { supabase, isSupabaseConfigured } from './lib/supabase.js'
import { LANGS, loadLang, saveLang, translate } from './lib/i18n.js'

const CN_WEEK_NAMES = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
const EN_WEEK_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const EN_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// 适配本地根路径与 GitHub Pages 子路径（/makemoney/）
const asset = (name) => `${import.meta.env.BASE_URL}${name}`

const MOODS = [
  { key: 'work', image: asset('bunny-work.webp'), weight: 0.2 },
  { key: 'slack', image: asset('bunny-slack.webp'), weight: 0.2 },
  { key: 'sleep', image: asset('bunny-sleep.webp'), weight: 0.2 },
  { key: 'drink', image: asset('bunny-drink.webp'), weight: 0.2 },
  { key: 'phone', image: asset('bunny-phone.webp'), weight: 0.2 },
]

function pickMood() {
  const value = Math.random()
  let acc = 0
  for (const item of MOODS) {
    acc += item.weight
    if (value < acc) return item.key
  }
  return 'work'
}

const REST_SCENE = { image: asset('bunny-sleep.webp') }

function formatClock(date, lang) {
  const pad = (value) => String(value).padStart(2, '0')
  const time = `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
  if (lang === 'en') {
    return `${EN_WEEK_NAMES[date.getDay()]}, ${EN_MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()} ${time}`
  }
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 ${CN_WEEK_NAMES[date.getDay()]} ${time}`
}

function toRemoteRow(user, config) {
  return {
    user_id: user.id,
    salary: config.salary,
    workdays: config.workdays,
    start_time: config.startTime,
    end_time: config.endTime,
    // 同时写入新字段与旧字段：新客户端用起止时间，旧客户端仍可读到午休时长
    lunch_start: config.lunchStart,
    lunch_end: config.lunchEnd,
    break_minutes: getBreakMinutes(config),
    updated_at: new Date().toISOString(),
  }
}

function fromRemoteRow(row) {
  return normalizeConfig({
    salary: row.salary,
    workdays: Array.isArray(row.workdays) ? row.workdays : [],
    startTime: row.start_time,
    endTime: row.end_time,
    lunchStart: row.lunch_start,
    lunchEnd: row.lunch_end,
    breakMinutes: row.break_minutes,
  })
}

export default function App() {
  const [config, setConfig] = useState(() => loadConfig())
  const [lang, setLang] = useState(() => loadLang())
  const [now, setNow] = useState(() => new Date())
  const [showSettings, setShowSettings] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [user, setUser] = useState(null)
  const [syncNote, setSyncNote] = useState('')
  const [mood, setMood] = useState('work')

  const t = (key, vars) => translate(lang, key, vars)

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    saveLang(lang)
    document.title = t('page.title')
  }, [lang])

  useEffect(() => {
    if (!supabase) return undefined
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const nextUser = session?.user || null
      setUser(nextUser)
      if (!nextUser) {
        setConfig(loadConfig())
        return
      }
      supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', nextUser.id)
        .maybeSingle()
        .then(({ data }) => {
          if (data) {
            const remote = fromRemoteRow(data)
            setConfig(remote)
            saveConfig(remote)
          } else {
            supabase.from('user_settings').upsert(toRemoteRow(nextUser, loadConfig()))
          }
        })
    })
    return () => subscription.unsubscribe()
  }, [])

  const stats = getEarnedStats(now, config)
  const todayEarned = stats.workingSecondsToday * stats.perSecond
  const countdown = getCountdownInfo(now, config, lang)
  const countdownText = countdown.textKey ? t(countdown.textKey) : countdown.text
  const monthProgress = Number(config.salary) > 0
    ? Math.min(100, Math.max(0, (stats.earned / Number(config.salary)) * 100))
    : 0

  useEffect(() => {
    if (stats.status !== 'working') return undefined
    const pick = () => setMood(pickMood())
    pick()
    const timer = setInterval(pick, 60 * 1000)
    return () => clearInterval(timer)
  }, [stats.status])

  const activeMood = MOODS.find((item) => item.key === mood) || MOODS[0]
  const scene = stats.status === 'working'
    ? {
        ...activeMood,
        label: t(`mood.${activeMood.key}.label`),
        desc: t(`mood.${activeMood.key}.desc`),
      }
    : { ...REST_SCENE, label: t(stats.labelKey), desc: t('rest.desc') }

  const handleSave = async (nextConfig) => {
    saveConfig(nextConfig)
    setConfig(nextConfig)
    setShowSettings(false)
    if (!user || !supabase) return
    setSyncNote(t('sync.syncing'))
    const { error } = await supabase.from('user_settings').upsert(toRemoteRow(user, nextConfig))
    setSyncNote(error ? t('sync.failed') : t('sync.success'))
  }

  const handleSignOut = async () => {
    if (!supabase) return
    await supabase.auth.signOut()
    setSyncNote('')
  }

  return (
    <div className="page">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">¥</span>
          <span className="brand-copy">
            <strong>MAKEMONEY</strong>
            <small>{t('brand.subtitle')}</small>
          </span>
        </div>
        <div className="topbar-right">
          <time className="clock">
            <span className="live-dot" />
            {formatClock(now, lang)}
          </time>
          <div className="lang-switch" role="group" aria-label={t('lang.switch')}>
            {LANGS.map((item) => (
              <button
                key={item.key}
                type="button"
                className={lang === item.key ? 'active' : ''}
                onClick={() => setLang(item.key)}
                title={item.label}
              >
                {item.short}
              </button>
            ))}
          </div>
          {syncNote && <span className="sync-note">{syncNote}</span>}
          {isSupabaseConfigured && (
            user ? (
              <>
                <span className="user-email" title={user.email}>{user.email.split('@')[0]}</span>
                <button className="pill-btn" onClick={handleSignOut}>{t('action.logout')}</button>
              </>
            ) : (
              <button className="pill-btn" onClick={() => setShowAuth(true)}>{t('action.login')}</button>
            )
          )}
          <button className="pill-btn primary" onClick={() => setShowSettings(true)}>
            {t('action.settings')}
          </button>
        </div>
      </header>

      <section className="card hero">
        <div className="hero-head">
          <span className="eyebrow">{t('hero.eyebrow')}</span>
          <span className="live-tag"><i />{t('hero.live')}</span>
        </div>
        <h1 className="amount">
          <span className="yen">¥</span>{formatMoney(stats.earned)}
        </h1>
        <p className="amount-note">{t('hero.note')}</p>

        <div className="progress-block">
          <div className="progress-head">
            <span>{t('hero.progress')}</span>
            <span className="progress-pct">{monthProgress.toFixed(1)}%</span>
          </div>
          <div className="progress-track"><div className="progress-fill" style={{ width: `${monthProgress}%` }} /></div>
          <div className="progress-caption">
            <span>¥{formatMoney(stats.earned)} / ¥{formatMoney(config.salary)}</span>
            <span>{t('hero.workdays', { days: stats.totalWorkdays })}</span>
          </div>
        </div>

        <div className="rule" />
        <div className="metrics">
          <div className="metric">
            <span>{t('metric.second')}</span>
            <strong>¥{formatSmall(stats.perSecond)}</strong>
          </div>
          <div className="metric">
            <span>{t('metric.today')}</span>
            <strong>¥{formatMoney(todayEarned)}</strong>
          </div>
          <div className="metric">
            <span>{t(countdown.labelKey)}</span>
            <strong className="countdown-value">{countdownText}</strong>
          </div>
        </div>
      </section>

      <BunnyScene
        label={scene.label}
        image={scene.image}
        desc={scene.desc}
        alt={t('bunny.alt', { label: scene.label })}
        popText={`+¥${formatSmall(stats.perSecond)}`}
        tick={now.getTime()}
        working={stats.status === 'working'}
        statusLabel={t('bunny.status')}
      />

      {showSettings && (
        <SettingsModal
          config={config}
          lang={lang}
          t={t}
          onClose={() => setShowSettings(false)}
          onSave={handleSave}
        />
      )}

      {showAuth && <AuthModal t={t} onClose={() => setShowAuth(false)} />}
    </div>
  )
}
