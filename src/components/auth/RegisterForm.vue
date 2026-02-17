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
  - UpdateTime: 2026/2/2 18:23
  -
  -->

<template>
        <div class="pt-6">
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
        </div>
</template>

<script setup>
import { nextTick, ref, watch } from 'vue'
import { LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons-vue'
import Captcha from './Captcha.vue'
import { message } from 'ant-design-vue'
import logger from '../../utils/logger.js'
import { authApi } from '../../api/user/auth/authApi.js'
import RsaEncryptor from '../../utils/RsaUtils.js'

const emit = defineEmits(['register-success'])

const registerForm = ref({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        agreement: false
})

const registerLoading = ref(false)
const captchaRef = ref(null)
const isVerified = ref(false)
const isFormValid = ref(false)
captchaRef.value = undefined


// 监听密码变化，更新确认密码验证状态
watch(() => registerForm.value.password, () => {
        updateFormValidation();
});

// 监听确认密码变化，更新表单验证状态
watch(() => registerForm.value.confirmPassword, () => {
        updateFormValidation();
});

// 更新表单验证状态的方法
const updateFormValidation = async () => {
        await nextTick()

        // 检查表单是否有效
        try {
                isFormValid.value = await validateForm()
        } catch {
                isFormValid.value = false
        }
}

// 表单验证方法
const validateForm = () => {
        return new Promise((resolve) => {
                // 检查用户名规则
                const usernameValid = registerForm.value.username &&
                    registerForm.value.username.length >= 3 &&
                    /^(?!\d+$)/.test(registerForm.value.username)

                // 检查邮箱规则
                const emailValid = registerForm.value.email &&
                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerForm.value.email)

                // 检查密码规则
                const passwordValid = registerForm.value.password &&
                    registerForm.value.password.length >= 6

                // 检查确认密码规则
                const confirmPasswordValid = registerForm.value.confirmPassword &&
                    registerForm.value.confirmPassword === registerForm.value.password

                // 检查协议同意规则
                const agreementValid = registerForm.value.agreement

                if (usernameValid && emailValid && passwordValid && confirmPasswordValid && agreementValid) {
                        resolve(true)
                } else {
                        resolve(false)
                }
        })
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

const registerRules = {
        username: [
                {required: true, message: '请输入用户名', trigger: 'change'},
                {min: 3, max: 20, message: '用户名长度3-20个字符', trigger: 'change'},
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
                                let error = null;

                                if (!value) {
                                        error = new Error('请确认密码');
                                } else if (value !== registerForm.value.password) {
                                        error = new Error('两次输入密码不一致');
                                }

                                return error ? Promise.reject(error) : Promise.resolve();
                        },
                        trigger: 'change'
                }
        ],
        agreement: [
                {
                        validator: (_, value) => {
                                return value ? Promise.resolve() : Promise.reject(new Error('请同意服务条款'));
                        },
                        trigger: 'change'
                }
        ]
}

/**
 * 从验证码组件获取二次验证参数（供提交注册时使用）
 * @returns {Object|null} 验证参数，包含 captchaVerification；未验证时为 null
 */
function getRegisterCaptchaVerification() {
        if (!captchaRef.value) return null
        return captchaRef.value.getCaptchaVerification() ?? null
}

/**
 * 重置注册相关状态：loading、验证码状态及验证码组件
 */
function resetRegisterState() {
        registerLoading.value = false
        isVerified.value = false
        if (captchaRef.value) {
                captchaRef.value.resetVerifyStatus()
        }
}

/**
 * 使用公钥加密密码并组装注册请求体（与登录逻辑一致）
 * @param {string} publicKey - 公钥 Base64
 * @param {string} tempToken - 临时凭证
 * @param {Object} captchaVerification - 验证码组件返回的验证信息
 * @returns {Object} 符合 /api/auth/register 的请求体
 */
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

/**
 * 从接口错误中提取用户可读的错误信息
 * @param {Object} res - 接口响应体（success: false）
 * @param {Error} err - 请求异常对象（可选）
 * @returns {string}
 */
function getRegisterErrorMessage(res, err) {
        if (res && res.errorMsg) return res.errorMsg
        if (err && err.message) return err.message
        return '注册失败，请稍后再试'
}

/**
 * 执行注册流程：获取公钥 → 加密密码 → 提交注册；失败时统一重置状态并提示
 */
async function handleRegister() {
        if (registerLoading.value) return

        registerLoading.value = true
        const verification = getRegisterCaptchaVerification()
        if (!verification) {
                message.error('请先完成验证码')
                resetRegisterState()
                return
        }

        let publicKeyRes
        try {
                publicKeyRes = await authApi.publicKey()
        } catch (err) {
                logger.error('注册-获取公钥失败:', err)
                message.error(getRegisterErrorMessage(null, err))
                resetRegisterState()
                return
        }

        if (publicKeyRes.code !== 200 || !publicKeyRes.data) {
                message.error(publicKeyRes.errorMsg || '获取公钥失败')
                resetRegisterState()
                return
        }

        const payload = buildRegisterPayload(
                publicKeyRes.data.publicKey,
                publicKeyRes.data.tempToken,
                verification
        )
        logger.log('注册请求参数（已脱敏）:', {
                username: payload.username,
                email: payload.email,
                tempToken: payload.tempToken ? '***' : ''
        })

        let registerRes
        try {
                registerRes = await authApi.register(payload)
        } catch (err) {
                logger.error('注册请求失败:', err)
                const msg = err.response?.data?.errorMsg || err.message || '注册失败，请稍后再试'
                message.error(msg)
                resetRegisterState()
                return
        }

        if (registerRes.success && registerRes.data) {
                message.success(registerRes.data.message || '注册成功，请登录')
                logger.log('注册成功 userId:', registerRes.data.userId)
                registerLoading.value = false
                emit('register-success')
                return
        }

        message.error(getRegisterErrorMessage(registerRes))
        resetRegisterState()
}
</script>

<style scoped>
</style>