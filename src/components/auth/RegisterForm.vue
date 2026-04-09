<!--
  - [RegisterForm.vue]
  - -------------------------------------------------------------------------------
  - This software is licensed under the MIT License.
  - However, any distribution or modification must retain this copyright notice.
  - See LICENSE for full terms.
  - -------------------------------------------------------------------------------
  - author: "Jiu Liu"
  - author_contact: "QQ: 3209174373, GitHub: https://github.com/DCSCDF"
  - license: "MIT"
  - license_exception: "Mandatory attribution retention"
  - UpdateTime: 2026/4/7 10:18
  -
  -->

<template>
        <div class="pt-6">
                <!-- 直接注册模式 -->
                <template v-if="!useEmailRegister">
                        <h3 class="text-2xl font-bold text-gray-800 mb-2">创建账户</h3>
                        <p class="text-gray-600 mb-8">加入我们</p>

                        <a-form :model="registerForm" :rules="registerRules" layout="vertical" @finish="handleRegister"
                                @validate="onValidate">
                                <a-form-item label="用户名" name="username" @change="onFieldChange">
                                        <a-input v-model:value="registerForm.username" class="rounded-lg"
                                                 placeholder="输入用户名"
                                                 size="large">
                                                <template #prefix>
                                                        <UserOutlined/>
                                                </template>
                                        </a-input>
                                </a-form-item>

                                <a-form-item label="邮箱" name="email" @change="onFieldChange">
                                        <a-input v-model:value="registerForm.email" class="rounded-lg"
                                                 placeholder="输入邮箱地址"
                                                 size="large"
                                                 type="email">
                                                <template #prefix>
                                                        <MailOutlined/>
                                                </template>
                                        </a-input>
                                </a-form-item>

                                <a-form-item label="密码" name="password" @change="onFieldChange">
                                        <a-input-password v-model:value="registerForm.password" class="rounded-lg"
                                                          placeholder="设置密码"
                                                          size="large">

                                                <LockOutlined/>

                                        </a-input-password>
                                </a-form-item>

                                <a-form-item label="确认密码" name="confirmPassword" @change="onFieldChange">
                                        <a-input-password v-model:value="registerForm.confirmPassword" class="rounded-lg"
                                                          placeholder="确认密码"
                                                          size="large">

                                                <LockOutlined/>

                                        </a-input-password>
                                </a-form-item>
                                <Captcha ref="captchaRef" @status-change="handleCaptchaStatusChange"></Captcha>
                                <a-form-item name="agreement" valuePropName="checked">
                                        <a-checkbox v-model:checked="registerForm.agreement" @change="onFieldChange">
                    <span class="text-sm text-gray-700">
                        我同意
                        <a class="text-blue-600 hover:text-blue-700" href="#">
                            服务条款
                        </a>
                        和
                        <a class="text-blue-600 hover:text-blue-700" href="#">
                            隐私政策
                        </a>
                    </span>
                                        </a-checkbox>
                                </a-form-item>

                                <a-button :disabled="!isVerified || !isFormValid" :loading="registerLoading"
                                          class="w-full h-10 rounded-lg text-base font-semibold flex items-center justify-center"
                                          html-type="submit"
                                          size="large"
                                          type="primary">
                                        创建账户
                                </a-button>
                        </a-form>
                </template>

                <!-- 邮箱验证注册模式 -->
                <template v-else>
                        <!-- 阶段1：填写用户信息 -->
                        <template v-if="registerStage === 'form'">
                                <h3 class="text-2xl font-bold text-gray-800 mb-2">创建账户</h3>
                                <p class="text-gray-600 mb-8">加入我们</p>

                                <a-form :model="registerForm" :rules="emailRegisterRules" layout="vertical"
                                        @finish="handleSendCode" @validate="onValidate">
                                        <a-form-item label="用户名" name="username" @change="onFieldChange">
                                                <a-input v-model:value="registerForm.username" class="rounded-lg"
                                                         placeholder="输入用户名，4-20个字符"
                                                         size="large">
                                                        <template #prefix>
                                                                <UserOutlined/>
                                                        </template>
                                                </a-input>
                                        </a-form-item>

                                        <a-form-item label="邮箱" name="email" @change="onFieldChange">
                                                <a-input v-model:value="registerForm.email" class="rounded-lg"
                                                         placeholder="输入邮箱地址"
                                                         size="large"
                                                         type="email">
                                                        <template #prefix>
                                                                <MailOutlined/>
                                                        </template>
                                                </a-input>
                                        </a-form-item>

                                        <a-form-item label="密码" name="password" @change="onFieldChange">
                                                <a-input-password v-model:value="registerForm.password" class="rounded-lg"
                                                                  placeholder="设置密码"
                                                                  size="large">

                                                        <LockOutlined/>

                                                </a-input-password>
                                        </a-form-item>

                                        <a-form-item label="确认密码" name="confirmPassword" @change="onFieldChange">
                                                <a-input-password v-model:value="registerForm.confirmPassword" class="rounded-lg"
                                                                  placeholder="确认密码"
                                                                  size="large">

                                                        <LockOutlined/>

                                                </a-input-password>
                                        </a-form-item>

                                        <Captcha ref="captchaRef" @status-change="handleCaptchaStatusChange"></Captcha>

                                        <a-form-item name="agreement" valuePropName="checked">
                                                <a-checkbox v-model:checked="registerForm.agreement" @change="onFieldChange">
                    <span class="text-sm text-gray-700">
                        我同意
                        <a class="text-blue-600 hover:text-blue-700" href="#">
                            服务条款
                        </a>
                        和
                        <a class="text-blue-600 hover:text-blue-700" href="#">
                            隐私政策
                        </a>
                    </span>
                                                </a-checkbox>
                                        </a-form-item>

                                        <a-button :disabled="!isVerified || !isFormValid" :loading="sendCodeLoading"
                                                  class="w-full h-10 rounded-lg text-base font-semibold flex items-center justify-center"
                                                  html-type="submit"
                                                  size="large"
                                                  type="primary">
                                                获取邮箱验证码
                                        </a-button>
                                </a-form>
                        </template>

                        <!-- 阶段2：填写验证码 -->
                        <template v-else-if="registerStage === 'verify'">
                                <div class="text-center">
                                        <div class="mb-6">
                                                <CheckCircleFilled class="text-5xl text-green-500 mb-3"/>
                                                <h3 class="text-2xl font-bold text-gray-800">验证码已发送</h3>
                                                <p class="text-gray-600 mt-2">
                                                        验证码已发送至 <span class="font-medium text-blue-600">{{ maskedEmail }}</span>
                                                </p>
                                                <p class="text-gray-500 text-sm mt-1">
                                                        有效期 {{ codeExpiresIn }} 秒
                                                </p>
                                        </div>

                                        <a-form :model="verifyForm" :rules="verifyRules" layout="vertical"
                                                @finish="handleConfirmRegister" @validate="onValidate">
                                                <a-form-item label="邮箱验证码" name="code" @change="onFieldChange">
                                                        <a-input v-model:value="verifyForm.code" class="rounded-lg"
                                                                 placeholder="输入6位验证码"
                                                                 size="large"
                                                                 :maxlength="6"
                                                                 @input="handleCodeInput">
                                                                <template #prefix>
                                                                        <SafetyOutlined/>
                                                                </template>
                                                        </a-input>
                                                </a-form-item>

                                                <div class="flex items-center justify-between mb-6">
                                                        <span class="text-gray-500 text-sm">
                                                                {{ countdown > 0 ? `${countdown}秒后可重新获取` : '未收到验证码？' }}
                                                        </span>
                                                        <a-button type="link" size="small" class="!p-0"
                                                                  :disabled="countdown > 0"
                                                                  @click="handleSendCode">
                                                                重新获取
                                                        </a-button>
                                                </div>

                                                <a-button :disabled="!isFormValid" :loading="registerLoading"
                                                          class="w-full h-10 rounded-lg text-base font-semibold flex items-center justify-center"
                                                          html-type="submit"
                                                          size="large"
                                                          type="primary">
                                                        确认注册
                                                </a-button>

                                                <a-button type="link" class="mt-3 !text-gray-500"
                                                          @click="handleBackToForm">
                                                        返回修改信息
                                                </a-button>
                                        </a-form>
                                </div>
                        </template>
                </template>
        </div>
