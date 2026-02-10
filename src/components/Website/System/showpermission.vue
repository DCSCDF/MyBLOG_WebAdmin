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
                                            class="text-gray-600 text-sm break-all">{{ currentPermission?.sortOrder || 'N/A' }}</span>
                                </div>
                                <a-divider/>
                                <div class="flex flex-col gap-1">
                                        <span class="font-medium text-gray-900 text-sm">权限编码：</span>
                                        <span
                                            class="text-gray-600 text-sm break-all">{{ currentPermission?.code || 'N/A' }}</span>
                                </div>
                                <a-divider/>
                                <div class="flex flex-col gap-1">
                                        <span class="font-medium text-gray-900 text-sm">权限名称：</span>
                                        <span
                                            class="text-gray-600 text-sm break-all">{{ currentPermission?.name || 'N/A' }}</span>
                                </div>
                                <a-divider/>
                                <div class="flex flex-col gap-1">
                                        <span class="font-medium text-gray-900 text-sm">权限描述：</span>
                                        <span class="text-gray-600 text-sm break-all">
                                                {{ currentPermission?.description || '暂无描述' }}
                                        </span>
                                </div>
                                <a-divider/>
                                <div class="flex flex-col gap-1">
                                        <span class="font-medium text-gray-900 text-sm">创建时间：</span>
                                        <span class="text-gray-600 text-sm break-all">
                                                {{ formatDate(currentPermission?.createTime) || 'N/A' }}
                                        </span>
                                </div>
                        </div>

                </a-drawer>
        </a-card>
</template>
<script setup>
import {onMounted, reactive, ref} from 'vue';
import {permissionApi} from "../../../api/user/auth/permission.js";
import logger from "../../../utils/logger.js";


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
                width: 180,
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
                width: 300,
        },
        {
                title: '操作',
                key: 'operation',
                fixed: 'right',
                width: 60,
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

// 获取权限列表数据（分页查询）
const fetchPermissionList = async (currentPage = 1, pageSize = 10) => {
        let result = {data: [], total: 0};

        try {
                // 确保参数不为空
                const current = currentPage || 1;
                const size = pageSize || 10;

                // 构造请求参数，包含分页信息
                const requestData = {
                        currentPage: current,
                        pageSize: size
                };
                logger.log("获取权限数据请求参数:", requestData);
                logger.log("原始传入参数 - currentPage:", currentPage, "pageSize:", pageSize);

                const response = await permissionApi.permissionList(requestData);

                logger.log("权限列表响应:", response);

                // 检查API响应格式
                if (response.code === 200 && response.data) {
                        // 成功获取权限数据 - 处理分页响应格式
                        const paginationData = response.data;
                        const permissionData = paginationData.records || [];
                        const total = paginationData.total || 0;

                        // 为每个权限项添加序号（用于表格显示）
                        const formattedData = permissionData.map((item, index) => ({
                                ...item,
                                key: item.id, // 使用id作为唯一键
                                order: item.sortOrder || (index + 1)
                        }));

                        logger.log("格式化后的权限数据:", formattedData);
                        logger.log("总记录数:", total);

                        result = {
                                data: formattedData,
                                total: total
                        };
                } else {
                        logger.error("API返回错误:", response.msg || '未知错误');
                }

        } catch (error) {
                logger.error('获取权限列表失败:', error);
        }

        return result;
};

// 加载表格数据
const loadTableData = async () => {
        loading.value = true;
        try {
                // 确保分页参数有效
                const current = paginationConfig.current || 1;
                const size = paginationConfig.pageSize || 10;

                const result = await fetchPermissionList(current, size);

                if (result && result.data) {
                        tableData.value = result.data;
                        paginationConfig.total = result.total;
                } else {
                        tableData.value = [];
                        paginationConfig.total = 0;
                }

        } catch (error) {
                logger.error('加载数据失败:', error);
                tableData.value = [];
                paginationConfig.total = 0;
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
        logger.log("组件挂载，分页配置:", paginationConfig);
        loadTableData();
});


</script>