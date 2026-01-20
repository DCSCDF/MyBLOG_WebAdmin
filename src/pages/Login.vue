<template>
    <!-- 动态背景  -->
    <div class="fixed inset-0 -z-50 
      bg-size-[200%_200%] animate-gradient 
            bg-linear-to-tr from-blue-400/40 via-white/70 to-blue-400/70
            dark:bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))]
            dark:from-gray-800 dark:via-gray-600 dark:to-gray-800">
    </div>
    <div class="min-h-screen flex items-center justify-center from-blue-50 to-indigo-100 p-4">
        <div class="w-full max-w-md">
            <div class="rounded-xl overflow-hidden shadow-2xl bg-white/80 backdrop-blur-md">
                <!-- 表单内容 -->
                <div class="px-8 pt-4 pb-8">
                    <!-- 标签页切换 -->
                    <a-tabs v-model:activeKey="activeTab" class="form-tabs">
                        <!-- 登陆标签页 -->
                        <a-tab-pane key="login" tab="登陆">
                           <LoginForm />
                        </a-tab-pane>

                        <!-- 注册标签页 -->
                        <a-tab-pane key="register" tab="注册">
                           <RegisterForm />
                        </a-tab-pane>
                    </a-tabs>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import LoginForm from '../components/auth/LoginForm.vue'
import RegisterForm from '../components/auth/RegisterForm.vue'

const activeTab = ref('login')
</script>

<style scoped>
.form-tabs :deep(.ant-tabs-tab) {
    font-weight: 600;
    font-size: 16px;
}

.form-tabs :deep(.ant-tabs-tab-active .ant-tabs-tab-btn) {
    color: #1890ff;
}
</style>
