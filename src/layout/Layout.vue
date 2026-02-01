<template>
        <div class="flex flex-col h-screen">
                <div class="flex flex-1 bg-gradient-to-br from-blue-50/20 to-gray-50/30">
                        <!-- 侧边栏菜单  -->
                        <div class="fixed h-full top-0 left-0 bottom-0 transition-all duration-300 ease-in-out z-10"
                             :class="windowWidth >= 768 ? (collapsed ? 'left-0 translate-x-0 w-20' : 'left-0 translate-x-0 w-50') : 'hidden -translate-x-full fixed left-0'">
                                <Menu :collapsed="collapsed"
                                      :toggleCollapsed="toggleCollapsed"></Menu>
                        </div>

                        <!-- 主内容区域 -->
                        <div
                            :class="[
                                'flex-1 transition-all duration-300 ease-in-out z-0',
                                windowWidth >= 768 ? (collapsed ? 'ml-20' : 'ml-50') : 'ml-0 transform-none'
                            ]"
                        >
                                <Header
                                    :collapsed="collapsed"
                                    @toggle-collapsed="toggleCollapsed"
                                    class="fixed top-0 transition-all duration-300 ease-in-out z-20"
                                    :class="windowWidth >= 768 ? (collapsed ? 'left-20 right-0' : 'left-50 right-0') : 'left-0 right-0 transform-none'"
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

const collapsed = ref(false);
const windowWidth = ref(window.innerWidth);

// 监听窗口大小变化
const handleResize = () => {
        windowWidth.value = window.innerWidth;
};

onMounted(() => {
        window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
        window.removeEventListener('resize', handleResize);
});

const toggleCollapsed = () => {
        collapsed.value = !collapsed.value;
};


</script>

<style scoped></style>