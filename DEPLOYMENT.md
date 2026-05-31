# 不丢 - 公网部署指南

## 🚨 重要提醒

**当前项目使用内存数据库，不适合生产环境！**

内存数据库的问题：
- 服务器重启后数据会丢失
- 无法持久化存储用户数据
- 不支持多用户并发写入

**建议**：在正式上线前，请将数据库替换为 MongoDB、PostgreSQL 或 MySQL。

---

## 部署方案

### 方案一：Vercel（前端） + Render（后端）【推荐】

#### 步骤1：部署后端到 Render

1. 访问 [Render.com](https://render.com) 并注册账号
2. 点击 "New +" → "Web Service"
3. 连接您的 GitHub 仓库：`OrdinaryPerson404/not-lose`
4. 配置服务：
   - **Name**: `bu-diu-backend`
   - **Region**: Oregon (US) 或 Singapore (Asia)
   - **Branch**: main
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

5. 添加环境变量：
   - `NODE_ENV` = `production`
   - `PORT` = `3001`
   - `CORS_ORIGIN` = `https://your-vercel-app.vercel.app`

6. 点击 "Deploy Web Service"
7. 等待部署完成，获取后端URL（如：`https://bu-diu-backend.onrender.com`）

#### 步骤2：部署前端到 Vercel

1. 访问 [Vercel.com](https://vercel.com) 并注册账号
2. 点击 "Add New..." → "Project"
3. 连接您的 GitHub 仓库：`OrdinaryPerson404/not-lose`
4. 配置项目：
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

5. 添加环境变量：
   - `VITE_API_BASE_URL` = `https://bu-diu-backend.onrender.com/api`

6. 点击 "Deploy"
7. 等待部署完成，获取前端URL（如：`https://bu-diu.vercel.app`）

#### 步骤3：更新 CORS 配置

回到 Render，更新后端的环境变量：
- `CORS_ORIGIN` = `https://bu-diu.vercel.app`

---

### 方案二：Railway（全栈部署）

Railway 支持前后端一站式部署，并提供数据库服务。

#### 步骤1：部署到 Railway

1. 访问 [Railway.app](https://railway.app) 并注册账号
2. 点击 "New Project" → "Deploy from GitHub repo"
3. 选择仓库：`OrdinaryPerson404/not-lose`
4. Railway 会自动检测项目结构

#### 步骤2：配置服务

**后端服务配置**：
- Root Directory: `backend`
- Build Command: `npm install`
- Start Command: `npm start`
- 环境变量：
  - `NODE_ENV` = `production`
  - `PORT` = `3001`

**前端服务配置**：
- Root Directory: `frontend`
- Build Command: `npm run build`
- 环境变量：
  - `VITE_API_BASE_URL` = `https://your-backend.railway.app/api`

#### 步骤3：添加数据库（可选）

Railway 提供免费的 PostgreSQL 或 MongoDB：
1. 点击 "Add Service" → "Database"
2. 选择 PostgreSQL 或 MongoDB
3. 更新后端代码以连接数据库

---

### 方案三：Render（全栈部署）

Render 支持静态站点 + Web Service。

#### 步骤1：部署后端（Web Service）

同方案一的步骤1。

#### 步骤2：部署前端（Static Site）

1. 在 Render 点击 "New +" → "Static Site"
2. 连接 GitHub 仓库
3. 配置：
   - **Name**: `bu-diu-frontend`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

4. 添加环境变量：
   - `VITE_API_BASE_URL` = `https://bu-diu-backend.onrender.com/api`

---

## 构建生产版本

### 前端构建

```bash
cd frontend
npm install
npm run build
```

构建产物位于 `frontend/dist` 目录。

### 后端构建

后端无需构建，直接运行：
```bash
cd backend
npm install
npm start
```

---

## 环境变量说明

### 前端环境变量

| 变量名 | 说明 | 示例值 |
|--------|------|--------|
| `VITE_API_BASE_URL` | 后端API地址 | `https://bu-diu-backend.onrender.com/api` |

### 后端环境变量

| 变量名 | 说明 | 示例值 |
|--------|------|--------|
| `NODE_ENV` | 运行环境 | `production` |
| `PORT` | 服务端口 | `3001` |
| `CORS_ORIGIN` | 允许的前端域名 | `https://bu-diu.vercel.app` |

---

## 数据库升级建议

### 使用 MongoDB

1. 安装依赖：
```bash
cd backend
npm install mongoose
```

2. 创建数据库连接文件 `backend/db/mongodb.js`

3. 替换 `backend/database.js` 为 MongoDB 实现

### 使用 PostgreSQL

1. 安装依赖：
```bash
cd backend
npm install pg
```

2. 创建数据库连接文件 `backend/db/postgresql.js`

3. 替换 `backend/database.js` 为 PostgreSQL 实现

---

## 常见问题

### Q1: 部署后API请求失败？

检查：
1. 后端服务是否正常运行
2. CORS_ORIGIN 环境变量是否正确设置
3. VITE_API_BASE_URL 是否正确配置

### Q2: 图片上传失败？

需要配置文件存储服务：
- 使用云存储（如 AWS S3、Cloudflare R2）
- 或使用 Render/Railway 的持久化存储

### Q3: 数据丢失？

升级到持久化数据库（MongoDB/PostgreSQL）。

---

## 部署检查清单

- [ ] 后端服务部署成功
- [ ] 前端服务部署成功
- [ ] CORS 配置正确
- [ ] API 请求正常
- [ ] 用户登录功能正常
- [ ] 发布帖子功能正常
- [ ] 图片上传功能正常（需配置存储）
- [ ] 数据持久化（需升级数据库）

---

## 推荐部署组合

**免费层最佳方案**：
- **前端**：Vercel（全球CDN，自动部署）
- **后端**：Render（免费层，稳定可靠）
- **数据库**：Railway MongoDB（免费层）

**生产环境推荐**：
- **前端**：Vercel Pro
- **后端**：Render Pro 或 Railway Pro
- **数据库**：MongoDB Atlas 或 AWS RDS

---

## 下一步

1. 选择部署方案
2. 注册云平台账号
3. 连接 GitHub 仓库
4. 配置环境变量
5. 部署服务
6. 测试功能
7. 升级数据库（重要！）

祝部署顺利！🎉