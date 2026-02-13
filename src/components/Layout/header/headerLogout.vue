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
  - UpdateTime: 2026/2/2 18:17
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
import logger from "../../../utils/logger.js";
import {LogoutOutlined} from '@ant-design/icons-vue';
import {useAuthStore} from '../../../stores/auth.js';

const router = useRouter();
const authStore = useAuthStore();

const handleLogout = async () => {

        try {

                const logoutResponse = await authApi.logout()

                if (logoutResponse.code === 200) {

                        // 提示用户登出成功
                        message.success(logoutResponse.data.message);

                        // 使用 Pinia store 清除认证状态
                        authStore.clearToken();
                        logger.log('登出成功')

                        await router.push('/login');
                } else {
                        //响应拦截器会马上跳转login
                        logger.error('code不是200')

                        // 即使后端返回错误，也要清除本地状态
                        authStore.clearToken();

                        await router.push('/login');
                        message.error("错误：未登录，跳转到登陆");
                }


        } catch (e) {

                logger.error('登出失败:', e)
                message.error("登出失败,可能是内部错误");

                // 发生错误时也清除本地状态
                authStore.clearToken();

                // 重定向到登录页
                await router.push('/login');
        }

};

</script>
