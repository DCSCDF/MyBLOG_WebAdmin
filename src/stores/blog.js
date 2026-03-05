/*
 * [blog.js]
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
import {blogApi} from '../api/blog/blogApi.js';
import logger from '../utils/logger.js';

export const useBlogStore = defineStore('blog', () => {
	// 文章列表
	const articles = ref([]);
	const loading = ref(false);

	// 分页信息（与后端字段对应：current, size, total, pages）
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

	/** 列表接口返回的筛选项，用于渲染筛选下拉 */
	const filterOptions = ref({});

	/** 当前编辑的文章详情 */
	const currentArticle = ref(null);

	/**
	 * 检查值是否存在（非空、非undefined、非null）
	 * @param {*} value - 待检查的值
	 * @returns {boolean}
	 */
	const hasValue = (value) => {
		return value !== null && value !== undefined && value !== '';
	};

	/**
	 * 检查值是否已定义
	 * @param {*} value - 待检查的值
	 * @returns {boolean}
	 */
	const isDefined = (value) => {
		return value !== undefined;
	};

	/**
	 * 构建请求参数
	 * @param {Object} params - 输入参数
	 * @returns {Object} 处理后的请求参数
	 */
	const buildRequestParams = (params) => {
		const safeParams = params || {};

		const currentPage = safeParams.currentPage ?? pagination.value.current;
		const pageSize = safeParams.pageSize ?? pagination.value.pageSize;
		const keyword = safeParams.keyword ?? queryParams.value.keyword;
		const isHidden = safeParams.isHidden !== undefined ? safeParams.isHidden : queryParams.value.isHidden;
		const isTop = safeParams.isTop !== undefined ? safeParams.isTop : queryParams.value.isTop;
		const isRecommend = safeParams.isRecommend !== undefined ? safeParams.isRecommend : queryParams.value.isRecommend;

		const requestParams = {
			currentPage,
			pageSize
		};

		if (hasValue(keyword)) {
			requestParams.keyword = keyword;
		}
		if (isDefined(isHidden)) {
			requestParams.isHidden = isHidden;
		}
		if (isDefined(isTop)) {
			requestParams.isTop = isTop;
		}
		if (isDefined(isRecommend)) {
			requestParams.isRecommend = isRecommend;
		}

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
		logger.log('文章列表获取成功，总数:', total);
	};

	/**
	 * 验证 API 响应是否有效
	 * @param {Object} response - API 响应
	 * @returns {boolean}
	 */
	const isValidResponse = (response) => {
		return response.success === true && response.data !== null && response.data !== undefined;
	};

	/**
	 * 获取错误消息
	 * @param {Object} response - API 响应
	 * @returns {string}
	 */
	const getErrorMessage = (response) => {
		return response.errorMsg || '获取文章列表失败';
	};

	/**
	 * 统一处理 API 成功/失败响应
	 * @param {Object} res - 接口响应
	 * @param {string} successLog - 成功时日志文案
	 * @param {string} errorMsgDefault - 失败时默认错误文案
	 * @returns {Object|boolean}
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
	 * 分页获取文章列表
	 * @param {Object} params - { currentPage, pageSize, keyword?, isHidden?, isTop?, isRecommend? }
	 * @returns {Promise<Array>}
	 */
	const fetchArticles = async (params) => {
		let result = null;
		loading.value = true;
		try {
			const requestParams = buildRequestParams(params);
			const response = await blogApi.list(requestParams);

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
			logger.error('获取文章列表失败:', error);
			articles.value = [];
			pagination.value = {...pagination.value, total: 0, pages: 0};
			result = [];
		} finally {
			loading.value = false;
		}
		return result;
	};

	/**
	 * 获取文章详情
	 * @param {number} id - 文章ID
	 * @returns {Promise<Object>}
	 */
	const fetchArticleDetail = async (id) => {
		loading.value = true;
		let result = null;
		try {
			const response = await blogApi.get(id);
			if (isValidResponse(response)) {
				currentArticle.value = response.data;
				logger.log('文章详情获取成功:', id);
				result = response.data;
			} else {
				const errorMessage = getErrorMessage(response);
				logger.error(errorMessage);
				// API 响应无效时，返回 null 而不是抛出异常
				result = null;
			}
		} catch (error) {
			logger.error('获取文章详情失败:', error);
			throw error;
		} finally {
			loading.value = false;
		}
		return result;
	};

	/**
	 * 更新文章状态
	 * @param {number} id - 文章ID
	 * @param {Object} body - { isHidden?, isTop?, isRecommend? }
	 * @returns {Promise<Object|boolean>}
	 */
	const updateArticleStatus = async (id, body) => {
		const res = await blogApi.updateStatus(id, body);
		return handleApiResult(res, '文章状态更新成功', '更新文章状态失败');
	};

	/**
	 * 更新文章内容
	 * @param {number} id - 文章ID
	 * @param {Object} body - { title?, summary?, content?, htmlContent?, coverImage?, tags?, categoryId? }
	 * @returns {Promise<Object|boolean>}
	 */
	const updateArticle = async (id, body) => {
		const res = await blogApi.update(id, body);
		return handleApiResult(res, '文章更新成功', '更新文章失败');
	};

	/**
	 * 删除文章
	 * @param {number} id - 文章ID
	 * @returns {Promise<boolean>}
	 */
	const deleteArticle = async (id) => {
		const res = await blogApi.delete(id);
		return handleApiResult(res, '文章删除成功', '删除文章失败');
	};

	/**
	 * 更新分页
	 * @param {Object} newPagination - { current?, pageSize? }
	 */
	const updatePagination = (newPagination) => {
		pagination.value = {...pagination.value, ...newPagination};
	};

	/**
	 * 更新查询参数
	 * @param {Object} newParams - { keyword?, isHidden?, isTop?, isRecommend? }
	 */
	const updateQueryParams = (newParams) => {
		queryParams.value = {...queryParams.value, ...newParams};
	};

	/**
	 * 清空当前文章详情
	 */
	const clearCurrentArticle = () => {
		currentArticle.value = null;
	};

	const currentArticles = computed(() => articles.value);
	const currentPagination = computed(() => pagination.value);

	return {
		articles,
		loading,
		pagination,
		queryParams,
		filterOptions,
		currentArticle,
		fetchArticles,
		fetchArticleDetail,
		updateArticleStatus,
		updateArticle,
		deleteArticle,
		updatePagination,
		updateQueryParams,
		clearCurrentArticle,
		currentArticles,
		currentPagination
	};
});
