import { useState } from 'react'
import { supabase } from '../lib/supabase.js'

function toEmail(account) {
  const value = account.trim()
  return value.includes('@') ? value : `${value}@makemoney.app`
}

export default function AuthModal({ onClose }) {
  const [mode, setMode] = useState('login')
  const [account, setAccount] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    const name = account.trim()
    if (!name) {
      setError('请输入账号')
      return
    }
    if (password.length < 6) {
      setError('密码至少 6 位')
      return
    }

    setLoading(true)
    setError('')
    setMessage('')
    try {
      const email = toEmail(name)
      if (mode === 'register') {
        const { data, error: signUpError } = await supabase.auth.signUp({ email, password })
        if (signUpError) throw signUpError
        if (data.session) {
          onClose()
        } else {
          setMessage('注册成功。请到 Supabase 关闭邮箱验证后，直接登录即可。')
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
        if (signInError) throw signInError
        onClose()
      }
    } catch (err) {
      setError(err.message || '操作失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div className="modal" onMouseDown={(event) => event.stopPropagation()} role="dialog" aria-modal="true">
        <div className="modal-head">
          <h2>{mode === 'login' ? '登录' : '注册账号'}</h2>
          <button className="icon-btn" onClick={onClose} aria-label="关闭">×</button>
        </div>

        <label className="field">
          <span>账号</span>
          <input
            type="text"
            value={account}
            onChange={(event) => setAccount(event.target.value)}
            placeholder="给自己起个账号名"
            autoComplete="username"
          />
        </label>

        <label className="field">
          <span>密码</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="至少 6 位"
            autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
          />
        </label>

        {error && <p className="form-error">{error}</p>}
        {message && <p className="form-message">{message}</p>}

        <div className="modal-actions">
          <button
            className="text-btn"
            onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); setMessage('') }}
          >
            {mode === 'login' ? '没有账号？注册' : '已有账号？登录'}
          </button>
          <button className="btn primary" onClick={submit} disabled={loading}>
            {loading ? '请稍候…' : mode === 'login' ? '登录' : '注册'}
          </button>
        </div>
      </div>
    </div>
  )
}
