<!--
  - [ImagesList.vue]
  - -------------------------------------------------------------------------------
  - This software is licensed under the MIT License.
  - However, any distribution or modification must retain this copyright notice.
  - See LICENSE for full terms.
  - -------------------------------------------------------------------------------
  - author: "Jiu Liu"
  - author_contact: "QQ: 3209174373, GitHub: https://github.com/DCSCDF"
  - license: "MIT"
  - license_exception: "Mandatory attribution retention"
  - UpdateTime: 2026/3/26 21:30
  -
  -->
<template>
        <a-card>
                <div class="mb-4 flex items-center justify-between">
                        <div>
                                <h2 class="font-bold text-lg mb-1">图片管理</h2>
                                <span class="text-sm text-gray-600">管理上传的图片，支持分页、关键词搜索。</span>
                        </div>
                </div>

                <!-- 上传区域 -->
                <a-upload-dragger
                    v-model:fileList="fileList"
                    :custom-request="handleCustomUpload"
                    :max-count="1"
                    :multiple="false"
                    :show-upload-list="false"
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/bmp,image/webp"
                    name="file"
                    @change="handleChange">
                        <p class="ant-upload-drag-icon">
                                <CloudUploadOutlined/>
                        </p>
                        <p class="ant-upload-text">点击此处上传图片</p>
                        <p class="ant-upload-hint">
                                支持 jpg、jpeg、png、gif、bmp、webp 格式，单个文件不超过 10MB
                        </p>
                </a-upload-dragger>

                <!-- 上传状态显示 -->
                <div v-if="ossStore.isUploading" class="mt-4">
                        <a-progress :percent="uploadProgress" status="active"/>
                        <p class="text-center text-sm text-gray-500 mt-1">正在上传...</p>
                </div>

                <!-- 搜索区域 -->
                <div class="search-filter-bar mt-6 mb-4 flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center">
                        <div class="w-full min-w-[200px] max-w-[300px]">
                                <a-input
                                    v-model:value="searchKeyword"
                                    class="w-full"
                                    placeholder="搜索文件名/哈希值"
                                    @press-enter="handleSearch">
                                        <template #prefix>
                                                <SearchOutlined/>
                                        </template>
                                </a-input>
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

                <!-- 图片表格 -->
                <a-table
                    :columns="columns"
                    :data-source="ossStore.currentImages"
                    :loading="ossStore.loading"
                    :pagination="tablePagination"
                    :scroll="{ x: 1000 }"
                    row-key="id"
                    @change="onTableChange">
                        <template #bodyCell="{ column, record }">
                                <template v-if="column.key === 'thumbnail'">
                                        <div class="flex items-center gap-2">
                                                <a-avatar
                                                    :size="48"
                                                    :src="ossStore.getImageUrl(record.hash)"
                                                    class="cursor-pointer hover:opacity-80 transition-opacity"
                                                    shape="square"
                                                    @click="openPreview(record)">
                                                        <template #icon>
                                                                <FileImageOutlined/>
                                                        </template>
                                                </a-avatar>
                                                <div class="flex flex-col">
                                                        <a class="font-medium hover:text-blue-500 cursor-pointer"
                                                           @click="openPreview(record)">
                                                                {{ record.originalName }}
                                                        </a>
                                                        <span class="text-xs text-gray-400 truncate max-w-[200px]">
								{{ truncateHash(record.hash) }}
							</span>
                                                </div>
                                        </div>
                                </template>
                                <template v-else-if="column.key === 'fileSize'">
                                        <span>{{ formatFileSize(record.fileSize) }}</span>
                                </template>
                                <template v-else-if="column.key === 'createTime'">
                                        <span>{{ formatDateTime(record.createTime) }}</span>
                                </template>
                                <template v-else-if="column.key === 'action'">
                                        <a-space>
                                                <a-button size="small" type="link" @click="openPreview(record)">
                                                        查看
                                                </a-button>
                                                <a-popconfirm
                                                    cancel-text="取消"
                                                    ok-text="确定"
                                                    title="确定删除该图片吗？删除后将无法恢复。"
                                                    @confirm="onDelete(record)">
                                                        <a-button danger size="small" type="link">删除</a-button>
                                                </a-popconfirm>
                                        </a-space>
                                </template>
                        </template>
                </a-table>
        </a-card>

        <!-- 图片预览弹窗 -->
        <a-modal
            v-model:open="previewVisible"
            :footer="null"
            title="图片详情"
            width="800px"
            @cancel="handlePreviewClose">
                <div v-if="currentRecord" class="flex flex-col gap-4">
                        <!-- 图片预览区域 -->
                        <div class="flex justify-center items-center bg-gray-100 rounded-lg overflow-hidden">
                                <img
                                    :alt="currentRecord.originalName"
                                    :src="ossStore.getImageUrl(currentRecord.hash)"
                                    class="max-w-full max-h-[500px] object-contain"/>
                        </div>
                        <!-- 图片信息 -->
                        <a-descriptions :column="1" bordered size="small">
                                <a-descriptions-item label="文件名">
                                        {{ currentRecord.originalName }}
                                </a-descriptions-item>
                                <!--                                <a-descriptions-item label="文件大小">-->
                                <!--                                        {{ formatFileSize(currentRecord.fileSize) }}-->
                                <!--                                </a-descriptions-item>-->
                                <a-descriptions-item label="哈希值">
                                        <a-tooltip :title="currentRecord.hash">
                                                <code class="text-xs bg-gray-100 px-1 py-0.5 rounded">{{
                                                                currentRecord.hash
                                                        }}</code>
                                        </a-tooltip>
                                </a-descriptions-item>
                                <!--                                <a-descriptions-item label="上传时间">-->
                                <!--                                        {{ formatDateTime(currentRecord.createTime) }}-->
                                <!--                                </a-descriptions-item>-->
                        </a-descriptions>
                        <!-- 操作按钮 -->
                        <div class="flex justify-end gap-2">
                                <a-button @click="copyImageUrl">复制链接</a-button>
                                <a-popconfirm
                                    cancel-text="取消"
                                    ok-text="确定"
                                    title="确定删除该图片吗？删除后将无法恢复。"
                                    @confirm="onDeleteFromPreview">
                                        <a-button danger>删除</a-button>
                                </a-popconfirm>
                        </div>
                </div>
        </a-modal>
