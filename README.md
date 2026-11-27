# makemoney

一个暖色动漫风的「每秒赚多少钱」页面：输入月薪、上班日、上下班时间和午休时长，实时显示本月已赚金额，小兔子每秒飘出 `+¥`。

当前版本：**纯前端 + localStorage**，不需要登录即可使用。后端预留 Supabase，后续可做登录同步。

## 功能

- 顶部实时日期时间
- 中间「本月已赚」每秒刷新，非工作时段自动暂停
- 底部小兔子电脑桌插画，每秒飘出 `+¥`
- 右上角 ⚙ 按钮打开设置：月薪、每周上班日（点击标亮）、上下班时间、午休时长
- 配置保存在浏览器 localStorage，刷新不丢

## 计算方式

- 按**本月实际工作日**计算
- 每日工作秒数 =（下班时间 − 上班时间 − 午休时长）× 60
- 每秒单价 = 月薪 ÷（本月工作日 × 每日工作秒数）
- 本月已赚 = 每秒单价 × 本月已工作秒数
- 暂不支持跨天工作

## 本地开发

```bash
npm install
npm run dev
```

生产构建：

```bash
npm run build
```

## Supabase（后续登录同步用）

前端使用 Publishable key（`sb_publishable_...`）；老项目的 anon key 也兼容。

```bash
cp .env.example .env
# 填入 VITE_SUPABASE_URL 和 VITE_SUPABASE_PUBLISHABLE_KEY
```

`secret key` / `service_role` key 绝不能写进前端代码、`.env` 或提交到 GitHub。

## GitHub 推送

远程仓库尚未创建。请在 GitHub 手动创建空仓库 `makemoney` 后执行：

```bash
git push -u origin main
```

首次推送会调用浏览器/系统登录窗口，使用 GitHub 账号授权一次即可。
