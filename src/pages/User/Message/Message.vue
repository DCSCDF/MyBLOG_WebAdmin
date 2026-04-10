<!--
  - [Message.vue]
  - -------------------------------------------------------------------------------
  - This software is licensed under the MIT License.
  - However, any distribution or modification must retain this copyright notice.
  - See LICENSE for full terms.
  - -------------------------------------------------------------------------------
  - author: "Jiu Liu"
  - author_contact: "QQ: 3209174373, GitHub: https://github.com/DCSCDF"
  - license: "MIT"
  - license_exception: "Mandatory attribution retention"
  - UpdateTime: 2026/3/8
  -
  -->
<template>
        <a-card>
                <div class="mb-4 flex items-center justify-between">
                        <div>
                                <h2 class="font-bold text-lg mb-1">我的评论</h2>
                                <span class="text-sm text-gray-600">管理我的评论，支持分页与状态筛选。</span>
                        </div>
                </div>

                <div class="search-filter-bar mb-4 flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center">
                        <div class="w-full min-w-[200px] max-w-[300px]">
                                <a-input
                                    v-model:value="searchKeyword"
                                    class="w-full"
                                    placeholder="搜索评论内容"
                                    @press-enter="handleSearch">
                                        <template #prefix>
                                                <SearchOutlined/>
                                        </template>
                                </a-input>
                        </div>
                        <div class="flex gap-2">
                                <div class="search-filter-item flex items-center gap-1 rounded-md min-w-0 my-1">
                                        <a-select
                                            v-model:value="searchStatus"
                                            allow-clear
                                            placeholder="评论状态">
                                                <a-select-option
                                                    v-for="opt in statusFilterOptions"
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

                <!-- 评论表格 -->
                <a-table
                    :columns="columns"
                    :data-source="commentStore.currentComments"
                    :loading="commentStore.loading"
                    :pagination="tablePagination"
                    :scroll="{ x: 1000 }"
                    row-key="id"
                    @change="onTableChange">
                        <template #bodyCell="{ column, record }">
                                <template v-if="column.key === 'blogTitle'">
                                        <a class="font-medium hover:text-blue-500">
                                                {{ record.blogTitle || '-' }}
                                        </a>
                                </template>
                                <template v-else-if="column.key === 'content'">
                                        <span class="truncate block max-w-[200px]">
                                                {{ record.content }}
                                        </span>
                                </template>
                                <template v-else-if="column.key === 'username'">
                                        <div class="flex items-center gap-2">
                                                <a-avatar
                                                    v-if="record.avatarUrl"
                                                    :size="28"
                                                    :src="getSmallImageUrl(record.avatarUrl)"/>
                                                <a-avatar v-else :size="28">
                                                        <template #icon>
                                                                <UserOutlined/>
                                                        </template>
                                                </a-avatar>
                                                <span>{{ record.username }}</span>
                                        </div>
                                </template>
                                <template v-else-if="column.key === 'status'">
                                        <a-tag :bordered="false" :color="getStatusColor(record.status)">
                                                {{ getStatusLabel(record.status) }}
                                        </a-tag>
                                </template>
                                <template v-else-if="column.key === 'action'">
                                        <a-space>
                                                <a-button size="small" type="link" @click="openEdit(record)">编辑
                                                </a-button>
                                                <a-popconfirm
                                                    cancel-text="取消"
                                                    ok-text="确定"
                                                    title="确定删除该评论吗？删除后将无法恢复。"
                                                    @confirm="onDelete(record)">
                                                        <a-button danger size="small" type="link">删除</a-button>
                                                </a-popconfirm>
                                        </a-space>
                                </template>
                        </template>
                </a-table>
        </a-card>

        <!-- 编辑评论弹窗 -->
        <a-modal
            v-model:open="editVisible"
            :confirm-loading="editSubmitting"
            cancel-text="取消"
            ok-text="保存"
            title="编辑评论"
            @afterClose="handleEditAfterClose"
            @cancel="handleEditCancel"
            @ok="submitEdit">
                <a-form
                    v-if="editForm"
                    :layout="'vertical'"
                    :model="editForm">
                        <a-form-item label="评论内容" name="content">
                                <a-textarea
                                    v-model:value="editForm.content"
                                    :rows="3"
                                    placeholder="评论内容"/>
                        </a-form-item>
                        <a-form-item label="个人网站" name="website">
                                <a-input
                                    v-model:value="editForm.website"
                                    placeholder="个人网站（传空字符串可清空）"/>
                        </a-form-item>
                </a-form>
        </a-modal>
</template>

