<template>
        <div class="flex flex-col h-screen bg-[#f5f5f5]">
                <div class="flex flex-1 overflow-hidden bg-gradient-to-br from-blue-50/20 to-gray-50/30">
                        <div class="fixed h-full z-40 top-0 left-0 bottom-0 transition-all duration-300 ease-in-out"
                             :class="collapsed ? 'w-20' : 'w-60'">
                                <Menu :collapsed="collapsed" :toggleCollapsed="toggleCollapsed"></Menu>
                        </div>
                        <div
                            :class="['flex-1 transition-all duration-300 ease-in-out', collapsed ? 'ml-20' : 'ml-60']">
                                <Header :collapsed="collapsed" @toggle-collapsed="toggleCollapsed"
                                        class="fixed top-0 z-30 transition-all duration-300 ease-in-out"
                                        :class="collapsed ? 'left-20 right-0' : 'left-60 right-0'"/>

                                <!-- 右侧内容区域 -->
                                <main
                                    class="flex flex-col min-h-[calc(100vh-4rem)] mt-16 overflow-y-auto p-0 sm:p-2 md:p-6 bg-gradient-to-br backdrop-blur-sm pt-16 max-w-7xl mx-auto">

                                        <div class="relative h-30 rounded-lg overflow-hidden m-3">
                                                <img
                                                    src="../assets/img/card_bg.png"
                                                    alt="Dashboard Background"
                                                    class="w-full h-full object-cover"
                                                />
                                                <div
                                                    class="absolute inset-0 flex items-center justify-between p-1 sm:p-6">
                                                        <div class="my-auto text-white mx-3">
                                                                <p class="!m-0">Hi，欢迎使用MyBlog平台</p>
                                                                <div class="h-4"></div>
                                                                <p class="!m-0">
                                                                        轻松创建、发布您的文章，方便的的后台管理，降低学习成本。</p>
                                                        </div>
                                                </div>
                                        </div>

                                        <div class="flex flex-1 flex-col">

                                                <div
                                                    class="min-h-90 bg-white my-8 m-3 border border-gray-200 rounded-lg flex-1">
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
import Header from '../components/header/header.vue';
import Menu from '../components/menu/menu.vue';
import {ref} from 'vue';

const collapsed = ref(false);

const toggleCollapsed = () => {
        collapsed.value = !collapsed.value;
};
</script>

<style scoped></style>
 