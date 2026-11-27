import { useEffect, useState } from 'react'
import { formatSmall } from '../lib/pay.js'

export default function BunnyScene({ working, perSecond, tick }) {
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

  return (
    <section className={`bunny-scene mood-${mood} ${working ? 'is-working' : 'is-resting'}`}>
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

      {!working && <div className="rest-note">暂停赚钱，休息一下 ~</div>}

      {working && mood === 'slack' && (
        <div className="slack-bubble">
          <svg viewBox="0 0 40 24" width="34" height="20" aria-hidden="true">
            <ellipse cx="18" cy="12" rx="12" ry="7" fill="#F9A8D4" stroke="#9A3412" strokeWidth="1.5" />
            <path d="M6 12 L0 6 L0 18 Z" fill="#F9A8D4" stroke="#9A3412" strokeWidth="1.5" />
            <circle cx="22" cy="10" r="1.6" fill="#7C2D12" />
          </svg>
          <span>摸鱼中~</span>
        </div>
      )}

      {working && mood === 'yawn' && (
        <div className="yawn-bubble">
          <span className="zzz z1">z</span>
          <span className="zzz z2">z</span>
          <span className="zzz z3">z</span>
          <span>哈欠~</span>
        </div>
      )}

      {working && mood === 'typing' && (
        <>
          <span className="paw paw-left" />
          <span className="paw paw-right" />
        </>
      )}

      <img className="bunny-img" src="/bunny.png" alt="动漫小兔子在电脑前努力工作" />
    </section>
  )
}