<script setup>
import {computed, onMounted, ref} from 'vue';
import {message} from 'ant-design-vue';
import {SearchOutlined, UserOutlined} from '@ant-design/icons-vue';
import {useCommentStore} from '../../../stores/comment.js';
import {getSmallImageUrl} from '../../../utils/imageUrl.js';

const commentStore = useCommentStore();

// 搜索与筛选
const searchKeyword = ref('');
const searchStatus = ref(undefined);

// 筛选项配置
const defaultStatusOptions = [
        {value: 0, label: '待审核'},
        {value: 1, label: '已通过'},
        {value: 2, label: '垃圾评论'}
];

/** 状态下拉选项：来自接口 filterOptions 或默认 */
const statusFilterOptions = computed(() => {
        const options = commentStore.filterOptions?.status;
        const useApiOptions = Array.isArray(options) && options.length > 0;
        return useApiOptions ? options : defaultStatusOptions;
});

/**
 * 获取状态标签颜色
 */
const getStatusColor = (status) => {
        const colorMap = {
                0: 'orange',
                1: 'green',
                2: 'red',
                3: 'default'
        };
        return colorMap[status] || 'default';
};

/**
 * 获取状态标签文本
 */
const getStatusLabel = (status) => {
        const labelMap = {
                0: '待审核',
                1: '已通过',
                2: '垃圾评论',
                3: '已删除'
        };
        return labelMap[status] || '未知';
};

// 表格列定义
const columns = [
        {title: 'ID', dataIndex: 'id', key: 'id', width: 70},
        {title: '文章', key: 'blogTitle', width: 180},
        // {title: '评论者', key: 'username', width: 140},
        {title: '内容', key: 'content', width: 220},
        {title: '状态', key: 'status', width: 90},
        // {title: '点赞数', dataIndex: 'likeCount', key: 'likeCount', width: 80},
        {title: '评论时间', dataIndex: 'createTime', key: 'createTime', width: 180},
        {title: '操作', key: 'action', width: 150, fixed: 'right'}
];

// 表格分页配置
const tablePagination = computed(() => ({
        current: commentStore.pagination.current,
        pageSize: commentStore.pagination.pageSize,
        total: commentStore.pagination.total,
        showSizeChanger: true,
        showTotal: (total) => `共 ${total} 条`
}));

// 弹窗状态与表单
const editVisible = ref(false);
const editSubmitting = ref(false);
const editForm = ref(null);

/**
 * 检查值是否有效（非 undefined、非 null、非空字符串）
 */
const isValidValue = (value) => {
        return value !== undefined && value !== null && value !== '';
};

/**
 * 加载评论列表
 */
const loadComments = () => {
        const params = {
                currentPage: commentStore.pagination.current,
                pageSize: commentStore.pagination.pageSize
        };

        // 处理状态参数
        const statusRaw = searchStatus.value;
        if (isValidValue(statusRaw)) {
                params.status = statusRaw;
        }

        commentStore.fetchComments(params).catch((e) => {
                message.error(e?.message || '加载评论列表失败');
        });
};

/**
 * 处理表格变化（分页、排序等）
 */
const onTableChange = (pagination) => {
        commentStore.updatePagination({
                current: pagination.current,
                pageSize: pagination.pageSize
        });
        loadComments();
};

/**
 * 处理搜索
 */
const handleSearch = () => {
        const statusVal = searchStatus.value;
        const statusParam = isValidValue(statusVal) ? statusVal : undefined;

        commentStore.updatePagination({current: 1});
        commentStore.updateQueryParams({
                keyword: searchKeyword.value.trim(),
                status: statusParam
        });
        loadComments();
};

/**
 * 处理重置
 */
const handleReset = () => {
        searchKeyword.value = '';
        searchStatus.value = undefined;
        commentStore.updatePagination({current: 1});
        commentStore.updateQueryParams({
                keyword: '',
                status: undefined
        });
        loadComments();
};

/**
 * 打开编辑弹窗
 */
const openEdit = (record) => {
        editForm.value = {
                id: record.id,
                content: record.content ?? '',
                website: record.website ?? ''
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
                errorMessage = '评论ID不存在';
        } else {
                canProceed = true;
        }

        if (canProceed) {
                editSubmitting.value = true;
                try {
                        await commentStore.updateComment(form.id, {
                                id: form.id,
                                content: form.content?.trim() || undefined,
                                website: form.website?.trim() || ''
                        });
                        message.success('保存成功');
                        editVisible.value = false;
                        editForm.value = null;
                        loadComments();
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
 * 处理删除评论
 */
const onDelete = async (record) => {
        try {
                await commentStore.deleteComment(record.id);
                message.success('删除成功');
                loadComments();
        } catch (e) {
                message.error(e?.message || '删除失败');
        }
};

// 初始加载
onMounted(() => {
        loadComments();
});
</script>

