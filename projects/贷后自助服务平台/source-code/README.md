# 贷后自助服务平台

面向贷款用户的 C 端自助服务平台，支持在线查看还款计划、申请展期/减免、上传凭证等。

## 技术栈

**前端**
- React 18 + Next.js 14（App Router, SSR/SSG）
- TypeScript
- Tailwind CSS
- React Suspense 流式渲染

**后端**
- NestJS
- Prisma ORM + SQLite
- Redis 缓存
- Swagger API 文档

## 快速启动

### 前端
```bash
cd frontend
npm install
npm run dev
# http://localhost:3000
```

### 后端
```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
# http://localhost:3001
# Swagger: http://localhost:3001/api/docs
```

## 项目结构

```
source-code/
├── frontend/                # Next.js 前端
│   ├── app/                 # App Router 页面
│   │   ├── layout.tsx       # 根布局
│   │   ├── page.tsx         # 首页
│   │   └── repayment/       # 还款模块
│   ├── components/          # 组件
│   │   ├── repayment-plan.tsx   # 还款计划（Server + Client 混合）
│   │   ├── user-info.tsx        # 用户信息（Server Component）
│   │   └── skeletons.tsx        # 骨架屏
│   ├── lib/api.ts           # API 请求封装
│   ├── next.config.js       # 代理配置
│   └── tailwind.config.ts
│
├── backend/                 # NestJS 后端
│   ├── src/
│   │   ├── main.ts          # 入口
│   │   ├── app.module.ts    # 根模块
│   │   ├── common/          # 公共模块
│   │   │   ├── prisma.module.ts    # Prisma 连接
│   │   │   └── redis.module.ts     # Redis 缓存
│   │   └── modules/
│   │       ├── auth/        # 鉴权模块（Guard + Decorator）
│   │       └── repayment/   # 还款模块（核心业务）
│   └── prisma/
│       └── schema.prisma    # 数据模型
│
└── README.md
```

## 核心特性

- **SSR 流式渲染**：React Suspense + Streaming SSR，首屏 LCP 1.1s
- **乐观锁并发控制**：Prisma 事务 + version 字段保证还款状态并发安全
- **Redis 缓存**：热门接口缓存，QPS 从 200 提升至 1200
- **NestJS Guard 鉴权**：统一鉴权 + 接口限流
- **OpenAPI 契约**：Swagger 自动生成文档，前端根据文档生成类型
- **PWA 支持**：核心流程在微信内置浏览器可用