</template>

<script setup>
import {CheckCircleFilled, SafetyOutlined} from '@ant-design/icons-vue'
import {nextTick, onMounted, onUnmounted, ref, watch} from 'vue'
import {LockOutlined, MailOutlined, UserOutlined} from '@ant-design/icons-vue'
import Captcha from './Captcha.vue'
import {message} from 'ant-design-vue'
import logger from '../../utils/logger.js'
import {authApi} from '../../api/user/auth/authApi.js'
import {publicConfigApi} from '../../api/system/publicConfigApi.js'
import RsaEncryptor from '../../utils/RsaUtils.js'

const emit = defineEmits(['register-success'])

const registerForm = ref({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        agreement: false
})

const verifyForm = ref({
        code: ''
})

const registerLoading = ref(false)
const sendCodeLoading = ref(false)
const captchaRef = ref(null)
const isVerified = ref(false)
const isFormValid = ref(false)
captchaRef.value = undefined

// 配置相关状态
const useEmailRegister = ref(false)
const registerStage = ref('form') // form-填写信息 | verify-填写验证码
const maskedEmail = ref('')
const countdown = ref(0)
const codeExpiresIn = ref(300)
let countdownTimer = null

// 获取邮箱验证注册配置
const fetchEmailRegisterConfig = async () => {
        try {
                const response = await publicConfigApi.getConfig({keys: ['reg.use-email']})
                if (response.success && response.data && response.data.length > 0) {
                        const config = response.data.find(item => item.configKey === 'reg.use-email')
                        useEmailRegister.value = config?.configValue === 'true'
                        logger.log('邮箱验证注册模式:', useEmailRegister.value)
                }
        } catch (error) {
                logger.error('获取注册配置失败:', error)
                useEmailRegister.value = false
        }
}

