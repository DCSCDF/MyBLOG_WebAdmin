<!--
  - [showpermission.vue]
  - -------------------------------------------------------------------------------
  - This software is licensed under the MIT License.
  - However, any distribution or modification must retain this copyright notice.
  - See LICENSE for full terms.
  - -------------------------------------------------------------------------------
  - author: "Jiu Liu"
  - author_contact: "QQ: 3209174373, GitHub: https://github.com/DCSCDF"
  - license: "MIT"
  - license_exception: "Mandatory attribution retention"
  - UpdateTime: 2026/2/3 22:48
  -
  -->
<template>
        <a-card>
                <div class="mb-4 flex items-center justify-between">
                        <div>
                                <h2 class="font-bold text-lg mb-1">权限列表</h2>
                                <span class="text-sm text-gray-600">(当前仅作为查看权限用，无法修改。)</span>
                        </div>
                        <a-radio-group v-model:value="viewMode" size="small">
                                <a-radio-button value="tree">
                                        <AppstoreOutlined /> 树形
                                </a-radio-button>
                                <a-radio-button value="list">
                                        <UnorderedListOutlined /> 列表
                                </a-radio-button>
                        </a-radio-group>
                </div>

                <!-- 树形展示 -->
                <div v-if="viewMode === 'tree'">
                        <a-tree
                            :tree-data="permissionTreeData"
                            :field-names="{ children: 'children', title: 'name', key: 'id' }"
                            :show-line="{ showLeafIcon: false }"
                            :default-expand-all="true"
                            block-node>
                                <template #title="{ name, code, description }">
                                        <div class="flex items-center justify-between w-full pr-4">
                                                <div class="flex flex-col">
                                                        <span class="font-medium">{{ name }}</span>
                                                        <span class="text-xs text-gray-500">{{ code }}</span>
                                                </div>
                                                <a-button size="small" type="link" @click.stop="viewPermissionById(code)">查看</a-button>
                                        </div>
                                </template>
                        </a-tree>
                        <div v-if="!permissionTreeData.length && !loading" class="text-gray-400 text-sm py-8 text-center">暂无权限数据</div>
                </div>

                <!-- 列表展示 -->
                <a-table
                    v-else
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


                <!-- 查看权限详情抽屉 -->
                <a-drawer
                    v-model:open="viewDrawerVisible"
                    :bodyStyle="{ backgroundColor: 'transparent', border: 'none' }"
                    :destroyOnClose="true"
                    :drawerStyle="{ backgroundColor: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)' }"
                    :footerStyle="{ textAlign: 'right' }"
                    :headerStyle="{ backgroundColor: 'transparent', border: 'none' }"
                    :width="320"
                    placement="right"
                    title="权限详情">
                        <div class="flex flex-col ">
                                <div class="flex flex-col gap-1">
                                        <span class="font-medium text-gray-900 text-sm">排序顺序：</span>
                                        <span
                                            class="text-gray-600 text-sm break-all">{{
                                                        currentPermission?.sortOrder
                                                }}</span>
                                </div>
                                <a-divider/>
                                <div class="flex flex-col gap-1">
                                        <span class="font-medium text-gray-900 text-sm">权限编码：</span>
                                        <span
                                            class="text-gray-600 text-sm break-all">{{ currentPermission?.code }}</span>
                                </div>
                                <a-divider/>
                                <div class="flex flex-col gap-1">
                                        <span class="font-medium text-gray-900 text-sm">权限名称：</span>
                                        <span
                                            class="text-gray-600 text-sm break-all">{{ currentPermission?.name }}</span>
                                </div>
                                <a-divider/>
                                <div class="flex flex-col gap-1">
                                        <span class="font-medium text-gray-900 text-sm">权限描述：</span>
                                        <span class="text-gray-600 text-sm break-all">
                                                {{ currentPermission?.description }}
                                        </span>
                                </div>
                                <a-divider/>
                                <div class="flex flex-col gap-1">
                                        <span class="font-medium text-gray-900 text-sm">创建时间：</span>
                                        <span class="text-gray-600 text-sm break-all">
                                                {{ formatDate(currentPermission?.createTime) }}
                                        </span>
                                </div>
                        </div>

                </a-drawer>
        </a-card>
</template>
<script setup>
import {computed, onMounted, ref} from 'vue';
import {AppstoreOutlined, UnorderedListOutlined} from '@ant-design/icons-vue';
import {usePermissionStore} from '../../../stores/permission.js';
import logger from "../../../utils/logger.js";
import {buildPermissionTree} from '../../../utils/permissionTree.js';

const permissionStore = usePermissionStore();

// 使用 store 的状态
const tableData = computed(() => permissionStore.currentPermissions);
const loading = computed(() => permissionStore.loading);
const paginationConfig = computed(() => permissionStore.pagination);


// 表格列配置
const columns = [
        // {
        //         title: '排序顺序',
        //         dataIndex: 'order',
        //         key: 'order',
        //         width: 70,
        // },
        {
                title: '权限编码',
                dataIndex: 'code',
                key: 'code',
                width: 160,
        },
        {
                title: '权限名称',
                dataIndex: 'name',
                key: 'name',
                width: 120,
        },
        {
                title: '权限描述',
                dataIndex: 'description',
                key: 'description',
                width: 200,
        },
        {
                title: '操作',
                key: 'operation',
                fixed: 'right',
                width: 60,
        },
];

// 响应式数据
const viewDrawerVisible = ref(false);
const currentPermission = ref(null);
const viewMode = ref('tree'); // 'tree' 或 'list'

// 计算树形数据
const permissionTreeData = computed(() => {
	if (viewMode.value === 'tree') {
		return buildPermissionTree(permissionStore.currentPermissions || []);
	}
	return [];
});


// 加载表格数据
const loadTableData = async () => {
        try {
                await permissionStore.fetchPermissions({
                        currentPage: paginationConfig.value.current,
                        pageSize: paginationConfig.value.pageSize
                });
        } catch (error) {
                logger.error('加载数据失败:', error);
        }
};

// 处理表格变化（排序、筛选、分页）
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

// 查看权限详情
const viewPermission = (record) => {
	currentPermission.value = record;
	viewDrawerVisible.value = true;
};

// 根据code查找权限并查看详情
const viewPermissionById = (code) => {
	const permission = permissionStore.currentPermissions.find(p => p.code === code);
	if (permission) {
		viewPermission(permission);
	}
};


// 格式化日期显示
const formatDate = (dateString) => {
        let result = '';

        if (dateString) {
                try {
                        const date = new Date(dateString);
                        result = date.toLocaleString('zh-CN', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit'
                        });
                } catch (error) {
                        logger.error('日期格式化失败:', error);
                        result = dateString;
                }
        }

        return result;
};

// 组件挂载时加载数据
onMounted(() => {
        logger.log("组件挂载，分页配置:", paginationConfig.value);
        loadTableData();
});


</script>