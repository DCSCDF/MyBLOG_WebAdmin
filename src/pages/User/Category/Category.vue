<!--
  - [Category.vue]
  - -------------------------------------------------------------------------------
  - This software is licensed under the MIT License.
  - However, any distribution or modification must retain this copyright notice.
  - See LICENSE for full terms.
  - -------------------------------------------------------------------------------
  - author: "Jiu Liu"
  - author_contact: "QQ: 3209174373, GitHub: https://github.com/DCSCDF"
  - license: "MIT"
  - license_exception: "Mandatory attribution retention"
  - UpdateTime: 2026/2/22 10:37
  -
 -->
<template>
        <a-card>
                <div class="mb-4 flex items-center justify-between">
                        <div>
                                <h2 class="font-bold text-lg mb-1">文章分类列表</h2>
                                <span class="text-sm text-gray-600">管理文章的分类，支持分页、关键词与隐藏状态筛选。</span>
                        </div>
                        <a-button type="primary" @click="openCreate">新建分类</a-button>
                </div>

                <div class="search-filter-bar mb-4 flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center">
                        <div class="w-full min-w-[200px] max-w-[300px]">
                                <a-input
                                    v-model:value="searchKeyword"
                                    class="w-full"
                                    placeholder="搜索分类名称/描述"
                                    @press-enter="handleSearch">
                                        <template #prefix>
                                                <SearchOutlined/>
                                        </template>
                                </a-input>
                        </div>
                        <div class="flex gap-2">
                                <div class="search-filter-item flex items-center gap-1 rounded-md min-w-0 my-1">
                                        <a-select
                                            v-model:value="searchHidden"
                                            allow-clear
                                            placeholder="是否隐藏">
                                                <a-select-option
                                                    v-for="opt in hiddenFilterOptions"
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

                <!-- 分类表格 -->
                <a-table
                    :columns="columns"
                    :data-source="categoryStore.currentCategories"
                    :loading="categoryStore.loading"
                    :pagination="tablePagination"
                    :scroll="{ x: 900 }"
                    row-key="id"
                    @change="onTableChange">
                        <template #bodyCell="{ column, record }">
                                <template v-if="column.key === 'hidden'">
                                        <a-tag :bordered="false" :color="record.hidden ? 'red' : 'green'">
                                                {{ record.hidden ? '隐藏' : '显示' }}
                                        </a-tag>
                                </template>
                                <template v-else-if="column.key === 'action'">
                                        <a-space>
                                                <a-button size="small" type="link" @click="openEdit(record)">编辑
                                                </a-button>
                                                <a-popconfirm
                                                    cancel-text="取消"
                                                    ok-text="确定"
                                                    title="确定删除该分类吗？删除后将无法恢复。"
                                                    @confirm="onDelete(record)">
                                                        <a-button danger size="small" type="link">删除</a-button>
                                                </a-popconfirm>
                                        </a-space>
                                </template>
                        </template>
                </a-table>
        </a-card>

        <!-- 新建分类弹窗 -->
        <a-modal
            v-model:open="createVisible"
            :confirm-loading="createSubmitting"
            cancel-text="取消"
            ok-text="创建"
            title="新建分类"
            @afterClose="handleCreateAfterClose"
            @cancel="handleCreateCancel"
            @ok="submitCreate">
                <a-form
                    v-if="createForm"
                    :layout="'vertical'"
                    :model="createForm"
                    :rules="createRules">
                        <a-form-item label="分类名称" name="name" required>
                                <a-input v-model:value="createForm.name" placeholder="分类名称，前端展示用"/>
                        </a-form-item>
                        <a-form-item label="分类描述" name="description">
                                <a-textarea
                                    v-model:value="createForm.description"
                                    :rows="2"
                                    placeholder="用于说明该分类的用途（可选）"/>
                        </a-form-item>
                        <a-form-item label="排序" name="sortOrder">
                                <a-input-number v-model:value="createForm.sortOrder" :min="0" style="width: 100%;"/>
                        </a-form-item>
                </a-form>
        </a-modal>

        <!-- 编辑分类弹窗 -->
        <a-modal
            v-model:open="editVisible"
            :confirm-loading="editSubmitting"
            cancel-text="取消"
            ok-text="保存"
            title="编辑分类"
            @afterClose="handleEditAfterClose"
            @cancel="handleEditCancel"
            @ok="submitEdit">
                <a-form
                    v-if="editForm"
                    :layout="'vertical'"
                    :model="editForm"
                    :rules="editRules">
                        <a-form-item label="分类名称" name="name" required>
                                <a-input v-model:value="editForm.name" placeholder="分类名称"/>
                        </a-form-item>
                        <a-form-item label="分类描述" name="description">
                                <a-textarea
                                    v-model:value="editForm.description"
                                    :rows="2"
                                    placeholder="分类描述（可选）"/>
                        </a-form-item>
                        <a-form-item label="排序" name="sortOrder">
                                <a-input-number v-model:value="editForm.sortOrder" :min="0" style="width: 100%;"/>
                        </a-form-item>
                        <a-form-item label="是否隐藏" name="hidden">
                                <a-switch
                                    v-model:checked="editForm.hidden"
                                    :checked-children="'隐藏'"
                                    :un-checked-children="'显示'"/>
                        </a-form-item>
                </a-form>
        </a-modal>
