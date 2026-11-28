export const LANGS = [
  { key: 'zh', short: '中', label: '简体中文' },
  { key: 'en', short: 'EN', label: 'English' },
]

const STORAGE_KEY = 'makemoney.lang.v1'

export function loadLang() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved === 'en' || saved === 'zh' ? saved : 'zh'
  } catch {
    return 'zh'
  }
}

export function saveLang(lang) {
  localStorage.setItem(STORAGE_KEY, lang)
}

const messages = {
  zh: {
    'page.title': 'makemoney · 每秒赚多少钱',
    'brand.subtitle': '把时间换算成收入',
    'action.settings': '设置',
    'action.login': '登录',
    'action.logout': '退出',
    'sync.syncing': '同步中…',
    'sync.failed': '同步失败',
    'sync.success': '已同步到云端',

    'hero.eyebrow': '本月已赚',
    'hero.live': '实时累计',
    'hero.note': '按本月实际工作日与有效工时计算',
    'hero.progress': '本月进度',
    'hero.workdays': '本月 {days} 个工作日',
    'metric.second': '每秒',
    'metric.today': '今日已赚',

    'status.rest': '休息日',
    'status.before': '还没上班',
    'status.after': '已下班',
    'status.break': '午休中',
    'status.working': '努力工作中',
    'countdown.offWork': '距离下班',
    'countdown.startWork': '距离上班',
    'countdown.today': '今日状态',

    'bunny.status': '工位状态',
    'bunny.alt': '动漫小兔子：{label}',
    'rest.desc': '休息一下，等你回来继续。',

    'mood.work.label': '努力工作中',
    'mood.work.desc': '它也在电脑前，陪你把这一秒变成收入。',
    'mood.slack.label': '摸鱼中~',
    'mood.slack.desc': '伸个懒腰，偷偷放空一下。',
    'mood.sleep.label': '打个盹~',
    'mood.sleep.desc': '眯一会儿，梦里也在赚钱。',
    'mood.drink.label': '喝水中',
    'mood.drink.desc': '喝口水，继续搬砖。',
    'mood.phone.label': '刷会儿手机',
    'mood.phone.desc': '偷偷看一眼，马上回来。',

    'settings.title': '修改设置',
    'settings.salary': '月薪（元）',
    'settings.workdays': '每周上班日',
    'settings.workdaysHint': '点击标亮需要上班的日子',
    'settings.start': '上班时间',
    'settings.end': '下班时间',
    'settings.lunchStart': '午休开始',
    'settings.lunchEnd': '午休结束',
    'settings.lunchHint': '直接填写午休起止时间，系统会自动扣除这段时长。暂不支持跨天。',
    'settings.cancel': '取消',
    'settings.save': '保存',
    'error.salary': '请输入大于 0 的月薪',
    'error.workdays': '至少选择一天上班',
    'error.end': '下班时间必须晚于上班时间（暂不支持跨天）',
    'error.lunchEnd': '午休结束时间必须晚于开始时间',
    'error.lunchRange': '午休时间需在工作时段内',

    'auth.loginTitle': '登录',
    'auth.registerTitle': '注册账号',
    'auth.close': '关闭',
    'auth.account': '账号',
    'auth.accountPlaceholder': '给自己起个账号名',
    'auth.password': '密码',
    'auth.passwordPlaceholder': '至少 6 位',
    'auth.noAccount': '没有账号？注册',
    'auth.hasAccount': '已有账号？登录',
    'auth.waiting': '请稍候…',
    'auth.login': '登录',
    'auth.register': '注册',
    'auth.errorAccount': '请输入账号',
    'auth.errorPassword': '密码至少 6 位',
    'auth.registerSuccess': '注册成功。请到 Supabase 关闭邮箱验证后，直接登录即可。',
    'auth.failed': '操作失败，请重试',

    'weekday.0': '日',
    'weekday.1': '一',
    'weekday.2': '二',
    'weekday.3': '三',
    'weekday.4': '四',
    'weekday.5': '五',
    'weekday.6': '六',
    'lang.switch': '切换语言',
  },
  en: {
    'page.title': 'makemoney · Earn per second',
    'brand.subtitle': 'Turn time into income',
    'action.settings': 'Settings',
    'action.login': 'Sign in',
    'action.logout': 'Sign out',
    'sync.syncing': 'Syncing…',
    'sync.failed': 'Sync failed',
    'sync.success': 'Synced to cloud',

    'hero.eyebrow': 'Earned this month',
    'hero.live': 'Live total',
    'hero.note': 'Based on actual workdays and effective hours this month',
    'hero.progress': 'Month progress',
    'hero.workdays': '{days} workdays this month',
    'metric.second': 'Per second',
    'metric.today': 'Earned today',

    'status.rest': 'Day off',
    'status.before': 'Before work',
    'status.after': 'Off work',
    'status.break': 'Lunch break',
    'status.working': 'Working hard',
    'countdown.offWork': 'Time until off work',
    'countdown.startWork': 'Time until work',
    'countdown.today': "Today's status",

    'bunny.status': 'Desk status',
    'bunny.alt': 'Anime bunny: {label}',
    'rest.desc': 'Taking a break. See you soon.',

    'mood.work.label': 'Working hard',
    'mood.work.desc': 'Working at the desk with you, turning every second into income.',
    'mood.slack.label': 'Slacking off~',
    'mood.slack.desc': 'A quick stretch and a little daydream.',
    'mood.sleep.label': 'Taking a nap~',
    'mood.sleep.desc': 'A quick nap — even dreams earn money.',
    'mood.drink.label': 'Having water',
    'mood.drink.desc': 'Sip some water, then back to work.',
    'mood.phone.label': 'Scrolling phone',
    'mood.phone.desc': 'Just one quick look, back right away.',

    'settings.title': 'Edit settings',
    'settings.salary': 'Monthly salary (CNY)',
    'settings.workdays': 'Workdays per week',
    'settings.workdaysHint': 'Tap to highlight your workdays',
    'settings.start': 'Start time',
    'settings.end': 'End time',
    'settings.lunchStart': 'Lunch start',
    'settings.lunchEnd': 'Lunch end',
    'settings.lunchHint': 'Set the lunch window and it will be deducted automatically. Overnight shifts are not supported yet.',
    'settings.cancel': 'Cancel',
    'settings.save': 'Save',
    'error.salary': 'Enter a monthly salary greater than 0',
    'error.workdays': 'Select at least one workday',
    'error.end': 'End time must be after start time (overnight not supported)',
    'error.lunchEnd': 'Lunch end must be after lunch start',
    'error.lunchRange': 'Lunch must fall within work hours',

    'auth.loginTitle': 'Sign in',
    'auth.registerTitle': 'Create account',
    'auth.close': 'Close',
    'auth.account': 'Account',
    'auth.accountPlaceholder': 'Pick an account name',
    'auth.password': 'Password',
    'auth.passwordPlaceholder': 'At least 6 characters',
    'auth.noAccount': 'No account? Sign up',
    'auth.hasAccount': 'Have an account? Sign in',
    'auth.waiting': 'Please wait…',
    'auth.login': 'Sign in',
    'auth.register': 'Sign up',
    'auth.errorAccount': 'Enter an account name',
    'auth.errorPassword': 'Password must be at least 6 characters',
    'auth.registerSuccess': 'Account created. Disable email confirmation in Supabase, then sign in.',
    'auth.failed': 'Something went wrong, please try again',

    'weekday.0': 'Sun',
    'weekday.1': 'Mon',
    'weekday.2': 'Tue',
    'weekday.3': 'Wed',
    'weekday.4': 'Thu',
    'weekday.5': 'Fri',
    'weekday.6': 'Sat',
    'lang.switch': 'Switch language',
  },
}

export function translate(lang, key, vars = {}) {
  let text = messages[lang]?.[key] ?? messages.zh[key] ?? key
  Object.entries(vars).forEach(([name, value]) => {
    text = text.replaceAll(`{${name}}`, String(value))
  })
  return text
}
