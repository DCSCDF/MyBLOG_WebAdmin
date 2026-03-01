<!--
  - [LinksSetting.vue]
  - -------------------------------------------------------------------------------
  - This software is licensed under the MIT License.
  - However, any distribution or modification must retain this copyright notice.
  - See LICENSE for full terms.
  - -------------------------------------------------------------------------------
  - author: "Jiu Liu"
  - author_contact: "QQ: 3209174373, GitHub: https://github.com/DCSCDF"
  - license: "MIT"
  - license_exception: "Mandatory attribution retention"
  - UpdateTime: 2026/3/1
  -
  -->

<template>
        <a-card>
                <div class="mb-4 flex items-center justify-between">
                        <div>
                                <h2 class="font-bold text-lg mb-1">友情链接列表</h2>
                                <span class="text-sm text-gray-600">管理网站的友情链接，支持分页、关键词与状态筛选。</span>
                        </div>
                        <a-button type="primary" @click="openCreate">新建友情链接</a-button>
                </div>

                <div class="search-filter-bar mb-4 flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center">
                        <div class="w-full min-w-[200px] max-w-[300px]">
                                <a-input
                                    v-model:value="searchKeyword"
                                    class="w-full"
                                    placeholder="搜索链接名称/URL/简介/备注"
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
                                            placeholder="链接状态">
                                                <a-select-option
                                                    v-for="opt in statusFilterOptions"
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

                <!-- 友情链接表格 -->
                <a-table
                    :columns="columns"
                    :data-source="friendLinkStore.currentLinks"
                    :loading="friendLinkStore.loading"
                    :pagination="tablePagination"
                    :scroll="{ x: 1100 }"
                    row-key="id"
                    @change="onTableChange">
                        <template #bodyCell="{ column, record }">
                                <template v-if="column.key === 'imageUrl'">
                                        <img
                                            v-if="record.imageUrl"
                                            :src="record.imageUrl"
                                            alt="图标"
                                            class="h-8 w-8 rounded object-cover"/>
                                        <span v-else class="text-gray-400">-</span>
                                </template>
                                <template v-else-if="column.key === 'status'">
                                        <a-tag :bordered="false" :color="statusTagColor(record.status)">
                                                {{ statusLabel(record.status) }}
                                        </a-tag>
                                </template>
                                <template v-else-if="column.key === 'action'">
                                        <a-space>
                                                <a-button size="small" type="link" @click="openDetail(record)">查看
                                                </a-button>
                                                <a-button size="small" type="link" @click="openEdit(record)">编辑
                                                </a-button>
                                                <template v-if="record.status !== 3">
                                                        <a-button
                                                            v-if="record.status !== 1"
                                                            size="small"
                                                            type="link"
                                                            @click="handleStatusChange(record, 1)">通过
                                                        </a-button>
                                                        <a-button
                                                            v-if="record.status !== 2"
                                                            size="small"
                                                            type="link"
                                                            @click="handleStatusChange(record, 2)">拒绝
                                                        </a-button>
                                                        <a-button
                                                            v-if="record.status !== 0"
                                                            size="small"
                                                            type="link"
                                                            @click="handleStatusChange(record, 0)">待审核
                                                        </a-button>
                                                </template>
                                                <a-popconfirm
                                                    cancel-text="取消"
                                                    ok-text="确定"
                                                    title="确定删除该友情链接吗？删除后为逻辑删除，状态将标记为已删除。"
                                                    @confirm="onDelete(record)">
                                                        <a-button danger size="small" type="link">删除</a-button>
                                                </a-popconfirm>
                                        </a-space>
                                </template>
                        </template>
                </a-table>
        </a-card>

        <!-- 友情链接详情抽屉 -->
        <a-drawer
            v-model:open="detailVisible"
            :width="400"
            title="友情链接详情"
            @close="handleDetailClose">
                <template v-if="detailLink">
                        <div class="space-y-3 text-sm">
                                <div>
                                        <span class="text-gray-500">链接名称：</span>
                                        <span>{{ detailLink.name }}</span>
                                        <a-divider/>
                                </div>

                                <div>
                                        <span class="text-gray-500">URL：</span>
                                        <a :href="detailLink.url" rel="noopener noreferrer"
                                           target="_blank">{{ detailLink.url }}</a>
                                        <a-divider/>
                                </div>

                                <div v-if="detailLink.summary">
                                        <span class="text-gray-500">简介：</span>
                                        <span>{{ detailLink.summary }}</span>
                                        <a-divider/>
                                </div>

                                <div v-if="detailLink.remark">
                                        <span class="text-gray-500">备注：</span>
                                        <span>{{ detailLink.remark }}</span>
                                        <a-divider/>
                                </div>

                                <div v-if="detailLink.imageUrl">
                                        <span class="text-gray-500">图片：</span>
                                        <img :src="detailLink.imageUrl" alt="图标"
                                             class="mt-1 h-12 rounded object-cover"/>
                                        <a-divider/>
                                </div>

                                <div>
                                        <span class="text-gray-500">排序：</span>
                                        <span>{{ detailLink.sortOrder ?? 0 }}</span>
                                        <a-divider/>
                                </div>

                                <div>
                                        <span class="text-gray-500">状态：</span>
                                        <a-tag :bordered="false" :color="statusTagColor(detailLink.status)">
                                                {{ statusLabel(detailLink.status) }}
                                        </a-tag>
                                        <a-divider/>
                                </div>

                                <div>
                                        <span class="text-gray-500">创建时间：</span>
                                        <span>{{ detailLink.createTime }}</span>
                                        <a-divider/>
                                </div>

                                <div>
                                        <span class="text-gray-500">更新时间：</span>
                                        <span>{{ detailLink.updateTime }}</span>
                                </div>
                        </div>
                </template>
        </a-drawer>

        <!-- 新建友情链接弹窗 -->
        <a-modal
            v-model:open="createVisible"
            :confirm-loading="createSubmitting"
            cancel-text="取消"
            ok-text="创建"
            title="新建友情链接"
            @afterClose="handleCreateAfterClose"
            @cancel="handleCreateCancel"
            @ok="submitCreate">
                <a-form
                    v-if="createForm"
                    :layout="'vertical'"
                    :model="createForm"
                    :rules="createRules">
                        <a-form-item label="链接名称" name="name" required>
                                <a-input v-model:value="createForm.name" placeholder="链接名称，前端展示用"/>
                        </a-form-item>
                        <a-form-item label="URL 地址" name="url" required>
                                <a-input v-model:value="createForm.url" placeholder="https://example.com"/>
                        </a-form-item>
                        <a-form-item label="简介" name="summary">
                                <a-textarea v-model:value="createForm.summary" :rows="2"
                                            placeholder="简要介绍该站点或链接用途（可选）"/>
                        </a-form-item>
                        <a-form-item label="备注" name="remark">
                                <a-textarea v-model:value="createForm.remark" :rows="2"
                                            placeholder="仅后台使用的备注（可选）"/>
                        </a-form-item>
                        <a-form-item label="图片 URL" name="imageUrl">
                                <a-input v-model:value="createForm.imageUrl" placeholder="站点 Logo 或图标地址（可选）"/>
                        </a-form-item>
                        <a-form-item label="排序" name="sortOrder">
                                <a-input-number v-model:value="createForm.sortOrder" :min="0" style="width: 100%;"/>
                        </a-form-item>
                </a-form>
        </a-modal>

        <!-- 编辑友情链接弹窗 -->
        <a-modal
            v-model:open="editVisible"
            :confirm-loading="editSubmitting"
            cancel-text="取消"
            ok-text="保存"
            title="编辑友情链接"
            @afterClose="handleEditAfterClose"
            @cancel="handleEditCancel"
            @ok="submitEdit">
                <a-form
                    v-if="editForm"
                    :layout="'vertical'"
                    :model="editForm"
                    :rules="editRules">
                        <a-form-item label="链接名称" name="name" required>
                                <a-input v-model:value="editForm.name" placeholder="链接名称"/>
                        </a-form-item>
                        <a-form-item label="URL 地址" name="url" required>
                                <a-input v-model:value="editForm.url" placeholder="https://example.com"/>
                        </a-form-item>
                        <a-form-item label="简介" name="summary">
                                <a-textarea v-model:value="editForm.summary" :rows="2" placeholder="简介（可选）"/>
                        </a-form-item>
                        <a-form-item label="备注" name="remark">
                                <a-textarea v-model:value="editForm.remark" :rows="2" placeholder="备注（可选）"/>
                        </a-form-item>
                        <a-form-item label="图片 URL" name="imageUrl">
                                <a-input v-model:value="editForm.imageUrl" placeholder="图片地址（可选）"/>
                        </a-form-item>
                        <a-form-item label="排序" name="sortOrder">
                                <a-input-number v-model:value="editForm.sortOrder" :min="0" style="width: 100%;"/>
                        </a-form-item>
                </a-form>
        </a-modal>
