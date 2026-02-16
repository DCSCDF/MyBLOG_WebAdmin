<!--
  - [LoginForm.vue]
  - -------------------------------------------------------------------------------
  - This software is licensed under the MIT License.
  - However, any distribution or modification must retain this copyright notice.
  - See LICENSE for full terms.
  - -------------------------------------------------------------------------------
  - author: "Jiu Liu"
  - author_contact: "QQ: 3209174373, GitHub: https://github.com/DCSCDF"
  - license: "MIT"
  - license_exception: "Mandatory attribution retention"
  - UpdateTime: 2026/2/2 18:17
  -
  -->

<template>
        <div class="pt-2">
                <h3 class="text-2xl font-bold text-gray-800 mb-2">欢迎回来</h3>
                <p class="text-gray-600 mb-8">登陆你的账户继续</p>

                <a-form :model="loginForm" :rules="loginRules" layout="vertical" @finish="handleLogin"
                        @validate="onValidate">
                        <a-form-item label="用户名" name="username" @change="onFieldChange">
                                <a-input v-model:value="loginForm.username" class="rounded-lg" placeholder="输入用户名"
                                         size="large">
                                        <UserOutlined/>
                                </a-input>
                        </a-form-item>

                        <a-form-item label="密码" name="password" @change="onFieldChange">
                                <a-input-password v-model:value="loginForm.password" class="rounded-lg"
                                                  placeholder="输入密码"
                                                  size="large">
                                        <LockOutlined/>
                                </a-input-password>
                        </a-form-item>

                        <Captcha ref="captchaRef" @status-change="handleCaptchaStatusChange"></Captcha>

                        <div class="flex items-center justify-between mb-6">
                                <a-checkbox v-model:checked="loginForm.remember">
                                        记住我
                                </a-checkbox>
                                <a class="text-blue-600 hover:text-blue-700 text-sm" href="#">
                                        忘记密码?
                                </a>
                        </div>

                        <a-button :disabled="!isVerified || !isFormValid" :loading="loginLoading"
                                  class="w-full h-10 rounded-lg text-base font-semibold flex items-center justify-center"
                                  html-type="submit" size="large"
                                  type="primary">

                                登陆
                        </a-button>
                </a-form>
        </div>
</template>

<script setup>
import {nextTick, ref} from 'vue'
import {LockOutlined, UserOutlined} from '@ant-design/icons-vue'
import Captcha from './Captcha.vue'
import logger from "../../utils/logger.js";
import {message} from "ant-design-vue";
import {authApi} from "../../api/user/auth/authApi.js";
import RsaEncryptor from "../../utils/RsaUtils.js";
import {useRouter} from 'vue-router';
import { useAuthStore } from '../../stores/auth.js';

const router = useRouter();
const authStore = useAuthStore();

const loginForm = ref({
        username: '',
        password: '',
        remember: false
})

const loginLoading = ref(false)
const captchaRef = ref(null)
const isVerified = ref(false)
const isFormValid = ref(false)
captchaRef.value = undefined;


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
                const usernameValid = loginForm.value.username &&
                    loginForm.value.username.length >= 3 &&
                    /^(?!\d+$)/.test(loginForm.value.username)

                // 检查密码规则
                const passwordValid = loginForm.value.password &&
                    loginForm.value.password.length >= 6

                if (usernameValid && passwordValid) {
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

const loginRules = {
        username: [
                {required: true, message: '请输入用户名', trigger: 'change'},
                {min: 3, message: '用户名至少3个字符', trigger: 'change'},
                {
                        pattern: /^(?!\d+$)/,
                        message: '用户名不能为纯数字',
                        trigger: 'change'
                }
        ],
        password: [
                {required: true, message: '请输入密码', trigger: 'change'},
                {min: 6, message: '密码至少6个字符', trigger: 'change'}
        ]
}

const handleLogin = async () => {
        loginLoading.value = true

        // 从验证码组件获取验证参数
        let captchaVerification = null
        if (captchaRef.value) {
                captchaVerification = captchaRef.value.getCaptchaVerification()
        }

        logger.log('Captcha 校验码:', captchaVerification)
        logger.log('Login 表单数据:', {
                username: loginForm.value.username,
                password: loginForm.value.password,
                checkRemember: loginForm.value.remember,
                captchaVerification
        })

        const publicKeyResponse = await authApi.publicKey()

        if (publicKeyResponse.code === 200) {

                const password = RsaEncryptor.encrypt(loginForm.value.password, publicKeyResponse.data.publicKey)

                const loginData = {
                        username: loginForm.value.username,
                        captchaVerification: captchaVerification.captchaVerification,
                        tempToken: publicKeyResponse.data.tempToken,
                        password: password,
                };
                logger.log('发送前的对象 ', loginData)

                const loginResponse = await authApi.login(loginData)
                logger.log('Login ', loginResponse)

                if (loginResponse.success === true) {

                        message.info(`登陆成功，欢迎回来 ${loginForm.value.username}`);
                        logger.log('获取的token:' + loginResponse.data.token)

                        // 使用 Pinia store 管理 token 和用户状态
                        authStore.setToken(
                            loginResponse.data.token, 
                            loginForm.value.remember,
                            {
                                username: loginForm.value.username,
                                // 可以添加更多用户信息
                                loginTime: new Date().toISOString()
                            }
                        );

                        logger.log(`${loginForm.value.remember ? '长期' : '会话'}token 设置完成`)
                        router.push('/user')
                } else {
                        message.error(loginResponse.errorMsg);
                        logger.error('Login 失败:', loginResponse.errorMsg)

                        //延时解除加载状态 防止重复点击
                        setTimeout(() => {
                                loginLoading.value = false

                                isVerified.value = false

                                // 重置验证码组件状态
                                if (captchaRef.value) {
                                        captchaRef.value.resetVerifyStatus();
                                }
                        }, 2000)

                }


        } else {
                // 验证码失败处理
                logger.log('Login 验证码失败', publicKeyResponse)
                message.error(publicKeyResponse.errorMsg || '服务器错误');

                //延时解除加载状态 防止重复点击
                setTimeout(() => {
                        loginLoading.value = false

                        isVerified.value = false

                        // 重置验证码组件状态
                        if (captchaRef.value) {
                                captchaRef.value.resetVerifyStatus();
                        }
                }, 2000)
        }
}
</script>

