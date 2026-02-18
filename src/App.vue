<!--
  - [App.vue]
  - -------------------------------------------------------------------------------
  - This software is licensed under the MIT License.
  - However, any distribution or modification must retain this copyright notice.
  - See LICENSE for full terms.
  - -------------------------------------------------------------------------------
  - author: "Jiu Liu"
  - author_contact: "QQ: 3209174373, GitHub: https://github.com/DCSCDF"
  - license: "MIT"
  - license_exception: "Mandatory attribution retention"
  - UpdateTime: 2026/2/17 22:27
  -
  -->

<template>
        <RouterView/>
</template>

<script setup>
import {RouterView} from 'vue-router'
import logger from './utils/logger.js'
import {useAuthStore} from './stores/auth.js'

console.info("%c MyBlogDev %c", "padding: 2px 6px; border-radius: 3px 3px; color: #fff; background: #FF6699; font-weight: bold;", "padding: 2px 6px; border-radius: 3px 3px; color: #fff; background: #FF9999; font-weight: bold;")
// 应用启动时输出环境信息
logger.environment()

// 在应用启动时初始化 token 从存储中恢复
const authStore = useAuthStore();
authStore.initTokenFromStorage();
</script>