</template>

<script setup>
import {computed, onMounted, ref} from 'vue';
import {message} from 'ant-design-vue';
import {SearchOutlined} from '@ant-design/icons-vue';
import {useFriendLinkStore} from '../../../stores/friendLink.js';

const friendLinkStore = useFriendLinkStore();

// 搜索与筛选（keyword 传接口，status 传 0/1/2/3；'' 表示不传该筛选）
const searchKeyword = ref('');
const searchStatus = ref(undefined);

const defaultStatusOptions = [
        {value: 0, label: '待审核'},
        {value: 1, label: '已通过'},
        {value: 2, label: '已拒绝'},
        {value: 3, label: '已删除'}
];

/** 状态下拉选项：来自接口 filterOptions 或默认 */
const statusFilterOptions = computed(() => {
        const options = friendLinkStore.filterOptions?.status;
        const useApiOptions = Array.isArray(options) && options.length > 0;
        return useApiOptions ? options : defaultStatusOptions;
});

/**
 * 状态文案
 * @param {number} status - 状态值
 * @returns {string}
 */
function statusLabel(status) {
        const map = {0: '待审核', 1: '已通过', 2: '已拒绝', 3: '已删除'};
        return map[status] ?? '未知';
}

/**
 * 状态标签颜色
 * @param {number} status - 状态值
 * @returns {string}
 */
