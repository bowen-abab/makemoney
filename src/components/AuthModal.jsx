import { useState } from 'react'
import { supabase } from '../lib/supabase.js'

function toEmail(account) {
  const value = account.trim()
  return value.includes('@') ? value : `${value}@makemoney.app`
}

export default function AuthModal({ t, onClose }) {
  const [mode, setMode] = useState('login')
  const [account, setAccount] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    const name = account.trim()
    if (!name) {
      setError(t('auth.errorAccount'))
      return
    }
    if (password.length < 6) {
      setError(t('auth.errorPassword'))
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
          setMessage(t('auth.registerSuccess'))
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
        if (signInError) throw signInError
        onClose()
      }
    } catch (err) {
      setError(err.message || t('auth.failed'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div className="modal" onMouseDown={(event) => event.stopPropagation()} role="dialog" aria-modal="true">
        <div className="modal-head">
          <h2>{t(mode === 'login' ? 'auth.loginTitle' : 'auth.registerTitle')}</h2>
          <button className="icon-btn" onClick={onClose} aria-label={t('auth.close')}>×</button>
        </div>

        <label className="field">
          <span>{t('auth.account')}</span>
          <input
            type="text"
            value={account}
            onChange={(event) => setAccount(event.target.value)}
            placeholder={t('auth.accountPlaceholder')}
            autoComplete="username"
          />
        </label>

        <label className="field">
          <span>{t('auth.password')}</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder={t('auth.passwordPlaceholder')}
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
            {t(mode === 'login' ? 'auth.noAccount' : 'auth.hasAccount')}
          </button>
          <button className="btn primary" onClick={submit} disabled={loading}>
            {loading ? t('auth.waiting') : t(mode === 'login' ? 'auth.login' : 'auth.register')}
          </button>
        </div>
      </div>
    </div>
  )
}
