<template>
    <div class="flex flex-col min-h-screen bg-gray-30">
        <header class="bg-white px-6 pt-1 h-16 flex justify-between items-center border-b border-gray-100 shadow-sm">
            <div class="flex items-center ">
                <h1 class="text-xl font-semibold text-gray-800 dark:text-white">欢迎回来,username!</h1>

            </div>
            <div class="flex items-center ">
                123
            </div>
        </header>

        <div class="flex flex-1 overflow-hidden bg-linear-to-br from-blue-50/20 to-gray-50/30">
            <!-- 左侧菜单容器 -->
            <div class="relative shadow-xl flex flex-col transition-all duration-300 ease-in-out backdrop-blur-sm border-r border-blue-100/30"
                :class="state.collapsed ? 'w-20' : 'w-60'">

                <div class="relative flex items-center justify-between  border-b border-blue-100/30" :class="[
                    state.collapsed
                        ? 'px-1 py-1'
                        : 'px-3 py-3'
                ]">
                    <!-- Logo -->
                    <div v-if="!state.collapsed" class="flex items-center space-x-2">
                        <div
                            class="w-8 h-8 bg-linear-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md shadow-blue-500/20">
                            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z">
                                </path>
                            </svg>
                        </div>
                        <span class="text-sm mt-1 text-gray-800">仪表盘</span>
                    </div>

                    <!-- 折叠按钮容器 -->
                    <div :class="[
                        'flex items-center transition-all duration-200',
                        state.collapsed ? 'w-full' : ''
                    ]">
                        <button @click="toggleCollapsed" :class="[
                            state.collapsed
                                ? 'w-full py-2.5 px-0 rounded-lg hover:bg-blue-50/60'
                                : 'p-2 rounded-lg hover:bg-blue-50/80'
                        ]">
                            <div class="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors mx-auto">
                                <MenuUnfoldOutlined v-if="state.collapsed" />
                                <MenuFoldOutlined v-else />
                            </div>
                        </button>
                    </div>
                </div>

                <!-- 菜单区域 -->
                <div class="relative flex-1 overflow-hidden">
                    <a-menu v-model:openKeys="state.openKeys" v-model:selectedKeys="state.selectedKeys" mode="inline"
                        theme="light" :inline-collapsed="state.collapsed" :items="items"
                        class="h-full overflow-y-auto bg-transparent border-0 pt-2" />
                </div>
            </div>

            <!-- 右侧内容区域 -->
            <main class="flex-1 overflow-y-auto p-6 bg-linear-to-br backdrop-blur-sm">
                <RouterView />
            </main>
        </div>
    </div>
</template>

<script setup>

import { RouterView, useRouter } from 'vue-router'
import { reactive, watch, h } from 'vue';
import { MenuFoldOutlined, MenuUnfoldOutlined, PieChartOutlined, DesktopOutlined, InboxOutlined, MailOutlined, AppstoreOutlined } from '@ant-design/icons-vue';

const state = reactive({
    collapsed: false,
    selectedKeys: ['1'],
    openKeys: ['sub1'],
    preOpenKeys: ['sub1'],
});
const items = reactive([
    {
        key: '1',
        icon: () => h(PieChartOutlined),
        label: 'Option 1',
        title: 'Option 1',
    },
    {
        key: '2',
        icon: () => h(DesktopOutlined),
        label: 'Option 2',
        title: 'Option 2',
    },
    {
        key: '3',
        icon: () => h(InboxOutlined),
        label: 'Option 3',
        title: 'Option 3',
    },
    {
        key: 'sub1',
        icon: () => h(MailOutlined),
        label: 'Navigation One11111111111111111111111111111111',
        title: 'Navigation One',
        children: [
            {
                key: '5',
                label: 'Option 5',
                title: 'Option 5',
            },
            {
                key: '6',
                label: 'Option 6',
                title: 'Option 6',
            },
            {
                key: '7',
                label: 'Option 7',
                title: 'Option 7',
            },
            {
                key: '8',
                label: 'Option 8',
                title: 'Option 8',
            },
        ],
    },
    {
        key: 'sub2',
        icon: () => h(AppstoreOutlined),
        label: 'Navigation Two',
        title: 'Navigation Two',
        children: [
            {
                key: '9',
                label: 'Option 9',
                title: 'Option 9',
            },
            {
                key: '10',
                label: 'Option 10',
                title: 'Option 10',
            },
            {
                key: 'sub3',
                label: 'Submenu',
                title: 'Submenu',
                children: [
                    {
                        key: '11',
                        label: 'Option 11',
                        title: 'Option 11',
                    },
                    {
                        key: '12',
                        label: 'Option 12',
                        title: 'Option 12',
                    },
                ],
            },
        ],
    },
]);
watch(
    () => state.openKeys,
    (_val, oldVal) => {
        state.preOpenKeys = oldVal;
    },
);
const toggleCollapsed = () => {
    state.collapsed = !state.collapsed;
    state.openKeys = state.collapsed ? [] : state.preOpenKeys;
};
</script>

<style scoped></style>
