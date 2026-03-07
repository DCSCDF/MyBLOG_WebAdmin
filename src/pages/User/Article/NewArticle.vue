<!--
  - [NewArticle.vue]
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
        <a-card class="md-editor-container">
                <div class="mb-4 flex items-center justify-between">
                        <div>
                                <h2 class="font-bold text-lg mb-1">撰写你的文章</h2>
                                <span
                                    class="text-sm text-gray-600">使用 Markdown 语法编写你的文章，工具栏可以点击空白区域左右拖动，撰写完成后点击提交文章来补充标题、分类等信息。</span>
                        </div>
                        <a-button type="primary" @click="handleSubmitClick">提交文章</a-button>
                </div>

                <MdEditor
                    v-model="mdText"
                    :toolbars="toolbars"
                    language="zh-CN"
                    preview
                    @change="handleEditorChange"
                    @onHtmlChanged="handleHtmlChange"
                    @save="handleSave"/>
        </a-card>

        <!-- 提交文章弹窗 -->
        <a-modal
            v-model:open="submitVisible"
            :confirm-loading="submitLoading"
            cancel-text="取消"
            ok-text="提交"
            title="提交文章"
            @ok="submitArticle">
                <a-form
                    :layout="'vertical'"
                    :model="submitForm"
                    :rules="submitRules">
                        <a-form-item label="文章标题" name="title" required>
                                <a-input v-model:value="submitForm.title" :maxlength="200"
                                         placeholder="请输入文章标题"/>
                        </a-form-item>
                        <a-form-item label="文章分类" name="categoryId">
                                <a-select
                                    v-model:value="submitForm.categoryId"
                                    allow-clear
                                    placeholder="请选择文章分类">
                                        <a-select-option v-for="cat in categoryList" :key="cat.id" :value="cat.id">
                                                {{ cat.name }}
                                        </a-select-option>
                                </a-select>
                        </a-form-item>
                        <a-form-item label="文章摘要" name="summary">
                                <a-textarea
                                    v-model:value="submitForm.summary"
                                    :maxlength="200"
                                    :rows="3"
                                    placeholder="请输入文章摘要（可选）"
                                    show-count/>
                        </a-form-item>
                        <a-form-item label="封面图片URL" name="coverImage">
                                <a-input
                                    v-model:value="submitForm.coverImage"
                                    placeholder="请输入封面图片URL（可选），支持 http/https 链接"/>
                        </a-form-item>
                        <a-form-item label="文章标签" name="tags">
                                <a-input
                                    v-model:value="submitForm.tags"
                                    placeholder="请输入标签，多个标签用逗号分隔（可选），如：前端,后端,Java"/>
                        </a-form-item>
                </a-form>
        </a-modal>
</template>

<script setup>
import {onMounted, onUnmounted, ref} from 'vue';
import {message} from 'ant-design-vue';
import {MdEditor} from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import {blogApi} from '../../../api/blog/blogApi.js';
import {useArticleStore} from '../../../stores/article.js';
import {useCategoryStore} from '../../../stores/category.js';

const articleStore = useArticleStore();
const categoryStore = useCategoryStore();

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

// 默认内容
const DEFAULT_TEXT = '**开始写作！**';

// Markdown 内容
const mdText = ref(DEFAULT_TEXT);

// 提交弹窗状态
const submitVisible = ref(false);
const submitLoading = ref(false);

// 提交表单数据
const submitForm = ref({
        title: '',
        categoryId: null,
        summary: '',
        coverImage: '',
        tags: ''
});

