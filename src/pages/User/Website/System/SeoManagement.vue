<!--
  - [SeoManagement.vue]
  - -------------------------------------------------------------------------------
  - This software is licensed under the MIT License.
  - However, any distribution or modification must retain this copyright notice.
  - See LICENSE for full terms.
  - -------------------------------------------------------------------------------
  - author: "Jiu Liu"
  - author_contact: "QQ: 3209174373, GitHub: https://github.com/DCSCDF"
  - license: "MIT"
  - license_exception: "Mandatory attribution retention"
  - UpdateTime: 2026/2/21 00:00
  -
  -->

<template>
        <a-card>
                <div class="mb-4 flex items-center justify-between">
                        <div>
                                <h2 class="font-bold text-lg mb-1">SEO配置列表</h2>
                                <span class="text-sm text-gray-600">管理网站SEO配置信息。</span>
                        </div>
                        <a-button type="primary" @click="handleCreate">
                                <template #icon>
                                        <PlusOutlined/>
                                </template>
                                新建SEO配置
                        </a-button>
                </div>

                <div class="search-filter-bar mb-4 flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center">
                        <div class="w-full min-w-[200px] max-w-[300px]">
                                <a-input
                                    v-model:value="searchKeyword"
                                    class="w-full"
                                    placeholder="搜索页面类型/标题/关键词/描述"
                                    @press-enter="handleSearch">
                                        <template #prefix>
                                                <SearchOutlined/>
                                        </template>
                                </a-input>
                        </div>
                        <div class="flex gap-2">
                                <div class="search-filter-item flex items-center gap-1 rounded-md min-w-0 my-1">
                                        <a-select
                                            v-model:value="searchIsSystem"
                                            allow-clear
                                            placeholder="是否系统内置"
                                            style="width: 150px;">
                                                <a-select-option
                                                    v-for="opt in isSystemFilterOptions"
                                                    :key="opt.value"
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

                <!-- SEO配置表格 -->
                <a-table
                    :columns="columns"
                    :data-source="seoStore.currentSeoList"
                    :loading="seoStore.loading"
                    :pagination="tablePagination"
                    :scroll="{ x: 1400 }"
                    row-key="id"
                    @change="onTableChange">
                        <template #bodyCell="{ column, record }">
                                <template v-if="column.key === 'pageType'">
                                        <a-tag>{{ record.pageType || '-' }}</a-tag>
                                </template>
                                <template v-else-if="column.key === 'isSystem'">
                                        <a-tag :bordered="false" :color="record.isSystem ? 'blue' : 'default'">
                                                {{ record.isSystem ? '是' : '否' }}
                                        </a-tag>
                                </template>
                                <template v-else-if="column.key === 'action'">
                                        <a-space>
                                                <a-button size="small" type="link" @click="openDetail(record)">查看
                                                </a-button>
                                                <a-button size="small" type="link" @click="openEdit(record)">编辑
                                                </a-button>
                                                <a-popconfirm
                                                    v-if="record.isSystem === false"
                                                    cancel-text="取消"
                                                    ok-text="确定"
                                                    title="确定删除该SEO配置吗？"
                                                    @confirm="onDelete(record)">
                                                        <a-button danger size="small" type="link">删除</a-button>
                                                </a-popconfirm>
                                                <a-tooltip v-else title="系统内置SEO配置不可删除">
                                                        <a-button disabled danger size="small" type="link">删除</a-button>
                                                </a-tooltip>
                                        </a-space>
                                </template>
                        </template>
                </a-table>
        </a-card>

        <!-- SEO配置详情抽屉 -->
        <SeoDetailDrawer
            v-model:open="detailVisible"
            :seo="selectedSeo"
            @close="selectedSeo = null"/>

        <!-- 编辑/创建SEO配置弹窗 -->
        <SeoEditModal
            ref="seoEditModalRef"
            v-model:open="editVisible"
            :seo="selectedSeo"
            :is-create="isCreate"
            @cancel="handleEditCancel"
            @submit="handleEditSubmit"/>
</template>

<script setup>
import {computed, onMounted, ref} from 'vue';
import {message} from 'ant-design-vue';
import {PlusOutlined, SearchOutlined} from '@ant-design/icons-vue';
import {useSeoStore} from '../../../../stores/seo.js';
import SeoDetailDrawer from '../../../../components/Website/System/SeoDetailDrawer.vue';
import SeoEditModal from '../../../../components/Website/System/SeoEditModal.vue';

const seoStore = useSeoStore();

// 搜索与筛选（仅关键词 + 是否系统内置）
const searchKeyword = ref('');
const searchIsSystem = ref(undefined);

/** 是否系统内置下拉选项：来自接口 filterOptions 或默认 */
const isSystemFilterOptions = computed(() => {
        const fromApi = seoStore.filterOptions?.isSystem;
        return fromApi && fromApi.length > 0 ? fromApi : [
                {value: 0, label: '否'},
                {value: 1, label: '是'}
        ];
});

