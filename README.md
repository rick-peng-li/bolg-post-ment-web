<!-- Git 仓库地址：git@github.com:rick-peng-li/bolg-post-ment-web.git -->

# bolg-post-ment-web

一个用于博客文章管理的前后端分离项目，支持文章列表查询、筛选、分页、详情查看、新增、编辑、删除以及 CSV 导出。前端基于 React + Vite 构建管理界面，后端基于 Express + MongoDB 提供 RESTful API。

## 1. 项目概览

### 1.1 核心能力

- 文章 CRUD：新增、查看、编辑、删除文章
- 列表管理：支持分页、关键字搜索、分类筛选、状态筛选
- 数据导出：支持将当前筛选结果导出为 CSV 文件
- 表单校验：前端使用 Yup，后端使用 Mongoose 双重校验
- 状态管理：支持 Draft、Published、Archived 三种文章状态
- 内容补充：支持标签、封面图 URL、摘要、正文内容

### 1.2 适用场景

- 中小型内容后台管理系统
- 博客文章运营与编辑系统
- React + Node.js + MongoDB 全栈练习项目

## 2. 技术架构

| 层级 | 技术方案 | 说明 |
| --- | --- | --- |
| 前端 | React 18、Vite、React Router 6 | 构建 SPA 管理后台与路由页面 |
| 表单 | React Hook Form、Yup | 表单状态管理与输入校验 |
| 网络请求 | Axios | 统一封装 API 请求与错误处理 |
| 消息提示 | react-hot-toast | 成功/失败反馈提示 |
| 后端 | Node.js、Express | 提供 RESTful API |
| 数据库 | MongoDB、Mongoose | 文档型数据存储与 Schema 校验 |
| 日志 | morgan | 请求日志输出 |
| 跨域 | cors | 支持前后端本地联调 |
| 导出 | json2csv | 支持文章数据导出为 CSV |

## 3. 架构说明

### 3.1 整体分层

- frontend：负责页面展示、交互处理、请求封装与表单校验
- backend：负责业务逻辑、数据持久化、数据校验与接口输出
- MongoDB：负责文章数据存储

### 3.2 前后端协作流程

1. 前端页面通过 `postService` 发起请求
2. Express 路由将请求分发到 `postController`
3. 控制器调用 `Post` 模型查询或写入 MongoDB
4. 后端统一返回 `success / data / message / pagination` 等结构
5. 前端根据接口结果刷新列表、详情和表单页面状态

### 3.3 后端目录设计

```text
backend/
├── config/           数据库连接配置
├── controllers/      文章业务控制器
├── middleware/       全局错误处理中间件
├── models/           Mongoose 数据模型
├── routes/           RESTful 路由定义
├── package.json
└── server.js         服务启动入口
```

### 3.4 前端目录设计

```text
frontend/
├── src/
│   ├── components/
│   │   ├── common/     通用组件：Header、Spinner、StatusBadge、ConfirmModal
│   │   ├── dashboard/  仪表盘、洞察页、工作流复用组件
│   │   └── posts/      文章业务组件：PostForm、PostTable、Pagination
│   ├── hooks/        文章聚合数据 Hook
│   ├── pages/        页面级组件
│   ├── services/     API 请求封装
│   ├── styles/       全局样式
│   ├── utils/        常量、工具函数、校验规则、内容统计
│   ├── App.jsx       路由入口
│   └── main.jsx      应用挂载入口
├── package.json
└── vite.config.js
```

## 4. 模块设计

### 4.1 后端模块

| 模块 | 位置 | 功能说明 |
| --- | --- | --- |
| 服务入口 | `backend/server.js` | 初始化环境变量、连接数据库、注册中间件与路由 |
| 数据库配置 | `backend/config/db.js` | 连接 MongoDB，连接失败时终止进程 |
| 文章模型 | `backend/models/Post.js` | 定义文章字段结构、枚举范围、长度限制与索引 |
| 文章控制器 | `backend/controllers/postController.js` | 实现分页查询、详情、创建、更新、删除、CSV 导出 |
| 路由模块 | `backend/routes/postRoutes.js` | 定义 `/api/posts` 相关接口 |
| 错误中间件 | `backend/middleware/errorHandler.js` | 统一处理校验错误、重复键错误、非法 ID 错误 |

