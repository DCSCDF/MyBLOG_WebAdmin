/*
 * [category.js]
 * --------------------------------------------------------------------------------
 * This software is licensed under the MIT License.
 * However, any distribution or modification must retain this copyright notice.
 * See LICENSE for full terms.
 * --------------------------------------------------------------------------------
 * author: "Jiu Liu"
 * author_contact: "QQ: 3209174373, GitHub: https://github.com/DCSCDF"
 * license: "MIT"
 * license_exception: "Mandatory attribution retention"
 * UpdateTime: 2026/3/4
 *
 */

import {defineStore} from 'pinia';
import {computed, ref} from 'vue';
import {categoryApi} from '../api/system/categoryApi.js';
import logger from '../utils/logger.js';

export const useCategoryStore = defineStore('category', () => {
	// 分类列表
	const categories = ref([]);
	const loading = ref(false);

	// 分页信息（与后端字段对应：current, size, total, pages）
	const pagination = ref({
		current: 1,
		pageSize: 10,
		total: 0,
		pages: 0
	});

	// 查询参数（keyword 匹配 name/description，hidden=false/true）
	const queryParams = ref({
		keyword: '',
		hidden: undefined
	});

	/** 列表接口返回的筛选项，用于渲染隐藏状态下拉（filterOptions.hidden） */
	const filterOptions = ref({});

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
		const hidden = safeParams.hidden !== undefined ? safeParams.hidden : queryParams.value.hidden;

		const requestParams = {
			currentPage,
			pageSize
		};

		if (hasValue(keyword)) {
			requestParams.keyword = keyword;
		}
		if (isDefined(hidden)) {
			requestParams.hidden = hidden;
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

		categories.value = records.map((item) => ({...item, key: item.id}));
		pagination.value = {current, pageSize: size, total, pages};
		filterOptions.value = options;
		logger.log('分类列表获取成功，总数:', total);
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
		return response.errorMsg || '获取分类列表失败';
	};

	/**
	 * 分页获取分类列表
	 * @param {Object} params - { currentPage, pageSize, keyword?, hidden? }
	 * @returns {Promise<Array>}
	 */
	const fetchCategories = async (params) => {
		let result = null;
		loading.value = true;
		try {
			const requestParams = buildRequestParams(params);
			const response = await categoryApi.list(requestParams);

			if (isValidResponse(response)) {
				processApiResponse(response, requestParams.pageSize);
				result = categories.value;
			} else {
				const errorMessage = getErrorMessage(response);
				logger.error(errorMessage);
				categories.value = [];
				pagination.value = {...pagination.value, total: 0, pages: 0};
				result = [];
			}
		} catch (error) {
			logger.error('获取分类列表失败:', error);
			categories.value = [];
			pagination.value = {...pagination.value, total: 0, pages: 0};
			result = [];
		} finally {
			loading.value = false;
		}
		return result;
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
	 * 创建分类
	 * @param {Object} body - { name, description?, sortOrder? }
	 * @returns {Promise<Object|boolean>}
	 */
	const createCategory = async (body) => {
		const res = await categoryApi.create(body);
		return handleApiResult(res, '分类创建成功', '创建分类失败');
	};

	/**
	 * 修改分类
	 * @param {number} id - 分类 ID
	 * @param {Object} body - { name?, description?, sortOrder?, hidden? }
	 * @returns {Promise<Object|boolean>}
	 */
	const updateCategory = async (id, body) => {
		const res = await categoryApi.update(id, body);
		return handleApiResult(res, '分类修改成功: ' + id, '修改分类失败');
	};

	/**
	 * 删除分类（物理删除）
	 * @param {number} id - 分类 ID
	 * @returns {Promise<boolean>}
	 */
	const deleteCategory = async (id) => {
		const res = await categoryApi.delete(id);
		return handleApiResult(res, '分类删除成功: ' + id, '删除分类失败');
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
	 * @param {Object} newParams - { keyword?, hidden? }
	 */
	const updateQueryParams = (newParams) => {
		queryParams.value = {...queryParams.value, ...newParams};
	};

	const currentCategories = computed(() => categories.value);
	const currentPagination = computed(() => pagination.value);

	return {
		categories,
		loading,
		pagination,
		queryParams,
		filterOptions,
		fetchCategories,
		createCategory,
		updateCategory,
		deleteCategory,
		updatePagination,
		updateQueryParams,
		currentCategories,
		currentPagination
	};
});

