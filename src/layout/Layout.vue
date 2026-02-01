<template>
        <div class="flex flex-col h-screen">
                <div class="flex flex-1 bg-gradient-to-br from-blue-50/20 to-gray-50/30">
                        <!-- 移动端遮罩层 -->
                        <div v-if="isMobile && mobileSidebarVisible"
                             class="fixed inset-0 bg-black/50 z-40 mobile-overlay visible"
                             @click="closeMobileSidebar"
                        ></div>

                        <!-- 侧边栏菜单 - 在移动端使用不同的显示逻辑 -->
                        <div
                            :class="[
                                 'fixed h-full z-40 top-0 left-0 bottom-0 transition-all duration-300 ease-in-out',
                                 isMobile ? (mobileSidebarVisible ? 'mobile-sidebar visible' : 'mobile-sidebar') : ''
                             ]"
                            :style="!isMobile ? {} : {}"
                        >
                                <Menu :collapsed="isMobile ? false : collapsed"
                                      :toggleCollapsed="isMobile ? toggleMobileSidebar : toggleCollapsed"
                                      :class="isMobile ? 'mobile-menu' : ''"></Menu>
                        </div>

                        <!-- 主内容区域 -->
                        <div
                            :class="[
                                'flex-1 transition-all duration-300 ease-in-out',
                                isMobile ? 'ml-0' : (collapsed ? 'ml-20' : 'ml-60')
                            ]"
                        >
                                <Header
                                    :collapsed="isMobile ? mobileSidebarVisible : collapsed"
                                    @toggle-collapsed="isMobile ? toggleMobileSidebar : toggleCollapsed"
                                    class="fixed top-0 z-30 transition-all duration-300 ease-in-out"
                                    :class="isMobile ? (mobileSidebarVisible ? 'left-0 right-0' : 'left-0 right-0') : (collapsed ? 'left-20 right-0' : 'left-60 right-0')"
                                />

                                <!-- 右侧内容区域 -->
                                <main
                                    class=" flex flex-col h-[calc(100vh-4rem)] mt-16 overflow-y-auto p-0 sm:p-2 md:p-6  px-auto">

                                        <div class="mx-4">
                                                <RouterView/>
                                        </div>

                                </main>
                        </div>
                </div>
        </div>
</template>

<script setup>
import {RouterView} from 'vue-router'
import Header from '../components/header/header.vue';
import {onMounted, onUnmounted, ref} from 'vue';
import Menu from "../components/menu/menu.vue";

const collapsed = ref(false);
const mobileSidebarVisible = ref(false); // 控制移动端侧边栏显示
const isMobile = ref(false); // 是否为移动端

// 检测屏幕尺寸变化
const checkMobile = () => {
        isMobile.value = window.innerWidth <= 768;
};

const toggleCollapsed = () => {
        collapsed.value = !collapsed.value;
};

// 移动端侧边栏开关
const toggleMobileSidebar = () => {
        mobileSidebarVisible.value = !mobileSidebarVisible.value;
};

// 关闭移动端侧边栏
const closeMobileSidebar = () => {
        mobileSidebarVisible.value = false;
};

onMounted(() => {
        // 初始化检测
        checkMobile();

        // 监听窗口大小变化
        window.addEventListener('resize', checkMobile);
});

onUnmounted(() => {
        // 清理事件监听器
        window.removeEventListener('resize', checkMobile);
});
</script>

<style scoped></style>