</template>

<script setup>
import {computed, onMounted, ref} from 'vue';
import {message} from 'ant-design-vue';
import {SearchOutlined} from '@ant-design/icons-vue';
import {useCategoryStore} from '../../../stores/category.js';

const categoryStore = useCategoryStore();

// 搜索与筛选（keyword 传接口，hidden 传 0/1 或 true/false；'' 表示不传该筛选）
const searchKeyword = ref('');
const searchHidden = ref(undefined);

const defaultHiddenOptions = [
        {value: 0, label: '显示'},
        {value: 1, label: '隐藏'}
];

/** 隐藏状态下拉选项：来自接口 filterOptions 或默认 */
const hiddenFilterOptions = computed(() => {
        const options = categoryStore.filterOptions?.hidden;
        const useApiOptions = Array.isArray(options) && options.length > 0;
        return useApiOptions ? options : defaultHiddenOptions;
});

// 表格列定义
const columns = [
        {title: 'ID', dataIndex: 'id', key: 'id', width: 70},
        {title: '名称', dataIndex: 'name', key: 'name', width: 160, ellipsis: true},
        {title: '描述', dataIndex: 'description', key: 'description', width: 220, ellipsis: true},
        {title: '排序', dataIndex: 'sortOrder', key: 'sortOrder', width: 80},
        {title: '是否隐藏', key: 'hidden', width: 90},
        {title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 180},
        {title: '更新时间', dataIndex: 'updateTime', key: 'updateTime', width: 180},
        {title: '操作', key: 'action', width: 220, fixed: 'right'}
];

// 表格分页配置
const tablePagination = computed(() => ({
        current: categoryStore.pagination.current,
        pageSize: categoryStore.pagination.pageSize,
        total: categoryStore.pagination.total,
        showSizeChanger: true,
        showTotal: (total) => `共 ${total} 条`
}));

// 弹窗状态与表单
const createVisible = ref(false);
const createSubmitting = ref(false);
const createForm = ref(null);
const editVisible = ref(false);
const editSubmitting = ref(false);
const editForm = ref(null);

const createRules = {
        name: [{required: true, message: '请输入分类名称'}]
};

const editRules = {
        name: [{required: true, message: '请输入分类名称'}]
};

/**
 * 加载分类列表
 */
const loadCategories = () => {
        const params = {
                currentPage: categoryStore.pagination.current,
                pageSize: categoryStore.pagination.pageSize
        };
        
        // 处理关键词参数
        const keywordRaw = searchKeyword.value;
        const hasKeyword = keywordRaw != null && String(keywordRaw).trim().length > 0;
        if (hasKeyword) {
                params.keyword = String(keywordRaw).trim();
        }
        
        // 处理隐藏状态参数
        const hiddenRaw = searchHidden.value;
        const isHiddenValueValid = hiddenRaw != null && hiddenRaw !== '';
        if (isHiddenValueValid) {
                params.hidden = hiddenRaw;
        }
        
        categoryStore.fetchCategories(params).catch((e) => {
                message.error(e?.message || '加载分类列表失败');
        });
};

/**
 * 处理表格变化（分页、排序等）
 */
