import { useState } from 'react'
import { WEEKDAYS } from '../lib/pay.js'

const toMinutes = (time) => {
  const [hour, minute] = String(time).split(':').map(Number)
  return hour * 60 + minute
}

export default function SettingsModal({ config, lang, t, onClose, onSave }) {
  const [form, setForm] = useState({ ...config, workdays: [...config.workdays] })
  const [error, setError] = useState('')

  const toggleDay = (index) => {
    setForm((prev) => ({
      ...prev,
      workdays: prev.workdays.includes(index)
        ? prev.workdays.filter((day) => day !== index)
        : [...prev.workdays, index].sort((a, b) => a - b),
    }))
  }

  const update = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = () => {
    const salary = Number(form.salary)
    const start = toMinutes(form.startTime)
    const end = toMinutes(form.endTime)
    const lunchStart = toMinutes(form.lunchStart)
    const lunchEnd = toMinutes(form.lunchEnd)

    if (!Number.isFinite(salary) || salary <= 0) {
      setError(t('error.salary'))
      return
    }
    if (form.workdays.length === 0) {
      setError(t('error.workdays'))
      return
    }
    if (end <= start) {
      setError(t('error.end'))
      return
    }
    if (lunchEnd <= lunchStart) {
      setError(t('error.lunchEnd'))
      return
    }
    if (lunchStart < start || lunchEnd > end) {
      setError(t('error.lunchRange'))
      return
    }

    onSave({
      ...form,
      salary,
      workdays: [...form.workdays].sort((a, b) => a - b),
    })
  }

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div className="modal" onMouseDown={(event) => event.stopPropagation()} role="dialog" aria-modal="true">
        <div className="modal-head">
          <h2>{t('settings.title')}</h2>
          <button className="icon-btn" onClick={onClose} aria-label={t('auth.close')}>×</button>
        </div>

        <label className="field">
          <span>{t('settings.salary')}</span>
          <input
            type="number"
            min="1"
            step="100"
            value={form.salary}
            onChange={(event) => update('salary', event.target.value)}
          />
        </label>

        <div className="field">
          <span>{t('settings.workdays')}</span>
          <div className="day-picker">
            {WEEKDAYS.map((day) => (
              <button
                key={day.index}
                type="button"
                className={`day-chip ${form.workdays.includes(day.index) ? 'active' : ''}`}
                onClick={() => toggleDay(day.index)}
              >
                {t(`weekday.${day.index}`)}
              </button>
            ))}
          </div>
          <small>{t('settings.workdaysHint')}</small>
        </div>

        <div className="field-row">
          <label className="field">
            <span>{t('settings.start')}</span>
            <input type="time" value={form.startTime} onChange={(event) => update('startTime', event.target.value)} />
          </label>
          <label className="field">
            <span>{t('settings.end')}</span>
            <input type="time" value={form.endTime} onChange={(event) => update('endTime', event.target.value)} />
          </label>
        </div>

        <div className="field-row">
          <label className="field">
            <span>{t('settings.lunchStart')}</span>
            <input type="time" value={form.lunchStart} onChange={(event) => update('lunchStart', event.target.value)} />
          </label>
          <label className="field">
            <span>{t('settings.lunchEnd')}</span>
            <input type="time" value={form.lunchEnd} onChange={(event) => update('lunchEnd', event.target.value)} />
          </label>
        </div>
        <p className="field-hint">{t('settings.lunchHint')}</p>

        {error && <p className="form-error">{error}</p>}

        <div className="modal-actions">
          <button className="btn ghost" onClick={onClose}>{t('settings.cancel')}</button>
          <button className="btn primary" onClick={handleSave}>{t('settings.save')}</button>
        </div>
      </div>
    </div>
  )
}
