<!--
  - [GlobalArticle.vue]
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
                                <h2 class="font-bold text-lg mb-1">全局文章管理</h2>
                                <span class="text-sm text-gray-600">管理所有用户的文章，支持分页、关键词与状态筛选。</span>
                        </div>
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
                                <div class="search-filter-item flex items-center gap-1 rounded-md min-w-0 my-1">
                                        <a-select
                                            v-model:value="searchTop"
                                            allow-clear
                                            placeholder="是否置顶">
                                                <a-select-option
                                                    v-for="opt in topFilterOptions"
                                                    :key="opt.value"
                                                    :value="opt.value">{{ opt.label }}
                                                </a-select-option>
                                        </a-select>
                                </div>
                                <div class="search-filter-item flex items-center gap-1 rounded-md min-w-0 my-1">
                                        <a-select
                                            v-model:value="searchRecommend"
                                            allow-clear
                                            placeholder="是否推荐">
                                                <a-select-option
                                                    v-for="opt in recommendFilterOptions"
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
                    :data-source="articleStore.currentArticles"
                    :loading="articleStore.loading"
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
                                                        <a class="font-medium hover:text-blue-500">
                                                                {{ record.title }}
                                                        </a>
                                                        <span v-if="record.summary"
                                                              class="text-xs text-gray-400 truncate max-w-[200px]">
                                                                {{ record.summary }}
                                                        </span>
                                                </div>
                                        </div>
                                </template>
                                <template v-else-if="column.key === 'author'">
                                        <span>{{ record.authorNickname || '用户已注销' }}</span>
                                </template>
                                <template v-else-if="column.key === 'tags'">
                                        <a-space v-if="record.tags" :size="4">
                                                <a-tag v-for="(tag, index) in record.tags.split(',').slice(0, 3)"
                                                       :key="index" color="blue">
                                                        {{ tag }}
                                                </a-tag>
                                                <a-tag v-if="record.tags.split(',').length > 3" color="default">
                                                        +{{ record.tags.split(',').length - 3 }}
                                                </a-tag>
                                        </a-space>
                                        <span v-else class="text-gray-400">-</span>
                                </template>
                                <template v-else-if="column.key === 'viewCount'">
                                        <span>{{ record.viewCount || 0 }}</span>
                                </template>
                                <template v-else-if="column.key === 'commentCount'">
                                        <span>{{ record.commentCount || 0 }}</span>
                                </template>
                                <template v-else-if="column.key === 'likeCount'">
                                        <span>{{ record.likeCount || 0 }}</span>
                                </template>
                                <template v-else-if="column.key === 'isHidden'">
                                        <a-tag :bordered="false" :color="record.isHidden ? 'red' : 'green'">
                                                {{ record.isHidden ? '隐藏' : '显示' }}
                                        </a-tag>
                                </template>
                                <template v-else-if="column.key === 'isTop'">
                                        <a-tag :bordered="false" :color="record.isTop ? 'gold' : 'default'">
                                                {{ record.isTop ? '置顶' : '不置顶' }}
                                        </a-tag>
                                </template>
                                <template v-else-if="column.key === 'isRecommend'">
                                        <a-tag :bordered="false" :color="record.isRecommend ? 'purple' : 'default'">
                                                {{ record.isRecommend ? '推荐' : '不推荐' }}
                                        </a-tag>
                                </template>
                                <template v-else-if="column.key === 'action'">
                                        <a-space>
                                                <a-button size="small" type="link" @click="toggleHidden(record)">
                                                        {{ record.isHidden ? '显示' : '隐藏' }}
                                                </a-button>
                                                <a-button size="small" type="link" @click="toggleTop(record)">
                                                        {{ record.isTop ? '取消置顶' : '设为置顶' }}
                                                </a-button>
                                                <a-button size="small" type="link" @click="toggleRecommend(record)">
                                                        {{ record.isRecommend ? '取消推荐' : '设为推荐' }}
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
</template>

<script setup>
import {computed, onMounted, ref} from 'vue';
import {message} from 'ant-design-vue';
import {FileTextOutlined, SearchOutlined} from '@ant-design/icons-vue';
import {useGlobalArticleStore} from '../../../../stores/globalArticle.js';

const articleStore = useGlobalArticleStore();

// 搜索与筛选
const searchKeyword = ref('');
const searchHidden = ref(undefined);
const searchTop = ref(undefined);
const searchRecommend = ref(undefined);

// 筛选项配置
const defaultHiddenOptions = [
        {value: null, label: '全部'},
        {value: false, label: '显示'},
        {value: true, label: '隐藏'}
];

const defaultTopOptions = [
        {value: null, label: '全部'},
        {value: false, label: '不置顶'},
        {value: true, label: '置顶'}
];

const defaultRecommendOptions = [
        {value: null, label: '全部'},
        {value: false, label: '不推荐'},
        {value: true, label: '推荐'}
];

