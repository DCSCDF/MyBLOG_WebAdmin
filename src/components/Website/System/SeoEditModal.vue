<!--
  - [SeoEditModal.vue]
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
        <a-modal
            v-model:open="visible"
            :confirm-loading="submitting"
            :title="isCreate ? '新建SEO配置' : '编辑SEO配置'"
            cancel-text="取消"
            ok-text="保存"
            width="800px"
            @cancel="handleCancel"
            @ok="handleSubmit">
                <a-form
                    v-if="form"
                    :layout="'vertical'"
                    :model="form"
                    :rules="rules">
                        <a-form-item label="页面类型" name="pageType">
                                <a-input
                                    v-if="isCreate"
                                    v-model:value="form.pageType"
                                    :maxlength="50"
                                    placeholder="页面类型名称，可自定义输入（如 home、文章页、关于我），最大 50 字符"
                                    show-count/>
                                <a-input
                                    v-else
                                    :value="form.pageType"
                                    disabled/>
                                <template v-if="isCreate" #extra>
                                        <span class="text-gray-500 text-xs">同一页面类型与页面ID组合不可重复</span>
                                </template>
                        </a-form-item>
                        <a-form-item label="页面ID" name="pageId">
                                <a-input-number
                                    v-model:value="form.pageId"
                                    :min="1"
                                    placeholder="关联页面ID（文章ID、分类ID等，首页等固定页面可为空）"
                                    style="width: 100%;"/>
                                <template #extra>
                                        <span class="text-gray-500 text-xs">首页、关于页、联系页等固定页面可为空</span>
                                </template>
                        </a-form-item>
                        <a-form-item label="SEO标题" name="title">
                                <a-input
                                    v-model:value="form.title"
                                    :maxlength="200"
                                    placeholder="SEO标题，最大 200 字符"
                                    show-count/>
                        </a-form-item>
                        <a-form-item label="SEO关键词" name="keywords">
                                <a-input
                                    v-model:value="form.keywords"
                                    :maxlength="500"
                                    placeholder="SEO关键词，最大 500 字符，逗号分隔"
                                    show-count/>
                        </a-form-item>
                        <a-form-item label="SEO描述" name="description">
                                <a-textarea
                                    v-model:value="form.description"
                                    :maxlength="1500"
                                    :rows="3"
                                    placeholder="SEO描述，最大 1500 字符"
                                    show-count/>
                        </a-form-item>
                        <a-divider>Open Graph 配置</a-divider>
                        <a-form-item label="OG标题" name="ogTitle">
                                <a-input
                                    v-model:value="form.ogTitle"
                                    :maxlength="200"
                                    placeholder="Open Graph标题，最大 200 字符"
                                    show-count/>
                        </a-form-item>
                        <a-form-item label="OG描述" name="ogDescription">
                                <a-textarea
                                    v-model:value="form.ogDescription"
                                    :maxlength="1500"
                                    :rows="3"
                                    placeholder="Open Graph描述，最大 1500 字符"
                                    show-count/>
                        </a-form-item>
                        <a-form-item label="OG图片URL" name="ogImage">
                                <a-input
                                    v-model:value="form.ogImage"
                                    :maxlength="500"
                                    placeholder="Open Graph图片URL，最大 500 字符"
                                    show-count/>
                        </a-form-item>
                        <a-form-item label="OG类型" name="ogType">
                                <a-input
                                    v-model:value="form.ogType"
                                    :maxlength="50"
                                    placeholder="Open Graph类型，默认：website"
                                    show-count/>
                        </a-form-item>
                        <a-divider>其他配置</a-divider>
                        <a-form-item label="规范URL" name="canonicalUrl">
                                <a-input
                                    v-model:value="form.canonicalUrl"
                                    :maxlength="500"
                                    placeholder="规范URL，最大 500 字符"
                                    show-count/>
                        </a-form-item>
                        <a-form-item label="Robots" name="robots">
                                <a-input
                                    v-model:value="form.robots"
                                    :maxlength="100"
                                    placeholder="robots meta标签，默认：index,follow"
                                    show-count/>
                        </a-form-item>
                </a-form>
        </a-modal>
</template>

<script setup>
import {computed, ref, watch} from 'vue';
import {message} from 'ant-design-vue';
import {useRouter} from 'vue-router';

const props = defineProps({
        open: {
                type: Boolean,
                default: false
        },
        seo: {
                type: Object,
                default: null
        },
        isCreate: {
                type: Boolean,
                default: false
        }
});

const emit = defineEmits(['update:open', 'submit', 'cancel', 'success']);

const router = useRouter();
const submitting = ref(false);
const form = ref(null);

const visible = computed({
        get: () => props.open,
        set: (val) => emit('update:open', val)
});

const rules = {
        pageType: [
                {required: true, message: '请输入页面类型名称', trigger: 'blur'},
                {max: 50, message: '页面类型名称不能超过 50 个字符', trigger: 'blur'}
        ],
        title: [
                {max: 200, message: 'SEO标题不能超过 200 个字符'}
        ],
        keywords: [
                {max: 500, message: 'SEO关键词不能超过 500 个字符'}
        ],
        description: [
                {max: 1500, message: 'SEO描述不能超过 1500 个字符'}
        ],
        ogTitle: [
                {max: 200, message: 'OG标题不能超过 200 个字符'}
        ],
        ogDescription: [
                {max: 1500, message: 'OG描述不能超过 1500 个字符'}
        ],
        ogImage: [
                {max: 500, message: 'OG图片URL不能超过 500 个字符'}
        ],
        ogType: [
                {max: 50, message: 'OG类型不能超过 50 个字符'}
        ],
        canonicalUrl: [
                {max: 500, message: '规范URL不能超过 500 个字符'}
        ],
        robots: [
                {max: 100, message: 'Robots不能超过 100 个字符'}
        ]
};

