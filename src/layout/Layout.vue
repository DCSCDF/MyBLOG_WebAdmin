<template>
        <div class="flex flex-col h-screen bg-[#f4f7fb]  ">
                <div class="flex flex-1 bg-gradient-to-br from-blue-50/20 to-gray-50/30">
                        <!-- 侧边栏菜单  -->
                        <div :class="windowWidth >= 768 ?
                               (collapsed ? 'left-0 translate-x-0 w-20' : 'left-0 translate-x-0 w-50') :
                                (mobileSidebarOpen ? 'left-0 translate-x-0 w-50 z-50' : '-translate-x-full w-50 z-50')"
                             class="fixed h-full top-0 bottom-0 transition-all duration-300 ease-in-out z-10">
                                <div class="relative h-full">
                                        <Menu :collapsed="windowWidth >= 768 ? collapsed : (mobileSidebarOpen ? false : true)"
                                              :toggleCollapsed="toggleCollapsed"></Menu>
                                        <!-- 移动端关闭按钮 -->
                                        <button
                                            v-if="windowWidth < 768 && mobileSidebarOpen"
                                            class="absolute top-4 -right-10 z-50 bg-white rounded-full p-2 shadow-lg w-8 h-8 flex items-center justify-center md:hidden"
                                            @click="toggleMobileSidebar">
                                                <svg class="h-5 w-5" fill="currentColor"
                                                     viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                        <path clip-rule="evenodd"
                                                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                              fill-rule="evenodd"/>
                                                </svg>
                                        </button>
                                </div>
                        </div>

                        <!-- 主内容区域 -->
                        <div
                            :class="[
                                'flex-1 transition-all duration-300 ease-in-out z-0',
windowWidth >= 768 ? (collapsed ? 'ml-20' : 'ml-50') : 'ml-0'
                            ]"
                        >
                                <Header
                                    :class="windowWidth >= 768 ? (collapsed ? 'left-20 right-0' : 'left-50 right-0') : 'left-0 right-0'"
                                    :collapsed="collapsed"
                                    :mobile-sidebar-open="mobileSidebarOpen"
                                    class="fixed top-0 transition-all duration-300 ease-in-out z-20"
                                    @toggle-collapsed="toggleCollapsed"
                                    @toggle-mobile-sidebar="toggleMobileSidebar"
                                />

                                <!-- 右侧内容区域 -->
                                <main
                                    class=" flex flex-col h-[calc(100vh-4rem)] mt-16 overflow-y-auto p-0 sm:px-2 md:px-6  px-auto">

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

const collapsed = ref(false); // 默认为展开状态，意味着显示图标和文字
const mobileSidebarOpen = ref(false); // 控制移动端侧边栏的展开/收起
const windowWidth = ref(window.innerWidth);

// 监听窗口大小变化
const handleResize = () => {
        windowWidth.value = window.innerWidth;
};

onMounted(() => {
        window.addEventListener('resize', handleResize);
        // 初始化时设置窗口宽度
        windowWidth.value = window.innerWidth;
});

onUnmounted(() => {
        window.removeEventListener('resize', handleResize);
});

const toggleCollapsed = () => {
        collapsed.value = !collapsed.value;
};

// 切换移动端侧边栏
const toggleMobileSidebar = () => {
        mobileSidebarOpen.value = !mobileSidebarOpen.value;
};


</script>

<style scoped></style>