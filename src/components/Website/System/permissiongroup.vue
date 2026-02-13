<!--
  - [permissiongroup.vue]
  - -------------------------------------------------------------------------------
  - This software is licensed under the MIT License.
  - However, any distribution or modification must retain this copyright notice.
  - See LICENSE for full terms.
  - -------------------------------------------------------------------------------
  - author: "Jiu Liu"
  - author_contact: "QQ: 3209174373, GitHub: https://github.com/DCSCDF"
  - license: "MIT"
  - license_exception: "Mandatory attribution retention"
  - UpdateTime: 2026/2/4 02:17
  -
  -->

<template>
        <a-card>
                <div class="mb-4">
                        <h2 class="font-bold text-lg mb-1">权限组修改/添加</h2>
                </div>

                <a-table
                    :columns="columns"
                    :data-source="tableData"
                    :loading="loading"
                    :pagination="paginationConfig"
                    :scroll="{ x: 800 }"
                    table-layout="fixed"
                    @change="handleTableChange">
                        <template #bodyCell="{ column, record }">
                                <template v-if="column.key === 'operation'">
                                        <a-button size="small" type="link" @click="viewPermission(record)">
                                                查看
                                        </a-button>
                                </template>
                                <template v-else-if="column.key === 'status'">
                                        <a-tag :color="record.status === '启用' ? 'green' : 'red'">
                                                {{ record.status }}
                                        </a-tag>
                                </template>
                        </template>
                </a-table>

                <!-- 查看权限组详情抽屉 -->
                <a-drawer
                    v-model:open="viewDrawerVisible"
                    title="权限组详情"
                    placement="right"
                    :width="480"
                    :footerStyle="{ textAlign: 'right' }"
                    :bodyStyle="{ backgroundColor: 'transparent', border: 'none' }"
                    :headerStyle="{ backgroundColor: 'transparent', border: 'none' }"
                    :drawerStyle="{ backgroundColor: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)' }"
                    :destroyOnClose="true">
                        <div class="flex flex-col gap-4">
                                <div class="flex flex-col gap-1">
                                        <span class="font-medium text-gray-900 text-sm">排序顺序：</span>
                                        <span class="text-gray-600 text-sm break-all">{{ currentPermissionGroup.order }}</span>
                                </div>
                                <div class="flex flex-col gap-1">
                                        <span class="font-medium text-gray-900 text-sm">权限组名称：</span>
                                        <span class="text-gray-600 text-sm break-all">{{ currentPermissionGroup.name }}</span>
                                </div>
                                <div class="flex flex-col gap-1">
                                        <span class="font-medium text-gray-900 text-sm">权限组描述：</span>
                                        <span class="text-gray-600 text-sm break-all">{{ currentPermissionGroup.description }}</span>
                                </div>
                                <div class="flex flex-col gap-1">
                                        <span class="font-medium text-gray-900 text-sm">状态：</span>
                                        <a-tag :color="currentPermissionGroup.status === '启用' ? 'green' : 'red'">
                                                {{ currentPermissionGroup.status }}
                                        </a-tag>
                                </div>
                        </div>
                        <template #footer>
                                <a-button @click="viewDrawerVisible = false">关闭</a-button>
                        </template>
                </a-drawer>
        </a-card>
</template>
<script setup>
import {computed, onMounted, reactive, ref} from 'vue';
import { usePermissionStore } from '../../../stores/permission.js';
import logger from "../../../utils/logger.js";

const permissionStore = usePermissionStore();

// 使用 store 的状态
const tableData = computed(() => permissionStore.currentPermissionGroups);
const loading = computed(() => permissionStore.loading);
const paginationConfig = computed(() => permissionStore.pagination);

// 表格列配置
const columns = [
        {
                title: '排序顺序',
                dataIndex: 'order',
                key: 'order',
                width: 120,

        },
        {
                title: '权限组名称',
                dataIndex: 'name',
                key: 'name',
                width: 200,
        },
        {
                title: '权限组描述',
                dataIndex: 'description',
                key: 'description',
                width: 300,
        },
        {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                width: 120,
                filters: [
                        {text: '启用', value: '启用'},
                        {text: '禁用', value: '禁用'},
                ],
        },
        {
                title: '操作',
                key: 'operation',
                fixed: 'right',
                width: 100,
        },
];

// 响应式数据
const viewDrawerVisible = ref(false);
const currentPermissionGroup = ref(null);

// 排序和筛选参数
const queryParams = reactive({
        sorter: {},
        filters: {},
});

// 加载表格数据
const loadTableData = async () => {
        try {
                await permissionStore.fetchPermissionGroups({
                        page: paginationConfig.value.current,
                        pageSize: paginationConfig.value.pageSize
                });
        } catch (error) {
                logger.error('加载数据失败:', error);
        }
};

// 处理表格变化（排序、筛选）
const handleTableChange = (pagination, filters, sorter) => {
        // 更新分页信息
        permissionStore.updatePagination({
                current: pagination.current,
                pageSize: pagination.pageSize
        });

        // 更新排序和筛选信息
        permissionStore.updateQueryParams({
                sorter,
                filters
        });

        // 重新加载数据
        loadTableData();
};

// 处理页码变化
const handlePageChange = (page, pageSize) => {
        permissionStore.updatePagination({
                current: page,
                pageSize: pageSize
        });
        loadTableData();
};

// 处理页面大小变化
const handlePageSizeChange = (_current, size) => {
        permissionStore.updatePagination({
                current: 1,
                pageSize: size
        });
        loadTableData();
};

// 查看权限组详情
const viewPermission = (record) => {
        currentPermissionGroup.value = record;
        viewDrawerVisible.value = true;
};

// 组件挂载时加载数据
onMounted(() => {
        loadTableData();
});
</script>