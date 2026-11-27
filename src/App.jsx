import { useEffect, useState } from 'react'
import SettingsModal from './components/SettingsModal.jsx'
import BunnyScene from './components/BunnyScene.jsx'
import { loadConfig, saveConfig, getEarnedStats, formatMoney, formatSmall } from './lib/pay.js'

const WEEK_NAMES = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']

const MOODS = [
  { key: 'work', label: '努力工作中', image: '/bunny.png', desc: '它也在电脑前，陪你把这一秒变成收入。' },
  { key: 'slack', label: '摸鱼中~', image: '/bunny-slack.png', desc: '伸个懒腰，偷偷放空一下。' },
  { key: 'sleep', label: '打个盹~', image: '/bunny-sleep.png', desc: '眯一会儿，梦里也在赚钱。' },
  { key: 'drink', label: '喝水中', image: '/bunny-drink.png', desc: '喝口水，继续搬砖。' },
  { key: 'phone', label: '刷会儿手机', image: '/bunny-phone.png', desc: '偷偷看一眼，马上回来。' },
]

const REST_SCENE = {
  label: '',
  image: '/bunny-sleep.png',
  desc: '休息一下，等你回来继续。',
}

function formatClock(date) {
  const pad = (value) => String(value).padStart(2, '0')
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 ${WEEK_NAMES[date.getDay()]} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

export default function App() {
  const [config, setConfig] = useState(() => loadConfig())
  const [now, setNow] = useState(() => new Date())
  const [showSettings, setShowSettings] = useState(false)
  const [mood, setMood] = useState('work')

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const stats = getEarnedStats(now, config)
  const todayEarned = stats.workingSecondsToday * stats.perSecond

  useEffect(() => {
    if (stats.status !== 'working') return undefined
    const pick = () => {
      const next = MOODS[Math.floor(Math.random() * MOODS.length)]
      setMood(next.key)
    }
    pick()
    const timer = setInterval(pick, 7000)
    return () => clearInterval(timer)
  }, [stats.status])

  const scene = stats.status === 'working'
    ? MOODS.find((item) => item.key === mood) || MOODS[0]
    : { ...REST_SCENE, label: stats.label }

  const handleSave = (nextConfig) => {
    saveConfig(nextConfig)
    setConfig(nextConfig)
    setShowSettings(false)
  }

  return (
    <div className="page">
      <header className="topbar">
        <div className="brand">
          MAKEMONEY
          <span>把时间换算成收入</span>
        </div>
        <div className="topbar-right">
          <time>{formatClock(now)}</time>
          <button className="text-btn" onClick={() => setShowSettings(true)}>
            设置
          </button>
        </div>
      </header>

      <section className="card hero">
        <p className="eyebrow">本月已赚</p>
        <h1 className="amount">
          <span className="yen">¥</span>{formatMoney(stats.earned)}
        </h1>
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
            <span>本月工作日</span>
            <strong>{stats.totalWorkdays} 天</strong>
          </div>
        </div>
      </section>

      <BunnyScene label={scene.label} image={scene.image} desc={scene.desc} />

      {showSettings && (
        <SettingsModal
          config={config}
          onClose={() => setShowSettings(false)}
          onSave={handleSave}
        />
      )}
    </div>
  )
}
