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
                <div class="mb-4">
                        <h2 class="font-bold text-lg mb-1">权限列表</h2>
                        <span class="text-sm text-gray-600">(当前仅作为查看权限用，无法修改。)</span>
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
                                            class="text-gray-600 text-sm break-all">{{ currentPermission.order }}</span>
                                </div>
                                <a-divider/>
                                <div class="flex flex-col gap-1">
                                        <span class="font-medium text-gray-900 text-sm">权限编码：</span>
                                        <span
                                            class="text-gray-600 text-sm break-all">{{ currentPermission.code }}</span>
                                </div>
                                <a-divider/>
                                <div class="flex flex-col gap-1">
                                        <span class="font-medium text-gray-900 text-sm">权限名称：</span>
                                        <span
                                            class="text-gray-600 text-sm break-all">{{ currentPermission.name }}</span>
                                </div>
                                <a-divider/>
                                <div class="flex flex-col gap-1">
                                        <span class="font-medium text-gray-900 text-sm">权限描述：</span>
                                        <span class="text-gray-600 text-sm break-all">{{
                                                        currentPermission.description
                                                }}</span>
                                </div>
                                <div v-if="currentPermission.status" class="flex flex-col gap-1">
                                        <span class="font-medium text-gray-900 text-sm">状态：</span>
                                        <a-tag :color="currentPermission.status === '启用' ? 'green' : 'red'">
                                                {{ currentPermission.status }}
                                        </a-tag>
                                </div>
                        </div>

                </a-drawer>
        </a-card>
</template>
<script setup>
import {onMounted, reactive, ref} from 'vue';

// 表格列配置
const columns = [
        {
                title: '排序顺序',
                dataIndex: 'order',
                key: 'order',
                width: 120,
        },
        {
                title: '权限编码',
                dataIndex: 'code',
                key: 'code',
                width: 180,
        },
        {
                title: '权限名称',
                dataIndex: 'name',
                key: 'name',
                width: 200,
        },
        {
                title: '权限描述',
                dataIndex: 'description',
                key: 'description',
                width: 300,
        },
        {
                title: '操作',
                key: 'operation',
                fixed: 'right',
                width: 100,
        },
];

// 响应式数据
const tableData = ref([]);
const loading = ref(false);
const viewDrawerVisible = ref(false);
const currentPermission = ref(null);

// 分页配置
const paginationConfig = reactive({
        current: 1,
        pageSize: 10,
        total: 0,
        showSizeChanger: true,

        showTotal: (total) => `共 ${total} 条记录`,
        pageSizeOptions: ['10', '20', '50', '100'],
        onChange: (page, pageSize) => {
                handlePageChange(page, pageSize);
        },
        onShowSizeChange: (current, size) => {
                handlePageSizeChange(current, size);
        },
});

// 排序和筛选参数
const queryParams = reactive({
        sorter: {},
        filters: {},
});

// 模拟数据生成
const generateMockData = (page = 1, pageSize = 10) => {
        const data = [];
        const total = 234; // 模拟总数据量
        const startIndex = (page - 1) * pageSize;
        const endIndex = Math.min(startIndex + pageSize, total);

        for (let i = startIndex; i < endIndex; i++) {
                data.push({
                        key: i,
                        order: i + 1,
                        code: `PERMISSION_${String(i + 1).padStart(4, '0')}`,
                        name: `权限名称 ${i + 1}`,
                        description: `这是第${i + 1}个权限的详细描述信息，用于说明该权限的具体作用和使用范围。`,

                });
        }

        return {data, total};
};

// 加载表格数据
const loadTableData = async () => {
        loading.value = true;
        try {
                // 模拟API调用延迟
                await new Promise(resolve => setTimeout(resolve, 500));

                const {data, total} = generateMockData(
                    paginationConfig.current,
                    paginationConfig.pageSize
                );

                tableData.value = data;
                paginationConfig.total = total;
        } catch (error) {
                console.error('加载数据失败:', error);
        } finally {
                loading.value = false;
        }
};

// 处理表格变化（排序、筛选）
const handleTableChange = (pagination, filters, sorter) => {
        // 更新分页信息
        paginationConfig.current = pagination.current;
        paginationConfig.pageSize = pagination.pageSize;

        // 更新排序信息
        queryParams.sorter = sorter;

        // 更新筛选信息
        queryParams.filters = filters;

        // 重新加载数据
        loadTableData();
};

// 处理页码变化
const handlePageChange = (page, pageSize) => {
        paginationConfig.current = page;
        paginationConfig.pageSize = pageSize;
        loadTableData();
};

// 处理页面大小变化
const handlePageSizeChange = (_current, size) => {
        paginationConfig.current = 1; // 重置到第一页
        paginationConfig.pageSize = size;
        loadTableData();
};

// 查看权限详情
const viewPermission = (record) => {
        currentPermission.value = record;
        viewDrawerVisible.value = true;
};

// 组件挂载时加载数据
onMounted(() => {
        loadTableData();
});
</script>