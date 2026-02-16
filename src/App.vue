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
  - UpdateTime: 2026/2/2 18:17
  -
  -->

<template>
        <RouterView/>
</template>

<script setup>
import {RouterView} from 'vue-router'
import logger from './utils/logger.js'

console.info("%c MyBlogDev %c", "padding: 2px 6px; border-radius: 3px 3px; color: #fff; background: #FF6699; font-weight: bold;", "padding: 2px 6px; border-radius: 3px 3px; color: #fff; background: #FF9999; font-weight: bold;")
// 应用启动时输出环境信息
logger.environment()
</script>

