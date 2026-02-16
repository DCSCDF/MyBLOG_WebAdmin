<!--
  - [header.vue]
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
        <header
            class="  !backdrop-blur-lg  h-14 flex justify-between items-center border-b border-gray-200 px-4 fixed top-0 left-0 right-0 z-50">
                <div class="flex items-center">
                        <button
                            class="flex items-center  justify-center text-black bg-transparent border-0 shadow-none outline-0 p-2 hover:bg-transparent focus:outline-none focus:ring-0"
                            style="cursor: pointer;"
                            @click="handleMenuToggle">
                                <MenuUnfoldOutlined v-if="showExpandIcon" class="!leading-none !m-0"
                                                    style="width: 2em; height: 2em; display: flex; align-items: center; justify-content: center; color: black;"/>
                                <MenuFoldOutlined v-else class="!leading-none !m-0"
                                                  style="width: 2em; height: 2em; display: flex; align-items: center; justify-content: center; color: black;"/>
                        </button>
                </div>

                <div class="flex items-center gap-3 mx-0 md:mx-8">
                        <a-dropdown>
                                <div
                                    class="flex rounded-lg transition-colors py-1.5 px-2 hover:bg-gray-200/50"
                                >
                                        <div class="flex-shrink-0">
                                                <a-avatar :size="28" :src="profile.avatarUrl">
                                                        {{ (profile.nickname || '昵称').charAt(0) }}
                                                </a-avatar>
                                        </div>
                                        <div class="flex flex-col min-w-0 ml-2 justify-end pb-px">
                                                <div class="text-sm !m-0 font-medium text-gray-600 truncate">
                                                        {{ profile.nickname || '昵称' }}
                                                </div>
                                        </div>
                                </div>
                                <template #overlay>
                                        <a-menu>
                                                <header-logout/>
                                        </a-menu>
                                </template>
                        </a-dropdown>
                </div>
        </header>
</template>

<script setup>
import {computed, defineEmits, defineProps, onMounted} from "vue";
import {authApi} from "../../../api/user/auth/authApi.js";
import logger from "../../../utils/logger.js";
import HeaderLogout from "./headerLogout.vue";
import {MenuFoldOutlined, MenuUnfoldOutlined,} from '@ant-design/icons-vue';
import {useAuthStore} from '../../../stores/auth.js';
import {useAppStore} from '../../../stores/app.js';

const props = defineProps({
        collapsed: {
                type: Boolean,
                default: false
        }
});

const authStore = useAuthStore();
const appStore = useAppStore();

// 从 store 获取用户资料，如果没有则使用默认值
const profile = computed(() => {
        const storeProfile = authStore.getUserProfile();
        return {
                nickname: storeProfile?.nickname || "",
                email: storeProfile?.email || "",
                avatarUrl: storeProfile?.avatarUrl || ""
        };
});

const emit = defineEmits(['toggle-collapsed']);

// 使用 app store 的状态
const isMobile = computed(() => appStore.isMobile);

// 判断是否显示展开图标
const showExpandIcon = computed(() => {
        // 在移动端时，如果侧边栏已打开则显示收起图标，否则显示展开图标
        // 在桌面端时，使用原来的 collapsed 状态
        return isMobile.value ? !appStore.isMobileSidebarOpen : props.collapsed;
});

const handleMenuToggle = () => {
        // 如果在移动端，则触发移动端侧边栏切换
        if (isMobile.value) {
                appStore.toggleMobileSidebar();
        } else {
                // 桌面端则使用原来的切换逻辑
                emit('toggle-collapsed');
        }
};

onMounted(async () => {

        try {
                const response = await authApi.profile();
                logger.log("用户信息", response);

                // 更新 store 中的用户资料
                authStore.updateUserProfile({
                        nickname: response.data.nickname,
                        email: response.data.email,
                        avatarUrl: response.data.avatarUrl
                });

                logger.log("用户信息已更新到 store");
        } catch (error) {
                logger.error("获取用户信息失败", error);
        }

        // 初始化设备状态
        appStore.updateDeviceStatus();
})

// Header组件不再单独监听窗口大小变化，由menu组件统一管理
// 设备状态通过appStore统一管理


</script>