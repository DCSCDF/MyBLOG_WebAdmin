<!--
  - [FindPasswordForm.vue]
  - -------------------------------------------------------------------------------
  - This software is licensed under the MIT License.
  - However, any distribution or modification must retain this copyright notice.
  - See LICENSE for full terms.
  - -------------------------------------------------------------------------------
  - author: "Jiu Liu"
  - author_contact: "QQ: 3209174373, GitHub: https://github.com/DCSCDF"
  - license: "MIT"
  - license_exception: "Mandatory attribution retention"
  - UpdateTime: 2026/4/12
  -
  -->

<template>
        <div class="pt-2">
                <!-- 返回登录链接 -->
                <!--                <div class="mb-4">-->
                <!--                        <a class="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1" href="#"-->
                <!--                           @click.prevent="emit('reset-success')">-->
                <!--                                <LeftOutlined/>-->
                <!--                                返回登录-->
                <!--                        </a>-->
                <!--                </div>-->

                <!-- 阶段1：填写用户信息并发送验证码 -->
                <template v-if="findPasswordStage === 'form'">
                        <h3 class="text-2xl font-bold text-gray-800 mb-2">找回密码</h3>
                        <p class="text-gray-600 mb-8">输入您的用户名或邮箱</p>

                        <a-form :model="findPasswordForm" :rules="findPasswordRules" layout="vertical"
                                @finish="handleSendCode" @validate="onValidate">
                                <a-form-item label="用户名或邮箱" name="usernameOrEmail" @change="onFieldChange">
                                        <a-input v-model:value="findPasswordForm.usernameOrEmail" class="rounded-lg"
                                                 placeholder="输入用户名或邮箱地址"
                                                 size="large">
                                                <template #prefix>
                                                        <UserOutlined/>
                                                </template>
                                        </a-input>
                                </a-form-item>

                                <Captcha ref="captchaRef" @status-change="handleCaptchaStatusChange"></Captcha>

                                <a-button :disabled="!isVerified || !isFormValid" :loading="sendCodeLoading"
                                          class="w-full h-10 !mt-6 rounded-lg text-base font-semibold flex items-center justify-center"
                                          html-type="submit"
                                          size="large"
                                          type="primary">
                                        获取验证码
                                </a-button>
                        </a-form>
                </template>

                <!-- 阶段2：填写验证码和新密码 -->
                <template v-else-if="findPasswordStage === 'verify'">
                        <div class="text-center">
                                <div class="mb-6">
                                        <CheckCircleFilled class="text-5xl text-green-500 mb-3"/>
                                        <h3 class="text-2xl font-bold text-gray-800">验证码已发送</h3>
                                        <p class="text-gray-600 mt-2">
                                                验证码已发送至 <span
                                            class="font-medium text-blue-600">{{ maskedEmail }}</span>
                                        </p>
                                </div>

                                <a-form :model="resetForm" :rules="resetRules" layout="vertical"
                                        @finish="handleConfirmReset" @validate="onValidate">
                                        <a-form-item label="验证码" name="code" @change="onFieldChange">
                                                <a-input v-model:value="resetForm.code" :maxlength="6"
                                                         class="rounded-lg"
                                                         placeholder="输入6位验证码"
                                                         size="large"
                                                         @input="handleCodeInput">
                                                        <template #prefix>
                                                                <SafetyOutlined/>
                                                        </template>
                                                </a-input>
                                        </a-form-item>

                                        <a-form-item label="新密码" name="newPassword" @change="onFieldChange">
                                                <a-input-password v-model:value="resetForm.newPassword"
                                                                  class="rounded-lg"
                                                                  placeholder="设置新密码"
                                                                  size="large">
                                                        <template #prefix>
                                                                <LockOutlined/>
                                                        </template>
                                                </a-input-password>
                                        </a-form-item>

                                        <a-form-item label="确认密码" name="confirmPassword" @change="onFieldChange">
                                                <a-input-password v-model:value="resetForm.confirmPassword"
                                                                  class="rounded-lg"
                                                                  placeholder="确认新密码"
                                                                  size="large">
                                                        <template #prefix>
                                                                <LockOutlined/>
                                                        </template>
                                                </a-input-password>
                                        </a-form-item>

                                        <!--                                        <div class="flex items-center justify-between mb-6">-->
                                        <!--                                                <span class="text-gray-500 text-sm">-->
                                        <!--                                                                {{-->
                                        <!--                                                                        countdown > 0 ? `${countdown}秒后可重新获取` : '未收到验证码？'-->
                                        <!--                                                                }}-->
                                        <!--                                                </span>-->
                                        <!--                                                <a-button :disabled="countdown > 0" class="!p-0" size="small"-->
                                        <!--                                                          type="link"-->
                                        <!--                                                          @click="handleSendCode">-->
                                        <!--                                                                重新获取-->
                                        <!--                                                </a-button>-->
                                        <!--                                        </div>-->

                                        <a-button :disabled="!isFormValid" :loading="resetLoading"
                                                  class="w-full h-10 !mt-6 rounded-lg text-base font-semibold flex items-center justify-center"
                                                  html-type="submit"
                                                  size="large"
                                                  type="primary">
                                                重置密码
                                        </a-button>

                                        <a-button class="mt-3 !text-gray-500" type="link"
                                                  @click="handleBackToForm">
                                                <template #icon>
                                                        <LeftOutlined/>
                                                </template>
                                                返回修改信息
                                        </a-button>
                                </a-form>
                        </div>
                </template>
        </div>
