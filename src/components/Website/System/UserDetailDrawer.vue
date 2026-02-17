<!--
  - [UserDetailDrawer.vue]
  - 用户详情抽屉组件：展示用户的基础信息
  -->

<template>
        <a-drawer
            v-model:open="visible"
            :destroy-on-close="true"
            :width="drawerWidth"
            title="用户详情"
            @close="handleClose">
                <template v-if="user">
                        <div class="flex flex-col gap-1">
                                <span class="font-medium text-gray-900 text-sm">用户名：</span>
                                <span class="text-gray-600 text-sm break-all">{{ user.username || '-' }}</span>
                        </div>
                        <a-divider/>
                        <div class="flex flex-col gap-1">
                                <span class="font-medium text-gray-900 text-sm">昵称：</span>
                                <span class="text-gray-600 text-sm break-all">{{ user.nickname || '-' }}</span>
                        </div>
                        <a-divider/>
                        <div class="flex flex-col gap-1">
                                <span class="font-medium text-gray-900 text-sm">邮箱：</span>
                                <span class="text-gray-600 text-sm break-all">{{ user.email || '-' }}</span>
                        </div>
                        <a-divider/>
                        <div class="flex flex-col gap-1">
                                <span class="font-medium text-gray-900 text-sm">头像：</span>
                                <span class="text-gray-600 text-sm break-all">
				<img
                                    v-if="user.avatarUrl"
                                    :src="user.avatarUrl"
                                    alt="头像"
                                    class="h-12 w-12 rounded-full object-cover"/>
				<span v-else class="text-gray-400">未设置</span>
			</span>
                        </div>
                        <a-divider/>
                        <div class="flex flex-col gap-1">
                                <span class="font-medium text-gray-900 text-sm">状态：</span>
                                <span class="text-gray-600 text-sm break-all">

					{{ user.status === 1 ? '启用' : '禁用' }}

			</span>
                        </div>
                        <a-divider/>
                        <div class="flex flex-col gap-1">
                                <span class="font-medium text-gray-900 text-sm">创建时间：</span>
                                <span class="text-gray-600 text-sm break-all">{{ formatDate(user.createTime) }}</span>
                        </div>
                        <a-divider/>
                        <div class="flex flex-col gap-1">
                                <span class="font-medium text-gray-900 text-sm">更新时间：</span>
                                <span class="text-gray-600 text-sm break-all">{{ formatDate(user.updateTime) }}</span>
                        </div>
                </template>
        </a-drawer>
</template>

<script setup>
import {computed, ref, watch} from 'vue';

const props = defineProps({
        open: {
                type: Boolean,
                default: false
        },
        user: {
                type: Object,
                default: null
        }
});

const emit = defineEmits(['update:open', 'close']);

const visible = computed({
        get: () => props.open,
        set: (val) => emit('update:open', val)
});

const windowWidth = ref(window.innerWidth);
const drawerWidth = computed(() => windowWidth.value < 768 ? 350 : 600);

const handleResize = () => {
        windowWidth.value = window.innerWidth;
};

const handleClose = () => {
        emit('close');
};

/**
 * 格式化日期时间
 * @param {string|Date} val - 日期值
 * @returns {string} 格式化后的日期字符串
 */
function formatDate(val) {
        let result = '-';
        if (val) {
                try {
                        result = new Date(val).toLocaleString('zh-CN', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit'
                        });
                } catch (e) {
                        result = String(val);
                }
        }
        return result;
}

watch(() => props.open, (newVal) => {
        if (newVal) {
                window.addEventListener('resize', handleResize);
        } else {
                window.removeEventListener('resize', handleResize);
        }
});
</script>
