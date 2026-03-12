<!--
  - [headerLogout.vue]
  - -------------------------------------------------------------------------------
  - This software is licensed under the MIT License.
  - However, any distribution or modification must retain this copyright notice.
  - See LICENSE for full terms.
  - -------------------------------------------------------------------------------
  - author: "Jiu Liu"
  - author_contact: "QQ: 3209174373, GitHub: https://github.com/DCSCDF"
  - license: "MIT"
  - license_exception: "Mandatory attribution retention"
  - UpdateTime: 2026/2/17 22:27
  -
  -->

<template>

        <a-menu-item key="1" class="text-center" style="padding: 5px 12px;" @click="handleLogout">
                <div class="flex items-center justify-center w-full">
                        <LogoutOutlined class="mr-1"/>
                        <span>退出登陆</span>
                </div>
        </a-menu-item>

</template>

<script setup>
import {useRouter} from 'vue-router';
import {message} from 'ant-design-vue';
import {authApi} from "../../../api/user/auth/authApi.js";
import {publicConfigApi} from "../../../api/system/publicConfigApi.js";
import logger from "../../../utils/logger.js";
import {LogoutOutlined} from '@ant-design/icons-vue';
import {useAuthStore} from '../../../stores/auth.js';

const router = useRouter();
const authStore = useAuthStore();

const handleLogout = async () => {
        try {
                // 获取 redirect_url 配置
                const redirectUrl = await getRedirectUrl();

                // 调用登出 API
                const logoutResponse = await authApi.logout();

                // 处理登出结果
                await processLogoutResult(logoutResponse, redirectUrl);

        } catch (e) {
                logger.error('登出失败:', e);
                message.error("登出失败，可能是内部错误");
                await handleLogoutError();
        }
};

/**
 * 检查是否存在本地 token
 */
const hasLocalToken = () => {
        const localToken = localStorage.getItem('token');
        const sessionToken = sessionStorage.getItem('token');

        return localToken || sessionToken;
};

/**
 * 从配置响应中提取 redirect_url
 */
const extractRedirectUrl = (configResponse) => {
        let redirectUrl = null;
        const configData = configResponse?.data;

        if (configResponse?.success && configData) {
                const redirectConfig = configData.find(item => item?.configKey === 'site.redirect_url');
                const configValue = redirectConfig?.configValue;

                if (redirectConfig && configValue) {
                        redirectUrl = configValue;
                }
        }

        return redirectUrl;
};

/**
 * 获取重定向 URL
 */
const getRedirectUrl = async () => {
        let redirectUrl = null;

        if (hasLocalToken()) {
                try {
                        const configResponse = await publicConfigApi.getConfig({keys: ['site.redirect_url']});
                        redirectUrl = extractRedirectUrl(configResponse);

                        if (redirectUrl) {
                                logger.log('获取到 redirect_url:', redirectUrl);
                        }
                } catch (configError) {
                        logger.error('获取 redirect_url 配置失败:', configError);
                }
        }

        return redirectUrl;
};

/**
 * 处理登出结果
 */
const processLogoutResult = async (logoutResponse, redirectUrl) => {
        if (logoutResponse.success === true) {
                message.success(logoutResponse.data.message);
                authStore.clearToken();
                logger.log('登出成功');
                await redirectToDestination(redirectUrl);
        } else {
                logger.error('登出失败:', logoutResponse.errorMsg);
                authStore.clearToken();
                message.error(logoutResponse.errorMsg || "登出失败");
                await redirectToDestination(redirectUrl);
        }
};


/**
 * 处理登出错误
 */
const handleLogoutError = async () => {
        authStore.clearToken();
        await redirectToDestination(null);
};


/**
 * 跳转到目标页面
 */
const redirectToDestination = async (redirectUrl) => {
        if (redirectUrl) {
                const separator = redirectUrl.includes('?') ? '&' : '?';
                window.location.href = `${redirectUrl}${separator}logout=true`;
        } else {
                await router.push('/login');
        }
};

</script>