</template>

<script setup>
import {CheckCircleFilled, LeftOutlined, LockOutlined, SafetyOutlined, UserOutlined} from '@ant-design/icons-vue'
import {message} from 'ant-design-vue'
import {nextTick, onUnmounted, ref, watch} from 'vue'
import {authApi} from '../../api/user/auth/authApi.js'
import Captcha from './Captcha.vue'
import logger from '../../utils/logger.js'
import RsaEncryptor from '../../utils/RsaUtils.js'

const emit = defineEmits(['reset-success'])

const findPasswordForm = ref({
        usernameOrEmail: '',
})

const resetForm = ref({
        code: '',
        newPassword: '',
        confirmPassword: ''
})

const sendCodeLoading = ref(false)
const resetLoading = ref(false)
const captchaRef = ref(null)
const isVerified = ref(false)
const isFormValid = ref(false)
captchaRef.value = undefined

const findPasswordStage = ref('form')
const maskedEmail = ref('')
const countdown = ref(0)
const codeExpiresIn = ref(300)
let countdownTimer = null

// 掩码邮箱显示
const maskEmail = (email) => {
        let result
        if (!email) {
                result = ''
        } else {
                const atIndex = email.indexOf('@')
                if (atIndex === -1) {
                        result = email.slice(0, 2) + '***'
                } else {
                        result = email.slice(0, 2) + '***' + email.slice(atIndex)
                }
        }
        return result
}

