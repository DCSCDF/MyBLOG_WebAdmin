<template>
    <div class="pt-2">
        <h3 class="text-2xl font-bold text-gray-800 mb-2">欢迎回来</h3>
        <p class="text-gray-600 mb-8">登陆你的账户继续</p>

        <a-form :model="loginForm" :rules="loginRules" layout="vertical" @finish="handleLogin">
            <a-form-item label="用户名" name="username">
                <a-input v-model:value="loginForm.username" placeholder="输入用户名" size="large" class="rounded-lg">
                    <template #prefix>
                        <UserOutlined />
                    </template>
                </a-input>
            </a-form-item>

            <a-form-item label="密码" name="password">
                <a-input-password v-model:value="loginForm.password" placeholder="输入密码" size="large" class="rounded-lg">
                    <template #prefix>
                        <LockOutlined />
                    </template>
                </a-input-password>
            </a-form-item>

            <Captcha></Captcha>

            <div class="flex items-center justify-between mb-6">
                <a-checkbox v-model:checked="loginForm.remember">
                    记住我
                </a-checkbox>
                <a href="#" class="text-blue-600 hover:text-blue-700 text-sm">
                    忘记密码?
                </a>
            </div>

            <a-button type="primary" size="large" html-type="submit" :loading="loginLoading" :disabled="!isVerified"
                class="w-full h-10 rounded-lg text-base font-semibold flex items-center justify-center">
                登陆
            </a-button>
        </a-form>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue'
import Captcha from './Captcha.vue'

const loginForm = ref({
    username: '',
    password: '',
    remember: false
})

const loginLoading = ref(false)


const isVerified = ref(false)

const loginRules = {
    username: [
        { required: true, message: '请输入用户名', trigger: 'change' },
        { min: 3, message: '用户名至少3个字符', trigger: 'change' },
        {
            pattern: /^(?!\d+$)/,
            message: '用户名不能为纯数字',
            trigger: 'change'
        }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'change' },
        { min: 6, message: '密码至少6个字符', trigger: 'change' }
    ]
}

const handleLogin = async () => {
    loginLoading.value = true
    // 处理登陆逻辑
}






</script>

<style scoped>
:deep(.ant-btn) {
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
}
</style>
