<!--
  - [doclist.vue]
  - -------------------------------------------------------------------------------
  - This software is licensed under the MIT License.
  - However, any distribution or modification must retain this copyright notice.
  - See LICENSE for full terms.
  - -------------------------------------------------------------------------------
  - author: "Jiu Liu"
  - author_contact: "QQ: 3209174373, GitHub: https://github.com/DCSCDF"
  - license: "MIT"
  - license_exception: "Mandatory attribution retention"
  - UpdateTime: 2026/3/11 05:38
  -
  -->
<template>
        <a-card>
                <div class="markdown-body">
                        <vue3-markdown-it :source="markdownContent"/>
                </div>
        </a-card>
</template>


<script setup>
import {ref} from 'vue'
import Vue3MarkdownIt from 'vue3-markdown-it'
import 'highlight.js/styles/monokai.css';
import 'github-markdown-css/github-markdown.css'

const markdownContent = ref(`

# 外部实现登陆
实现登陆前需要做如下配置：网站管理页面的站点配置-网站基本设置的前台登陆地址项（URL如\`http://localhost:3000/login\`），同时修改后端\`app.cors.allowed-origins\`添加前台url。

### 登陆
当用户执行登陆之后会访问配置后的前台登陆地址并携带参数如下：

\`http://localhost:3000/?code=9IUQDyzC30XjFTDVDMlDGSObQ1pi7zWc&redirect_url=http://localhost:5173/login&remember=false\`

code为用来访问后端交换token，有效期5分钟一次性。redirect_url为执行交换token和存储token后需要跳转的地址。remember为存储为会话存储或者本地存储，true为本地存储。

### Code交换Token的API

用于外部授权模式下，使用授权码换取正式的登录 token。

- **请求方法**: \`POST\`
- **请求路径**: \`/api/auth/oauth/token\`
- **限流**: 60 秒内最多 10 次

#### 请求参数

\`code\` 为登录接口返回的一次性授权码，有效期 5 分钟，只能使用一次。

\`\`\`json
{
  "code": "AbCdEfGhIjKlMnOpQrStUvWxYz012345"
}
\`\`\`

| 字段   | 类型     | 必填 | 说明                |
|------|--------|----|-------------------|
| code | String | 是  | 授权码，登录接口返回，有效期5分钟 |

#### 响应示例

\`\`\`json
{
    "data": {
        "token": "J062mk2fxe......82w34W3E9UbagD"
    },
    "success": true,
    "errorMsg": null,
    "code": 200
}
\`\`\`

#### 错误响应

- 授权码为空：\`code: 400\`
- 授权码无效或已过期：\`code: 400\`

\`\`\`json
{
    "data": null,
    "success": false,
    "errorMsg": "授权码无效或已过期",
    "code": 400
}
\`\`\`

---
`)
</script>


