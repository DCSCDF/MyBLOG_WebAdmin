<!--
  - [Login.vue]
  - -------------------------------------------------------------------------------
  - This software is licensed under the MIT License.
  - However, any distribution or modification must retain this copyright notice.
  - See LICENSE for full terms.
  - -------------------------------------------------------------------------------
  - author: "Jiu Liu"
  - author_contact: "QQ: 3209174373, GitHub: https://github.com/DCSCDF"
  - license: "MIT"
  - license_exception: "Mandatory attribution retention"
  - UpdateTime: 2026/2/18 06:59
  -
  -->

<template>
        <!-- 动态背景  -->
        <div class="fixed inset-0 -z-50
                bg-size-[200%_200%] animate-gradient
                bg-linear-to-tr from-blue-400/40 via-white/70 to-blue-400/70
                dark:bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))]
                dark:from-gray-800 dark:via-gray-600 dark:to-gray-800">
        </div>
        <div class="min-h-screen flex items-center justify-center from-blue-50 to-indigo-100 lg:p-4 p-2">
                <div class="w-full max-w-md">
                        <a-card class="!overflow-hidden shadow-xl !bg-white/80 !backdrop-blur-md">
                                <!-- 标签页切换 -->
                                <a-tabs v-model:activeKey="activeTab" class="form-tabs md:!px-5 !pb-5">
                                        <!-- 登陆标签页 -->
                                        <a-tab-pane key="login" tab="登陆">
                                                <LoginForm/>
                                        </a-tab-pane>
                                        <!-- 注册标签页 -->
                                        <a-tab-pane key="register" tab="注册">
                                                <RegisterForm @register-success="activeTab = 'login'"/>
                                        </a-tab-pane>
                                </a-tabs>
                        </a-card>
                </div>
        </div>
</template>

<script setup>
import {ref} from 'vue'
import LoginForm from '../components/auth/LoginForm.vue'
import RegisterForm from '../components/auth/RegisterForm.vue'

const activeTab = ref('login')
</script>