### 4.2 前端模块

| 模块 | 位置 | 功能说明 |
| --- | --- | --- |
| 应用路由 | `frontend/src/App.jsx` | 配置总览、文章列表、工作流、洞察、新建、详情、编辑、404 页面 |
| 请求服务 | `frontend/src/services/postService.js` | 封装文章接口调用及错误拦截 |
| 聚合 Hook | `frontend/src/hooks/usePostsDataset.js` | 统一拉取文章全集，为多页面统计分析提供数据源 |
| 仪表盘组件 | `frontend/src/components/dashboard/*` | 统计卡片、面板、迷你文章列表、工作流列等复用组件 |
| 表单组件 | `frontend/src/components/posts/PostForm.jsx` | 统一承载新增与编辑表单 |
| 列表表格 | `frontend/src/components/posts/PostTable.jsx` | 展示文章列表及操作按钮 |
| 分页组件 | `frontend/src/components/posts/Pagination.jsx` | 处理页码切换 |
| 通用组件 | `frontend/src/components/common/*` | 头部导航、加载态、状态徽标、确认弹窗 |
| 内容分析工具 | `frontend/src/utils/postAnalytics.js` | 负责状态统计、分类分布、作者榜单、趋势与建议生成 |

## 5. 页面设计

| 页面 | 路由 | 主要功能 |
| --- | --- | --- |
| 内容总览页 | `/dashboard` | 展示总体统计、最近更新、分类分布、作者活跃度、月度趋势与运营建议 |
| 文章列表页 | `/` | 分页浏览文章、搜索、分类筛选、状态筛选、删除、导出 CSV |
| 工作流看板页 | `/workflow` | 按 Draft、Published、Archived 分组查看内容推进状态 |
| 内容洞察页 | `/insights` | 查看封面率、摘要率、标签率、分类结构、作者贡献与内容建议 |
| 新建文章页 | `/posts/new` | 创建新文章，提交前进行表单校验 |
| 文章详情页 | `/posts/:id` | 查看完整文章内容、作者信息、标签、更新时间 |
| 编辑文章页 | `/posts/:id/edit` | 加载已有文章数据并更新内容 |
| 404 页面 | `*` | 处理不存在的路由 |

### 5.1 页面交互说明

- 总览页提供全站级统计与最近更新内容，适合进入后台后的第一视角
- 列表页支持搜索标题、作者、分类
- 工作流看板页适合按状态管理文章生产流程
- 洞察页用于查看内容质量、作者贡献和分类集中度
- 删除文章时使用确认弹窗，避免误删
- 详情页支持直接跳转到编辑页或执行删除
- 新增页与编辑页共用同一套表单组件，降低重复代码

## 6. 数据模型设计

### 6.1 Post 文章模型

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| title | String | 是 | 文章标题，3~150 字符 |
| author | String | 是 | 作者名称，至少 2 字符 |
| email | String | 是 | 作者邮箱 |
| category | String | 是 | 分类，限定枚举值 |
| status | String | 否 | 文章状态，默认 Draft |
| tags | String[] | 否 | 标签数组 |
| thumbnailUrl | String | 否 | 缩略图链接 |
| shortDescription | String | 否 | 文章摘要，最长 300 字符 |
| content | String | 是 | 正文内容，至少 10 字符 |
| createdAt | Date | 自动生成 | 创建时间 |
| updatedAt | Date | 自动生成 | 更新时间 |

### 6.2 分类与状态

- 分类：Technology、Design、Business、Lifestyle、Health、Travel、Food、Other
- 状态：Draft、Published、Archived