/** 隐藏状态下拉选项 */
const hiddenFilterOptions = computed(() => {
        const options = articleStore.filterOptions?.isHidden;
        const useApiOptions = Array.isArray(options) && options.length > 0;
        return useApiOptions ? options : defaultHiddenOptions;
});

/** 置顶状态下拉选项 */
const topFilterOptions = computed(() => {
        const options = articleStore.filterOptions?.isTop;
        const useApiOptions = Array.isArray(options) && options.length > 0;
        return useApiOptions ? options : defaultTopOptions;
});

/** 推荐状态下拉选项 */
const recommendFilterOptions = computed(() => {
        const options = articleStore.filterOptions?.isRecommend;
        const useApiOptions = Array.isArray(options) && options.length > 0;
        return useApiOptions ? options : defaultRecommendOptions;
});

// 表格列定义
const columns = [
        {title: 'ID', dataIndex: 'id', key: 'id', width: 70},
        {title: '文章', key: 'title', width: 280},
        {title: '作者', key: 'author', width: 160},
        {title: '标签', key: 'tags', width: 140},
        {title: '浏览量', key: 'viewCount', width: 80},
        {title: '评论数', key: 'commentCount', width: 80},
        {title: '点赞数', key: 'likeCount', width: 80},

        {title: '隐藏', key: 'isHidden', width: 70},
        {title: '置顶', key: 'isTop', width: 70},
        {title: '推荐', key: 'isRecommend', width: 70},

        {title: '操作', key: 'action', width: 280, fixed: 'right'}
];

// 表格分页配置
const tablePagination = computed(() => ({
        current: articleStore.pagination.current,
        pageSize: articleStore.pagination.pageSize,
        total: articleStore.pagination.total,
        showSizeChanger: true,
        showTotal: (total) => `共 ${total} 条`
}));

/**
 * 检查值是否有效（非 undefined、非 null、非空字符串）
 */
const isValidValue = (value) => {
        return value !== undefined && value !== null && value !== '';
};

/**
 * 加载文章列表
 */
const loadArticles = () => {
        const params = {
                currentPage: articleStore.pagination.current,
                pageSize: articleStore.pagination.pageSize
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

        // 处理置顶状态参数
        const topRaw = searchTop.value;
        if (isValidValue(topRaw)) {
                params.isTop = topRaw;
        }

        // 处理推荐状态参数
        const recommendRaw = searchRecommend.value;
        if (isValidValue(recommendRaw)) {
                params.isRecommend = recommendRaw;
        }

        articleStore.fetchArticles(params).catch((e) => {
                message.error(e?.message || '加载文章列表失败');
        });
};

/**
 * 处理表格变化（分页、排序等）
 */
const onTableChange = (pagination) => {
        articleStore.updatePagination({
                current: pagination.current,
                pageSize: pagination.pageSize
        });
        loadArticles();
};

/**
 * 处理搜索
 */
const handleSearch = () => {
        articleStore.updatePagination({current: 1});
        articleStore.updateQueryParams({
                keyword: searchKeyword.value.trim(),
                isHidden: searchHidden.value,
                isTop: searchTop.value,
                isRecommend: searchRecommend.value
        });
        loadArticles();
};

/**
 * 处理重置
 */
const handleReset = () => {
        searchKeyword.value = '';
        searchHidden.value = undefined;
        searchTop.value = undefined;
        searchRecommend.value = undefined;
        articleStore.updatePagination({current: 1});
        articleStore.updateQueryParams({
                keyword: '',
                isHidden: undefined,
                isTop: undefined,
                isRecommend: undefined
        });
        loadArticles();
};

/**
 * 切换隐藏状态
 */
const toggleHidden = async (record) => {
        const newValue = !record.isHidden;

        try {
                await articleStore.updateArticleStatus(record.id, {isHidden: newValue});
                message.success(newValue ? '文章已隐藏' : '文章已显示');
                loadArticles();
        } catch (e) {
                message.error(e?.message || '更新状态失败');
        }
};

/**
 * 切换置顶状态
 */
const toggleTop = async (record) => {
        const newValue = !record.isTop;

        try {
                await articleStore.updateArticleStatus(record.id, {isTop: newValue});
                message.success(newValue ? '文章已置顶' : '文章已取消置顶');
                loadArticles();
        } catch (e) {
                message.error(e?.message || '更新状态失败');
        }
};

/**
 * 切换推荐状态
 */
const toggleRecommend = async (record) => {
        const newValue = !record.isRecommend;

        try {
                await articleStore.updateArticleStatus(record.id, {isRecommend: newValue});
                message.success(newValue ? '文章已推荐' : '文章已取消推荐');
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
                await articleStore.deleteArticle(record.id);
                message.success('删除成功');
                loadArticles();
        } catch (e) {
                message.error(e?.message || '删除失败');
        }
};

// 初始加载
onMounted(() => {
        loadArticles();
});
</script>

<style scoped>
</style>
