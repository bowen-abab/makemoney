import { useEffect, useState } from 'react'

export default function BunnyScene({ label, image, desc, popText, tick, working }) {
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
        <img src={image} alt={`动漫小兔子：${label}`} />
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
        <p className="eyebrow">工位状态</p>
        <h2>{label}</h2>
        <p className="desc">{desc}</p>
      </div>
    </section>
  )
}
