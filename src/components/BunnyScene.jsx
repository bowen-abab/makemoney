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

      <img className="bunny-img" src="/bunny.png" alt="动漫小兔子在电脑前努力工作" />
    </section>
  )
}
