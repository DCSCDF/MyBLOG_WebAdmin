<!--
  - [RoleDetailDrawer.vue]
  - -------------------------------------------------------------------------------
  - This software is licensed under the MIT License.
  - However, any distribution or modification must retain this copyright notice.
  - See LICENSE for full terms.
  - -------------------------------------------------------------------------------
  - author: "Jiu Liu"
  - author_contact: "QQ: 3209174373, GitHub: https://github.com/DCSCDF"
  - license: "MIT"
  - license_exception: "Mandatory attribution retention"
  - UpdateTime: 2026/2/18 09:48
  -
  -->

<template>
        <a-drawer
            v-model:open="visible"
            :destroy-on-close="true"
            :width="drawerWidth"
            title="角色详情"
            @close="handleClose">
                <template v-if="role">
                        <div class="flex flex-col gap-1">
                                <span class="font-medium text-gray-900 text-sm">编码：</span>
                                <span class="text-gray-600 text-sm break-all">{{ role.code }}</span>
                        </div>
                        <a-divider/>
                        <div class="flex flex-col gap-1">
                                <span class="font-medium text-gray-900 text-sm">名称：</span>
                                <span class="text-gray-600 text-sm break-all">{{ role.name }}</span>
                        </div>
                        <a-divider/>
                        <div class="flex flex-col gap-1">
                                <span class="font-medium text-gray-900 text-sm">描述：</span>
                                <span class="text-gray-600 text-sm break-all">{{ role.description || '-' }}</span>
                        </div>
                        <a-divider/>
                        <div class="flex flex-col gap-1">
                                <span class="font-medium text-gray-900 text-sm">超级管理员：</span>
                                <span class="text-gray-600 text-sm break-all">{{ role.superAdmin ? '是' : '否' }}</span>
                        </div>
                        <a-divider/>
                        <div class="flex flex-col gap-1">
                                <span class="font-medium text-gray-900 text-sm">系统内置：</span>
                                <span class="text-gray-600 text-sm break-all">{{ role.isSystem ? '是' : '否' }}</span>
                        </div>
                        <a-divider/>
                        <div class="flex flex-col gap-1">
                                <span class="font-medium text-gray-900 text-sm">排序：</span>
                                <span class="text-gray-600 text-sm break-all">{{ role.sortOrder }}</span>
                        </div>
                        <a-divider/>
                        <div class="flex flex-col gap-1">
                                <span class="font-medium text-gray-900 text-sm">状态：</span>
                                <span
                                    class="text-gray-600 text-sm break-all">{{ role.status === 1 ? '启用' : '禁用' }}</span>
                        </div>
                        <a-divider/>
                        <div class="flex flex-col gap-1">
                                <span class="font-medium text-gray-900 text-sm">创建时间：</span>
                                <span class="text-gray-600 text-sm break-all">{{ formatDate(role.createTime) }}</span>
                        </div>
                        <a-divider/>
                        <div class="flex flex-col gap-1">
                                <span class="font-medium text-gray-900 text-sm">更新时间：</span>
                                <span class="text-gray-600 text-sm break-all">{{ formatDate(role.updateTime) }}</span>
                        </div>
                </template>
        </a-drawer>
</template>

<script setup>
import {computed} from 'vue';
import {useDrawerWidth} from '../../../../../composables/useDrawerWidth.js';
import {formatDate} from '../../../../../utils/formatDate.js';

const props = defineProps({
        open: {type: Boolean, default: false},
        role: {type: Object, default: null}
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
