<template>
    <header class="bg-white px-6 pt-1 h-16 flex justify-between items-center border-b border-gray-100">
        <div class="flex items-center ">
            <img src="../../assets/vue.svg" alt="">
           <!-- <h1 class="text-xl font-semibold mx-3 text-gray-800 dark:text-white">myblog</h1> -->

        </div>
        <div class="flex items-center ">
            <a-avatar shape="square" :size="42">
                <template #icon>
                    <UserOutlined />
                </template>
            </a-avatar>
        </div>
    </header>
</template>
<script setup>
import {
    UserOutlined,
} from '@ant-design/icons-vue';
</script>