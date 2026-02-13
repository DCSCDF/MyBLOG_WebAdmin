# MyBLOG 后台项目结构文档

这是一个基于 Vue 3 + Vite 构建的博客管理系统后台。

![img.png](Document/docimg/img.png)

## 技术栈

<div align="center">

![Vue.js](https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![Ant Design](https://img.shields.io/badge/Ant_Design-1890FF?style=for-the-badge&logo=antdesign&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Pinia](https://img.shields.io/badge/Pinia-FEDC00?style=for-the-badge&logo=pinia&logoColor=black)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)
![Vue Router](https://img.shields.io/badge/Vue_Router-4FC08D?style=for-the-badge&logo=vuedotjs&logoColor=white)

</div>

> ### 参考文档
> - [状态管理](/Document/PINIA_GUIDE.md)

## 目录结构详解

```
MyBLOG_WebAdmin/
├── src/                        # 源代码目录
│   ├── api/                    # API接口层
│   │
│   ├── components/             # 公共组件库
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
│   ├── stores/                 # 全局状态管理
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
