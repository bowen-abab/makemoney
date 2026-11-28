import { useEffect, useState } from 'react'
import SettingsModal from './components/SettingsModal.jsx'
import AuthModal from './components/AuthModal.jsx'
import BunnyScene from './components/BunnyScene.jsx'
import { loadConfig, saveConfig, normalizeConfig, getBreakMinutes, getEarnedStats, getCountdownInfo, formatMoney, formatSmall } from './lib/pay.js'
import { supabase, isSupabaseConfigured } from './lib/supabase.js'

const WEEK_NAMES = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']

// 适配本地根路径与 GitHub Pages 子路径（/makemoney/）
const asset = (name) => `${import.meta.env.BASE_URL}${name}`

const MOODS = [
  { key: 'work', label: '努力工作中', image: asset('bunny.png'), desc: '它也在电脑前，陪你把这一秒变成收入。', weight: 0.75 },
  { key: 'slack', label: '摸鱼中~', image: asset('bunny-slack.png'), desc: '伸个懒腰，偷偷放空一下。', weight: 0.0625 },
  { key: 'sleep', label: '打个盹~', image: asset('bunny-sleep.png'), desc: '眯一会儿，梦里也在赚钱。', weight: 0.0625 },
  { key: 'drink', label: '喝水中', image: asset('bunny-drink.png'), desc: '喝口水，继续搬砖。', weight: 0.0625 },
  { key: 'phone', label: '刷会儿手机', image: asset('bunny-phone.png'), desc: '偷偷看一眼，马上回来。', weight: 0.0625 },
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

const REST_SCENE = {
  label: '',
  image: asset('bunny-sleep.png'),
  desc: '休息一下，等你回来继续。',
}

function formatClock(date) {
  const pad = (value) => String(value).padStart(2, '0')
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 ${WEEK_NAMES[date.getDay()]} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
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
  const [now, setNow] = useState(() => new Date())
  const [showSettings, setShowSettings] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [user, setUser] = useState(null)
  const [syncNote, setSyncNote] = useState('')
  const [mood, setMood] = useState('work')

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

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
  const countdown = getCountdownInfo(now, config)
  const monthProgress = Number(config.salary) > 0
    ? Math.min(100, Math.max(0, (stats.earned / Number(config.salary)) * 100))
    : 0

  useEffect(() => {
    if (stats.status !== 'working') return undefined
    const pick = () => setMood(pickMood())
    pick()
    const timer = setInterval(pick, 5 * 60 * 1000)
    return () => clearInterval(timer)
  }, [stats.status])

  const scene = stats.status === 'working'
    ? MOODS.find((item) => item.key === mood) || MOODS[0]
    : { ...REST_SCENE, label: stats.label }

  const handleSave = async (nextConfig) => {
    saveConfig(nextConfig)
    setConfig(nextConfig)
    setShowSettings(false)
    if (!user || !supabase) return
    setSyncNote('同步中…')
    const { error } = await supabase.from('user_settings').upsert(toRemoteRow(user, nextConfig))
    setSyncNote(error ? '同步失败' : '已同步到云端')
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
            <small>把时间换算成收入</small>
          </span>
        </div>
        <div className="topbar-right">
          <time className="clock">
            <span className="live-dot" />
            {formatClock(now)}
          </time>
          {syncNote && <span className="sync-note">{syncNote}</span>}
          {isSupabaseConfigured && (
            user ? (
              <>
                <span className="user-email" title={user.email}>{user.email.split('@')[0]}</span>
                <button className="pill-btn" onClick={handleSignOut}>退出</button>
              </>
            ) : (
              <button className="pill-btn" onClick={() => setShowAuth(true)}>登录</button>
            )
          )}
          <button className="pill-btn primary" onClick={() => setShowSettings(true)}>
            设置
          </button>
        </div>
      </header>

      <section className="card hero">
        <div className="hero-head">
          <span className="eyebrow">本月已赚</span>
          <span className="live-tag"><i />实时累计</span>
        </div>
        <h1 className="amount">
          <span className="yen">¥</span>{formatMoney(stats.earned)}
        </h1>
        <p className="amount-note">按本月实际工作日与有效工时计算</p>

        <div className="progress-block">
          <div className="progress-head">
            <span>本月进度</span>
            <span className="progress-pct">{monthProgress.toFixed(1)}%</span>
          </div>
          <div className="progress-track"><div className="progress-fill" style={{ width: `${monthProgress}%` }} /></div>
          <div className="progress-caption">
            <span>¥{formatMoney(stats.earned)} / ¥{formatMoney(config.salary)}</span>
            <span>本月 {stats.totalWorkdays} 个工作日</span>
          </div>
        </div>

        <div className="rule" />
        <div className="metrics">
          <div className="metric">
            <span>每秒</span>
            <strong>¥{formatSmall(stats.perSecond)}</strong>
          </div>
          <div className="metric">
            <span>今日已赚</span>
            <strong>¥{formatMoney(todayEarned)}</strong>
          </div>
          <div className="metric">
            <span>{countdown.label}</span>
            <strong className="countdown-value">{countdown.text}</strong>
          </div>
        </div>
      </section>

      <BunnyScene
        label={scene.label}
        image={scene.image}
        desc={scene.desc}
        popText={`+¥${formatSmall(stats.perSecond)}`}
        tick={now.getTime()}
        working={stats.status === 'working'}
      />

      {showSettings && (
        <SettingsModal
          config={config}
          onClose={() => setShowSettings(false)}
          onSave={handleSave}
        />
      )}

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </div>
  )
}