// 掩码邮箱显示
const maskEmail = (email) => {
        if (!email) return ''
        const [localPart, domain] = email.split('@')
        if (!domain) return email
        const masked = localPart.slice(0, 2) + '***'
        return masked + '@' + domain
}

// 开始倒计时
const startCountdown = (seconds) => {
        if (countdownTimer) {
                clearInterval(countdownTimer)
        }
        countdown.value = seconds
        countdownTimer = setInterval(() => {
                countdown.value--
                if (countdown.value <= 0) {
                        clearInterval(countdownTimer)
                        countdownTimer = null
                }
        }, 1000)
}

// 组件卸载时清理定时器
onUnmounted(() => {
        if (countdownTimer) {
                clearInterval(countdownTimer)
        }
})

// 验证码输入处理（只允许数字）
const handleCodeInput = (e) => {
        verifyForm.value.code = e.target.value.replace(/\D/g, '')
}

// 返回表单填写阶段
const handleBackToForm = () => {
        registerStage.value = 'form'
        verifyForm.value.code = ''
        isFormValid.value = false
        if (countdownTimer) {
                clearInterval(countdownTimer)
                countdownTimer = null
        }
}

// 发送注册验证码
const handleSendCode = async () => {
        if (sendCodeLoading.value || !isVerified.value || !isFormValid.value) return

        sendCodeLoading.value = true

        try {
                const captchaVerification = captchaRef.value?.getCaptchaVerification() ?? null
                logger.log('验证码校验码:', captchaVerification)

                const publicKeyRes = await authApi.publicKey()

                if (publicKeyRes.code !== 200) {
                        message.error(publicKeyRes.errorMsg || '获取加密参数失败')
                        sendCodeLoading.value = false
                        return
                }

                const encryptedPassword = RsaEncryptor.encrypt(
                        registerForm.value.password,
                        publicKeyRes.data.publicKey
                )

                const payload = {
                        username: registerForm.value.username.trim(),
                        email: registerForm.value.email.trim(),
                        password: encryptedPassword,
                        tempToken: publicKeyRes.data.tempToken,
                        captchaVerification: captchaVerification?.captchaVerification
                }

                logger.log('发送注册验证码请求:', {
                        username: payload.username,
                        email: payload.email
                })

                const response = await authApi.registerCode(payload)

                if (response.success) {
                        maskedEmail.value = maskEmail(registerForm.value.email)
                        codeExpiresIn.value = response.data.expiresIn || 300
                        registerStage.value = 'verify'
                        startCountdown(codeExpiresIn.value)
                        message.success(response.data.message || '验证码已发送到您的邮箱')
                } else {
                        message.error(response.errorMsg || '发送验证码失败')
                        captchaRef.value?.resetVerifyStatus()
                        isVerified.value = false
                }
        } catch (error) {
                logger.error('发送验证码异常:', error)
                message.error(error.message || '发送验证码失败')
                captchaRef.value?.resetVerifyStatus()
                isVerified.value = false
        } finally {
                sendCodeLoading.value = false
        }
}

