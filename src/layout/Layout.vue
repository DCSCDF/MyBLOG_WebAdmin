<template>
        <div class="flex flex-col h-screen">
                <div class="flex flex-1 bg-gradient-to-br from-blue-50/20 to-gray-50/30">
                        <!-- 侧边栏菜单  -->
                        <div
                            class="fixed h-full z-40 top-0 left-0 bottom-0 transition-all duration-300 ease-in-out"
                        >
                                <Menu :collapsed="collapsed"
                                      :toggleCollapsed="toggleCollapsed"></Menu>
                        </div>

                        <!-- 主内容区域 -->
                        <div
                            :class="[
                                'flex-1 transition-all duration-300 ease-in-out',
                                collapsed ? 'ml-20' : 'ml-60'
                            ]"
                        >
                                <Header
                                    :collapsed="collapsed"
                                    @toggle-collapsed="toggleCollapsed"
                                    class="fixed top-0 z-30 transition-all duration-300 ease-in-out"
                                    :class="collapsed ? 'left-20 right-0' : 'left-60 right-0'"
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
import {ref} from 'vue';
import Menu from "../components/menu/menu.vue";

const collapsed = ref(false);

const toggleCollapsed = () => {
        collapsed.value = !collapsed.value;
};


</script>

<style scoped></style>