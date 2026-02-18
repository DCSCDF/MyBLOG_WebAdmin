<!--
  - [UserRolePermissionDrawer.vue]
  - 用户角色权限展示抽屉组件：展示用户的角色及其权限和权限组
  -->

<template>
        <a-drawer
            v-model:open="visible"
            :destroy-on-close="true"
            :width="drawerWidth"
            title="用户角色与权限"
            @close="handleClose">
                <template v-if="user">
                        <div class="mb-4 text-gray-600 text-sm">
                                {{ user.nickname || user.username }}（{{ user.username }}）
                        </div>

                        <!-- 加载状态 -->
                        <div v-if="isLoading" class="flex justify-center py-8">
                                <a-spin size="large"/>
                        </div>

                        <!-- 角色列表 -->
                        <template v-else>
                                <div v-if="!roles || roles.length === 0" class="text-gray-400 text-sm py-4 text-center">
                                        没有权限查看
                                </div>

                                <div v-else class="space-y-6">
                                        <div
                                            v-for="role in roles"
                                            :key="role.id"
                                            class="border border-gray-200 rounded-lg p-4">
                                                <!-- 角色信息 -->
                                                <div class="mb-4 flex items-center justify-between">
                                                        <div>
                                                                <div class="flex items-center gap-2">
                                                                        <h3 class="font-semibold text-base">{{
                                                                                        role.name
                                                                                }}</h3>
                                                                        <a-tag v-if="isSuperAdminRole(role)"
                                                                               :bordered="false" color="red">超级管理员
                                                                        </a-tag>
                                                                </div>
                                                                <p class="text-xs text-gray-500 mt-1">{{
                                                                                role.code
                                                                        }}</p>
                                                                <p v-if="role.description"
                                                                   class="text-xs text-gray-400 mt-1">
                                                                        {{ role.description }}
                                                                </p>
                                                        </div>
                                                </div>

                                                <!-- 权限和权限组加载状态 -->
                                                <div v-if="rolePermissionsLoading[role.id]"
                                                     class="flex justify-center py-4">
                                                        <a-spin size="small"/>
                                                </div>

                                                <!-- 权限和权限组内容 -->
                                                <template v-else>
                                                        <!-- 权限组列表 -->
                                                        <div class="mb-4">
                                                                <div class="mb-2 text-sm font-medium text-gray-700">
                                                                        权限组
                                                                </div>
                                                                <template
                                                                    v-if="rolePermissionGroups[role.id]?.length > 0">
                                                                        <a-table
                                                                            :columns="groupColumns"
                                                                            :data-source="rolePermissionGroups[role.id]"
                                                                            :pagination="false"
                                                                            :scroll="{ x: 400 }"
                                                                            row-key="id"
                                                                            size="small"
                                                                            table-layout="fixed">
                                                                                <template
                                                                                    #bodyCell="{ column, record }">
                                                                                        <template
                                                                                            v-if="column.key === 'description'">
                                                                                                <span
                                                                                                    class="text-gray-500">{{
                                                                                                                record.description || '-'
                                                                                                        }}</span>
                                                                                        </template>
                                                                                </template>
                                                                        </a-table>
                                                                </template>
                                                                <div v-else class="text-gray-400 text-sm py-2">
                                                                        没有权限
                                                                </div>
                                                        </div>

                                                        <!-- 权限列表 -->
                                                        <div>
                                                                <div class="mb-2 text-sm font-medium text-gray-700">
                                                                        权限
                                                                </div>
                                                                <div v-if="rolePermissions[role.id]?.length === 0"
                                                                     class="text-gray-400 text-sm py-2">
                                                                        没有权限
                                                                </div>
                                                                <a-table
                                                                    v-else
                                                                    :columns="permissionColumns"
                                                                    :data-source="rolePermissions[role.id]"
                                                                    :pagination="false"
                                                                    :scroll="{ x: 500 }"
                                                                    row-key="id"
                                                                    size="small"
                                                                    table-layout="fixed">
                                                                        <template #bodyCell="{ column, record }">
                                                                                <template
                                                                                    v-if="column.key === 'source'">
                                                                                        <a-tag :bordered="false"
                                                                                               :color="record.fromGroup ? 'blue' : 'green'">
                                                                                                {{
                                                                                                        record.fromGroup ? '来自权限组' : '直接添加'
                                                                                                }}
                                                                                        </a-tag>
                                                                                </template>
                                                                        </template>
                                                                </a-table>
                                                        </div>
                                                </template>
                                        </div>
                                </div>
                        </template>
                </template>
        </a-drawer>