const onTableChange = (pagination) => {
        categoryStore.updatePagination({
                current: pagination.current,
                pageSize: pagination.pageSize
        });
        loadCategories();
};

/**
 * 处理搜索
 */
const handleSearch = () => {
        const hiddenVal = searchHidden.value;
        const isHiddenValueValid = hiddenVal != null && hiddenVal !== '';
        const hiddenParam = isHiddenValueValid ? hiddenVal : undefined;
        
        categoryStore.updatePagination({current: 1});
        categoryStore.updateQueryParams({
                keyword: searchKeyword.value.trim(),
                hidden: hiddenParam
        });
        loadCategories();
};

/**
 * 处理重置
 */
const handleReset = () => {
        searchKeyword.value = '';
        searchHidden.value = undefined;
        categoryStore.updatePagination({current: 1});
        categoryStore.updateQueryParams({keyword: '', hidden: undefined});
        loadCategories();
};

/**
 * 打开新建弹窗
 */
const openCreate = () => {
        createForm.value = {
                name: '',
                description: '',
                sortOrder: 0
        };
        createVisible.value = true;
};

/**
 * 新建弹窗取消
 */
const handleCreateCancel = () => {
        createVisible.value = false;
};

/**
 * 新建弹窗关闭后清理
 */
const handleCreateAfterClose = () => {
        createForm.value = null;
};

/**
 * 提交新建
 */
const submitCreate = async () => {
        let canProceed = false;
        let errorMessage = '';
        const form = createForm.value;

        if (!form) {
                errorMessage = '表单数据不存在';
        } else {
                const name = form.name ? form.name.trim() : '';
                if (name.length > 0) {
                        canProceed = true;
                } else {
                        errorMessage = '请输入分类名称';
                }
        }

        if (canProceed) {
                createSubmitting.value = true;
                try {
                        await categoryStore.createCategory({
                                name: form.name?.trim(),
                                description: form.description?.trim() || undefined,
                                sortOrder: form.sortOrder ?? 0
                        });
                        message.success('创建成功');
                        createVisible.value = false;
                        createForm.value = null;
                        loadCategories();
                } catch (e) {
                        message.error(e?.message || '创建失败');
                } finally {
                        createSubmitting.value = false;
                }
        } else if (errorMessage) {
                message.warning(errorMessage);
        }
};

/**
 * 打开编辑弹窗
 */
const openEdit = (record) => {
        editForm.value = {
                id: record.id,
                name: record.name,
                description: record.description ?? '',
                sortOrder: record.sortOrder ?? 0,
                hidden: Boolean(record.hidden)
        };
        editVisible.value = true;
};

/**
 * 编辑弹窗取消
 */
const handleEditCancel = () => {
        editVisible.value = false;
};

/**
 * 编辑弹窗关闭后清理
 */
const handleEditAfterClose = () => {
        editForm.value = null;
};

/**
 * 提交编辑
 */
const submitEdit = async () => {
        let canProceed = false;
        let errorMessage = '';
        const form = editForm.value;

        if (!form) {
                errorMessage = '表单数据不存在';
        } else if (!form.id) {
                errorMessage = '分类ID不存在';
        } else {
                const name = form.name ? form.name.trim() : '';
                if (name.length > 0) {
                        canProceed = true;
                } else {
                        errorMessage = '请输入分类名称';
                }
        }

        if (canProceed) {
                editSubmitting.value = true;
                try {
                        await categoryStore.updateCategory(form.id, {
                                id: form.id,
                                name: form.name?.trim(),
                                description: form.description?.trim() || undefined,
                                sortOrder: form.sortOrder ?? 0,
                                hidden: form.hidden
                        });
                        message.success('保存成功');
                        editVisible.value = false;
                        editForm.value = null;
                        loadCategories();
                } catch (e) {
                        message.error(e?.message || '保存失败');
                } finally {
                        editSubmitting.value = false;
                }
        } else if (errorMessage) {
                message.warning(errorMessage);
        }
};

/**
 * 处理删除分类
 */
const onDelete = async (record) => {
        try {
                await categoryStore.deleteCategory(record.id);
                message.success('删除成功');
                loadCategories();
        } catch (e) {
                message.error(e?.message || '删除失败');
        }
};

// 初始加载
onMounted(() => {
        loadCategories();
});
</script>
