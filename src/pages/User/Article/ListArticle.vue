<!--
  - [ListArticle.vue]
  - -------------------------------------------------------------------------------
  - This software is licensed under the MIT License.
  - However, any distribution or modification must retain this copyright notice.
  - See LICENSE for full terms.
  - -------------------------------------------------------------------------------
  - author: "Jiu Liu"
  - author_contact: "QQ: 3209174373, GitHub: https://github.com/DCSCDF"
  - license: "MIT"
  - license_exception: "Mandatory attribution retention"
  - UpdateTime: 2026/3/5
  -
  -->
<template>
        <a-card>
                <div class="mb-4 flex items-center justify-between">
                        <div>
                                <h2 class="font-bold text-lg mb-1">文章管理</h2>
                                <span class="text-sm text-gray-600">管理您的文章，支持分页、关键词与状态筛选。</span>
                        </div>
                        <a-button type="primary" @click="goToCreate">新建文章</a-button>
                </div>

                <div class="search-filter-bar mb-4 flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center">
                        <div class="w-full min-w-[200px] max-w-[300px]">
                                <a-input
                                    v-model:value="searchKeyword"
                                    class="w-full"
                                    placeholder="搜索文章标题"
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

                <!-- 文章表格 -->
                <a-table
                    :columns="columns"
                    :data-source="blogStore.currentArticles"
                    :loading="blogStore.loading"
                    :pagination="tablePagination"
                    :scroll="{ x: 1100 }"
                    row-key="id"
                    @change="onTableChange">
                        <template #bodyCell="{ column, record }">
                                <template v-if="column.key === 'title'">
                                        <div class="flex items-center gap-2">
                                                <a-avatar
                                                    v-if="record.coverImage"
                                                    :size="40"
                                                    :src="record.coverImage"
                                                    shape="square"/>
                                                <a-avatar v-else :size="40" shape="square">
                                                        <template #icon>
                                                                <FileTextOutlined/>
                                                        </template>
                                                </a-avatar>
                                                <div class="flex flex-col">
                                                        <a class="font-medium hover:text-blue-500"
                                                           @click="openEdit(record)">
                                                                {{ record.title }}
                                                        </a>
                                                        <span v-if="record.summary"
                                                              class="text-xs text-gray-400 truncate max-w-[200px]">
                                                                {{ record.summary }}
                                                        </span>
                                                </div>
                                        </div>
                                </template>
                                <template v-else-if="column.key === 'tags'">
                                        <a-space v-if="record.tags" :size="4">
                                                <a-tag v-for="(tag, index) in record.tags.split(',').slice(0, 2)"
                                                       :key="index" color="blue">
                                                        {{ tag }}
                                                </a-tag>
                                                <a-tag v-if="record.tags.split(',').length >2" color="default">
                                                        +{{ record.tags.split(',').length - 2 }}
                                                </a-tag>
                                        </a-space>
                                        <span v-else class="text-gray-400">-</span>
                                </template>
                                <template v-else-if="column.key === 'commentCount'">
                                        <span>{{ record.commentCount || 0 }}</span>
                                </template>
                                <template v-else-if="column.key === 'isHidden'">
                                        <a-tag :bordered="false" :color="record.isHidden ? 'red' : 'green'">
                                                {{ record.isHidden ? '隐藏' : '显示' }}
                                        </a-tag>
                                </template>
                                <template v-else-if="column.key === 'action'">
                                        <a-space>
                                                <a-button size="small" type="link" @click="toggleHidden(record)">
                                                        {{ record.isHidden ? '显示' : '隐藏' }}
                                                </a-button>
                                                <a-button size="small" type="link" @click="openEdit(record)">编辑
                                                </a-button>
                                                <a-popconfirm
                                                    cancel-text="取消"
                                                    ok-text="确定"
                                                    title="确定删除该文章吗？删除后将无法恢复。"
                                                    @confirm="onDelete(record)">
                                                        <a-button danger size="small" type="link">删除</a-button>
                                                </a-popconfirm>
                                        </a-space>
                                </template>
                        </template>
                </a-table>
        </a-card>

        <!-- 编辑文章内容弹窗 -->
        <a-modal
            v-model:open="contentEditVisible"
            :footer="null"
            cancel-text="取消"
            title="编辑文章内容"
            width="90%"
            @afterClose="handleContentEditAfterClose"
            @cancel="handleContentEditCancel">
                <div v-if="editForm" class="flex flex-col gap-4">
                        <!-- 标题显示 -->
                        <div class="text-lg font-medium text-gray-700">
                                {{ editForm.title }}
                        </div>

                        <!-- MD编辑器 -->

                        <MdEditor
                            v-model="editForm.content"
                            :toolbars="toolbars"
                            language="zh-CN"
                            preview
                            @onHtmlChanged="handleHtmlChange"/>


                        <!-- 按钮 -->
                        <div class="flex justify-end gap-2">
                                <a-button @click="handleContentEditCancel">取消</a-button>
                                <a-button type="primary" @click="goToInfoEdit">下一步，编辑信息</a-button>
                        </div>
                </div>
        </a-modal>

        <!-- 编辑文章信息弹窗 -->
        <a-modal
            v-model:open="infoEditVisible"
            :confirm-loading="infoSubmitting"
            :footer="null"
            cancel-text="取消"
            title="编辑文章信息"
            width="600px"
            @afterClose="handleInfoEditAfterClose"
            @cancel="handleInfoEditCancel">
                <a-form
                    v-if="editForm"
                    :layout="'vertical'">
                        <a-form-item label="文章标题" required>
                                <a-input v-model:value="editForm.title" :maxlength="200"
                                         placeholder="请输入文章标题"/>
                        </a-form-item>
                        <a-form-item label="文章分类">
                                <a-select
                                    v-model:value="editForm.categoryId"
                                    allow-clear
                                    placeholder="选择分类">
                                        <a-select-option v-for="cat in categoryList" :key="cat.id"
                                                         :value="cat.id">
                                                {{ cat.name }}
                                        </a-select-option>
                                </a-select>
                        </a-form-item>
                        <a-form-item label="文章摘要">
                                <a-textarea
                                    v-model:value="editForm.summary"
                                    :maxlength="200"
                                    :rows="3"
                                    placeholder="请输入文章摘要（可选）"
                                    show-count/>
                        </a-form-item>
                        <a-form-item label="封面图片URL">
                                <a-input
                                    v-model:value="editForm.coverImage"
                                    placeholder="请输入封面图片URL（可选），支持 http/https 链接"/>
                        </a-form-item>
                        <a-form-item label="文章标签">
                                <a-input
                                    v-model:value="editForm.tags"
                                    placeholder="多个标签用逗号分隔，如：前端,后端,Java"/>
                        </a-form-item>

                        <!-- 按钮 -->
                        <div class="flex justify-end gap-2 mt-4">
                                <a-button @click="handleInfoEditCancel">取消</a-button>
                                <a-button :loading="infoSubmitting" type="primary" @click="submitInfoEdit">保存
                                </a-button>
                        </div>
                </a-form>
        </a-modal>