// 表格列定义
const columns = [
        {title: 'ID', dataIndex: 'id', key: 'id', width: 80},
        {title: '页面类型', key: 'pageType', width: 100},
        {title: '页面ID', dataIndex: 'pageId', key: 'pageId', width: 100, ellipsis: true},
        {title: 'SEO标题', dataIndex: 'title', key: 'title', width: 200, ellipsis: true},
        {title: '关键词', dataIndex: 'keywords', key: 'keywords', width: 200, ellipsis: true},
        {title: '描述', dataIndex: 'description', key: 'description', width: 250, ellipsis: true},
        {title: '是否系统内置', key: 'isSystem', width: 120},
        {title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 180},
        {title: '操作', key: 'action', width: 200, fixed: 'right'}
];

// 表格分页配置
const tablePagination = computed(() => ({
        current: seoStore.pagination.current,
        pageSize: seoStore.pagination.pageSize,
        total: seoStore.pagination.total,
        showSizeChanger: true,
        showTotal: (total) => `共 ${total} 条`
}));

// 抽屉和弹窗状态
const detailVisible = ref(false);
const editVisible = ref(false);
const selectedSeo = ref(null);
const isCreate = ref(false);
const seoEditModalRef = ref(null);

/**
 * 加载SEO配置列表
 */
const loadSeoList = () => {
        const params = {
                currentPage: seoStore.pagination.current,
                pageSize: seoStore.pagination.pageSize
        };

        if (searchKeyword.value) {
                params.keyword = searchKeyword.value.trim();
        }
        if (searchIsSystem.value != null && searchIsSystem.value !== '') {
                params.isSystem = searchIsSystem.value;
        }

        seoStore.fetchSeoList(params).catch((e) => {
                message.error(e?.message || '加载SEO配置列表失败');
        });
};

/**
 * 处理表格变化（分页、排序等）
 */
const onTableChange = (pagination) => {
        seoStore.updatePagination({
                current: pagination.current,
                pageSize: pagination.pageSize
        });
        loadSeoList();
};

/**
 * 处理搜索
 */
const handleSearch = () => {
        seoStore.updatePagination({current: 1});
        seoStore.updateQueryParams({
                keyword: searchKeyword.value.trim(),
                isSystem: (searchIsSystem.value == null || searchIsSystem.value === '') ? undefined : searchIsSystem.value
        });
        loadSeoList();
};

/**
 * 处理重置
 */
const handleReset = () => {
        searchKeyword.value = '';
        searchIsSystem.value = undefined;
        seoStore.updatePagination({current: 1});
        seoStore.updateQueryParams({keyword: '', isSystem: undefined});
        loadSeoList();
};

/**
 * 打开详情抽屉
 */
const openDetail = (record) => {
        selectedSeo.value = record;
        detailVisible.value = true;
};

/**
 * 打开创建弹窗
 */
const handleCreate = () => {
        selectedSeo.value = null;
        isCreate.value = true;
        editVisible.value = true;
};

/**
 * 打开编辑弹窗（先拉取SEO配置详情）
 */
const openEdit = (record) => {
        // 统一处理逻辑，确保只有一个返回点
        let shouldFetchDetail = record && record.id;

        if (shouldFetchDetail) {
                seoStore.fetchSeoById(record.id).then((detail) => {
                        selectedSeo.value = detail || record;
                        isCreate.value = false;
                        editVisible.value = true;
                }).catch(() => {
                        selectedSeo.value = record;
                        isCreate.value = false;
                        editVisible.value = true;
                });
        } else {
                selectedSeo.value = record;
                isCreate.value = false;
                editVisible.value = true;
        }
};

/**
 * 处理编辑取消
 */
const handleEditCancel = () => {
        selectedSeo.value = null;
        isCreate.value = false;
};

/**
 * 处理编辑/创建提交
 */
const handleEditSubmit = async (formData) => {
        let hasError = false;
        let errorMessage = '';
        
        try {
                // 检查更新时的ID是否存在
                const isCreateMode = isCreate.value;
                const isUpdateMode = !isCreateMode;
                const hasValidId = selectedSeo.value && selectedSeo.value.id;
                
                if (isUpdateMode && !hasValidId) {
                        hasError = true;
                        errorMessage = 'SEO配置ID不存在';
                }

                if (!hasError) {
                        // 执行创建或更新操作
                        const result = isCreateMode 
                                ? await seoStore.createSeo(formData)
                                : await seoStore.updateSeo(selectedSeo.value.id, formData);

                        // 检查操作结果
                        const operationFailed = result === false;
                        if (operationFailed) {
                                hasError = true;
                                errorMessage = isCreateMode ? '创建失败' : '保存失败';
                        } else {
                                message.success(isCreateMode ? '创建成功' : '保存成功');
                                editVisible.value = false;
                                selectedSeo.value = null;
                                isCreate.value = false;
                                loadSeoList();
                                // 调用子组件的刷新方法
                                if (seoEditModalRef.value) {
                                        seoEditModalRef.value.handleParentSuccess();
                                }
                        }
                }
                
                if (hasError) {
                        message.error(errorMessage);
                }
        } catch (e) {
                // 捕获异常情况（如网络错误、API抛出的错误等）
                message.error(e?.message || (isCreate.value ? '创建失败' : '保存失败'));
        }
};

/**
 * 处理删除SEO配置
 */
const onDelete = async (record) => {
        try {
                await seoStore.deleteSeo(record.id);
                message.success('删除成功');
                loadSeoList();
        } catch (e) {
                message.error(e?.message || '删除失败');
        }
};

// 初始加载
onMounted(() => {
        loadSeoList();
});
</script>