// 开始倒计时
const startCountdown = (seconds) => {
        if (countdownTimer) clearInterval(countdownTimer)
        countdown.value = seconds
        countdownTimer = setInterval(() => {
                if (countdown.value > 0) {
                        countdown.value--
                } else {
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
        resetForm.value.code = e.target.value.replace(/\D/g, '')
}

// 返回表单填写阶段
const handleBackToForm = async () => {
        findPasswordStage.value = 'form'
        resetForm.value.code = ''
        resetForm.value.newPassword = ''
        resetForm.value.confirmPassword = ''
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

// 发送找回密码验证码
const handleSendCode = async () => {
        const canProceed = sendCodeLoading.value === false && isVerified.value && isFormValid.value
        if (canProceed) {
                sendCodeLoading.value = true

                try {
                        const captchaVerification = captchaRef.value?.getCaptchaVerification() ?? null
                        logger.log('验证码校验码:', captchaVerification)

                        const publicKeyData = await handleGetPublicKey()
                        if (publicKeyData) {
                                const payload = {
                                        usernameOrEmail: findPasswordForm.value.usernameOrEmail.trim(),
                                        tempToken: publicKeyData.tempToken,
                                        captchaVerification: captchaVerification?.captchaVerification
                                }

                                logger.log('发送找回密码验证码请求:', {
                                        usernameOrEmail: payload.usernameOrEmail
                                })

                                const response = await authApi.findPasswordCode(payload)
                                if (response.success) {
                                        maskedEmail.value = response.data?.email || maskEmail(findPasswordForm.value.usernameOrEmail)
                                        codeExpiresIn.value = response.data?.expiresIn || 300
                                        findPasswordStage.value = 'verify'
                                        startCountdown(codeExpiresIn.value)
                                        message.success(response.data?.message || '验证码已发送到您的邮箱，请查收')
                                } else {
                                        message.error(response.errorMsg || '发送验证码失败')
                                        captchaRef.value?.resetVerifyStatus()
                                        isVerified.value = false
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

// 确认重置密码
const handleConfirmReset = async () => {
        const canProceed = resetLoading.value === false
        if (canProceed) {
                resetLoading.value = true

                try {
                        const publicKeyData = await handleGetPublicKey()
                        if (publicKeyData) {
                                const encryptedPassword = RsaEncryptor.encrypt(
                                    resetForm.value.newPassword,
                                    publicKeyData.publicKey
                                )

                                const payload = {
                                        usernameOrEmail: findPasswordForm.value.usernameOrEmail.trim(),
                                        code: resetForm.value.code.trim(),
                                        newPassword: encryptedPassword
                                }

                                logger.log('确认重置密码请求:', {
                                        usernameOrEmail: payload.usernameOrEmail,
                                        code: '******'
                                })

                                const response = await authApi.findPasswordConfirm(payload)
                                if (response.success) {
                                        message.success(response.data?.message || '密码重置成功，请使用新密码登录')
                                        logger.log('密码重置成功')
                                        emit('reset-success')
                                } else {
                                        message.error(response.errorMsg || '重置密码失败')
                                        resetFindPasswordState()
                                }
                        }
                } catch (error) {
                        logger.error('重置密码异常:', error)
                        message.error(error.message || '重置密码失败')
                        resetFindPasswordState()
                } finally {
                        resetLoading.value = false
                }
        }
}

// 监听密码变化
watch(() => resetForm.value.newPassword, () => {
        updateFormValidation()
})

// 监听确认密码变化
watch(() => resetForm.value.confirmPassword, () => {
        updateFormValidation()
})

// 监听验证码输入变化
watch(() => resetForm.value.code, () => {
        validateResetForm()
})

// 更新表单验证状态
const updateFormValidation = async () => {
        await nextTick()
        try {
                isFormValid.value = findPasswordStage.value === 'verify'
                    ? validateResetForm()
                    : await validateFindPasswordForm()
        } catch {
                isFormValid.value = false
        }
}

// 密码验证规则
const passwordRules = [
        {check: (v) => v && v.length >= 6, msg: '密码至少6个字符'},
        {check: (v) => v && v.length <= 20, msg: '密码最多20个字符'},
        {check: (v) => v && /[A-Za-z]/.test(v), msg: '密码必须包含字母'},
        {check: (v) => v && /[0-9]/.test(v), msg: '密码必须包含数字'},
        {check: (v) => v && !/[\s'"<>]/.test(v), msg: '密码不能包含空格、引号等特殊字符'}
]

// 通用验证函数
const validateField = (value, rules) => {
        const failedRule = rules.find(rule => !rule.check(value))
        return failedRule ? failedRule.msg : null
}

// 验证密码格式
const validatePassword = (password) => {
        let result = null
        const err = validateField(password, passwordRules)
        if (err) {
                result = err
        }
        return result
}

// 验证找回密码表单
const validateFindPasswordForm = () => {
        const usernameOrEmailValid = findPasswordForm.value.usernameOrEmail && findPasswordForm.value.usernameOrEmail.trim().length > 0
        return Promise.resolve(usernameOrEmailValid)
}

// 验证重置表单
const validateResetForm = () => {
        const codeValid = resetForm.value.code && resetForm.value.code.length === 6
        const passwordErr = validatePassword(resetForm.value.newPassword)
        const passwordValid = !passwordErr
        const confirmValid = resetForm.value.confirmPassword && resetForm.value.confirmPassword === resetForm.value.newPassword
        return codeValid && passwordValid && confirmValid
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

// 找回密码表单验证规则
const findPasswordRules = {
        usernameOrEmail: [
                {required: true, message: '请输入用户名或邮箱', trigger: 'change'}
        ]
}

// 重置表单验证规则
const resetRules = {
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
        ],
        newPassword: [
                {required: true, message: '请输入新密码', trigger: 'change'},
                {
                        validator: (_, value) => {
                                let result = Promise.resolve()
                                if (value) {
                                        const err = validateField(value, passwordRules)
                                        if (err) {
                                                result = Promise.reject(new Error(err))
                                        }
                                }
                                return result
                        },
                        trigger: 'change'
                }
        ],
        confirmPassword: [
                {required: true, message: '请确认新密码', trigger: 'change'},
                {
                        validator: (_, value) => {
                                let result = Promise.resolve()
                                if (value && value !== resetForm.value.newPassword) {
                                        result = Promise.reject(new Error('两次输入密码不一致'))
                                }
                                return result
                        },
                        trigger: 'change'
                }
        ]
}

// 重置找回密码状态
function resetFindPasswordState() {
        findPasswordStage.value = 'form'
        sendCodeLoading.value = false
        resetLoading.value = false
        isVerified.value = false
        captchaRef.value?.resetVerifyStatus()
        if (countdownTimer) {
                clearInterval(countdownTimer)
                countdownTimer = null
        }
        countdown.value = 0
}
</script>

<style scoped>
</style>
