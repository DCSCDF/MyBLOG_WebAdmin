<template>
        <div class="flex items-center ">
                <a-button class="!m-0" danger type="text" @click="handleLogout">登出</a-button>
        </div>
</template>

<script setup>
import {useRouter} from 'vue-router';
import {message} from 'ant-design-vue';
import {authApi} from "../../api/user/auth/authApi.js";
import logger from "../../utils/logger.js";

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