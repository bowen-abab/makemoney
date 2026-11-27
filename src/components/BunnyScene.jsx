export default function BunnyScene({ label, image, desc }) {
  return (
    <section className="card companion">
      <img src={image} alt={`动漫小兔子：${label}`} />
      <div className="companion-text">
        <p className="eyebrow">工位状态</p>
        <h2>{label}</h2>
        <p className="desc">{desc}</p>
      </div>
    </section>
  )
}
