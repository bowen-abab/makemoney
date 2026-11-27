import { useEffect, useState } from 'react'
import SettingsModal from './components/SettingsModal.jsx'
import BunnyScene from './components/BunnyScene.jsx'
import { loadConfig, saveConfig, getEarnedStats, formatMoney, formatSmall } from './lib/pay.js'

const WEEK_NAMES = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']

function formatClock(date) {
  const pad = (value) => String(value).padStart(2, '0')
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 ${WEEK_NAMES[date.getDay()]} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

export default function App() {
  const [config, setConfig] = useState(() => loadConfig())
  const [now, setNow] = useState(() => new Date())
  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const stats = getEarnedStats(now, config)
  const working = stats.status === 'working'

  const handleSave = (nextConfig) => {
    saveConfig(nextConfig)
    setConfig(nextConfig)
    setShowSettings(false)
  }

  return (
    <div className="app-shell">
      <button
        className="settings-btn"
        onClick={() => setShowSettings(true)}
        aria-label="修改设置"
        title="修改设置"
      >
        ⚙
      </button>

      <header className="clock">{formatClock(now)}</header>

      <main className="money-panel">
        <p className="money-label">本月已赚</p>
        <h1 className="money-value">¥ {formatMoney(stats.earned)}</h1>
        <div className="money-meta">
          <span>每秒 ≈ ¥{formatSmall(stats.perSecond)}</span>
          <span className={`status-pill ${working ? 'on' : 'off'}`}>{stats.label}</span>
        </div>
      </main>

      <BunnyScene working={working} perSecond={stats.perSecond} tick={now.getTime()} />

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
