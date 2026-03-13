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
import {useAuthStore} from '../../stores/auth.js';
import {publicConfigApi} from "../../api/system/publicConfigApi.js";

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
        // 防止重复提交
        if (loginLoading.value) return;

        loginLoading.value = true;

        try {
                // 获取验证码验证参数
                const captchaVerification = captchaRef.value ?
                    captchaRef.value.getCaptchaVerification() : null;

                logger.log('Captcha 校验码:', captchaVerification);
                logger.log('Login 表单数据:', {
                        username: loginForm.value.username,
                        password: loginForm.value.password,
                        checkRemember: loginForm.value.remember,
                        captchaVerification
                });

                const publicKeyResponse = await authApi.publicKey();

                // 处理公钥获取失败的情况
                if (publicKeyResponse.code !== 200) {
                        handleError('验证码获取失败', publicKeyResponse.errorMsg || '服务器错误');
                        return;
                }

                const password = RsaEncryptor.encrypt(loginForm.value.password, publicKeyResponse.data.publicKey);

                const loginData = {
                        username: loginForm.value.username,
                        captchaVerification: captchaVerification.captchaVerification,
                        tempToken: publicKeyResponse.data.tempToken,
                        password: password,
                        oauthEnabled: loginForm.value.remember
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
        logger.log('========== 登录成功处理开始 ==========');
        logger.log('response:', response);
        logger.log('response.data:', response.data);
        logger.log('response.data.code:', response.data?.code);
        logger.log('remember 状态:', loginForm.value.remember);

        message.info(`登陆成功，欢迎回来 ${loginForm.value.username}`);

        // 判断是否是外部授权模式（返回了 code）
        if (response.data?.code) {
                logger.log('检测到 code，进入外部授权模式');
                // 外部授权模式，使用 code 跳转，传入 token 避免 401
                await handleOAuthRedirect(response.data.code, response.data.token);
        } else {
                logger.log('未检测到 code，进入正常登录模式');
                // 正常模式，直接保存 token 并跳转到仪表盘
                await handleNormalLogin(response);
        }
        logger.log('========== 登录成功处理结束 ==========');
};

// 处理外部授权模式跳转
const handleOAuthRedirect = async (code, token) => {
        logger.log('========== 开始处理 OAuth 跳转 ==========');
        logger.log('code:', code);
        logger.log('token:', token);

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

                if (configResponse.success && configResponse.data && configResponse.data.length > 0) {
                        const redirectUrl = configResponse.data.find(item => item.configKey === 'site.redirect_url');
                        logger.log('redirectUrl 配置项:', redirectUrl);

                        if (redirectUrl && redirectUrl.configValue) {
                                // 配置了 redirect_url，跳转到该地址并携带 code、token 和 redirect_url
                                const targetRedirectUrl = redirectUrl.configValue;
                                const separator = targetRedirectUrl.includes('?') ? '&' : '?';
                                const currentUrl = window.location.origin + window.location.pathname;
                                const targetUrl = `${targetRedirectUrl}${separator}code=${code}&token=${encodeURIComponent(token)}&redirect_url=${encodeURIComponent(currentUrl)}`;

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
                const defaultRedirectUrl = window.location.origin + window.location.pathname;
                const separator = defaultRedirectUrl.includes('?') ? '&' : '?';
                const targetUrl = `${defaultRedirectUrl}${separator}code=${code}&redirect_url=${encodeURIComponent(defaultRedirectUrl)}`;
                logger.log('默认跳转 URL:', targetUrl);
                window.location.href = targetUrl;
        } catch (error) {
                logger.error('查询 site.redirect_url 配置失败:', error);
                // 查询失败时提示错误
                message.error('授权码获取失败，请重试');
                resetLoginState();
        }
        logger.log('========== OAuth 跳转处理结束 ==========');
};

// 处理正常登录
const handleNormalLogin = async (response) => {
        logger.log('获取的token:' + response.data.token);

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

        // 如果是记住我登录，检查是否配置了 redirect_url
        if (loginForm.value.remember) {
                try {
                        const configResponse = await publicConfigApi.getConfig({keys: ['site.redirect_url']});
                        logger.log('记住我登录查询 redirect_url:', configResponse);

                        if (configResponse.success && configResponse.data && configResponse.data.length > 0) {
                                const redirectConfig = configResponse.data.find(item => item.configKey === 'site.redirect_url');
                                if (redirectConfig && redirectConfig.configValue) {
                                        logger.log('记住我登录，跳转到 redirect_url:', redirectConfig.configValue);
                                        window.location.href = redirectConfig.configValue;
                                        return;
                                }
                        }
                } catch (error) {
                        logger.error('查询 redirect_url 失败:', error);
                }
        }

        // 正常跳转到仪表盘
        logger.log('正常登录，跳转到仪表盘');
        router.push('/user');
};

// 处理登录失败
const handleLoginFailure = (response) => {
        let errorMessage = '登录失败';

        // 根据不同情况提供具体错误信息
        if (response.errorMsg) {
                errorMessage = response.errorMsg;
        } else if (response.code === 400) {
                errorMessage = '用户名或密码错误';
        } else {
                errorMessage = '请检查用户名和密码';
        }

        handleError('登录失败', errorMessage);
        logger.error('Login 失败详情:', {
                errorMsg: response.errorMsg,
                code: response.code,
                data: response.data
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