</template>

<script setup>
import {computed, onMounted, ref} from 'vue';
import {useRouter} from 'vue-router';
import {message} from 'ant-design-vue';
import {FileTextOutlined, SearchOutlined} from '@ant-design/icons-vue';
import {MdEditor} from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import {useBlogStore} from '../../../stores/blog.js';
import {useCategoryStore} from '../../../stores/category.js';

const router = useRouter();
const blogStore = useBlogStore();
const categoryStore = useCategoryStore();

// 搜索与筛选
const searchKeyword = ref('');
const searchHidden = ref(undefined);

// 筛选项配置
const defaultHiddenOptions = [
        {value: false, label: '显示'},
        {value: true, label: '隐藏'}
];

/** 隐藏状态下拉选项：来自接口 filterOptions 或默认 */
const hiddenFilterOptions = computed(() => {
        const options = blogStore.filterOptions?.isHidden;
        const useApiOptions = Array.isArray(options) && options.length > 0;
        return useApiOptions ? options : defaultHiddenOptions;
});

// 表格列定义
const columns = [
        {title: 'ID', dataIndex: 'id', key: 'id', width: 70},
        {title: '文章', key: 'title', width: 280},
        {title: '标签', key: 'tags', width: 160},
        {title: '评论数', key: 'commentCount', width: 80},

        {title: '隐藏', key: 'isHidden', width: 70},

        {title: '操作', key: 'action', width: 150, fixed: 'right'}
];

