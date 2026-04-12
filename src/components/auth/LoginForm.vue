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
  - UpdateTime: 2026/2/18 10:19
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
                                <a v-if="useEmailRegister" class="text-blue-600 hover:text-blue-700 text-sm" href="#"
                                   @click.prevent="handleForgotPassword">
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
import {nextTick, onMounted, ref} from 'vue'
import {LockOutlined, UserOutlined} from '@ant-design/icons-vue'
import Captcha from './Captcha.vue'
import logger from "../../utils/logger.js";
import {message} from "ant-design-vue";
import {authApi} from "../../api/user/auth/authApi.js";
import RsaEncryptor from "../../utils/RsaUtils.js";
import {useRouter} from 'vue-router';
import {useAuthStore} from '../../stores/auth.js';
import {publicConfigApi} from "../../api/system/publicConfigApi.js";

const emit = defineEmits(['switch-to-find-password'])

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
const isRedirectUrlValid = ref(false) // redirect_url 是否有效
captchaRef.value = undefined;

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
// 组件挂载时获取配置
onMounted(() => {
        fetchEmailRegisterConfig()
})

// 检查 redirect_url 是否有效
const checkRedirectUrl = async () => {
        try {
                const configResponse = await publicConfigApi.getConfig({keys: ['site.redirect_url']});
                if (configResponse.success && configResponse.data && configResponse.data.length > 0) {
                        const redirectConfig = configResponse.data.find(item => item.configKey === 'site.redirect_url');
                        if (redirectConfig && redirectConfig.configValue) {
                                // 检查是否为有效的 URL
                                const urlPattern = /^https?:\/\/.+/
                                isRedirectUrlValid.value = urlPattern.test(redirectConfig.configValue);
                                logger.log('redirect_url 是否有效:', isRedirectUrlValid.value);
                        }
                }
        } catch (error) {
                console.error('检查 redirect_url 失败:', error);
                isRedirectUrlValid.value = false;
        }
}

// 组件挂载时检查 redirect_url
onMounted(() => {
        checkRedirectUrl()
})


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

