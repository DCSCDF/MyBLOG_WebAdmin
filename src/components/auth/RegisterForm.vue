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
                                        <a-input-password v-model:value="registerForm.confirmPassword"
                                                          class="rounded-lg"
                                                          placeholder="确认密码"
                                                          size="large">

                                                <LockOutlined/>

                                        </a-input-password>
                                </a-form-item>
                                <Captcha ref="captchaRef" @status-change="handleCaptchaStatusChange"></Captcha>
                                <!--                                <a-form-item name="agreement" valuePropName="checked">-->
                                <!--                                        <a-checkbox v-model:checked="registerForm.agreement" @change="onFieldChange">-->
                                <!--                    <span class="text-sm text-gray-700">-->
                                <!--                        我同意-->
                                <!--                        <a class="text-blue-600 hover:text-blue-700" href="#">-->
                                <!--                            服务条款-->
                                <!--                        </a>-->
                                <!--                        和-->
                                <!--                        <a class="text-blue-600 hover:text-blue-700" href="#">-->
                                <!--                            隐私政策-->
                                <!--                        </a>-->
                                <!--                    </span>-->
                                <!--                                        </a-checkbox>-->
                                <!--                                </a-form-item>-->

                                <a-button :disabled="!isVerified || !isFormValid" :loading="registerLoading"
                                          class="w-full h-10 !mt-6 rounded-lg text-base font-semibold flex items-center justify-center"
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
                                                <a-input-password v-model:value="registerForm.password"
                                                                  class="rounded-lg"
                                                                  placeholder="设置密码"
                                                                  size="large">

                                                        <LockOutlined/>

                                                </a-input-password>
                                        </a-form-item>

                                        <a-form-item label="确认密码" name="confirmPassword" @change="onFieldChange">
                                                <a-input-password v-model:value="registerForm.confirmPassword"
                                                                  class="rounded-lg"
                                                                  placeholder="确认密码"
                                                                  size="large">

                                                        <LockOutlined/>

                                                </a-input-password>
                                        </a-form-item>

                                        <Captcha ref="captchaRef" @status-change="handleCaptchaStatusChange"></Captcha>

                                        <!--                                        <a-form-item name="agreement" valuePropName="checked">-->
                                        <!--                                                <a-checkbox v-model:checked="registerForm.agreement"-->
                                        <!--                                                            @change="onFieldChange">-->
                                        <!--                    <span class="text-sm text-gray-700">-->
                                        <!--                        我同意服务条款-->

                                        <!--                    </span>-->
                                        <!--                                                </a-checkbox>-->
                                        <!--                                        </a-form-item>-->

                                        <a-button :disabled="!isVerified || !isFormValid" :loading="sendCodeLoading"
                                                  class="w-full h-10 !mt-6 rounded-lg text-base font-semibold flex items-center justify-center"
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
                                                        验证码已发送至 <span
                                                    class="font-medium text-blue-600">{{ maskedEmail }}</span>
                                                </p>
                                                <!--                                                <p class="text-gray-500 text-sm mt-1">-->
                                                <!--                                                        有效期 {{ codeExpiresIn }} 秒-->
                                                <!--                                                </p>-->
                                        </div>

                                        <a-form :model="verifyForm" :rules="verifyRules" layout="vertical"
                                                @finish="handleConfirmRegister" @validate="onValidate">
                                                <a-form-item label="邮箱验证码" name="code" @change="onFieldChange">
                                                        <a-input v-model:value="verifyForm.code" :maxlength="6"
                                                                 class="rounded-lg"
                                                                 placeholder="输入6位验证码"
                                                                 size="large"
                                                                 @input="handleCodeInput">
                                                                <template #prefix>
                                                                        <SafetyOutlined/>
                                                                </template>
                                                        </a-input>
                                                </a-form-item>

                                                <!--                                                <div class="flex items-center justify-between mb-6">-->
                                                <!--                                                        <span class="text-gray-500 text-sm">-->
                                                <!--                                                                {{-->
                                                <!--                                                                        countdown > 0 ? `${countdown}秒后可重新获取` : '未收到验证码？'-->
                                                <!--                                                                }}-->
                                                <!--                                                        </span>-->
                                                <!--                                                        <a-button :disabled="countdown > 0" class="!p-0" size="small"-->
                                                <!--                                                                  type="link"-->
                                                <!--                                                                  @click="handleSendCode">-->
                                                <!--                                                                重新获取-->
                                                <!--                                                        </a-button>-->
                                                <!--                                                </div>-->

                                                <a-button :disabled="!isFormValid" :loading="registerLoading"
                                                          class="w-full h-10 !mt-6 rounded-lg text-base font-semibold flex items-center justify-center"
                                                          html-type="submit"
                                                          size="large"
                                                          type="primary">
                                                        确认注册
                                                </a-button>

                                                <a-button class="!mt-2 !text-gray-500" type="link"
                                                          @click="handleBackToForm">
                                                        <!--                                                        <template #icon>-->
                                                        <!--                                                                <LeftOutlined/>-->
                                                        <!--                                                        </template>-->
                                                        返回修改信息
                                                </a-button>
                                        </a-form>
                                </div>
                        </template>
                </template>
        </div>