function statusTagColor(status) {
        const map = {0: 'orange', 1: 'green', 2: 'red', 3: 'default'};
        return map[status] ?? 'default';
}

// 表格列定义
const columns = [
        {title: 'ID', dataIndex: 'id', key: 'id', width: 70},
        {title: '名称', dataIndex: 'name', key: 'name', width: 120, ellipsis: true},
        {title: 'URL', dataIndex: 'url', key: 'url', width: 180, ellipsis: true},
        {title: '简介', dataIndex: 'summary', key: 'summary', width: 140, ellipsis: true},
        {title: '图片', key: 'imageUrl', width: 70},
        {title: '排序', dataIndex: 'sortOrder', key: 'sortOrder', width: 70},
        {title: '状态', key: 'status', width: 90},
        {title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 180},
        {title: '操作', key: 'action', width: 320, fixed: 'right'}
];

// 表格分页配置
const tablePagination = computed(() => ({
        current: friendLinkStore.pagination.current,
        pageSize: friendLinkStore.pagination.pageSize,
        total: friendLinkStore.pagination.total,
        showSizeChanger: true,
        showTotal: (total) => `共 ${total} 条`
}));

// 抽屉和弹窗状态
const detailVisible = ref(false);
const selectedLink = ref(null);
/** 详情抽屉当前展示的链接（只读，用于模板避免 selectedLink 为 null 的报错） */
const detailLink = computed(() => selectedLink.value);
const createVisible = ref(false);
const createSubmitting = ref(false);
const createForm = ref(null);
const editVisible = ref(false);
const editSubmitting = ref(false);
const editForm = ref(null);

const createRules = {
        name: [{required: true, message: '请输入链接名称'}],
        url: [
                {required: true, message: '请输入 URL 地址'},
                {type: 'string', pattern: /^https?:\/\/.+/, message: '请输入有效的 http 或 https 链接'}
        ]
};
const editRules = {
        name: [{required: true, message: '请输入链接名称'}],
        url: [
                {required: true, message: '请输入 URL 地址'},
                {type: 'string', pattern: /^https?:\/\/.+/, message: '请输入有效的 http 或 https 链接'}
        ]
};

/**
 * 加载友情链接列表
 */
const loadLinks = () => {
        const params = {
                currentPage: friendLinkStore.pagination.current,
                pageSize: friendLinkStore.pagination.pageSize
        };
        const keywordRaw = searchKeyword.value;
        const hasKeyword = keywordRaw != null && String(keywordRaw).trim().length > 0;
        if (hasKeyword) {
                params.keyword = String(keywordRaw).trim();
        }
        const statusRaw = searchStatus.value;
        const hasStatus = statusRaw != null && statusRaw !== '';
        if (hasStatus) {
                params.status = statusRaw;
        }
        friendLinkStore.fetchLinks(params).catch((e) => {
                message.error(e?.message || '加载友情链接列表失败');
        });
};

/**
 * 处理表格变化（分页、排序等）
 */
const onTableChange = (pagination) => {
        friendLinkStore.updatePagination({
                current: pagination.current,
                pageSize: pagination.pageSize
        });
        loadLinks();
};

/**
 * 处理搜索
 */
const handleSearch = () => {
        const statusVal = searchStatus.value;
        const statusParam = (statusVal != null && statusVal !== '') ? statusVal : undefined;
        friendLinkStore.updatePagination({current: 1});
        friendLinkStore.updateQueryParams({
                keyword: searchKeyword.value.trim(),
                status: statusParam
        });
        loadLinks();
};