// 登录验证规则（不检查保留词，允许管理员登录）
const usernameRules = [
        {check: (v) => v && v.length >= 4 && v.length <= 20, msg: '用户名长度必须为4-20个字符'},
        {check: (v) => v && /^[a-zA-Z]/.test(v), msg: '用户名必须以字母开头'},
        {check: (v) => v && /^[a-zA-Z0-9]+$/.test(v), msg: '用户名只能包含字母和数字'},
        {check: (v) => v && !/^\d+$/.test(v), msg: '用户名不能为纯数字'}
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

// 验证密码
const validatePassword = (password) => !validateField(password, passwordRules)


// 表单验证方法
const validateForm = () => {
        const usernameValid = validateUsername(loginForm.value.username)
        const passwordValid = validatePassword(loginForm.value.password)
        return Promise.resolve(usernameValid && passwordValid)
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
        password: [
                {required: true, message: '请输入密码', trigger: 'change'},
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
        ]
}

const handleLogin = async () => {
        // 防止重复提交
        if (loginLoading.value) return;

        loginLoading.value = true;

        try {
                // 获取验证码验证参数
                let captchaVerification = null
                if (captchaRef.value) {
                        captchaVerification = captchaRef.value.getCaptchaVerification()
                }

                logger.log('Captcha 校验码:', captchaVerification);
                logger.log('Login 表单数据:', {
                        username: loginForm.value.username,
                        password: loginForm.value.password,
                        checkRemember: loginForm.value.remember,
                        captchaVerification
                });

                const publicKeyResponse = await authApi.publicKey();

                // 处理公钥获取失败的情况
                if (!publicKeyResponse) {
                        handleError('验证码获取失败', '服务器无响应，请稍后重试');
                        return;
                }

                if (publicKeyResponse.code !== 200) {
                        handleError('验证码获取失败', publicKeyResponse.errorMsg || '服务器错误');
                        return;
                }

                if (!publicKeyResponse.data || !publicKeyResponse.data.publicKey) {
                        handleError('验证码获取失败', '加密密钥无效，请刷新页面重试');
                        return;
                }

                const password = RsaEncryptor.encrypt(loginForm.value.password, publicKeyResponse.data.publicKey);

                const loginData = {
                        username: loginForm.value.username,
                        captchaVerification: captchaVerification.captchaVerification,
                        tempToken: publicKeyResponse.data.tempToken,
                        password: password,
                        oauthEnabled: isRedirectUrlValid.value
                };

                logger.log('发送前的对象 ', loginData);

                const loginResponse = await authApi.login(loginData);
                logger.log('Login 响应:', loginResponse);

                // 处理登录结果
                if (loginResponse && loginResponse.success === true) {
                        await handleLoginSuccess(loginResponse);
                } else {
                        handleLoginFailure(loginResponse);
                }

                // 登录流程结束后重置loading状态
                loginLoading.value = false;

        } catch (error) {
                // 区分业务错误和网络异常
                if (error instanceof Error) {
                        // 这是由响应拦截器抛出的业务错误
                        handleBusinessError(error);
                } else {
                        // 网络异常或其他系统错误
                        handleNetworkError(error);
                }
        }
};

// 处理错误情况的统一函数
const handleError = (operation, errorMessage) => {
        message.error(errorMessage);
        logger.error(`${operation}:`, errorMessage);
        resetLoginState();
};

// 处理登录成功
const handleLoginSuccess = async (response) => {
        logger.log('登录成功处理开始 ');
        logger.log('response:', response);
        logger.log('response.data:', response.data);
        logger.log('response.data.code:', response.data?.code);
        logger.log('remember 状态:', loginForm.value.remember);

        // 严格检查响应数据是否有效
        if (!response || !response.data) {
                logger.error('登录响应数据无效');
                message.error('登录失败，请重试');
                resetLoginState();
                return;
        }

        message.info(`登陆成功，欢迎回来 ${loginForm.value.username}`);

        // 无论是否有 code，都跳转到 redirect_url
        if (response.data?.code) {
                logger.log('检测到 code，进入外部授权模式');
                await handleOAuthRedirect(response.data.code, response.data.token);
        } else {
                logger.log('未检测到 code，进入正常登录模式');
                await handleNormalLogin(response);
        }
        logger.log('登录成功处理结束');
};

// 处理外部授权模式跳转
const handleOAuthRedirect = async (code, token) => {
        logger.log(' OAuth 跳转 ');
        logger.log('code:', code);
        logger.log('token:', token);
        logger.log('remember:', loginForm.value.remember);

        // 先保存 token，避免后续 API 请求因缺少 token 而返回 401
        if (token) {
                authStore.setToken(
                    token,
                    loginForm.value.remember,
                    {
                            username: loginForm.value.username,
                            loginTime: new Date().toISOString()
                    }
                );
                logger.log('OAuth 模式下 token 已保存');
        }

        try {
                // 查询 site.redirect_url 配置（使用公共接口）
                logger.log('开始查询 site.redirect_url 配置');
                const configResponse = await publicConfigApi.getConfig({keys: ['site.redirect_url']});
                logger.log('configResponse:', configResponse);

                // 严格检查 API 响应是否成功
                if (!configResponse) {
                        logger.error('redirect_url 配置 API 响应为空');
                        message.error('获取配置失败，请重试');
                        resetLoginState();
                        return;
                }

                if (configResponse.success === false) {
                        logger.error('redirect_url 配置 API 返回失败:', configResponse.errorMsg);
                        message.error(configResponse.errorMsg || '获取配置失败，请重试');
                        resetLoginState();
                        return;
                }

                const currentUrl = window.location.origin + window.location.pathname;
                const rememberValue = loginForm.value.remember ? 'true' : 'false';

                if (configResponse.data && configResponse.data.length > 0) {
                        const redirectUrl = configResponse.data.find(item => item.configKey === 'site.redirect_url');
                        logger.log('redirectUrl 配置项:', redirectUrl);

                        if (redirectUrl && redirectUrl.configValue) {
                                // 配置了 redirect_url，跳转到该地址并携带 code、redirect_url 和 remember
                                const targetRedirectUrl = redirectUrl.configValue;
                                const separator = targetRedirectUrl.includes('?') ? '&' : '?';
                                const targetUrl = `${targetRedirectUrl}${separator}code=${code}&redirect_url=${encodeURIComponent(currentUrl)}&remember=${rememberValue}`;

                                logger.log('外部授权模式，跳转到 redirect_url:', targetUrl);
                                window.location.href = targetUrl;
                                return;
                        } else {
                                logger.log('redirectUrl.configValue 为空');
                        }
                } else {
                        logger.log('未获取到 redirect_url 配置数据');
                }

                // 未配置 redirect_url，使用默认的回调地址
                logger.log('未配置 site.redirect_url，使用默认回调地址');
                const separator = currentUrl.includes('?') ? '&' : '?';
                const targetUrl = `${currentUrl}${separator}code=${code}&redirect_url=${encodeURIComponent(currentUrl)}&remember=${rememberValue}`;
                logger.log('默认跳转 URL:', targetUrl);
                window.location.href = targetUrl;
        } catch (error) {
                logger.error('查询 site.redirect_url 配置失败:', error);
                // 查询失败时提示错误
                message.error('授权码获取失败，请重试');
                resetLoginState();
        }
        logger.log(' OAuth 跳转处理结束');
};

// 处理正常登录
const handleNormalLogin = async (response) => {
        // 严格检查响应数据
        if (!response || !response.data) {
                logger.error('登录响应数据无效');
                message.error('登录失败，请重试');
                resetLoginState();
                return;
        }

        logger.log('获取的token:' + response.data.token);

        // 检查 token 是否有效
        if (!response.data.token) {
                logger.error('登录响应中缺少 token');
                message.error('登录失败，请重试');
                resetLoginState();
                return;
        }

        // 使用 Pinia store 管理 token 和用户状态
        authStore.setToken(
            response.data.token,
            loginForm.value.remember,
            {
                    id: response.data.user?.id,
                    username: response.data.user?.username || loginForm.value.username,
                    nickname: response.data.user?.nickname,
                    email: response.data.user?.email,
                    avatarUrl: response.data.user?.avatarUrl,
                    status: response.data.user?.status,
                    createTime: response.data.user?.createTime,
                    updateTime: response.data.user?.updateTime,
                    loginTime: new Date().toISOString()
            }
        );

        logger.log(`${loginForm.value.remember ? '长期' : '会话'}token 设置完成`);

        // 如果有 code，跳转到 redirect_url 并携带 code 和 remember
        if (response.data?.code) {
                logger.log('有 code，进入外部授权模式');
                await handleOAuthRedirect(response.data.code, response.data.token);
                return;
        }

        // 无 code，直接路由跳转到 /user
        logger.log('无 code，直接跳转到 /user');
        router.push('/user');
};

// 处理登录失败
const handleLoginFailure = (response) => {
        let errorMessage = '登录失败';

        // 防御性检查：确保 response 有效
        if (response) {
                // 根据不同情况提供具体错误信息
                if (response.errorMsg) {
                        errorMessage = response.errorMsg;
                } else if (response.code === 400) {
                        errorMessage = '用户名或密码错误';
                } else {
                        errorMessage = '请检查用户名和密码';
                }
        }

        handleError('登录失败', errorMessage);
        logger.error('Login 失败详情:', {
                errorMsg: response?.errorMsg,
                code: response?.code,
                data: response?.data
        });
};

// 处理业务错误（由响应拦截器抛出的Error对象）
const handleBusinessError = (error) => {
        logger.error('Login 业务错误:', error.message);

        // 显示真实的业务错误信息
        handleError('登录失败', error.message);
};

// 处理网络异常
const handleNetworkError = (error) => {
        logger.error('Login 网络异常:', error);

        let errorMessage = '网络连接失败，请检查网络设置';

        if (error.code === 'ECONNABORTED') {
                errorMessage = '请求超时，请稍后再试';
        } else if (error.message && error.message.includes('Network Error')) {
                errorMessage = '网络连接失败，请检查网络设置';
        }

        handleError('网络异常', errorMessage);
};

// 跳转到找回密码页面
const handleForgotPassword = () => {
        emit('switch-to-find-password')
}

// 重置登录状态的函数
const resetLoginState = () => {
        // 立即重置loading状态
        loginLoading.value = false

        // 重置验证码状态
        isVerified.value = false

        // 重置验证码组件状态
        if (captchaRef.value) {
                captchaRef.value.resetVerifyStatus();
        }
}
</script>

