<!--
  - [Login.vue]
  - -------------------------------------------------------------------------------
  - This software is licensed under the MIT License.
  - However, any distribution or modification must retain this copyright notice.
  - See LICENSE for full terms.
  - -------------------------------------------------------------------------------
  - author: "Jiu Liu"
  - author_contact: "QQ: 3209174373, GitHub: https://github.com/DCSCDF"
  - license: "MIT"
  - license_exception: "Mandatory attribution retention"
  - UpdateTime: 2026/2/18 06:59
  -
  -->

<template>
        <!-- 动态背景  -->
        <div class="fixed inset-0 -z-50
                bg-size-[200%_200%] animate-gradient
                bg-linear-to-tr from-blue-400/40 via-white/70 to-blue-400/70
                dark:bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))]
                dark:from-gray-800 dark:via-gray-600 dark:to-gray-800">
        </div>


        <div class="min-h-screen flex items-center justify-center from-blue-50 to-indigo-100 lg:p-4 p-2 flex flex-col">

                <div class="w-full max-w-md">
                        <div class="my-2">
                                <a v-if="showBackButton"

                                   @click="handleBack">
                                        <ArrowLeftOutlined class="mr-2 " style="color: #9ca3af"/>
                                        <span class="text-gray-400">返回</span>
                                </a>
                        </div>


                        <a-card class="!overflow-hidden shadow-xl !bg-white/80 !backdrop-blur-md mt-10">

                                <!-- 标签页切换 -->
                                <a-tabs v-model:activeKey="activeTab" class="form-tabs md:!px-5 !pb-5"
                                        @change="handleTabChange">
                                        <!-- 登陆标签页 -->
                                        <a-tab-pane key="login" tab="登陆">
                                                <LoginForm/>
                                        </a-tab-pane>
                                        <!-- 注册标签页 -->
                                        <a-tab-pane key="register" tab="注册">
                                                <RegisterForm @register-success="activeTab = 'login'"/>
                                        </a-tab-pane>
                                </a-tabs>
                        </a-card>
                </div>
        </div>
</template>

<script setup>
import {onMounted, ref} from 'vue'
import {ArrowLeftOutlined} from '@ant-design/icons-vue'
import LoginForm from '../components/auth/LoginForm.vue'
import RegisterForm from '../components/auth/RegisterForm.vue'
import {publicConfigApi} from '../api/system/publicConfigApi.js'

const activeTab = ref('login')
const showBackButton = ref(false)
const redirectUrl = ref('')

// 切换 tab 时关闭验证码弹窗
const handleTabChange = () => {
        // 触发全局事件，通知所有 Captcha 组件关闭弹窗
        window.dispatchEvent(new CustomEvent('close-captcha'))
}

// 检查是否显示返回按钮
const checkShowBackButton = async () => {
        try {
                const configResponse = await publicConfigApi.getConfig({keys: ['site.redirect_url']})
                if (configResponse.success && configResponse.data && configResponse.data.length > 0) {
                        const redirectConfig = configResponse.data.find(item => item.configKey === 'site.redirect_url')
                        if (redirectConfig && redirectConfig.configValue) {
                                // 检查是否为有效的 URL
                                const urlPattern = /^https?:\/\/.+/
                                if (urlPattern.test(redirectConfig.configValue)) {
                                        redirectUrl.value = redirectConfig.configValue
                                        showBackButton.value = true
                                }
                        }
                }
        } catch (error) {
                console.error('获取 redirect_url 失败:', error)
        }
}

// 返回按钮点击事件
const handleBack = () => {
        if (redirectUrl.value) {
                window.location.href = redirectUrl.value
        }
}

onMounted(() => {
        checkShowBackButton()
})
</script>