</template>

<script setup>
import {CheckCircleFilled, LockOutlined, MailOutlined, SafetyOutlined, UserOutlined} from '@ant-design/icons-vue'
import {nextTick, onMounted, onUnmounted, ref, watch} from 'vue'
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
        agreement: true
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

const registerStage = ref('form') // form-填写信息 | verify-填写验证码
const maskedEmail = ref('')
const countdown = ref(0)
const codeExpiresIn = ref(300)
let countdownTimer = null

// 获取邮箱验证注册配置
const useEmailRegister = ref(false)
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
        let result
        if (!email) {
                result = ''
        } else {
                const parts = email.split('@')
                if (parts.length !== 2 || !parts[1]) {
                        result = email
                } else {
                        result = parts[0].slice(0, 2) + '***@' + parts[1]
                }
        }
        return result
}

// 开始倒计时
const startCountdown = (seconds) => {
        if (countdownTimer) clearInterval(countdownTimer)
        countdown.value = seconds
        countdownTimer = setInterval(() => {
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
const handleBackToForm = async () => {
        registerStage.value = 'form'
        verifyForm.value.code = ''
        if (countdownTimer) {
                clearInterval(countdownTimer)
                countdownTimer = null
        }
        isVerified.value = false
        captchaRef.value?.resetVerifyStatus()
        await nextTick()
        await updateFormValidation()
}

// 处理公钥获取
const handleGetPublicKey = async () => {
        const publicKeyRes = await authApi.publicKey()
        let result = null
        if (publicKeyRes.code === 200) {
                result = publicKeyRes.data
        } else {
                message.error(publicKeyRes.errorMsg || '获取加密参数失败')
                captchaRef.value?.resetVerifyStatus()
                isVerified.value = false
        }
        return result
}

// 处理发送验证码请求
const handleSendCodeRequest = async (payload) => {
        const response = await authApi.registerCode(payload)
        let result = null
        if (response.success) {
                result = response.data
        } else {
                message.error(response.errorMsg || '发送验证码失败')
                captchaRef.value?.resetVerifyStatus()
                isVerified.value = false
        }
        return result
}

// 发送注册验证码
const handleSendCode = async () => {
        // 检查前置条件
        const canProceed = sendCodeLoading.value === false && isVerified.value && isFormValid.value
        if (canProceed) {
                sendCodeLoading.value = true

                try {
                        const captchaVerification = captchaRef.value?.getCaptchaVerification() ?? null
                        logger.log('验证码校验码:', captchaVerification)

                        // 获取公钥
                        const publicKeyData = await handleGetPublicKey()
                        if (publicKeyData) {
                                // 构建请求载荷
                                const encryptedPassword = RsaEncryptor.encrypt(
                                    registerForm.value.password,
                                    publicKeyData.publicKey
                                )

                                const payload = {
                                        username: registerForm.value.username.trim(),
                                        email: registerForm.value.email.trim(),
                                        password: encryptedPassword,
                                        tempToken: publicKeyData.tempToken,
                                        captchaVerification: captchaVerification?.captchaVerification
                                }

                                logger.log('发送注册验证码请求:', {
                                        username: payload.username,
                                        email: payload.email
                                })

                                // 发送验证码
                                const responseData = await handleSendCodeRequest(payload)
                                if (responseData) {
                                        maskedEmail.value = maskEmail(registerForm.value.email)
                                        codeExpiresIn.value = responseData.expiresIn || 300
                                        registerStage.value = 'verify'
                                        startCountdown(codeExpiresIn.value)
                                        message.success(responseData.message || '验证码已发送到您的邮箱')
                                }
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
}

// 确认注册
const handleConfirmRegister = async () => {
        const canProceed = registerLoading.value === false
        if (canProceed) {
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

// 保留词列表
const RESERVED_WORDS = ['admin', 'root', 'system', 'test', 'administrator', 'user', 'guest', 'super', 'master', 'owner']

// 通用验证规则
const usernameRules = [
        {check: (v) => v && v.length >= 4 && v.length <= 20, msg: '用户名长度必须为4-20个字符'},
        {check: (v) => v && /^[a-zA-Z]/.test(v), msg: '用户名必须以字母开头'},
        {check: (v) => v && /^[a-zA-Z0-9]+$/.test(v), msg: '用户名只能包含字母和数字'},
        {check: (v) => v && !/^\d+$/.test(v), msg: '用户名不能为纯数字'},
        {check: (v) => v && !RESERVED_WORDS.includes(v.toLowerCase()), msg: '该用户名不可使用'}
]

const passwordRules = [
        {check: (v) => v && v.length >= 6, msg: '密码至少6个字符'},
        {check: (v) => v && v.length <= 32, msg: '密码最多32个字符'},
        {check: (v) => v && /[A-Z]/.test(v), msg: '密码必须包含大写字母'},
        {check: (v) => v && /[a-z]/.test(v), msg: '密码必须包含小写字母'},
        {check: (v) => v && /[0-9]/.test(v), msg: '密码必须包含数字'}
]

// 通用验证函数：返回第一个错误信息或 null - 使用 find 简化
const validateField = (value, rules) => {
        const failedRule = rules.find(rule => !rule.check(value))
        return failedRule ? failedRule.msg : null
}

// 验证用户名
const validateUsername = (username) => !validateField(username, usernameRules)

// 验证密码（带用户名检查）
const validatePasswordWithUsername = (password, username) => {
        let result = null
        const err = validateField(password, passwordRules)
        if (err) {
                result = err
        } else if (username && password.toLowerCase().includes(username.toLowerCase())) {
                result = '密码不能包含用户名'
        }
        return result
}

// 验证表单
const validateForm = () => {
        const usernameValid = validateUsername(registerForm.value.username)
        const emailValid = registerForm.value.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerForm.value.email)
        const passwordValid = !validatePasswordWithUsername(registerForm.value.password, registerForm.value.username)
        const confirmPasswordValid = registerForm.value.confirmPassword && registerForm.value.confirmPassword === registerForm.value.password
        const agreementValid = registerForm.value.agreement
        return Promise.resolve(usernameValid && emailValid && passwordValid && confirmPasswordValid && agreementValid)
}

// 验证验证码表单
const validateVerifyForm = () => {
        return verifyForm.value.code && verifyForm.value.code.length === 6
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
                {
                        validator: (_, value) => {
                                let result = Promise.resolve()
                                if (value) {
                                        const err = validateField(value, usernameRules)
                                        if (err) {
                                                result = Promise.reject(new Error(err))
                                        }
                                }
                                return result
                        },
                        trigger: 'change'
                }
        ],
        email: [
                {required: true, message: '请输入邮箱', trigger: 'change'},
                {type: 'email', message: '请输入有效的邮箱地址', trigger: 'change'}
        ],
        password: [
                {required: true, message: '请输入密码', trigger: 'change'},
                {
                        validator: (_, value) => {
                                let result = Promise.resolve()
                                if (value) {
                                        const err = validateField(value, passwordRules)
                                        if (err) {
                                                result = Promise.reject(new Error(err))
                                        } else if (registerForm.value.username && value.toLowerCase().includes(registerForm.value.username.toLowerCase())) {
                                                result = Promise.reject(new Error('密码不能包含用户名'))
                                        }
                                }
                                return result
                        },
                        trigger: 'change'
                }
        ],
        confirmPassword: [
                {required: true, message: '请确认密码', trigger: 'change'},
                {
                        validator: (_, value) => {
                                let result = Promise.resolve()
                                if (value) {
                                        const err = value !== registerForm.value.password ? new Error('两次输入密码不一致') : null
                                        if (err) {
                                                result = Promise.reject(err)
                                        }
                                }
                                return result
                        },
                        trigger: 'change'
                }
        ],
        agreement: [
                {
                        validator: (_, value) => {
                                let result = Promise.resolve()
                                if (!value) {
                                        result = Promise.reject(new Error('请同意服务条款'))
                                }
                                return result
                        },
                        trigger: 'change'
                }
        ]
}

// 邮箱验证注册表单验证规则
const emailRegisterRules = {
        username: [
                {required: true, message: '请输入用户名', trigger: 'change'},
                {
                        validator: (_, value) => {
                                let result = Promise.resolve()
                                if (value) {
                                        const err = validateField(value, usernameRules)
                                        if (err) {
                                                result = Promise.reject(new Error(err))
                                        }
                                }
                                return result
                        },
                        trigger: 'change'
                }
        ],
        email: [
                {required: true, message: '请输入邮箱', trigger: 'change'},
                {type: 'email', message: '请输入有效的邮箱地址', trigger: 'change'}
        ],
        password: [
                {required: true, message: '请输入密码', trigger: 'change'},
                {
                        validator: (_, value) => {
                                let result = Promise.resolve()
                                if (value) {
                                        const err = validateField(value, passwordRules)
                                        if (err) {
                                                result = Promise.reject(new Error(err))
                                        } else if (registerForm.value.username && value.toLowerCase().includes(registerForm.value.username.toLowerCase())) {
                                                result = Promise.reject(new Error('密码不能包含用户名'))
                                        }
                                }
                                return result
                        },
                        trigger: 'change'
                }
        ],
        confirmPassword: [
                {required: true, message: '请确认密码', trigger: 'change'},
                {
                        validator: (_, value) => {
                                let result = Promise.resolve()
                                if (value) {
                                        const err = value !== registerForm.value.password ? new Error('两次输入密码不一致') : null
                                        if (err) {
                                                result = Promise.reject(err)
                                        }
                                }
                                return result
                        },
                        trigger: 'change'
                }
        ],
        agreement: [
                {
                        validator: (_, value) => {
                                let result = Promise.resolve()
                                if (!value) {
                                        result = Promise.reject(new Error('请同意服务条款'))
                                }
                                return result
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
                                let result = Promise.resolve()
                                if (value && value.length !== 6) {
                                        result = Promise.reject(new Error('验证码为6位数字'))
                                }
                                return result
                        },
                        trigger: 'change'
                }
        ]
}

// 获取验证码验证参数
function getRegisterCaptchaVerification() {
        let result = null
        if (captchaRef.value) {
                const verification = captchaRef.value.getCaptchaVerification()
                if (verification) {
                        result = verification
                }
        }
        return result
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

// // 获取错误信息
// function getRegisterErrorMessage(res, err) {
//         let errorMessage = '注册失败，请稍后再试'
//
//         if (res && res.errorMsg) {
//                 errorMessage = res.errorMsg
//         } else if (err && err.message) {
//                 errorMessage = err.message
//         }
//
//         return errorMessage
// }

// 直接注册流程（不使用邮箱验证）
async function handleRegister() {
        const canProceed = registerLoading.value === false
        if (canProceed) {
                registerLoading.value = true

                try {
                        const captchaVerification = getRegisterCaptchaVerification()
                        if (captchaVerification) {
                                logger.log('注册请求参数（已脱敏）:', {
                                        username: registerForm.value.username,
                                        email: registerForm.value.email
                                })

                                const publicKeyRes = await authApi.publicKey()
                                if (publicKeyRes.code === 200) {
                                        const payload = buildRegisterPayload(publicKeyRes.data.publicKey, publicKeyRes.data.tempToken, captchaVerification)
                                        const response = await authApi.register(payload)
                                        if (response.success) {
                                                message.success(response.data.message || '注册成功，请登录')
                                                logger.log('注册成功 userId:', response.data.userId)
                                                emit('register-success')
                                        } else {
                                                message.error(response.errorMsg || '注册失败')
                                                resetRegisterState()
                                        }
                                } else {
                                        message.error(publicKeyRes.errorMsg || '获取加密参数失败')
                                        resetRegisterState()
                                }
                        } else {
                                message.error('请先完成验证码')
                        }
                } catch (error) {
                        logger.error('注册异常:', error)
                        message.error(error.message || '注册失败，请稍后再试')
                        resetRegisterState()
                } finally {
                        registerLoading.value = false
                }
        }
}

// 组件挂载时获取配置
onMounted(() => {
        fetchEmailRegisterConfig()
})
</script>

<style scoped>
</style>