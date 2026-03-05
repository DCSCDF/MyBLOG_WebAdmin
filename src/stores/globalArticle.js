/*
 * [globalArticle.js]
 * --------------------------------------------------------------------------------
 * This software is licensed under the MIT License.
 * However, any distribution or modification must retain this copyright notice.
 * See LICENSE for full terms.
 * --------------------------------------------------------------------------------
 * author: "Jiu Liu"
 * author_contact: "QQ: 3209174373, GitHub: https://github.com/DCSCDF"
 * license: "MIT"
 * license_exception: "Mandatory attribution retention"
 * UpdateTime: 2026/3/5
 *
 */

import {defineStore} from 'pinia';
import {computed, ref} from 'vue';
import {globalArticleApi} from '../api/globalArticleApi.js';
import logger from '../utils/logger.js';

export const useGlobalArticleStore = defineStore('globalArticle', () => {
	// 文章列表
	const articles = ref([]);
	const loading = ref(false);

	// 分页信息
	const pagination = ref({
		current: 1,
		pageSize: 10,
		total: 0,
		pages: 0
	});

	// 查询参数
	const queryParams = ref({
		keyword: '',
		isHidden: undefined,
		isTop: undefined,
		isRecommend: undefined
	});

	// 筛选项配置
	const filterOptions = ref({});

	/**
	 * 检查值是否存在（非空、非 undefined、非 null）
	 */
	const hasValue = (value) => {
		return value !== null && value !== undefined && value !== '';
	};

	/**
	 * 构建请求参数
	 */
	const buildRequestParams = (params) => {
		const safeParams = params || {};

		// 基础分页参数
		const requestParams = {
			currentPage: safeParams.currentPage ?? pagination.value.current,
			pageSize: safeParams.pageSize ?? pagination.value.pageSize
		};

		// 可选查询参数 - 关键字
		const keyword = safeParams.keyword ?? queryParams.value.keyword;
		if (hasValue(keyword)) {
			requestParams.keyword = keyword;
		}

		// 可选查询参数 - 布尔筛选（需要区分 undefined 和 false）
		const filters = [
			{key: 'isHidden', value: safeParams.isHidden !== undefined ? safeParams.isHidden : queryParams.value.isHidden},
			{key: 'isTop', value: safeParams.isTop !== undefined ? safeParams.isTop : queryParams.value.isTop},
			{key: 'isRecommend', value: safeParams.isRecommend !== undefined ? safeParams.isRecommend : queryParams.value.isRecommend}
		];

		filters.forEach(({key, value}) => {
			if (value !== undefined) {
				requestParams[key] = value;
			}
		});

		return requestParams;
	};

	/**
	 * 处理 API 响应数据
	 */
	const processApiResponse = (response, pageSize) => {
		const {
			records = [],
			total = 0,
			current = 1,
			size = pageSize,
			pages = 0,
			filterOptions: options = {}
		} = response.data;

		articles.value = records.map((item) => ({...item, key: item.id}));
		pagination.value = {current, pageSize: size, total, pages};
		filterOptions.value = options;
		logger.log('全局文章列表获取成功，总数:', total);
	};

	/**
	 * 验证 API 响应是否有效
	 */
	const isValidResponse = (response) => {
		return response.success === true && response.data !== null && response.data !== undefined;
	};

	/**
	 * 获取错误消息
	 */
	const getErrorMessage = (response) => {
		return response.errorMsg || '获取全局文章列表失败';
	};

	/**
	 * 统一处理 API 成功/失败响应
	 */
	const handleApiResult = (res, successLog, errorMsgDefault) => {
		if (res.success === true) {
			logger.log(successLog);
			return res.data !== undefined && res.data !== null ? res.data : true;
		}
		const errorMessage = res.errorMsg || errorMsgDefault;
		logger.error(errorMessage);
		throw new Error(errorMessage);
	};

	/**
	 * 分页获取所有用户的文章列表
	 */
	const fetchArticles = async (params) => {
		let result = null;
		loading.value = true;
		try {
			const requestParams = buildRequestParams(params);
			const response = await globalArticleApi.list(requestParams);

			if (isValidResponse(response)) {
				processApiResponse(response, requestParams.pageSize);
				result = articles.value;
			} else {
				const errorMessage = getErrorMessage(response);
				logger.error(errorMessage);
				articles.value = [];
				pagination.value = {...pagination.value, total: 0, pages: 0};
				result = [];
			}
		} catch (error) {
			logger.error('获取全局文章列表失败:', error);
			articles.value = [];
			pagination.value = {...pagination.value, total: 0, pages: 0};
			result = [];
		} finally {
			loading.value = false;
		}
		return result;
	};

	/**
	 * 更新文章状态
	 */
	const updateArticleStatus = async (id, body) => {
		const res = await globalArticleApi.updateStatus(id, body);
		return handleApiResult(res, '文章状态更新成功', '更新文章状态失败');
	};

	/**
	 * 删除文章
	 */
	const deleteArticle = async (id) => {
		const res = await globalArticleApi.delete(id);
		return handleApiResult(res, '文章删除成功', '删除文章失败');
	};

	/**
	 * 更新分页
	 */
	const updatePagination = (newPagination) => {
		pagination.value = {...pagination.value, ...newPagination};
	};

	/**
	 * 更新查询参数
	 */
	const updateQueryParams = (newParams) => {
		queryParams.value = {...queryParams.value, ...newParams};
	};

	const currentArticles = computed(() => articles.value);
	const currentPagination = computed(() => pagination.value);

	return {
		articles,
		loading,
		pagination,
		queryParams,
		filterOptions,
		fetchArticles,
		updateArticleStatus,
		deleteArticle,
		updatePagination,
		updateQueryParams,
		currentArticles,
		currentPagination
	};
});
