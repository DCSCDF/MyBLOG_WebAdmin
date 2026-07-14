<!--
  - [MyRecentMessage.vue]
  - -------------------------------------------------------------------------------
  - This software is licensed under the MIT License.
  - However, any distribution or modification must retain this copyright notice.
  - See LICENSE for full terms.
  - -------------------------------------------------------------------------------
  - author: "Jiu Liu"
  - author_contact: "QQ: 3209174373, GitHub: https://github.com/DCSCDF"
  - license: "MIT"
  - license_exception: "Mandatory attribution retention"
  - UpdateTime: 2026/6/9 18:56
  -
  -->

<template>
        <show-permission-content permission="comment:list">

                <a-card size="small" title="最近回复我的评论">

                        <div v-if="loading" class="my-4 flex justify-center">
                                <a-spin />
                        </div>

                        <div v-else-if="replies.length === 0" class="my-4 text-center text-outline">
                                暂无回复消息
                        </div>

                        <div v-else>
                                <div v-for="reply in replies" :key="reply.id" class="my-4">

                                        <div class="flex mx-6">
                                                <!-- 头像 -->
                                                <a class="flex-shrink-0" :href="reply.website || '#'"
                                                        :target="reply.website ? '_blank' : undefined"
                                                        rel="noopener noreferrer">
                                                       <a-avatar :size="40" :src="reply.avatarUrl">
                                                                {{ (reply.username || '').charAt(0) }}
                                                        </a-avatar>
                                                </a>

                                                <div class="flex flex-col flex-1 min-w-0 ml-4">
                                                        <!-- 用户名 -->
                                                        <div class="flex items-center gap-2 pb-1 flex-wrap">
                                                                <a class="text-sm font-bold text-on-background hover:text-primary transition-colors"
                                                                        :href="reply.website || '#'"
                                                                        :target="reply.website ? '_blank' : undefined"
                                                                        rel="noopener noreferrer">
                                                                        {{ reply.username }}
                                                                </a>
                                                                <a-tag v-if="reply.isAdmin" color="blue"
                                                                        size="small">管理员</a-tag>
                                                        </div>

                                                        <!-- 评论内容 -->
                                                        <p class="text-sm mb-2!">
                                                                {{ reply.content }}
                                                        </p>

                                                        <!-- 时间 -->
                                                        <div
                                                                class="flex items-center gap-4 text-[11px] text-outline font-medium">
                                                                <span>{{ formatTime(reply.createTime) }}</span>
                                                        </div>
                                                </div>
                                        </div>

                                </div>
                        </div>

                </a-card>
        </show-permission-content>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import ShowPermissionContent from "./Website/System/ShowPermissionContent.vue";
import { commentApi } from '../api/user/commentApi.js';

const replies = ref([]);
const loading = ref(false);

const formatTime = (timeStr) => {
        if (!timeStr) return '';
        const date = new Date(timeStr);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}`;
};

const fetchReplies = async () => {
        loading.value = true;
        try {
                const res = await commentApi.getReplies(6);
                replies.value = res.data || [];
        } catch (error) {
                console.error('获取回复消息失败:', error);
                replies.value = [];
        } finally {
                loading.value = false;
        }
};

onMounted(() => {
        fetchReplies();
});
</script>

<style scoped>

</style>