// 提交表单验证规则
const submitRules = {
        title: [
                {required: true, message: '请输入文章标题', trigger: 'blur'},
                {max: 200, message: '文章标题不能超过200字符', trigger: 'blur'}
        ],
        summary: [
                {max: 200, message: '文章摘要不能超过200字符', trigger: 'blur'}
        ],
        coverImage: [
                {
                        pattern: /^(https?:\/\/)?[\w\-]+(\.[\w\-]+)+[/#?]?.*$/,
                        message: '请输入有效的URL格式',
                        trigger: 'blur'
                }
        ]
};

// 分类列表
const categoryList = ref([]);


/**
 * 处理编辑器内容变化
 * @param {string} value - MD内容
 */
const handleEditorChange = (value) => {
        articleStore.updateMdContent(value);
};

/**
 * 处理 HTML 内容变化
 * @param {string} html - HTML内容
 */
const handleHtmlChange = (html) => {
        articleStore.updateHtmlContent(html);
};

/**
 * 处理保存（快捷键或工具栏触发）
 */
const handleSave = () => {
        articleStore.saveDraft();
        message.success('草稿已保存');
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
 * 点击提交按钮
 */
const handleSubmitClick = () => {
        // 先保存当前编辑内容到 store
        articleStore.updateMdContent(mdText.value);
        // 打开提交弹窗
        submitVisible.value = true;
};

/**
 * 提交文章
 */
const submitArticle = async () => {
        // 表单验证 - 使用标志变量控制流程
        let hasError = false;

        if (!submitForm.value.title || submitForm.value.title.trim() === '') {
                message.warning('请输入文章标题');
                hasError = true;
        } else if (submitForm.value.summary && submitForm.value.summary.length > 200) {
                message.warning('文章摘要不能超过 200 字符');
                hasError = true;
        } else if (submitForm.value.coverImage) {
                const url = submitForm.value.coverImage.trim();
                if (url && !/^https?:\/\/[\w\-]+(\.[\w\-]+)+[/#?]?.*$/.test(url)) {
                        message.warning('封面图片 URL 格式无效，请输入有效的 http/https 链接');
                        hasError = true;
                }
        }

        // 只有在没有错误时才执行提交逻辑
        if (!hasError) {
                submitLoading.value = true;
                try {
                        // 获取当前的 MD 和 HTML 内容
                        const currentMdContent = mdText.value;
                        const currentHtmlContent = articleStore.htmlContent;

                        const params = {
                                title: submitForm.value.title.trim(),
                                categoryId: submitForm.value.categoryId || undefined,
                                summary: submitForm.value.summary?.trim() ?? undefined,
                                content: currentMdContent,
                                htmlContent: currentHtmlContent,
                                coverImage: submitForm.value.coverImage?.trim() || undefined,
                                tags: submitForm.value.tags?.trim() || undefined
                        };

                        const result = await blogApi.create(params);

                        if (result) {
                                message.success('文章创建成功');
                                // 清空本地存储的草稿
                                articleStore.clearDraft();
                                // 重置表单
                                resetSubmitForm();
                                // 关闭弹窗
                                submitVisible.value = false;
                                // 重置编辑器内容
                                mdText.value = DEFAULT_TEXT;
                        }
                } catch (e) {
                        message.error(e?.message || '创建文章失败');
                } finally {
                        submitLoading.value = false;
                }
        }
};

/**
 * 重置提交表单
 */
const resetSubmitForm = () => {
        submitForm.value = {
                title: '',
                categoryId: null,
                summary: '',
                coverImage: '',
                tags: ''
        };
};

// 组件挂载时
onMounted(async () => {
        // 初始化草稿（从本地存储恢复）
        const hasDraft = articleStore.initDraft();
        if (hasDraft && articleStore.mdContent) {
                mdText.value = articleStore.mdContent;
                message.info('已恢复上次编辑的草稿');
        }

        // 加载分类列表
        await loadCategories();

        // 启动自动保存
        articleStore.startAutoSave(
            () => mdText.value,
            () => articleStore.htmlContent
        );
});

// 组件卸载时
onUnmounted(() => {
        // 停止自动保存
        articleStore.stopAutoSave();
        // 保存当前草稿
        articleStore.saveDraft();
});
</script>

<style scoped>
.md-editor-container {
        min-height: calc(100vh - 150px);
}


</style>
