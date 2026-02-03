# MyBLOG 管理系统项目结构文档

这是一个基于 Vue 3 + Vite 构建的博客管理系统后台。

## 技术栈

- **核心框架**: Vue 3 (Composition API)
- **构建工具**: Vite
- **UI框架**: Ant Design Vue
- **样式框架**: Tailwind CSS
- **状态管理**: Pinia/Vuex
- **HTTP客户端**: Axios
- **路由管理**: Vue Router 4

## 目录结构详解

```
MyBLOG_WebAdmin/
├── src/                          # 源代码目录
│   ├── api/                     # API接口层
│   │   └── user/
│   │       └── ...             # 业务模块API
│   │
│   ├── components/              # 公共组件库
│   │
│   ├── config/                 # 配置文件
│   │
│   ├── layout/                 # 布局组件
│   │   └── Layout.vue          # 主布局容器
│   │
│   ├── pages/                  # 页面组件
│   │
│   ├── router/                 # 路由配置
│   │   └── index.js            # 路由主配置文件
│   │
│   ├── style/                  # 全局样式
│   │   ├── fonts.css           # 字体样式
│   │   └── style.css           # 全局样式
│   │
│   ├── types/                  # TypeScript类型定义
│   │   └── env.d.ts            # 环境变量类型声明
│   │
│   ├── utils/                  # 工具函数
│   │
│   ├── App.vue                 # 根组件
│   └── main.js                 # 入口文件
│
├── index.html                  # HTML模板
├── package.json                # 项目依赖配置
├── package-lock.json           # 依赖锁定文件
├── qodana.yaml                 # 代码质量配置
├── tailwind.config.js          # Tailwind配置
└── vite.config.js              # Vite构建配置
```

## 启动和部署

### 开发环境

```bash
npm install
npm run dev
```

### 生产构建

```bash
npm run build
```

### 代码检查

```bash
npm run lint
```

## 项目特色
---
*文档更新时间: 2026-02-03*