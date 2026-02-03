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

const router = useRouter();

const handleLogout = async () => {

        try {

                const logoutResponse = await authApi.logout()

                if (logoutResponse.code === 200) {

                        // 提示用户登出成功
                        message.success(logoutResponse.data.message);

                        // 清除本地存储的token
                        localStorage.removeItem('token');
                        sessionStorage.removeItem('token');
                        localStorage.removeItem('remember');
                        localStorage.removeItem('user_profile');
                        logger.log('登出成功')

                        await router.push('/login');
                } else {
                        //响应拦截器会马上跳转login
                        logger.error('code不是200')

                        localStorage.removeItem('token');
                        sessionStorage.removeItem('token');
                        localStorage.removeItem('remember');
                        localStorage.removeItem('user_profile');

                        await router.push('/login');
                        message.error("错误：未登录，跳转到登陆");
                }


        } catch (e) {

                logger.error('登出失败:', e)
                message.error("登出失败,可能是内部错误");

                // 重定向到登录页
                await router.push('/login');
        }

};

</script>

<style scoped>

</style>