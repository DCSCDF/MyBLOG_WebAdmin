<template>
        <template v-if="hasPermission">
                <slot></slot>
        </template>
</template>

<script setup>
import {computed} from 'vue';
import {useAuthStore} from '../../../stores/auth.js';
import logger from '../../../utils/logger.js';

const props = defineProps({
        permission: {
                type: String,
                required: true,
                description: '权限编码'
        }
});

const authStore = useAuthStore();

const hasPermission = computed(() => {
        const isValid = props.permission && authStore.userPermissions && authStore.userPermissions.length > 0;
        const result = isValid && authStore.userPermissions.includes(props.permission);
        logger.log(`权限检查：${props.permission} - ${result ? '通过' : '拒绝'}`);
        return result;
});
</script>
