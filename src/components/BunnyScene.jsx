export default function BunnyScene({ label }) {
  return (
    <section className="card companion">
      <img src="/bunny.png" alt="动漫小兔子在电脑前工作" />
      <div className="companion-text">
        <p className="eyebrow">工位状态</p>
        <h2>{label}</h2>
        <p className="desc">它也在电脑前，陪你把这一秒变成收入。</p>
      </div>
    </section>
  )
}