## 7. 接口设计

### 7.1 返回结构约定

大部分接口返回统一 JSON 结构：

```json
{
  "success": true,
  "data": {},
  "message": "optional",
  "pagination": {}
}
```

### 7.2 接口清单

| 方法 | 路径 | 功能 |
| --- | --- | --- |
| GET | `/api/health` | 服务健康检查 |
| GET | `/api/posts` | 获取文章列表，支持分页、搜索、筛选、排序 |
| GET | `/api/posts/:id` | 获取单篇文章详情 |
| POST | `/api/posts` | 创建文章 |
| PUT | `/api/posts/:id` | 更新文章 |
| DELETE | `/api/posts/:id` | 删除文章 |
| GET | `/api/posts/export` | 导出文章 CSV |

### 7.3 列表查询参数

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| page | number | 1 | 当前页码 |
| limit | number | 10 | 每页条数 |
| search | string | - | 按标题、作者、分类模糊搜索 |
| category | string | - | 按分类筛选 |
| status | string | - | 按状态筛选 |
| sortBy | string | createdAt | 排序字段 |
| order | string | desc | 排序方向，支持 asc / desc |

### 7.4 创建/更新文章请求体示例

```json
{
  "title": "React + Node.js 搭建博客后台",
  "author": "张三",
  "email": "zhangsan@example.com",
  "category": "Technology",
  "status": "Published",
  "tags": ["react", "nodejs", "mongodb"],
  "thumbnailUrl": "https://example.com/cover.jpg",
  "shortDescription": "介绍如何快速搭建一个文章管理后台。",
  "content": "这里是文章正文内容。"
}
```

### 7.5 错误处理策略

- 参数校验失败：返回 400
- 非法 ObjectId：返回 400
- 数据不存在：返回 404
- 服务端未知异常：返回 500
- 开发环境下额外返回错误栈，便于排查问题

## 8. 启动方式

### 8.1 环境要求

- Node.js 18+
- MongoDB 6+
- npm 9+

### 8.2 后端启动

在 `backend` 目录下创建 `.env` 文件：

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/blog_app
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

执行命令：

```bash
cd backend
npm install
npm run dev
```

启动后默认访问：`http://localhost:5000`

### 8.3 前端启动

如需显式指定接口地址，可在 `frontend` 目录下创建 `.env` 文件：

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

执行命令：

```bash
cd frontend
npm install
npm run dev
```

启动后默认访问：`http://localhost:5173`

### 8.4 生产构建

前端构建：

```bash
cd frontend
npm run build
```

后端生产启动：

```bash
cd backend
npm start
```

## 9. 联调说明

- 前端默认从 `VITE_API_BASE_URL` 读取接口地址
- 若未配置该变量，则前端默认请求相对路径 `/api`
- 本地开发推荐前后端分别运行在 5173 和 5000 端口
- 后端通过 `CLIENT_URL` 控制允许访问的前端来源

## 10. 当前实现特点

- 采用组件化拆分，列表、表单、分页、弹窗、仪表盘与工作流模块职责清晰
- 使用统一服务层封装接口，并通过聚合 Hook 为多页面复用文章数据
- 前后端同时做数据校验，减少脏数据写入风险
- 支持 CSV 导出，满足基础运营数据留存需求
- 支持内容总览、洞察分析、状态看板等扩展页面，项目内容更完整
- 支持搜索与多条件筛选，适合管理型后台场景

## 11. 目录清单

```text
bolg-post-ment-web/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── package-lock.json
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   ├── dashboard/
│   │   │   └── posts/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── styles/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   └── vite.config.js
├── .gitignore
└── README.md
```

## 12. 后续可扩展方向

- 增加用户登录、权限控制与角色管理
- 引入富文本编辑器与图片上传能力
- 增加接口测试、单元测试与 E2E 测试
- 增加文章草稿自动保存与发布计划能力
- 增加分类管理、标签管理与数据看板
