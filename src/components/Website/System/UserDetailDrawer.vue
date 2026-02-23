<!--
  - [UserDetailDrawer.vue]
  - -------------------------------------------------------------------------------
  - This software is licensed under the MIT License.
  - However, any distribution or modification must retain this copyright notice.
  - See LICENSE for full terms.
  - -------------------------------------------------------------------------------
  - author: "Jiu Liu"
  - author_contact: "QQ: 3209174373, GitHub: https://github.com/DCSCDF"
  - license: "MIT"
  - license_exception: "Mandatory attribution retention"
  - UpdateTime: 2026/2/18 09:46
  -
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
import {computed} from 'vue';
import {formatDate} from '../../../utils/formatDate.js';
import {useDrawerWidth} from '../../../utils/useDrawerWidth.js';

const props = defineProps({
        open: {type: Boolean, default: false},
        user: {type: Object, default: null}
});

const emit = defineEmits(['update:open', 'close']);

const visible = computed({
        get: () => props.open,
        set: (val) => emit('update:open', val)
});

const {drawerWidth} = useDrawerWidth();

function handleClose() {
        emit('close');
}
</script>
