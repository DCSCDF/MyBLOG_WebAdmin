<!--
  - [Layout.vue]
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
        <div class="flex flex-col h-screen overflow-hidden">
                <!-- 遮罩层 -->
                <div
                    v-show="windowWidth < 768"
                    :class="{
                        'opacity-0 pointer-events-none': !mobileSidebarOpen,
                        'opacity-50': mobileSidebarOpen
                    }"
                    class="fixed inset-0 bg-black/30 z-50 transition-all duration-300 ease-in-out"
                    @click="toggleMobileSidebar">
                </div>

                <!-- 侧边栏菜单  -->
                <div :class="windowWidth >= 768 ?
                               (collapsed ? 'left-0 translate-x-0 w-20' : 'left-0 translate-x-0 w-60') :
                                (mobileSidebarOpen ? 'left-0 translate-x-0 w-70 z-60' : '-translate-x-full w-70 z-60')"
                     class="fixed h-full top-0 bottom-0 transition-all duration-300 ease-in-out z-10">
                        <div class="relative h-full">
                                <Menu
                                    :collapsed="windowWidth >= 768 ? collapsed : (!mobileSidebarOpen)"
                                    :toggleCollapsed="toggleCollapsed"></Menu>
                                <!-- 移动端关闭按钮 -->
                                <button
                                    v-if="windowWidth < 768 && mobileSidebarOpen"
                                    class="absolute top-3 right-6 z-50 bg-white rounded-full border border-gray-200 p-3  w-8 h-8 flex items-center justify-center md:hidden"
                                    @click="toggleMobileSidebar">
                                        <CloseOutlined/>
                                </button>
                        </div>
                </div>

                <!-- 主内容区域 -->
                <div
                    :class="[
                        'flex-1 transition-all duration-300 ease-in-out z-0 overflow-hidden',
                        windowWidth >= 768 ? (collapsed ? 'ml-20' : 'ml-60') : 'ml-0'
                    ]"
                >
                        <Header
                            :class="windowWidth >= 768 ? (collapsed ? 'left-20 right-0' : 'left-60 right-0') : 'left-0 right-0'"
                            :collapsed="collapsed"
                            class="fixed top-0 transition-all duration-300 ease-in-out z-20"
                            @toggle-collapsed="toggleCollapsed"
                        />

                        <!-- 右侧内容区域 -->
                        <main class="flex flex-col pt-14 h-full w-full">

                                <div class="flex-1 overflow-y-auto p-0 md:px-6 px-2  pt-6 pb-12">
                                        <breadcrumb></breadcrumb>

                                        <!-- 限制内容宽度防止撑开 -->
                                        <div class="w-full mt-12">
                                                <RouterView/>
                                        </div>

                                </div>

                        </main>
                </div>
        </div>
</template>

<script setup>
import {RouterView} from 'vue-router'
import Header from '../components/Layout/header/header.vue';
import {onMounted, onUnmounted, ref, computed} from 'vue';
import Menu from "../components/Layout/menu/menu.vue";
import {CloseOutlined} from '@ant-design/icons-vue';
import Breadcrumb from "../components/Layout/header/breadcrumb.vue";
import { useAppStore } from '../stores/app.js';

const appStore = useAppStore();

const collapsed = ref(false); // 默认为展开状态，意味着显示图标和文字
const windowWidth = ref(window.innerWidth);

// 使用 app store 的移动端状态
const mobileSidebarOpen = computed({
        get: () => appStore.isMobileSidebarOpen,
        set: (value) => appStore.setMobileSidebarOpen(value)
});

// 监听窗口大小变化
const handleResize = () => {
        windowWidth.value = window.innerWidth;
        // 更新设备状态
        appStore.updateDeviceStatus();
};

onMounted(() => {
        window.addEventListener('resize', handleResize);
        // 初始化时设置窗口宽度和设备状态
        windowWidth.value = window.innerWidth;
        appStore.updateDeviceStatus();
        // 启动窗口大小监听器
        const cleanup = appStore.startResizeListener();
        
        // 组件卸载时清理
        onUnmounted(() => {
                cleanup();
        });
});

onUnmounted(() => {
        window.removeEventListener('resize', handleResize);
});

const toggleCollapsed = () => {
        collapsed.value = !collapsed.value;
};

// 切换移动端侧边栏
const toggleMobileSidebar = () => {
        appStore.toggleMobileSidebar();
};


</script>