/**
 * 处理重置
 */
const handleReset = () => {
        searchKeyword.value = '';
        searchStatus.value = undefined;
        friendLinkStore.updatePagination({current: 1});
        friendLinkStore.updateQueryParams({keyword: '', status: undefined});
        loadLinks();
};

/**
 * 打开详情抽屉
 */
const openDetail = (record) => {
        selectedLink.value = record;
        detailVisible.value = true;
};

/**
 * 关闭详情抽屉并清空选中
 */
const handleDetailClose = () => {
        selectedLink.value = null;
};

/**
 * 打开新建弹窗
 */
const openCreate = () => {
        createForm.value = {
                name: '',
                url: '',
                summary: '',
                remark: '',
                imageUrl: '',
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
        let canProceed;
        let errorMessage = '';
        const form = createForm.value;
        const hasForm = Boolean(form);
        if (hasForm) {
                const name = form.name?.trim() ?? '';
                const url = form.url?.trim() ?? '';
                const hasName = name.length > 0;
                const hasUrl = url.length > 0;
                const validUrl = hasUrl && /^https?:\/\/.+/.test(url);
                if (hasName && hasUrl && validUrl) {
                        canProceed = true;
                } else {
                        canProceed = false;
                        errorMessage = hasName ? (hasUrl ? '请输入有效的 http 或 https 链接' : '请输入 URL 地址') : '请输入链接名称';
                }
        } else {
                canProceed = false;
                errorMessage = '请填写表单';
        }
        if (canProceed) {
                createSubmitting.value = true;
                try {
                        await friendLinkStore.createLink({
                                name: form.name?.trim(),
                                url: form.url?.trim(),
                                summary: form.summary?.trim() || undefined,
                                remark: form.remark?.trim() || undefined,
                                imageUrl: form.imageUrl?.trim() || undefined,
                                sortOrder: form.sortOrder ?? 0
                        });
                        message.success('创建成功');
                        createVisible.value = false;
                        createForm.value = null;
                        loadLinks();
                } catch (e) {
                        message.error(e?.message || '创建失败');
                } finally {
                        createSubmitting.value = false;
                }
        } else {
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
                url: record.url,
                summary: record.summary ?? '',
                remark: record.remark ?? '',
                imageUrl: record.imageUrl ?? '',
                sortOrder: record.sortOrder ?? 0
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

        // 验证表单存在
        if (!form) {
                errorMessage = '表单数据不存在';
        } else if (!form.id) {
                errorMessage = '友情链接ID不存在';
        } else {
                const name = form.name?.trim() ?? '';
                const url = form.url?.trim() ?? '';
                const hasName = name.length > 0;
                const hasUrl = url.length > 0;
                const validUrl = hasUrl && /^https?:\/\/.+/.test(url);

                if (hasName && hasUrl && validUrl) {
                        canProceed = true;
                } else {
                        errorMessage = hasName ? (hasUrl ? '请输入有效的 http 或 https 链接' : '请输入 URL 地址') : '请输入链接名称';
                }
        }

        if (canProceed) {
                editSubmitting.value = true;
                try {
                        await friendLinkStore.updateLink(form.id, {
                                id: form.id,
                                name: form.name?.trim(),
                                url: form.url?.trim(),
                                summary: form.summary?.trim() || undefined,
                                remark: form.remark?.trim() || undefined,
                                imageUrl: form.imageUrl?.trim() || undefined,
                                sortOrder: form.sortOrder ?? 0
                        });
                        message.success('保存成功');
                        editVisible.value = false;
                        editForm.value = null;
                        loadLinks();
                } catch (e) {
                        message.error(e?.message || '保存失败');
                } finally {
                        editSubmitting.value = false;
                }
        } else {
                message.warning(errorMessage);
        }
};

/**
 * 变更友链审核状态（0=待审核，1=已通过，2=已拒绝）
 */
const handleStatusChange = async (record, status) => {
        try {
                await friendLinkStore.updateLinkStatus(record.id, status);
                message.success('状态已更新');
                loadLinks();
        } catch (e) {
                message.error(e?.message || '变更状态失败');
        }
};

/**
 * 处理删除
 */
const onDelete = async (record) => {
        try {
                await friendLinkStore.deleteLink(record.id);
                message.success('删除成功');
                loadLinks();
        } catch (e) {
                message.error(e?.message || '删除失败');
        }
};

// 初始加载
onMounted(() => {
        loadLinks();
});
</script>
