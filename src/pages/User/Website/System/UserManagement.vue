<!--
  - [UserManagement.vue]
  - -------------------------------------------------------------------------------
  - This software is licensed under the MIT License.
  - However, any distribution or modification must retain this copyright notice.
  - See LICENSE for full terms.
  - -------------------------------------------------------------------------------
  - author: "Jiu Liu"
  - author_contact: "QQ: 3209174373, GitHub: https://github.com/DCSCDF"
  - license: "MIT"
  - license_exception: "Mandatory attribution retention"
  - UpdateTime: 2026/2/18 10:34
  -
  -->

<!--
  - [UserManagement.vue]
  - 用户管理页面：分页列表、详情、编辑、删除、查看角色权限
  - 对应后端接口：/api/user/*
  -->

<template>
        <a-card>
                <div class="mb-4 flex items-center justify-between">
                        <div>
                                <h2 class="font-bold text-lg mb-1">用户列表</h2>
                                <span class="text-sm text-gray-600">管理系统中所有用户账号。</span>
                        </div>
                </div>

                <div class="search-filter-bar mb-4 flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center">
                        <div class="w-full min-w-[200px] max-w-[300px]">
                                <a-input
                                    v-model:value="searchKeyword"
                                    class="w-full"
                                    placeholder="搜索用户名/昵称/邮箱"
                                    @press-enter="handleSearch">
                                        <template #prefix>
                                                <SearchOutlined/>
                                        </template>
                                </a-input>
                        </div>
                        <div class="flex gap-2">
                                <div class="search-filter-item flex items-center gap-1 rounded-md min-w-0 my-1">
                                        <a-select
                                            v-model:value="searchStatus"
                                            allow-clear
                                            placeholder="状态">
                                                <a-select-option
                                                    v-for="opt in statusFilterOptions"
                                                    :key="opt.label"
                                                    :value="opt.value">{{ opt.label }}
                                                </a-select-option>
                                        </a-select>
                                </div>
                        </div>
                        <div class="flex shrink-0 gap-2 w-full lg:w-auto justify-end">
                                <a-button type="primary" @click="handleSearch">
                                        <template #icon>
                                                <SearchOutlined/>
                                        </template>
                                        搜索
                                </a-button>
                                <a-button @click="handleReset">重置</a-button>
                        </div>
                </div>

                <!-- 用户表格 -->
                <a-table
                    :columns="columns"
                    :data-source="userStore.currentUsers"
                    :loading="userStore.loading"
                    :pagination="tablePagination"
                    :scroll="{ x: 1000 }"
                    row-key="id"
                    @change="onTableChange">
                        <template #bodyCell="{ column, record }">
                                <template v-if="column.key === 'avatar'">
                                        <img
                                            v-if="record.avatarUrl"
                                            :src="record.avatarUrl"
                                            alt="头像"
                                            class="h-8 w-8 rounded-full object-cover"/>
                                        <span v-else class="text-gray-400">-</span>
                                </template>
                                <template v-else-if="column.key === 'status'">
                                        <a-tag :bordered="false" :color="record.status === 1 ? 'green' : 'red'">
                                                {{ record.status === 1 ? '启用' : '禁用' }}
                                        </a-tag>
                                </template>
                                <template v-else-if="column.key === 'action'">
                                        <a-space>
                                                <a-button size="small" type="link" @click="openDetail(record)">查看
                                                </a-button>
                                                <a-button size="small" type="link" @click="openRolePermission(record)">
                                                        角色权限
                                                </a-button>
                                                <a-button size="small" type="link" @click="openEdit(record)">编辑
                                                </a-button>
                                                <a-button
                                                    v-if="record.status === 1"
                                                    size="small"
                                                    type="link"
                                                    @click="handleDisable(record)">禁用
                                                </a-button>
                                                <a-button
                                                    v-else
                                                    size="small"
                                                    type="link"
                                                    @click="handleEnable(record)">启用
                                                </a-button>
                                                <a-popconfirm
                                                    cancel-text="取消"
                                                    ok-text="确定"
                                                    title="确定删除该用户吗？删除后用户将无法登录。"
                                                    @confirm="onDelete(record)">
                                                        <a-button danger size="small" type="link">删除</a-button>
                                                </a-popconfirm>
                                        </a-space>
                                </template>
                        </template>
                </a-table>
        </a-card>

        <!-- 用户详情抽屉 -->
        <UserDetailDrawer
            v-model:open="detailVisible"
            :user="selectedUser"
            @close="selectedUser = null"/>

        <!-- 编辑用户弹窗 -->
        <UserEditModal
            ref="userEditModalRef"
            v-model:open="editVisible"
            :user="selectedUser"
            @cancel="selectedUser = null"
            @submit="handleEditSubmit"/>

        <!-- 用户角色权限抽屉 -->
        <UserRolePermissionDrawer
            v-model:open="rolePermissionVisible"
            :roles="userRoles"
            :user="selectedUser"
            @close="handleRolePermissionClose"/>
</template>

<script setup>
import {computed, onMounted, ref} from 'vue';
import {message} from 'ant-design-vue';
import {SearchOutlined} from '@ant-design/icons-vue';
import {useUserStore} from '../../../../stores/user.js';
import UserDetailDrawer from '../../../../components/Website/System/UserDetailDrawer.vue';
import UserEditModal from '../../../../components/Website/System/UserEditModal.vue';
import UserRolePermissionDrawer from '../../../../components/Website/System/UserRolePermissionDrawer.vue';

const userStore = useUserStore();

// 搜索与筛选（keyword 传接口，status 传 0/1；'' 表示不传该筛选）
const searchKeyword = ref('');
const searchStatus = ref(undefined);

/** 状态下拉选项：来自接口 filterOptions 或默认 */
const statusFilterOptions = computed(() => {
        const fromApi = userStore.filterOptions?.status;
        return fromApi && fromApi.length > 0 ? fromApi : [{value: 0, label: '禁用'}, {value: 1, label: '启用'}];
});

