# makemoney

一个暖色动漫风的「每秒赚多少钱」页面：输入月薪、上班日、上下班时间和午休起止时间，实时显示本月已赚金额，小兔子每秒飘出 `+¥`。

## 功能

- 顶部实时日期时间
- 中间「本月已赚」每秒刷新，非工作时段自动暂停
- 小兔子随机切换 5 种状态（工作 / 摸鱼 / 打盹 / 喝水 / 刷手机各 20%），每 1 分钟一次；五种状态共用同一张脸，动作与装饰不同，并以循环动画 WebP 呈现
- 工作时兔子身上每秒飘出 `+¥{每秒单价}`
- 顶部可切换简体中文 / English，界面文案与日期格式同步切换
- 右上角「设置」打开弹窗：月薪、每周上班日（点击标亮）、上下班时间、午休开始/结束时间
- 不登录也能用：配置存在浏览器 localStorage
- 登录 Supabase 后：配置自动同步到云端，换设备也能用

## 计算方式

- 按**本月实际工作日**计算
- 每日工作秒数 =（下班时间 − 上班时间 −（午休结束 − 午休开始））× 60
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

## Supabase 接入

前端使用 Publishable key（`sb_publishable_...`）；老项目的 anon key 也兼容。

1. 复制 `.env.example` 为 `.env`，填入 `VITE_SUPABASE_URL` 和 `VITE_SUPABASE_PUBLISHABLE_KEY`。
2. 在 Supabase 控制台 → **SQL Editor** 中执行 `supabase/schema.sql`，创建 `user_settings` 表并开启 RLS。
3. 重启 `npm run dev`，右上角会出现「登录」。注册或登录后自动从云端读取配置；之后每次点「保存」都会同步到云端。

`secret key` / `service_role` key 绝不能写进前端代码、`.env` 或提交到 GitHub。

## GitHub

远程仓库：`https://github.com/bowen-abab/makemoney`

```bash
git push -u origin main
```
