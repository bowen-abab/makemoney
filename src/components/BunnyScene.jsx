import { useEffect, useState } from 'react'

export default function BunnyScene({ label, image, desc, alt, popText, tick, working, statusLabel }) {
  const [pops, setPops] = useState([])

  useEffect(() => {
    if (!working) {
      setPops([])
      return
    }
    setPops((prev) => [...prev.slice(-2), tick])
  }, [tick, working])

  return (
    <section className="card companion">
      <div className="bunny-frame">
        <div className="bunny-halo" />
        <img src={image} alt={alt || `动漫小兔子：${label}`} />
        <div className="float-layer">
          {pops.map((id, index) => (
            <span
              key={id}
              className="money-pop"
              style={{ left: `${32 + (index % 3) * 12}%` }}
            >
              {popText}
            </span>
          ))}
        </div>
      </div>
      <div className="companion-text">
        <p className="eyebrow">{statusLabel || '工位状态'}</p>
        <span className="status-badge">{label}</span>
        <p className="desc">{desc}</p>
      </div>
    </section>
  )
}
