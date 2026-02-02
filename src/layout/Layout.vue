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
        <div class="flex flex-col h-screen bg-[#f4f7fb]  ">
                <div class="flex flex-1 bg-gradient-to-br from-blue-50/20 to-gray-50/30">
                        <!-- 侧边栏菜单  -->
                        <div :class="windowWidth >= 768 ?
                               (collapsed ? 'left-0 translate-x-0 w-20' : 'left-0 translate-x-0 w-50') :
                                (mobileSidebarOpen ? 'left-0 translate-x-0 w-50 z-50' : '-translate-x-full w-50 z-50')"
                             class="fixed h-full top-0 bottom-0 transition-all duration-300 ease-in-out z-10">
                                <div class="relative h-full">
                                        <Menu
                                            :collapsed="windowWidth >= 768 ? collapsed : (!mobileSidebarOpen)"
                                            :toggleCollapsed="toggleCollapsed"></Menu>
                                        <!-- 移动端关闭按钮 -->
                                        <button
                                            v-if="windowWidth < 768 && mobileSidebarOpen"
                                            class="absolute top-4 -right-10 z-50 bg-white rounded-full p-2 shadow-lg w-8 h-8 flex items-center justify-center md:hidden"
                                            @click="toggleMobileSidebar">
                                                <CloseOutlined/>
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
                                    class=" flex flex-col h-[calc(100vh-4rem)] mt-16 overflow-y-auto p-0  md:px-6  px-auto">

                                        <div class="mx-2 space-y-6 my-6">
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
import {CloseOutlined} from '@ant-design/icons-vue';

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