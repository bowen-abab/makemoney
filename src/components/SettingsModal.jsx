import { useState } from 'react'
import { WEEKDAYS } from '../lib/pay.js'

export default function SettingsModal({ config, onClose, onSave }) {
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
    const breakMinutes = Number(form.breakMinutes)
    const [startH, startM] = form.startTime.split(':').map(Number)
    const [endH, endM] = form.endTime.split(':').map(Number)

    if (!Number.isFinite(salary) || salary <= 0) {
      setError('请输入大于 0 的月薪')
      return
    }
    if (form.workdays.length === 0) {
      setError('至少选择一天上班')
      return
    }
    if (!Number.isFinite(breakMinutes) || breakMinutes < 0) {
      setError('午休时长不能为负数')
      return
    }
    if (endH * 60 + endM <= startH * 60 + startM) {
      setError('下班时间必须晚于上班时间（暂不支持跨天）')
      return
    }

    onSave({
      ...form,
      salary,
      breakMinutes,
      workdays: [...form.workdays].sort((a, b) => a - b),
    })
  }

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div className="modal" onMouseDown={(event) => event.stopPropagation()} role="dialog" aria-modal="true">
        <div className="modal-head">
          <h2>修改设置</h2>
          <button className="icon-btn" onClick={onClose} aria-label="关闭">×</button>
        </div>

        <label className="field">
          <span>月薪（元）</span>
          <input
            type="number"
            min="1"
            step="100"
            value={form.salary}
            onChange={(event) => update('salary', event.target.value)}
          />
        </label>

        <div className="field">
          <span>每周上班日</span>
          <div className="day-picker">
            {WEEKDAYS.map((day) => (
              <button
                key={day.index}
                type="button"
                className={`day-chip ${form.workdays.includes(day.index) ? 'active' : ''}`}
                onClick={() => toggleDay(day.index)}
              >
                {day.label}
              </button>
            ))}
          </div>
          <small>点击标亮需要上班的日子</small>
        </div>

        <div className="field-row">
          <label className="field">
            <span>上班时间</span>
            <input type="time" value={form.startTime} onChange={(event) => update('startTime', event.target.value)} />
          </label>
          <label className="field">
            <span>下班时间</span>
            <input type="time" value={form.endTime} onChange={(event) => update('endTime', event.target.value)} />
          </label>
        </div>

        <label className="field">
          <span>午休时长（分钟）</span>
          <input
            type="number"
            min="0"
            max="480"
            step="10"
            value={form.breakMinutes}
            onChange={(event) => update('breakMinutes', event.target.value)}
          />
          <small>按工作时段中间自动扣除，暂不支持跨天工作</small>
        </label>

        {error && <p className="form-error">{error}</p>}

        <div className="modal-actions">
          <button className="btn ghost" onClick={onClose}>取消</button>
          <button className="btn primary" onClick={handleSave}>保存</button>
        </div>
      </div>
    </div>
  )
}
