<template>
    <div class="dashboard">
        <h1>仪表盘</h1>

        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-icon"></div>
                <div class="stat-content">
                    <p class="stat-label">文章总数</p>
                    <p class="stat-value">{{ stats.articles }}</p>
                </div>
            </div>

            <div class="stat-card">
                <div class="stat-icon"></div>
                <div class="stat-content">
                    <p class="stat-label">评论数</p>
                    <p class="stat-value">{{ stats.comments }}</p>
                </div>
            </div>

            <div class="stat-card">
                <div class="stat-icon"></div>
                <div class="stat-content">
                    <p class="stat-label">用户数</p>
                    <p class="stat-value">{{ stats.users }}</p>
                </div>
            </div>

            <div class="stat-card">
                <div class="stat-icon"></div>
                <div class="stat-content">
                    <p class="stat-label">浏览量</p>
                    <p class="stat-value">{{ stats.views }}</p>
                </div>
            </div>
        </div>

        <div class="welcome-section">
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

<style scoped>
.dashboard {
    max-width: 1200px;
}

.dashboard h1 {
    color: #333;
    margin-bottom: 30px;
    font-size: 28px;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    margin-bottom: 40px;
}

.stat-card {
    background: white;
    padding: 24px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    gap: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s, box-shadow 0.3s;
}

.stat-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.stat-icon {
    font-size: 40px;
}

.stat-content {
    flex: 1;
}

.stat-label {
    color: #999;
    font-size: 14px;
    margin: 0;
}

.stat-value {
    color: #333;
    font-size: 28px;
    font-weight: bold;
    margin: 8px 0 0;
}

.welcome-section {
    background: white;
    padding: 30px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.welcome-section h2 {
    color: #333;
    margin-top: 0;
}

.welcome-section p {
    color: #666;
    line-height: 1.6;
}
</style>