// 确认注册
const handleConfirmRegister = async () => {
        if (registerLoading.value) return

        registerLoading.value = true

        try {
                const payload = {
                        email: registerForm.value.email.trim(),
                        code: verifyForm.value.code.trim()
                }

                logger.log('确认注册请求:', {email: payload.email, code: '******'})

                const response = await authApi.registerConfirm(payload)

                if (response.success) {
                        message.success(response.data.message || '注册成功，请登录')
                        logger.log('注册成功 userId:', response.data.userId)
                        emit('register-success')
                } else {
                        message.error(response.errorMsg || '注册失败')
                        resetRegisterState()
                }
        } catch (error) {
                logger.error('确认注册异常:', error)
                message.error(error.message || '注册失败')
                resetRegisterState()
        } finally {
                registerLoading.value = false
        }
}

// 监听密码变化
watch(() => registerForm.value.password, () => {
        updateFormValidation()
})

// 监听确认密码变化
watch(() => registerForm.value.confirmPassword, () => {
        updateFormValidation()
})

// 监听验证码输入变化
watch(() => verifyForm.value.code, () => {
        validateVerifyForm()
})

// 更新表单验证状态
const updateFormValidation = async () => {
        await nextTick()
        try {
                isFormValid.value = useEmailRegister.value && registerStage.value === 'verify'
                        ? validateVerifyForm()
                        : await validateForm()
        } catch {
                isFormValid.value = false
        }
}

// 验证表单
const validateForm = () => {
        return new Promise((resolve) => {
                const usernameValid = registerForm.value.username &&
                        registerForm.value.username.length >= 4 &&
                        registerForm.value.username.length <= 20 &&
                        /^(?!\d+$)/.test(registerForm.value.username)

                const emailValid = registerForm.value.email &&
                        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerForm.value.email)

                const passwordValid = registerForm.value.password &&
                        registerForm.value.password.length >= 6

                const confirmPasswordValid = registerForm.value.confirmPassword &&
                        registerForm.value.confirmPassword === registerForm.value.password

                const agreementValid = registerForm.value.agreement

                if (usernameValid && emailValid && passwordValid && confirmPasswordValid && agreementValid) {
                        resolve(true)
                } else {
                        resolve(false)
                }
        })
}

// 验证验证码表单
const validateVerifyForm = () => {
        const codeValid = verifyForm.value.code && verifyForm.value.code.length === 6
        return codeValid
}

// 验证码状态变化处理
const handleCaptchaStatusChange = (status) => {
        isVerified.value = status
}

// 字段变化处理
const onFieldChange = async () => {
        await updateFormValidation()
}

// 表单验证回调
const onValidate = async () => {
        await updateFormValidation()
}

// 直接注册表单验证规则
const registerRules = {
        username: [
                {required: true, message: '请输入用户名', trigger: 'change'},
                {min: 4, max: 20, message: '用户名长度4-20个字符', trigger: 'change'},
                {
                        pattern: /^(?!\d+$)/,
                        message: '用户名不能为纯数字',
                        trigger: 'change'
                }
        ],
        email: [
                {required: true, message: '请输入邮箱', trigger: 'change'},
                {type: 'email', message: '请输入有效的邮箱地址', trigger: 'change'}
        ],
        password: [
                {required: true, message: '请输入密码', trigger: 'change'},
                {min: 6, message: '密码至少6个字符', trigger: 'change'}
        ],
        confirmPassword: [
                {required: true, message: '请确认密码', trigger: 'change'},
                {
                        validator: (_, value) => {
                                let error = null

                                if (!value) {
                                        error = new Error('请确认密码')
                                } else if (value !== registerForm.value.password) {
                                        error = new Error('两次输入密码不一致')
                                }

                                return error ? Promise.reject(error) : Promise.resolve()
                        },
                        trigger: 'change'
                }
        ],
        agreement: [
                {
                        validator: (_, value) => {
                                return value ? Promise.resolve() : Promise.reject(new Error('请同意服务条款'))
                        },
                        trigger: 'change'
                }
        ]
}

