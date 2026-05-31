# 不丢 - 南航校园失物招领平台

一个专为南昌航空大学设计的校园失物招领平台，帮助同学们找回丢失的物品，传递善意。

## 项目特点

- 🎨 简洁美观的移动端界面
- 🔍 智能物品匹配系统
- 📍 详细的地点分类选择
- 💝 感谢承诺机制
- 🏆 归还记录墙

## 技术栈

### 前端
- React 18
- TypeScript
- Vite
- React Router
- Vant UI

### 后端
- Node.js
- Express
- CORS

## 项目结构

```
bu-diu-app/
├── backend/
│   ├── routes/
│   │   ├── auth.js       # 认证路由
│   │   ├── match.js      # 匹配路由
│   │   └── posts.js      # 帖子路由
│   ├── database.js       # 内存数据库
│   ├── server.js         # 服务器入口
│   ├── package.json
│   └── package-lock.json
├── frontend/
│   ├── src/
│   │   ├── components/   # 公共组件
│   │   ├── hooks/        # 自定义 Hooks
│   │   ├── pages/        # 页面组件
│   │   ├── services/     # API 服务
│   │   ├── styles/       # 全局样式
│   │   ├── types/        # TypeScript 类型
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── vant.d.ts
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── package-lock.json
└── 功能术语详解.md
```

## 快速开始

### 后端启动

```bash
cd backend
npm install
npm run dev
```

后端服务将在 `http://localhost:3001` 启动

### 前端启动

```bash
cd frontend
npm install
npm run dev
```

前端开发服务器将在 `http://localhost:3000` 启动

## 测试账号

平台提供以下测试账号（学号即密码）：

- `25201732` - 失主账号
- `25201845` - 捡到者账号
- `25201901` - 通用测试账号

## 功能说明

### 核心功能

1. **发布寻物启事** - 失主可以发布丢失物品信息
2. **发布捡到线索** - 好心人可以发布捡到物品信息
3. **智能匹配** - 系统自动匹配相似的寻物和线索
4. **物品认领** - 失主可以认领匹配的物品
5. **确认归还** - 完成物品交接后确认归还
6. **已回家墙** - 展示所有成功归还的物品

### 特色功能

- 地点分类选择，覆盖校园主要区域
- 感谢承诺机制，鼓励善意传递
- 详细的物品描述和图片上传
- 安全交接提示
- 个人发布记录管理

## 开发说明

### 前端开发

- 使用 Vite 作为构建工具
- 采用组件化开发模式
- 使用 React Router 进行路由管理
- 自定义 Hooks 管理状态和业务逻辑

### 后端开发

- 使用 Express 构建 RESTful API
- 内存数据库存储数据（生产环境建议使用真实数据库）
- CORS 支持跨域请求
- 包含智能匹配算法

## 许可证

MIT License
