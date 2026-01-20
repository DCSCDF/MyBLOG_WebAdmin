<template>
    <!-- 动态背景  -->
    <div class="fixed inset-0 -z-50 
            bg-[length:200%_200%] animate-gradient 
            bg-gradient-to-tr from-blue-400/40 via-white/70 to-blue-400/70
            dark:bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))]
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
                            <div class="pt-2">
                                <h3 class="text-2xl font-bold text-gray-800 mb-2">欢迎回来</h3>
                                <p class="text-gray-600 mb-8">登陆你的账户继续</p>

                                <a-form :model="loginForm" :rules="loginRules" layout="vertical" @finish="handleLogin">
                                    <a-form-item label="用户名" name="username">
                                        <a-input v-model:value="loginForm.username" placeholder="输入用户名" size="large"
                                            class="rounded-lg">
                                            <template #prefix>
                                                <UserOutlined />
                                            </template>
                                        </a-input>
                                    </a-form-item>

                                    <a-form-item label="密码" name="password">
                                        <a-input-password v-model:value="loginForm.password" placeholder="输入密码"
                                            size="large" class="rounded-lg">
                                            <template #prefix>
                                                <LockOutlined />
                                            </template>
                                        </a-input-password>
                                    </a-form-item>

                                    <div class="flex items-center justify-between mb-6">
                                        <a-checkbox v-model:checked="loginForm.remember">
                                            记住我
                                        </a-checkbox>
                                        <a href="#" class="text-blue-600 hover:text-blue-700 text-sm">
                                            忘记密码?
                                        </a>
                                    </div>

                                    <a-button type="primary" size="large" html-type="submit" :loading="loginLoading"
                                        class="w-full h-10 rounded-lg text-base font-semibold">
                                        登陆
                                    </a-button>
                                </a-form>
                            </div>
                        </a-tab-pane>

                        <!-- 注册标签页 -->
                        <a-tab-pane key="register" tab="注册">
                            <div class="pt-6">
                                <h3 class="text-2xl font-bold text-gray-800 mb-2">创建账户</h3>
                                <p class="text-gray-600 mb-8">加入我们开始你的博客之旅</p>

                                <a-form :model="registerForm" :rules="registerRules" layout="vertical"
                                    @finish="handleRegister">
                                    <a-form-item label="用户名" name="username">
                                        <a-input v-model:value="registerForm.username" placeholder="输入用户名" size="large"
                                            class="rounded-lg">
                                            <template #prefix>
                                                <UserOutlined />
                                            </template>
                                        </a-input>
                                    </a-form-item>

                                    <a-form-item label="邮箱" name="email">
                                        <a-input v-model:value="registerForm.email" type="email" placeholder="输入邮箱地址"
                                            size="large" class="rounded-lg">
                                            <template #prefix>
                                                <MailOutlined />
                                            </template>
                                        </a-input>
                                    </a-form-item>

                                    <a-form-item label="密码" name="password">
                                        <a-input-password v-model:value="registerForm.password" placeholder="设置密码"
                                            size="large" class="rounded-lg">
                                            <template #prefix>
                                                <LockOutlined />
                                            </template>
                                        </a-input-password>
                                    </a-form-item>

                                    <a-form-item label="确认密码" name="confirmPassword">
                                        <a-input-password v-model:value="registerForm.confirmPassword"
                                            placeholder="确认密码" size="large" class="rounded-lg">
                                            <template #prefix>
                                                <LockOutlined />
                                            </template>
                                        </a-input-password>
                                    </a-form-item>

                                    <a-form-item name="agreement" valuePropName="checked">
                                        <a-checkbox v-model:checked="registerForm.agreement">
                                            <span class="text-sm text-gray-700">
                                                我同意
                                                <a href="#" class="text-blue-600 hover:text-blue-700">
                                                    服务条款
                                                </a>
                                                和
                                                <a href="#" class="text-blue-600 hover:text-blue-700">
                                                    隐私政策
                                                </a>
                                            </span>
                                        </a-checkbox>
                                    </a-form-item>

                                    <a-button type="primary" size="large" html-type="submit" :loading="registerLoading"
                                        class="w-full h-10 rounded-lg text-base font-semibold">
                                        创建账户
                                    </a-button>
                                </a-form>
                            </div>
                        </a-tab-pane>
                    </a-tabs>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons-vue'

const router = useRouter()
const activeTab = ref('login')

// 登陆表单数据
const loginForm = ref({
    username: '',
    password: '',
    remember: false
})

// 注册表单数据
const registerForm = ref({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreement: false
})

// 加载状态
const loginLoading = ref(false)
const registerLoading = ref(false)

// 登陆验证规则
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

// 注册验证规则
const registerRules = {
    username: [
        { required: true, message: '请输入用户名', trigger: 'change' },
        { min: 3, max: 20, message: '用户名长度3-20个字符', trigger: 'change' },
        {
            pattern: /^(?!\d+$)/,
            message: '用户名不能为纯数字',
            trigger: 'change'
        }
    ],
    email: [
        { required: true, message: '请输入邮箱', trigger: 'change' },
        { type: 'email', message: '请输入有效的邮箱地址', trigger: 'change' }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'change' },
        { min: 6, message: '密码至少6个字符', trigger: 'change' }
    ],
    confirmPassword: [
        { required: true, message: '请确认密码', trigger: 'change' },
        {
            validator: (rule, value) => {
                if (value !== registerForm.value.password) {
                    return Promise.reject(new Error('两次输入密码不一致'))
                }
                return Promise.resolve()
            },
            trigger: 'change'
        }
    ],
    agreement: [
        {
            validator: (rule, value) => {
                if (!value) {
                    return Promise.reject(new Error('请同意服务条款'))
                }
                return Promise.resolve()
            },
            trigger: 'change'
        }
    ]
}

// 处理登陆
const handleLogin = async () => {
    loginLoading.value = true

}

// 处理注册
const handleRegister = async () => {
    registerLoading.value = true

}
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
