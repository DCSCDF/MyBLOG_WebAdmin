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
import { ref, onMounted } from 'vue'

const username = ref('')
const stats = ref({
    articles: 24,
    comments: 128,
    users: 456,
    views: 5280
})

onMounted(() => {
    username.value = localStorage.getItem('username') || '用户'
})
</script>

<style scoped></style>