</template>

<script setup>
import {computed, ref, watch} from 'vue';
import {useDrawerWidth} from '../../../composables/useDrawerWidth.js';
import {isSuperAdminRole, useRoleStore} from '../../../stores/role.js';
import {usePermissionGroupStore} from '../../../stores/permissiongroup.js';
import logger from '../../../utils/logger.js';

const props = defineProps({
        open: {
                type: Boolean,
                default: false
        },
        user: {
                type: Object,
                default: null
        },
        roles: {
                type: Array,
                default: () => []
        }
});

const emit = defineEmits(['update:open', 'close']);

const roleStore = useRoleStore();
const permissionGroupStore = usePermissionGroupStore();

const visible = computed({
        get: () => props.open,
        set: (val) => emit('update:open', val)
});

const { drawerWidth } = useDrawerWidth();

const loadingPermissions = ref(false);
const rolePermissionsLoading = ref({});
const rolePermissions = ref({});
const rolePermissionGroups = ref({});
const permissionIdsFromGroups = ref({});

// 计算是否正在加载
const isLoading = computed(() => {
        return loadingPermissions.value;
});

// 权限组表格列
const groupColumns = [
        {title: '权限组名称', dataIndex: 'name', key: 'name'},
        {title: '描述', dataIndex: 'description', key: 'description', ellipsis: true}
];

// 权限表格列
const permissionColumns = [
        {title: '权限编码', dataIndex: 'code', key: 'code', ellipsis: true},
        {title: '权限名称', dataIndex: 'name', key: 'name'},
        {title: '来源', key: 'source', width: 100}
];

/**
 * 加载角色的权限详情
 * @param {number} roleId - 角色ID
 */
const loadRolePermissions = async (roleId) => {
        // 使用单一返回点模式，消除多余循环
        if (!rolePermissionsLoading.value[roleId]) {
                rolePermissionsLoading.value[roleId] = true;
                try {
                        // 获取角色权限详情
                        const roleDetail = await roleStore.fetchPermissionsDetail(roleId);

                        // 存储权限组
                        rolePermissionGroups.value[roleId] = roleDetail.permissionGroups || [];

                        // 加载权限组中的权限ID（使用扁平化处理）
                        const groupPermissionIds = new Set();
                        if (roleDetail.permissionGroups && roleDetail.permissionGroups.length > 0) {
                                // 收集所有权限组ID
                                const groupIds = roleDetail.permissionGroups.map(group => group.id);
                                
                                // 并行获取所有权限组的权限
                                const groupPromises = groupIds.map(groupId => 
                                    permissionGroupStore.fetchGroupPermissions(groupId).catch(() => [])
                                );
                                const groupResults = await Promise.all(groupPromises);
                                
                                // 使用 flat() 扁平化后单次循环
                                const allPermissions = groupResults.flat();
                                for (const permission of allPermissions) {
                                        groupPermissionIds.add(permission.id);
                                }
                        }
                        permissionIdsFromGroups.value[roleId] = groupPermissionIds;

                        // 处理权限列表，标记来源
                        rolePermissions.value[roleId] = (roleDetail.permissions || []).map(permission => ({
                                ...permission,
                                fromGroup: groupPermissionIds.has(permission.id)
                        }));
                } catch (e) {
                        logger.error('加载角色权限失败:', e);
                        rolePermissions.value[roleId] = [];
                        rolePermissionGroups.value[roleId] = [];
                } finally {
                        rolePermissionsLoading.value[roleId] = false;
                }
        }
};

/**
 * 加载所有角色的权限
 */
const loadAllRolePermissions = async () => {
        // 使用单一返回点模式
        if (props.roles && props.roles.length > 0) {
                loadingPermissions.value = true;
                try {
                        const promises = props.roles.map(role => loadRolePermissions(role.id));
                        await Promise.all(promises);
                } catch (e) {
                        logger.error('加载角色权限失败:', e);
                } finally {
                        loadingPermissions.value = false;
                }
        }
};

/**
 * 处理关闭
 */
const handleClose = () => {
        rolePermissions.value = {};
        rolePermissionGroups.value = {};
        permissionIdsFromGroups.value = {};
        rolePermissionsLoading.value = {};
        emit('close');
};

watch(() => props.open, (newVal) => {
        if (newVal && props.roles && props.roles.length > 0) {
                loadAllRolePermissions();
        }
});

watch(() => props.roles, (newRoles) => {
        if (props.open && newRoles && newRoles.length > 0) {
                loadAllRolePermissions();
        }
});
</script>
