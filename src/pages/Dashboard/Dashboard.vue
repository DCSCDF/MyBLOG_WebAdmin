<template>
  <div>
    <h1>仪表盘</h1>

    <div>
      <h2>欢迎，{{ username }}!</h2>
      <p>这是你的MyBlog管理系统仪表盘，可以在这里管理你的博客内容。</p>
    </div>
  </div>
</template>

<script setup>
import {onMounted, ref} from 'vue'

const username = ref('')

onMounted(() => {
  username.value = '用户'
})
</script>

<style scoped></style>