// 表格列定义
const columns = [
        {title: 'ID', dataIndex: 'id', key: 'id', width: 80},
        {title: '头像', key: 'avatar', width: 80},
        {title: '用户名', dataIndex: 'username', key: 'username', width: 120},
        {title: '昵称', dataIndex: 'nickname', key: 'nickname', width: 120},
        {title: '邮箱', dataIndex: 'email', key: 'email', width: 180, ellipsis: true},
        {title: '状态', key: 'status', width: 80},
        {title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 180},
        {title: '操作', key: 'action', width: 300, fixed: 'right'}
];

// 表格分页配置
const tablePagination = computed(() => ({
        current: userStore.pagination.current,
        pageSize: userStore.pagination.pageSize,
        total: userStore.pagination.total,
        showSizeChanger: true,
        showTotal: (total) => `共 ${total} 条`
}));

// 抽屉和弹窗状态
const detailVisible = ref(false);
const editVisible = ref(false);
const rolePermissionVisible = ref(false);
const selectedUser = ref(null);
const userRoles = ref([]);
const userEditModalRef = ref(null);

/**
 * 加载用户列表
 */
const loadUsers = () => {
        const params = {
                currentPage: userStore.pagination.current,
                pageSize: userStore.pagination.pageSize
        };

        if (searchKeyword.value) {
                params.keyword = searchKeyword.value.trim();
        }
        if (searchStatus.value != null && searchStatus.value !== '') {
                params.status = searchStatus.value;
        }

        userStore.fetchUsers(params).catch((e) => {
                message.error(e?.message || '加载用户列表失败');
        });
};

/**
 * 处理表格变化（分页、排序等）
 */
const onTableChange = (pagination) => {
        userStore.updatePagination({
                current: pagination.current,
                pageSize: pagination.pageSize
        });
        loadUsers();
};

/**
 * 处理搜索
 */
const handleSearch = () => {
        userStore.updatePagination({current: 1});
        userStore.updateQueryParams({
                keyword: searchKeyword.value.trim(),
                status: (searchStatus.value == null || searchStatus.value === '') ? undefined : searchStatus.value
        });
        loadUsers();
};

/**
 * 处理重置
 */
const handleReset = () => {
        searchKeyword.value = '';
        searchStatus.value = undefined;
        userStore.updatePagination({current: 1});
        userStore.updateQueryParams({keyword: '', status: undefined});
        loadUsers();
};

/**
 * 打开详情抽屉
 */
const openDetail = (record) => {
        selectedUser.value = record;
        detailVisible.value = true;
};

/**
 * 打开编辑弹窗（先拉取用户详情以拿到 roleId，保证角色下拉能回显当前角色）
 */
const openEdit = (record) => {
        // 统一处理逻辑，确保只有一个返回点
        let shouldFetchDetail = record && record.id;

        if (shouldFetchDetail) {
                userStore.fetchUserById(record.id).then((detail) => {
                        selectedUser.value = detail || record;
                        editVisible.value = true;
                }).catch(() => {
                        selectedUser.value = record;
                        editVisible.value = true;
                });
        } else {
                selectedUser.value = record;
                editVisible.value = true;
        }
};

/**
 * 处理编辑提交
 */
const handleEditSubmit = async (updateData) => {
        // 统一处理逻辑，确保只有一个返回点
        let canProceed = selectedUser.value != null;

        if (canProceed) {
                try {
                        const result = await userStore.updateUser(selectedUser.value.id, updateData);
                        
                        // 检查更新结果，只有当result不为false时才算成功
                        if (result !== false) {
                                message.success('保存成功');
                                editVisible.value = false;
                                selectedUser.value = null;
                                loadUsers();
                                // 调用子组件的刷新方法
                                if (userEditModalRef.value) {
                                        userEditModalRef.value.handleParentSuccess();
                                }
                        } else {
                                // updateUser返回false表示更新失败，但没有抛出异常
                                message.error('保存失败');
                        }
                } catch (e) {
                        // 捕获异常情况（如网络错误、API抛出的错误等）
                        message.error(e?.message || '保存失败');
                }
        }
};

/**
 * 处理编辑成功后的回调
 */


/**
 * 打开角色权限抽屉
 */
const openRolePermission = (record) => {
        selectedUser.value = record;
        rolePermissionVisible.value = true;

        // 直接使用用户对象中的roles数据，避免额外API调用
        userRoles.value = record.roles || [];
};

/**
 * 处理角色权限抽屉关闭
 */
const handleRolePermissionClose = () => {
        selectedUser.value = null;
        userRoles.value = [];
};

/**
 * 处理启用用户
 */
const handleEnable = async (record) => {
        try {
                await userStore.updateUserStatus(record.id, 1);
                message.success('启用成功');
                loadUsers();
        } catch (e) {
                message.error(e?.message || '启用失败');
        }
};

/**
 * 处理禁用用户
 */
const handleDisable = async (record) => {
        try {
                await userStore.updateUserStatus(record.id, 0);
                message.success('禁用成功');
                loadUsers();
        } catch (e) {
                message.error(e?.message || '禁用失败');
        }
};

/**
 * 处理删除用户
 */
const onDelete = async (record) => {
        try {
                await userStore.deleteUser(record.id);
                message.success('删除成功');
                loadUsers();
        } catch (e) {
                message.error(e?.message || '删除失败');
        }
};

// 初始加载
onMounted(() => {
        loadUsers();
});
</script>