// 表格分页配置
const tablePagination = computed(() => ({
        current: blogStore.pagination.current,
        pageSize: blogStore.pagination.pageSize,
        total: blogStore.pagination.total,
        showSizeChanger: true,
        showTotal: (total) => `共 ${total} 条`
}));

// 弹窗状态与表单
const contentEditVisible = ref(false);
const infoEditVisible = ref(false);
const infoSubmitting = ref(false);
const editForm = ref(null);

// 编辑器工具栏配置
const toolbars = [
        'bold',
        'underline',
        'italic',
        '-',
        'title',
        'strikeThrough',
        'sub',
        'sup',
        'quote',
        'unorderedList',
        'orderedList',
        'task',
        '-',
        'codeRow',
        'code',
        'link',
        'image',
        'table',
        'mermaid',
        'katex',
        '-',
        'revoke',
        'next',
        '=',
        'pageFullscreen',
        'fullscreen',
        'preview',
        'previewOnly',
        'htmlPreview',
        'catalog',
];

// 分类列表
const categoryList = ref([]);

// 缓存编辑时的 HTML 内容
let cachedHtmlContent = '';

/**
 * 检查值是否有效（非 undefined、非 null、非空字符串）
 * @param {any} value - 待检查的值
 * @returns {boolean} 如果值有效返回 true
 */
const isValidValue = (value) => {
        return value !== undefined && value !== null && value !== '';
};

/**
 * 加载文章列表
 */
const loadArticles = () => {
        const params = {
                currentPage: blogStore.pagination.current,
                pageSize: blogStore.pagination.pageSize
        };

        // 处理关键词参数
        const keywordRaw = searchKeyword.value;
        const hasKeyword = keywordRaw != null && String(keywordRaw).trim().length > 0;
        if (hasKeyword) {
                params.keyword = String(keywordRaw).trim();
        }

        // 处理隐藏状态参数
        const hiddenRaw = searchHidden.value;
        if (isValidValue(hiddenRaw)) {
                params.isHidden = hiddenRaw;
        }

        blogStore.fetchArticles(params).catch((e) => {
                message.error(e?.message || '加载文章列表失败');
        });
};

/**
 * 处理表格变化（分页、排序等）
 */
const onTableChange = (pagination) => {
        blogStore.updatePagination({
                current: pagination.current,
                pageSize: pagination.pageSize
        });
        loadArticles();
};

/**
 * 处理搜索
 */
const handleSearch = () => {
        blogStore.updatePagination({current: 1});
        blogStore.updateQueryParams({
                keyword: searchKeyword.value.trim(),
                isHidden: searchHidden.value
        });
        loadArticles();
};

/**
 * 处理重置
 */
const handleReset = () => {
        searchKeyword.value = '';
        searchHidden.value = undefined;
        blogStore.updatePagination({current: 1});
        blogStore.updateQueryParams({
                keyword: '',
                isHidden: undefined
        });
        loadArticles();
};

/**
 * 跳转到新建文章页面
 */
const goToCreate = () => {
        router.push('/user/article/create');
};

/**
 * 加载分类列表
 */
const loadCategories = async () => {
        try {
                await categoryStore.fetchCategories({currentPage: 1, pageSize: 100});
                categoryList.value = categoryStore.categories || [];
        } catch (e) {
                console.error('加载分类列表失败:', e);
        }
};

/**
 * 打开编辑弹窗（先打开内容编辑弹窗）
 */