</template>

<script setup>
import {computed, onMounted, ref} from 'vue';
import {message} from 'ant-design-vue';
import {CloudUploadOutlined, FileImageOutlined, SearchOutlined} from '@ant-design/icons-vue';
import {useOssStore} from '../../../stores/oss.js';

const ossStore = useOssStore();

// 文件列表（用于上传组件）
const fileList = ref([]);
const uploadProgress = ref(0);

// 搜索与筛选
const searchKeyword = ref('');

// 表格列定义
const columns = [
        {title: 'ID', dataIndex: 'id', key: 'id', width: 70},
        {title: '图片', key: 'thumbnail', width: 280},
        {title: '文件大小', key: 'fileSize', width: 100},
        {title: '上传时间', key: 'createTime', width: 180},
        {title: '操作', key: 'action', width: 120, fixed: 'right'}
];

// 表格分页配置
const tablePagination = computed(() => ({
        current: ossStore.pagination.current,
        pageSize: ossStore.pagination.pageSize,
        total: ossStore.pagination.total,
        showSizeChanger: true,
        showTotal: (total) => `共 ${total} 条`
}));

// 图片预览相关
const previewVisible = ref(false);
const currentRecord = ref(null);

/**
 * 格式化文件大小
 */
const formatFileSize = (bytes) => {
        const units = ['B', 'KB', 'MB', 'GB'];
        let result = '-';
        let size = bytes;
        let unitIndex = 0;
        if (bytes || bytes === 0) {
                while (size >= 1024 && unitIndex < units.length - 1) {
                        size /= 1024;
                        unitIndex++;
                }
                result = `${size.toFixed(unitIndex > 0 ? 2 : 0)} ${units[unitIndex]}`;
        }
        return result;
};

/**
 * 格式化日期时间
 */
const formatDateTime = (dateTime) => {
        let result = '-';
        if (dateTime) {
                const date = new Date(dateTime);
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                const hours = String(date.getHours()).padStart(2, '0');
                const minutes = String(date.getMinutes()).padStart(2, '0');
                const seconds = String(date.getSeconds()).padStart(2, '0');
                result = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        }
        return result;
};

/**
 * 截断哈希值显示
 */
const truncateHash = (hash) => {
        let result = '-';
        if (hash) {
                result = hash.length > 16 ? `${hash.substring(0, 8)}...${hash.substring(hash.length - 8)}` : hash;
        }
        return result;
};