/**
 * 初始化表单
 */
const initForm = () => {
        const seoData = props.seo || {};

        form.value = {
                pageType: seoData.pageType || '',
                pageId: seoData.pageId || undefined,
                title: seoData.title || '',
                keywords: seoData.keywords || '',
                description: seoData.description || '',
                ogTitle: seoData.ogTitle || '',
                ogDescription: seoData.ogDescription || '',
                ogImage: seoData.ogImage || '',
                ogType: seoData.ogType || 'website',
                canonicalUrl: seoData.canonicalUrl || '',
                robots: seoData.robots || 'index,follow'
        };
};

/**
 * 处理取消
 */
const handleCancel = () => {
        form.value = null;
        emit('cancel');
};

/**
 * 验证表单数据
 * @returns {{isValid: boolean, errorMessage: string}}
 */
const validateForm = () => {
        // 使用单一返回点模式
        let isValid = true;
        let errorMessage = '';

        // 表单存在性验证
        if (!form.value) {
                isValid = false;
                errorMessage = '表单数据不存在';
        } else {
                // 页面类型验证（仅创建时必填，最大 50 字符）
                const pageTypeTrimmed = (form.value.pageType || '').toString().trim();
                if (props.isCreate && !pageTypeTrimmed) {
                        isValid = false;
                        errorMessage = '请输入页面类型名称';
                } else if (pageTypeTrimmed.length > 50) {
                        isValid = false;
                        errorMessage = '页面类型名称不能超过 50 个字符';
                } else {
                        // 字段长度验证
                        const validations = [
                                { value: form.value.title, maxLength: 200, message: 'SEO标题不能超过 200 个字符' },
                                { value: form.value.keywords, maxLength: 500, message: 'SEO关键词不能超过 500 个字符' },
                                { value: form.value.description, maxLength: 1500, message: 'SEO描述不能超过 1500 个字符' },
                                { value: form.value.ogTitle, maxLength: 200, message: 'OG标题不能超过 200 个字符' },
                                { value: form.value.ogDescription, maxLength: 1500, message: 'OG描述不能超过 1500 个字符' },
                                { value: form.value.ogImage, maxLength: 500, message: 'OG图片URL不能超过 500 个字符' },
                                { value: form.value.ogType, maxLength: 50, message: 'OG类型不能超过 50 个字符' },
                                { value: form.value.canonicalUrl, maxLength: 500, message: '规范URL不能超过 500 个字符' },
                                { value: form.value.robots, maxLength: 100, message: 'Robots不能超过 100 个字符' }
                        ];

                        for (const validation of validations) {
                                if (validation.value && validation.value.length > validation.maxLength) {
                                        isValid = false;
                                        errorMessage = validation.message;
                                        break;
                                }
                        }
                }
        }

        return { isValid, errorMessage };
};

/**
 * 构建提交数据
 * @returns {Object} 提交数据对象
 */
const buildSubmitData = () => {
        const submitData = {};

        // 创建时必须包含 pageType（页面类型名称，最大 50 字符）
        if (props.isCreate && form.value.pageType != null) {
                const pt = (form.value.pageType + '').trim();
                if (pt) submitData.pageType = pt;
        }

        // 定义字段处理配置
        const fieldConfigs = [
                { key: 'pageId', source: form.value.pageId, transform: null },
                { key: 'title', source: form.value.title, transform: (val) => val.trim() || null },
                { key: 'keywords', source: form.value.keywords, transform: (val) => val.trim() || null },
                { key: 'description', source: form.value.description, transform: (val) => val.trim() || null },
                { key: 'ogTitle', source: form.value.ogTitle, transform: (val) => val.trim() || null },
                { key: 'ogDescription', source: form.value.ogDescription, transform: (val) => val.trim() || null },
                { key: 'ogImage', source: form.value.ogImage, transform: (val) => val.trim() || null },
                { key: 'ogType', source: form.value.ogType, transform: (val) => val.trim() || 'website' },
                { key: 'canonicalUrl', source: form.value.canonicalUrl, transform: (val) => val.trim() || null },
                { key: 'robots', source: form.value.robots, transform: (val) => val.trim() || 'index,follow' }
        ];

        // 统一处理字段
        for (const config of fieldConfigs) {
                if (config.source != null) {
                        submitData[config.key] = config.transform 
                                ? config.transform(config.source) 
                                : config.source;
                }
        }

        return submitData;
};

/**
 * 处理提交
 */
const handleSubmit = async () => {
        const validationResult = validateForm();

        // 使用单一返回点模式
        if (validationResult.isValid) {
                // 执行提交逻辑
                submitting.value = true;
                try {
                        const submitData = buildSubmitData();
                        emit('submit', submitData);
                } finally {
                        submitting.value = false;
                }
        } else {
                message.warning(validationResult.errorMessage);
        }
};

/**
 * 刷新当前页面
 */
const refreshPage = () => {
        // 使用 Vue Router 刷新当前路由
        router.go(0);
};

watch(() => props.open, (newVal) => {
        if (newVal) {
                initForm();
        }
});

// 监听父组件发出的成功事件，在保存成功时刷新页面
const handleParentSuccess = () => {
        setTimeout(() => {
                refreshPage();
        }, 100);
};

// 暴露方法给父组件调用
defineExpose({
        handleParentSuccess
});
</script>
