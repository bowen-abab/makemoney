import { useEffect, useState } from 'react'
import { formatSmall } from '../lib/pay.js'

export default function BunnyScene({ working, perSecond, tick }) {
  const [pulses, setPulses] = useState([])

  useEffect(() => {
    if (!working || !tick) return
    const id = `${tick}-${Math.random().toString(36).slice(2)}`
    setPulses((prev) => [...prev, id])
  }, [tick, working])

  const removePulse = (id) => {
    setPulses((prev) => prev.filter((item) => item !== id))
  }

  return (
    <section className={`bunny-scene ${working ? 'is-working' : 'is-resting'}`}>
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

      <svg className="bunny-svg" viewBox="0 0 340 230" role="img" aria-label="小兔子在电脑桌前工作">
        {/* 桌子 */}
        <rect x="30" y="150" width="280" height="12" rx="6" fill="#C87A4E" />
        <rect x="50" y="162" width="12" height="55" rx="4" fill="#A9603B" />
        <rect x="278" y="162" width="12" height="55" rx="4" fill="#A9603B" />

        {/* 显示器 */}
        <rect x="190" y="70" width="100" height="62" rx="6" fill="#FFF7ED" stroke="#8B5E3C" strokeWidth="3" />
        <rect x="198" y="78" width="84" height="46" rx="3" fill="#FFE8CC" />
        <path d="M230 132 h20 v10 h-20 z" fill="#8B5E3C" />
        <rect x="215" y="142" width="50" height="6" rx="3" fill="#8B5E3C" />

        {/* 键盘 */}
        <rect x="195" y="140" width="85" height="14" rx="4" fill="#F5D0A9" stroke="#8B5E3C" strokeWidth="2" />

        {/* 咖啡杯 */}
        <rect x="58" y="128" width="22" height="22" rx="5" fill="#F97316" />
        <path d="M80 134 q10 2 8 10 q-2 6 -8 6" stroke="#F97316" strokeWidth="3" fill="none" />

        {/* 兔子 */}
        <g className="bunny">
          <ellipse cx="110" cy="125" rx="42" ry="38" fill="#FFF9F2" stroke="#8B5E3C" strokeWidth="3" />
          <circle cx="110" cy="82" r="30" fill="#FFF9F2" stroke="#8B5E3C" strokeWidth="3" />

          <ellipse cx="96" cy="46" rx="9" ry="28" fill="#FFF9F2" stroke="#8B5E3C" strokeWidth="3" transform="rotate(-8 96 46)" />
          <ellipse cx="124" cy="46" rx="9" ry="28" fill="#FFF9F2" stroke="#8B5E3C" strokeWidth="3" transform="rotate(8 124 46)" />
          <ellipse cx="96" cy="46" rx="4" ry="18" fill="#FBCFE8" transform="rotate(-8 96 46)" />
          <ellipse cx="124" cy="46" rx="4" ry="18" fill="#FBCFE8" transform="rotate(8 124 46)" />

          <circle cx="100" cy="82" r="3.5" fill="#5B3A29" />
          <circle cx="120" cy="82" r="3.5" fill="#5B3A29" />
          <circle cx="110" cy="92" r="3" fill="#F472B6" />
          <path d="M106 97 q4 4 8 0" stroke="#5B3A29" strokeWidth="2" fill="none" strokeLinecap="round" />
          <ellipse cx="88" cy="92" rx="6" ry="4" fill="#FBCFE8" opacity="0.9" />
          <ellipse cx="132" cy="92" rx="6" ry="4" fill="#FBCFE8" opacity="0.9" />

          <path className="arm arm-left" d="M138 122 q22 -4 48 12" stroke="#8B5E3C" strokeWidth="7" strokeLinecap="round" fill="none" />
          <path className="arm arm-right" d="M134 134 q24 2 50 2" stroke="#8B5E3C" strokeWidth="7" strokeLinecap="round" fill="none" />
        </g>
      </svg>
    </section>
  )
}
