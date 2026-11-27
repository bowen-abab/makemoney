import { useEffect, useState } from 'react'
import { isSupabaseConfigured, supabase } from './lib/supabase.js'

export default function App() {
  const [sessionReady, setSessionReady] = useState(false)

  useEffect(() => {
    if (!supabase) return
    supabase.auth.getSession().then(() => setSessionReady(true))
  }, [])

  return (
    <main className="container">
      <div className="badge">Vite + React + Supabase</div>
      <h1>makemoney</h1>
      <p className="subtitle">前端项目骨架已就绪。后端使用 Supabase，下一步接入你的业务功能。</p>

      <div className={`status ${isSupabaseConfigured ? 'ok' : 'warn'}`}>
        <strong>Supabase 配置：</strong>
        {isSupabaseConfigured
          ? `已读取环境变量${sessionReady ? '，客户端初始化完成。' : '，正在初始化…'}`
          : '未配置。请复制 .env.example 为 .env 并填入 URL 和 anon key。'}
      </div>

      <section className="card">
        <h2>下一步</h2>
        <ol>
          <li>在 Supabase 创建项目，拿到 Project URL 和 anon key。</li>
          <li>在项目根目录创建 <code>.env</code>，填入上面两个值。</li>
          <li>运行 <code>npm install &amp;&amp; npm run dev</code> 启动前端。</li>
          <li>用 Supabase Auth / Database / Storage 接入你的功能。</li>
        </ol>
      </section>

      <p className="tip">提醒：service_role key 永远不要写进前端代码或提交到 GitHub。</p>
    </main>
  )
}
