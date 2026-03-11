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
import {configApi} from "../../../api/system/configApi.js";
import logger from "../../../utils/logger.js";
import {LogoutOutlined} from '@ant-design/icons-vue';
import {useAuthStore} from '../../../stores/auth.js';

const router = useRouter();
const authStore = useAuthStore();

const handleLogout = async () => {

        try {

                // 检查是否需要跳转到外部 redirect_url
                let redirectUrl = null;
                const hasLocalToken = !!localStorage.getItem('token');

                // 如果 token 在本地存储中，查询 redirect_url 配置
                if (hasLocalToken) {
                        try {
                                const configResponse = await configApi.systemList({keys: ['site.redirect_url']});
                                if (configResponse.success && configResponse.data) {
                                        const redirectConfig = configResponse.data.find(item => item.configKey === 'site.redirect_url');
                                        if (redirectConfig && redirectConfig.configValue) {
                                                redirectUrl = redirectConfig.configValue;
                                                logger.log('获取到 redirect_url:', redirectUrl);
                                        }
                                }
                        } catch (configError) {
                                logger.error('获取 redirect_url 配置失败:', configError);
                        }
                }

                const logoutResponse = await authApi.logout()

                if (logoutResponse.success === true) {

                        // 提示用户登出成功
                        message.success(logoutResponse.data.message);

                        // 使用 Pinia store 清除认证状态
                        authStore.clearToken();
                        logger.log('登出成功')

                        // 如果有 redirect_url 且 token 在本地存储中，跳转到 redirect_url
                        if (redirectUrl) {
                                const separator = redirectUrl.includes('?') ? '&' : '?';
                                window.location.href = `${redirectUrl}${separator}logout=true`;
                        } else {
                                await router.push('/login');
                        }
                } else {
                        //响应拦截器会马上跳转login
                        logger.error('登出失败:', logoutResponse.errorMsg)

                        // 即使后端返回错误，也要清除本地状态
                        authStore.clearToken();

                        // 如果有 redirect_url 且 token 在本地存储中，跳转到 redirect_url
                        if (redirectUrl) {
                                const separator = redirectUrl.includes('?') ? '&' : '?';
                                window.location.href = `${redirectUrl}${separator}logout=true`;
                        } else {
                                await router.push('/login');
                        }
                        message.error(logoutResponse.errorMsg || "登出失败");
                }


        } catch (e) {

                logger.error('登出失败:', e)
                message.error("登出失败,可能是内部错误");

                // 发生错误时也清除本地状态
                authStore.clearToken();

                // 如果有 redirect_url 且 token 在本地存储中，跳转到 redirect_url
                if (redirectUrl) {
                        const separator = redirectUrl.includes('?') ? '&' : '?';
                        window.location.href = `${redirectUrl}${separator}logout=true`;
                } else {
                        // 重定向到登录页
                        await router.push('/login');
                }
        }

};

</script>
