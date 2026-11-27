export const WEEKDAYS = [
  { index: 1, label: '一' },
  { index: 2, label: '二' },
  { index: 3, label: '三' },
  { index: 4, label: '四' },
  { index: 5, label: '五' },
  { index: 6, label: '六' },
  { index: 0, label: '日' },
]

export const DEFAULT_CONFIG = {
  salary: 10000,
  workdays: [1, 2, 3, 4, 5],
  startTime: '09:00',
  endTime: '18:00',
  breakMinutes: 60,
}

const STORAGE_KEY = 'makemoney.config.v1'

export function loadConfig() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_CONFIG
    const parsed = JSON.parse(raw)
    const salary = Number(parsed.salary)
    const breakMinutes = Number(parsed.breakMinutes)
    return {
      ...DEFAULT_CONFIG,
      ...parsed,
      salary: Number.isFinite(salary) && salary > 0 ? salary : DEFAULT_CONFIG.salary,
      workdays: Array.isArray(parsed.workdays) ? parsed.workdays : DEFAULT_CONFIG.workdays,
      breakMinutes: Number.isFinite(breakMinutes) && breakMinutes >= 0 ? breakMinutes : DEFAULT_CONFIG.breakMinutes,
    }
  } catch {
    return DEFAULT_CONFIG
  }
}

export function saveConfig(config) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
}

function timeToMinutes(time) {
  const [hour, minute] = String(time).split(':').map(Number)
  return hour * 60 + minute
}

export function getDailyMinutes(config) {
  const start = timeToMinutes(config.startTime)
  const end = timeToMinutes(config.endTime)
  return Math.max(0, end - start - Number(config.breakMinutes || 0))
}

export function isWorkday(date, config) {
  return config.workdays.includes(date.getDay())
}

export function getMonthStats(date, config) {
  const year = date.getFullYear()
  const month = date.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const dailyMinutes = getDailyMinutes(config)

  let totalWorkdays = 0
  for (let day = 1; day <= daysInMonth; day++) {
    if (isWorkday(new Date(year, month, day), config)) totalWorkdays++
  }

  const totalWorkSeconds = totalWorkdays * dailyMinutes * 60
  const perSecond = totalWorkSeconds > 0 ? Number(config.salary) / totalWorkSeconds : 0

  return { daysInMonth, totalWorkdays, dailyMinutes, totalWorkSeconds, perSecond }
}

export function getWorkStatus(date, config) {
  const dailyMinutes = getDailyMinutes(config)
  const dailySeconds = dailyMinutes * 60

  if (!isWorkday(date, config)) {
    return { status: 'rest', label: '休息日', workingSecondsToday: 0, dailySeconds }
  }

  const nowMinutes = date.getHours() * 60 + date.getMinutes() + date.getSeconds() / 60
  const start = timeToMinutes(config.startTime)
  const end = timeToMinutes(config.endTime)
  const breakMinutes = Number(config.breakMinutes || 0)

  if (nowMinutes < start) {
    return { status: 'before', label: '还没上班', workingSecondsToday: 0, dailySeconds }
  }
  if (nowMinutes >= end) {
    return { status: 'after', label: '已下班', workingSecondsToday: dailySeconds, dailySeconds }
  }

  const workSpan = end - start
  const breakStart = start + Math.max(0, (workSpan - breakMinutes) / 2)
  const breakEnd = breakStart + breakMinutes

  let workedMinutes
  if (nowMinutes <= breakStart) {
    workedMinutes = nowMinutes - start
  } else if (nowMinutes < breakEnd) {
    workedMinutes = breakStart - start
  } else {
    workedMinutes = nowMinutes - start - breakMinutes
  }

  workedMinutes = Math.max(0, Math.min(workedMinutes, dailyMinutes))
  const inBreak = nowMinutes >= breakStart && nowMinutes < breakEnd

  return {
    status: inBreak ? 'break' : 'working',
    label: inBreak ? '午休中' : '努力工作中',
    workingSecondsToday: workedMinutes * 60,
    dailySeconds,
  }
}

export function getEarnedStats(date, config) {
  const monthStats = getMonthStats(date, config)
  const workStatus = getWorkStatus(date, config)
  const year = date.getFullYear()
  const month = date.getMonth()
  const today = date.getDate()

  let elapsedSeconds = 0
  for (let day = 1; day <= today; day++) {
    const dayDate = new Date(year, month, day)
    if (!isWorkday(dayDate, config)) continue
    if (day < today) {
      elapsedSeconds += workStatus.dailySeconds
    } else {
      elapsedSeconds += workStatus.workingSecondsToday
    }
  }

  return {
    ...monthStats,
    ...workStatus,
    elapsedSeconds,
    earned: elapsedSeconds * monthStats.perSecond,
  }
}

export function formatDuration(seconds) {
  const total = Math.max(0, Math.floor(Number(seconds || 0)))
  const hours = Math.floor(total / 3600)
  const minutes = Math.floor((total % 3600) / 60)
  const secs = total % 60
  if (hours > 0) return `${hours}小时${String(minutes).padStart(2, '0')}分${String(secs).padStart(2, '0')}秒`
  if (minutes > 0) return `${minutes}分${String(secs).padStart(2, '0')}秒`
  return `${secs}秒`
}

export function getCountdownInfo(date, config) {
  const workStatus = getWorkStatus(date, config)

  if (workStatus.status === 'working' || workStatus.status === 'break') {
    return {
      label: '距离下班',
      text: formatDuration(workStatus.dailySeconds - workStatus.workingSecondsToday),
    }
  }

  const nowMinutes = date.getHours() * 60 + date.getMinutes() + date.getSeconds() / 60
  const start = timeToMinutes(config.startTime)

  if (workStatus.status === 'before') {
    return { label: '距离上班', text: formatDuration((start - nowMinutes) * 60) }
  }
  if (workStatus.status === 'after') {
    return { label: '今日状态', text: '已下班' }
  }
  return { label: '今日状态', text: '休息日' }
}

export function formatMoney(value) {
  return Number(value || 0).toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export function formatSmall(value) {
  return Number(value || 0).toFixed(3)
}