/**
 * 自定义上传方法
 */
const handleCustomUpload = async ({file, onSuccess, onError}) => {
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp', 'image/webp'];
        const maxSize = 10 * 1024 * 1024;
        const fileType = file.type;
        const isAllowed = allowedTypes.includes(fileType);
        const isSizeAllowed = file.size <= maxSize;
        const errorMessages = {
                type: '不支持的图片格式，支持的格式：jpg、jpeg、png、gif、bmp、webp',
                size: '图片大小不能超过 10MB'
        };

        let errorType = '';
        if (!isAllowed) {
                errorType = 'type';
        } else if (!isSizeAllowed) {
                errorType = 'size';
        }

        if (errorType) {
                const msg = errorMessages[errorType];
                onError(new Error(msg));
                message.error(msg);
        }

        try {
                const result = await ossStore.uploadImage(file);
                fileList.value = [];
                loadImages();
                message.success('上传成功');
                onSuccess(result);
        } catch (e) {
                onError(e);
                message.error(e?.message || '上传失败');
        }
};

/**
 * 处理上传变化
 */
const handleChange = (info) => {
        const status = info.file.status;
        if (status === 'uploading') {
                uploadProgress.value = Math.round((info.file.percent || 0), 2);
        } else if (status === 'done') {
                uploadProgress.value = 100;
        } else if (status === 'error') {
                uploadProgress.value = 0;
        }
};

/**
 * 加载图片列表
 */
const loadImages = () => {
        const params = {
                currentPage: ossStore.pagination.current,
                pageSize: ossStore.pagination.pageSize
        };

        // 处理关键词参数
        const keywordRaw = searchKeyword.value;
        const hasKeyword = keywordRaw != null && String(keywordRaw).trim().length > 0;
        if (hasKeyword) {
                params.keyword = String(keywordRaw).trim();
        }

        ossStore.fetchImages(params).catch((e) => {
                message.error(e?.message || '加载图片列表失败');
        });
};

/**
 * 处理表格变化（分页、排序等）
 */
const onTableChange = (pagination) => {
        ossStore.updatePagination({
                current: pagination.current,
                pageSize: pagination.pageSize
        });
        loadImages();
};

/**
 * 处理搜索
 */
const handleSearch = () => {
        ossStore.updatePagination({current: 1});
        ossStore.updateQueryParams({
                keyword: searchKeyword.value.trim()
        });
        loadImages();
};

/**
 * 处理重置
 */
const handleReset = () => {
        searchKeyword.value = '';
        ossStore.updatePagination({current: 1});
        ossStore.updateQueryParams({
                keyword: ''
        });
        loadImages();
};

/**
 * 打开图片预览
 */
const openPreview = (record) => {
        currentRecord.value = record;
        previewVisible.value = true;
};

/**
 * 关闭预览弹窗
 */
const handlePreviewClose = () => {
        previewVisible.value = false;
        currentRecord.value = null;
};

/**
 * 复制图片链接
 */
const copyImageUrl = async () => {
        let hasRecord = false;
        let url = '';
        if (currentRecord.value) {
                hasRecord = true;
                url = ossStore.getImageUrl(currentRecord.value.hash);
        }
        if (hasRecord) {
                try {
                        await navigator.clipboard.writeText(url);
                        message.success('链接已复制到剪贴板');
                } catch (e) {
                        message.error('复制失败，请手动复制');
                }
        }
};

/**
 * 处理删除图片
 */
const onDelete = async (record) => {
        try {
                await ossStore.deleteImage(record.hash);
                message.success('删除成功');
                loadImages();
        } catch (e) {
                message.error(e?.message || '删除失败');
        }
};

/**
 * 从预览弹窗删除图片
 */
const onDeleteFromPreview = async () => {
        let hasRecord = false;
        let hash = '';
        if (currentRecord.value) {
                hasRecord = true;
                hash = currentRecord.value.hash;
        }
        if (hasRecord) {
                try {
                        await ossStore.deleteImage(hash);
                        message.success('删除成功');
                        previewVisible.value = false;
                        currentRecord.value = null;
                        loadImages();
                } catch (e) {
                        message.error(e?.message || '删除失败');
                }
        }
};

// 初始加载
onMounted(() => {
        loadImages();
});
</script>
