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
        <div class="flex flex-col h-screen">
                <div class="flex flex-1 bg-gradient-to-br from-blue-50/20 to-gray-50/30">
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
                                            class="absolute top-3 right-6 z-50 bg-white rounded-full border border-gray-200 p-2  w-8 h-8 flex items-center justify-center md:hidden"
                                            @click="toggleMobileSidebar">
                                                <CloseOutlined/>
                                        </button>
                                </div>
                        </div>

                        <!-- 主内容区域 -->
                        <div
                            :class="[
                                'flex-1 transition-all duration-300 ease-in-out z-0 max-w-full',
                                windowWidth >= 768 ? (collapsed ? 'ml-20' : 'ml-60') : 'ml-0',
                                windowWidth >= 768 ? (collapsed ? 'collapsed' : 'expanded') : 'mobile'
                            ]"
                        >
                                <Header
                                    :class="windowWidth >= 768 ? (collapsed ? 'left-20 right-0' : 'left-60 right-0') : 'left-0 right-0'"
                                    :collapsed="collapsed"
                                    :mobile-sidebar-open="mobileSidebarOpen"
                                    class="fixed top-0 transition-all duration-300 ease-in-out z-20"
                                    @toggle-collapsed="toggleCollapsed"
                                    @toggle-mobile-sidebar="toggleMobileSidebar"
                                />

                                <!-- 右侧内容区域 -->
                                <main class="flex flex-col mt-16 p-0 md:px-6 px-2 max-w-full overflow-x-hidden">

                                        <div class="space-y-6 my-6 w-full max-w-full overflow-x-hidden">
                                                <breadcrumb></breadcrumb>

                                                <!-- 限制内容宽度防止撑开 -->
                                                <div class="max-w-full overflow-x-auto w-full">
                                                        <RouterView/>
                                                </div>

                                        </div>

                                </main>
                        </div>
                </div>
        </div>
</template>

<script setup>
import {RouterView} from 'vue-router'
import Header from '../components/Layout/header/header.vue';
import {onMounted, onUnmounted, ref} from 'vue';
import Menu from "../components/Layout/menu/menu.vue";
import {CloseOutlined} from '@ant-design/icons-vue';
import Breadcrumb from "../components/Layout/header/breadcrumb.vue";


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

<style scoped>
/* 使用Tailwind类无法完全覆盖的特殊情况 */
@media (min-width: 768px) {
    .expanded main {
        max-width: calc(100vw - 15rem) !important;
    }
    
    .collapsed main {
        max-width: calc(100vw - 5rem) !important;
    }
}

/* 确保移动端全宽显示 */
@media (max-width: 767px) {
    main {
        max-width: 100vw !important;
    }
}
</style>