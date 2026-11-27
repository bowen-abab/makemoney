import { useEffect, useState } from 'react'
import { formatSmall } from '../lib/pay.js'

export default function BunnyScene({ working, label, perSecond, tick }) {
  const [pulses, setPulses] = useState([])
  const [mood, setMood] = useState('typing')

  useEffect(() => {
    if (!working) {
      setMood('rest')
      return
    }
    setMood('typing')
    const interval = setInterval(() => {
      const random = Math.random()
      setMood(random < 0.72 ? 'typing' : random < 0.86 ? 'slack' : 'yawn')
    }, 8000)
    return () => clearInterval(interval)
  }, [working])

  useEffect(() => {
    if (!working || !tick) return
    const id = `${tick}-${Math.random().toString(36).slice(2)}`
    setPulses((prev) => [...prev, id])
  }, [tick, working])

  const removePulse = (id) => {
    setPulses((prev) => prev.filter((item) => item !== id))
  }

  const displayLabel = !working
    ? label
    : mood === 'slack'
      ? '摸鱼中~'
      : mood === 'yawn'
        ? '哈欠~'
        : label

  return (
    <section className={`bunny-scene mood-${mood} ${working ? 'is-working' : 'is-resting'}`}>
      <div className="room-window" aria-hidden="true" />
      <div className="room-shelf" aria-hidden="true">
        <span /><span /><span /><span />
      </div>
      <div className="room-plant" aria-hidden="true">
        <span /><span /><span />
      </div>
      <div className="rug" aria-hidden="true" />

      <div className="bunny-status">
        {working && mood === 'slack' && (
          <svg viewBox="0 0 40 24" width="26" height="16" aria-hidden="true">
            <ellipse cx="18" cy="12" rx="12" ry="7" fill="#F9A8D4" stroke="#9A3412" strokeWidth="1.5" />
            <path d="M6 12 L0 6 L0 18 Z" fill="#F9A8D4" stroke="#9A3412" strokeWidth="1.5" />
            <circle cx="22" cy="10" r="1.6" fill="#7C2D12" />
          </svg>
        )}
        {working && mood === 'yawn' && <span className="mini-z">z</span>}
        <span>{displayLabel}</span>
      </div>

      <div className="float-layer">
        {pulses.map((id) => (
          <span
            key={id}
            className="money-pop"
            onAnimationEnd={() => removePulse(id)}
          >
            +¥{formatSmall(perSecond)}
          </span>
        ))}
      </div>

      <img className="bunny-img" src="/bunny.png" alt="动漫小兔子在电脑前努力工作" />
    </section>
  )
}
