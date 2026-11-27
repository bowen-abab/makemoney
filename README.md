# makemoney

前端：Vite + React　后端：Supabase

## 本地开发

```bash
npm install
cp .env.example .env
# 编辑 .env，填入 Supabase Project URL 和 anon key
npm run dev
```

生产构建：

```bash
npm run build
```

## 安全提醒

- 前端只能使用 Supabase 的 **anon key**。
- `service_role` key 拥有管理员权限，绝不能写进前端代码、`.env` 或提交到 GitHub。
- 在 Supabase 控制台为数据表开启 Row Level Security (RLS)，并按用户隔离数据。

## 仓库说明

该仓库已通过 GitHub 连接器完成首次代码上传。后续本地推送需要配置 Git 凭据：

```bash
git config --global credential.helper manager
git remote add origin https://github.com/bowen-abab/makemoney.git
git push -u origin main
```

推送时会调用浏览器/系统登录窗口，使用你的 GitHub 账号授权一次即可。