const openEdit = async (record) => {
        try {
                // 获取文章详情
                const detail = await blogStore.fetchArticleDetail(record.id);
                if (detail) {
                        editForm.value = {
                                id: detail.id,
                                title: detail.title || '',
                                categoryId: detail.categoryId || null,
                                summary: detail.summary || '',
                                content: detail.content || '',
                                coverImage: detail.coverImage || '',
                                tags: detail.tags || ''
                        };
                        cachedHtmlContent = detail.htmlContent || '';
                        contentEditVisible.value = true;
                }
        } catch (e) {
                message.error(e?.message || '获取文章详情失败');
        }
};

// /**
//  * 处理编辑器内容变化
//  */
// const handleEditorChange = () => {
//         // 可以在这里处理内容变化
// };

/**
 * 处理 HTML 内容变化
 */
const handleHtmlChange = (html) => {
        cachedHtmlContent = html;
};

/**
 * 内容编辑弹窗取消
 */
const handleContentEditCancel = () => {
        contentEditVisible.value = false;
};

/**
 * 内容编辑弹窗关闭后清理
 */
const handleContentEditAfterClose = () => {
        // 不清理表单，保留数据用于信息编辑
};

/**
 * 跳转到信息编辑弹窗
 */
const goToInfoEdit = () => {
        // 关闭内容编辑弹窗，打开信息编辑弹窗
        contentEditVisible.value = false;
        infoEditVisible.value = true;
};

/**
 * 信息编辑弹窗取消
 */
const handleInfoEditCancel = () => {
        infoEditVisible.value = false;
};

/**
 * 信息编辑弹窗关闭后清理
 */
const handleInfoEditAfterClose = () => {
        editForm.value = null;
        cachedHtmlContent = '';
        blogStore.clearCurrentArticle();
};

/**
 * 提交信息编辑（包含内容一起提交）
 */
const submitInfoEdit = async () => {
        const form = editForm.value;
        let shouldProceed = true;

        // 检查表单数据是否存在
        if (!form) {
                message.warning('表单数据不存在');
                shouldProceed = false;
        } else {
                // 验证标题
                if (!form.title || form.title.trim() === '') {
                        message.warning('请输入文章标题');
                        shouldProceed = false;
                } else if (form.summary && form.summary.length > 200) {
                        // 验证摘要
                        message.warning('文章摘要不能超过 200 字符');
                        shouldProceed = false;
                } else if (form.coverImage) {
                        // 验证封面图片 URL
                        const url = form.coverImage.trim();
                        if (url && !/^https?:\/\/[\w\-]+(\.[\w\-]+)+[/#?]?.*$/.test(url)) {
                                message.warning('封面图片 URL 格式无效，请输入有效的 http/https 链接');
                                shouldProceed = false;
                        }
                }
        }

        // 只有在验证通过时才执行提交逻辑
        if (shouldProceed) {
                infoSubmitting.value = true;
                try {
                        // 同时更新内容部分和信息部分
                        // 注意：需要将空字符串传给后端，而不是 undefined
                        await blogStore.updateArticle(form.id, {
                                title: form.title.trim(),
                                categoryId: form.categoryId || null,
                                summary: form.summary?.trim() || '',
                                content: form.content || '',
                                htmlContent: cachedHtmlContent || '',
                                coverImage: form.coverImage?.trim() || '',
                                tags: form.tags?.trim() || ''
                        });
                        message.success('文章更新成功');
                        infoEditVisible.value = false;
                        loadArticles();
                } catch (e) {
                        message.error(e?.message || '更新文章失败');
                } finally {
                        infoSubmitting.value = false;
                }
        }
};

/**
 * 切换文章隐藏状态
 */
const toggleHidden = async (record) => {
        const newValue = !record.isHidden;

        try {
                await blogStore.updateArticleStatus(record.id, {isHidden: newValue});
                message.success(newValue ? '文章已隐藏' : '文章已显示');
                loadArticles();
        } catch (e) {
                message.error(e?.message || '更新状态失败');
        }
};

/**
 * 处理删除文章
 */
const onDelete = async (record) => {
        try {
                await blogStore.deleteArticle(record.id);
                message.success('删除成功');
                loadArticles();
        } catch (e) {
                message.error(e?.message || '删除失败');
        }
};

// 初始加载
onMounted(async () => {
        loadArticles();
        await loadCategories();
});
</script>

<style scoped>
</style>
