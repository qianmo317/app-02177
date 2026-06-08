# 图书购物商城

## How to Run

### Docker 方式

```bash
# 使用 Docker Compose 启动
docker-compose up -d --build

# 访问地址
http://localhost:8081
```

### 本地开发

```bash
# 进入项目目录
cd frontend-user

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 访问地址
http://localhost:5173
```

## Services

| 服务名称 | 端口 | 说明 |
|---------|------|------|
| frontend-user | 8081 | 图书商城用户端 |

## 测试账号

| 用户名 | 密码 | 说明 |
|--------|------|------|
| admin | 123456 | 测试账号 |
| user | 123456 | 普通用户 |

## 题目内容

给我写一个简单的vue图书购物商城。

---

## 项目介绍

这是一个基于 Vue 3 + Vite + Element Plus + Pinia 构建的图书购物商城前端项目。

### ⚠️ Mock 数据说明

本项目为前端演示项目，**未接入真实后端服务**，以下功能使用 Mock/本地存储模拟实现：

| 功能模块 | Mock 实现方式 | 说明 |
|---------|-------------|------|
| 用户认证 | localStorage | 用户数据存储在浏览器本地，支持注册新用户 |
| 图书数据 | Pinia Store | 静态图书数据，存储在前端状态管理中 |
| 购物车 | localStorage | 购物车数据持久化到本地存储 |
| 订单管理 | localStorage | 订单数据持久化到本地存储 |
| 支付二维码 | 模拟生成 | 二维码内容为模拟的微信支付链接，扫码无实际支付功能，点击"支付完成"按钮模拟支付成功 |

**生产环境部署时，需要将 Mock 实现替换为真实的后端 API 调用。**

### 技术栈

- Vue 3 - 渐进式 JavaScript 框架
- Vite - 下一代前端构建工具
- Element Plus - Vue 3 UI 组件库
- Pinia - Vue 状态管理
- Vue Router - 路由管理
- Scss - CSS 预处理器
- Axios - HTTP 请求库

### 功能模块

1. **首页** - 展示图书列表、搜索、分类筛选
2. **图书管理** - 图书列表、搜索、分类筛选
3. **购物车** - 添加/删除商品、修改数量、结算
4. **订单管理** - 订单列表、支付、取消订单
5. **用户认证** - 登录、注册
6. **个人中心** - 个人信息管理、修改密码
7. **图书详情** - 查看图书详细信息

### 项目结构

```
├── README.md                 # 项目说明文档
├── docker-compose.yml        # Docker Compose 配置
├── .gitignore                # Git 忽略文件
└── frontend-user/            # 用户端项目
    ├── Dockerfile            # Docker 构建文件
    ├── nginx.conf            # Nginx 配置
    ├── package.json          # 项目依赖
    ├── vite.config.js        # Vite 配置
    ├── index.html            # HTML 入口
    ├── public/               # 静态资源
    └── src/
        ├── main.js           # 入口文件
        ├── App.vue           # 根组件
        ├── api/              # API 接口
        ├── router/           # 路由配置
        ├── stores/           # Pinia 状态管理
        ├── styles/           # 全局样式
        ├── components/       # 公共组件
        ├── utils/            # 工具函数
        └── views/            # 页面组件
            ├── Home.vue      # 首页
            ├── Books.vue     # 图书列表
            ├── BookDetail.vue# 图书详情
            ├── Cart.vue      # 购物车
            ├── Checkout.vue  # 结算页
            ├── Orders.vue    # 订单列表
            ├── Profile.vue   # 个人中心
            ├── Login.vue     # 登录页
            └── Register.vue  # 注册页
```
