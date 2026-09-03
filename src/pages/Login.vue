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
        <!--        <div class="fixed inset-0 -z-50-->
        <!--                        bg-size-[200%_200%] animate-gradient-->
        <!--                        bg-linear-to-tr from-blue-400/40 via-white/70 to-blue-400/70-->
        <!--                        dark:bg-[radial-gradient(ellipse_at_center,var(&#45;&#45;tw-gradient-stops))]-->
        <!--                        dark:from-gray-800 dark:via-gray-600 dark:to-gray-800">-->
        <!--        </div>-->


        <!-- 返回按钮 - 悬浮在左上角 -->
        <div v-if="showBackButton"
             class="fixed top-2 left-2 md:left-8 md:top-8 z-50
                    group flex items-center cursor-pointer w-fit
                    px-3 py-1.5 rounded-full
                    bg-white/70
                    border border-gray-200
                    hover:shadow-md backdrop-blur-sm
                    transition-all duration-300 ease-out`
                    hover:bg-white hover:border-blue-300 hover:shadow-lg
                    active:scale-95"
             @click="handleBack">

                <LeftOutlined class="text-sm !text-gray-600
                                          group-hover:text-blue-500
                                          group-hover:-translate-x-0.5
                                          transition-all duration-300"/>
                <span class="text-sm text-gray-600
                             group-hover:text-blue-600 
                             transition-colors duration-300">返回</span>
        </div>

        <div
            class="min-h-screen flex items-center justify-center from-blue-50 to-indigo-100 lg:p-4 p-2 flex flex-col ">

                <div class="w-full max-w-md my-12">

                        <!-- 站点身份标识（后端配置的站点名） -->
                        <div class="text-center mb-6 mt-2">
                                <h1 class="text-3xl font-bold text-gray-800 tracking-tight">
                                        {{ siteName || 'MyBlog' }}
                                </h1>
                                <!--                                <div class="mt-2 flex items-center justify-center gap-1.5 text-xs text-gray-500">-->
                                <!--                                        <SafetyCertificateOutlined class="text-green-500"/>-->
                                <!--                                        <span> 用户后台</span>-->
                                <!--                                </div>-->
                        </div>

                        <a-card class="!overflow-hidden !bg-white/80 !backdrop-blur-md mt-10">
                                <!-- 标签页切换 -->
                                <a-tabs v-model:activeKey="activeTab" class="form-tabs !px-2 md:!px-6 !pb-5"
                                        @change="handleTabChange">
                                        <!-- 登陆标签页 -->
                                        <a-tab-pane key="login" tab="登陆">
                                                <LoginForm @switch-to-find-password="activeTab = 'find-password'"/>
                                        </a-tab-pane>
                                        <!-- 注册标签页 -->
                                        <a-tab-pane key="register" tab="注册">
                                                <RegisterForm @register-success="activeTab = 'login'"/>
                                        </a-tab-pane>

                                </a-tabs>
                                <div v-if="activeTab === 'find-password'" class="form-tabs !px-2 md:!px-6 !pb-5">
                                        <!-- 找回密码表单（不作为tab，直接显示在tab区域下方） -->
                                        <FindPasswordForm
                                            @reset-success="activeTab = 'login'"/>
                                </div>

                        </a-card>

                        <!-- 底部：关于本站 · 隐私政策 -->
                        <div class="mt-6 mb-2 text-center text-sm text-gray-500">
                                <a class="text-gray-600 hover:text-blue-600 transition-colors" href="#"
                                   @click.prevent="showAbout = true">关于本站</a>
                                <span class="mx-2 text-gray-400">·</span>
                                <a class="text-gray-600 hover:text-blue-600 transition-colors" href="#"
                                   @click.prevent="showPrivacy = true">隐私政策</a>
                        </div>
                </div>
        </div>

        <!-- 关于本站 弹窗 -->
        <a-modal v-model:open="showAbout" :footer="null" :title="`${siteName || 'MyBlog'} · 关于本站`" centered
                 width="520px">
                <div class="text-sm text-gray-700 leading-relaxed space-y-3 py-2">
                        <!--                        <p>{{ siteName || 'MyBlog' }} 是一个面向个人用户的私密内容管理平台，-->
                        <!--                                仅用于站点管理员与授权用户登录维护自身内容，不对外公开访问。</p>-->
                        <!--                        <p>本站不收集访客行为数据，不嵌入第三方广告或分析脚本，-->
                        <!--                                所有内容均存储于站点自有服务器。</p>-->
                        <p class="text-gray-500 text-xs pt-2 border-t border-gray-100">
                                站点域名：{{ siteDomain || locationOrigin }}<br/>
                                备案号：{{ recordNumber || '—' }}
                        </p>
                </div>
        </a-modal>

        <!-- 隐私政策 弹窗 -->
        <a-modal v-model:open="showPrivacy" :footer="null" :title="`${siteName || 'MyBlog'} · 隐私政策`" centered
                 width="520px">
                <div class="text-sm text-gray-700 leading-relaxed space-y-3 py-2">
                        <p><strong>1. 我们存储什么</strong><br/>
                                本站仅在用户主动注册或登录时，保存您提交的账号、密码（已加密）及基本资料，
                                用于身份验证，不会保存任何其他个人信息。</p>
                        <p><strong>2. 我们不存储 / 不收集</strong><br/>
                                本站不收集访客浏览记录、设备指纹、地理位置或行为画像，
                                不嵌入第三方统计、广告或追踪脚本。</p>
                        <p><strong>3. 我们不转交第三方</strong><br/>
                                您的账号密码仅存储于本站自有服务器，不会以任何形式出售、共享、转让给任何第三方，
                                亦不接入任何第三方登录或第三方 SDK。</p>
                        <p><strong>4. 数据安全</strong><br/>
                                密码通过非对称加密（RSA）传输，服务端仅存储加盐哈希，
                                传输全程使用 HTTPS，本站管理員也无法看到您的明文密码。</p>
                        <p><strong>5. 联系方式</strong><br/>
                                如对您的数据有疑问，可通过页面提供的站长联系方式与我们沟通。</p>
                </div>
        </a-modal>
</template>

<script setup>
import {computed, onMounted, ref} from 'vue'
import {LeftOutlined} from '@ant-design/icons-vue'
import LoginForm from '../components/auth/LoginForm.vue'
import RegisterForm from '../components/auth/RegisterForm.vue'
import FindPasswordForm from '../components/auth/FindPasswordForm.vue'
import {publicConfigApi} from '../api/system/publicConfigApi.js'
import {useAppStore} from '../stores/app.js'

const appStore = useAppStore()

const activeTab = ref('login')
const showBackButton = ref(false)

// 弹窗可见性
const showAbout = ref(false)
const showPrivacy = ref(false)

// 站点信息（从 store 获取，store 会优先读 localStorage 缓存）
const siteName = computed(() => appStore.siteInfo?.siteName || '')
const siteDomain = computed(() => appStore.siteInfo?.siteDomain || '')
const recordNumber = computed(() => appStore.siteInfo?.recordNumber || '')
// 当前页面 origin（当后端未配置 siteDomain 时回退使用）
const locationOrigin = typeof window !== 'undefined' ? window.location.origin : ''


// 切换 tab 时关闭验证码弹窗
const handleTabChange = () => {
        // 触发全局事件，通知所有 Captcha 组件关闭弹窗
        window.dispatchEvent(new CustomEvent('close-captcha'))
}
const redirectUrl = ref('')
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
                window.location.href = redirectUrl.value + "?back=true"
        }
}

onMounted(() => {
        checkShowBackButton()
        // 拉取站点信息（App.vue 也会拉，这里再拉一次保证登录页独立可访问时也有数据）
        appStore.fetchSiteInfo()
})
</script>

