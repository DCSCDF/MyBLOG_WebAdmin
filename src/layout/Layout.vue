<template>
    <div class="flex flex-col min-h-screen bg-gray-30">
       <Header></Header>

        <div class="flex flex-1 overflow-hidden bg-linear-to-br from-blue-50/20 to-gray-50/30">
           <Menu></Menu>

            <!-- 右侧内容区域 -->
            <main class="flex-1 overflow-y-auto p-6 bg-linear-to-br backdrop-blur-sm">
                <RouterView />
            </main>
        </div>
    </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import Header from '../components/header/header.vue';
import Menu from '../components/menu/menu.vue';
</script>

<style scoped></style>