// 邮箱验证注册表单验证规则
const emailRegisterRules = {
        username: [
                {required: true, message: '请输入用户名', trigger: 'change'},
                {min: 4, max: 20, message: '用户名长度4-20个字符', trigger: 'change'},
                {
                        pattern: /^(?!\d+$)/,
                        message: '用户名不能为纯数字',
                        trigger: 'change'
                }
        ],
        email: [
                {required: true, message: '请输入邮箱', trigger: 'change'},
                {type: 'email', message: '请输入有效的邮箱地址', trigger: 'change'}
        ],
        password: [
                {required: true, message: '请输入密码', trigger: 'change'},
                {min: 6, message: '密码至少6个字符', trigger: 'change'}
        ],
        confirmPassword: [
                {required: true, message: '请确认密码', trigger: 'change'},
                {
                        validator: (_, value) => {
                                let error = null

                                if (!value) {
                                        error = new Error('请确认密码')
                                } else if (value !== registerForm.value.password) {
                                        error = new Error('两次输入密码不一致')
                                }

                                return error ? Promise.reject(error) : Promise.resolve()
                        },
                        trigger: 'change'
                }
        ],
        agreement: [
                {
                        validator: (_, value) => {
                                return value ? Promise.resolve() : Promise.reject(new Error('请同意服务条款'))
                        },
                        trigger: 'change'
                }
        ]
}

// 验证码确认表单验证规则
const verifyRules = {
        code: [
                {required: true, message: '请输入验证码', trigger: 'change'},
                {
                        validator: (_, value) => {
                                if (!value) {
                                        return Promise.reject(new Error('请输入验证码'))
                                }
                                if (value.length !== 6) {
                                        return Promise.reject(new Error('验证码为6位数字'))
                                }
                                return Promise.resolve()
                        },
                        trigger: 'change'
                }
        ]
}

// 获取验证码验证参数
function getRegisterCaptchaVerification() {
        return captchaRef.value ? captchaRef.value.getCaptchaVerification() ?? null : null
}

// 重置注册状态
function resetRegisterState() {
        registerLoading.value = false
        isVerified.value = false
        captchaRef.value?.resetVerifyStatus()
}

// 构建注册请求体
function buildRegisterPayload(publicKey, tempToken, captchaVerification) {
        const encryptedPassword = RsaEncryptor.encrypt(
                registerForm.value.password,
                publicKey
        )
        return {
                username: registerForm.value.username.trim(),
                email: registerForm.value.email.trim(),
                password: encryptedPassword,
                tempToken,
                captchaVerification: captchaVerification.captchaVerification
        }
}

// 获取错误信息
function getRegisterErrorMessage(res, err) {
        let errorMessage = '注册失败，请稍后再试'

        if (res && res.errorMsg) {
                errorMessage = res.errorMsg
        } else if (err && err.message) {
                errorMessage = err.message
        }

        return errorMessage
}

// 直接注册流程（不使用邮箱验证）
async function handleRegister() {
        if (registerLoading.value) return

        registerLoading.value = true

        try {
                const captchaVerification = getRegisterCaptchaVerification()

                if (!captchaVerification) {
                        message.error('请先完成验证码')
                        registerLoading.value = false
                        return
                }

                logger.log('注册请求参数（已脱敏）:', {
                        username: registerForm.value.username,
                        email: registerForm.value.email
                })

                const publicKeyRes = await authApi.publicKey()

                if (publicKeyRes.code !== 200) {
                        message.error(publicKeyRes.errorMsg || '获取加密参数失败')
                        resetRegisterState()
                        return
                }

                const payload = buildRegisterPayload(
                        publicKeyRes.data.publicKey,
                        publicKeyRes.data.tempToken,
                        captchaVerification
                )

                const response = await authApi.register(payload)

                if (response.success) {
                        message.success(response.data.message || '注册成功，请登录')
                        logger.log('注册成功 userId:', response.data.userId)
                        emit('register-success')
                } else {
                        message.error(response.errorMsg || '注册失败')
                        resetRegisterState()
                }
        } catch (error) {
                logger.error('注册异常:', error)
                message.error(error.message || '注册失败，请稍后再试')
                resetRegisterState()
        } finally {
                registerLoading.value = false
        }
}

// 组件挂载时获取配置
onMounted(() => {
        fetchEmailRegisterConfig()
})
</script>

<style scoped>
</style>