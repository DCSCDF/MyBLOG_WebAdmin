/*
 * [seo.js]
 * --------------------------------------------------------------------------------
 * This software is licensed under the MIT License.
 * However, any distribution or modification must retain this copyright notice.
 * See LICENSE for full terms.
 * --------------------------------------------------------------------------------
 * author: "Jiu Liu"
 * author_contact: "QQ: 3209174373, GitHub: https://github.com/DCSCDF"
 * license: "MIT"
 * license_exception: "Mandatory attribution retention"
 * UpdateTime: 2026/2/21 00:00
 *
 */

import {defineStore} from 'pinia';
import {computed, ref} from 'vue';
import {seoApi} from '../api/system/seoApi.js';
import logger from '../utils/logger.js';

export const useSeoStore = defineStore('seo', () => {
	// SEO配置列表
	const seoList = ref([]);
	const loading = ref(false);

	// 分页信息（与后端字段对应：current, size, total, pages）
	const pagination = ref({
		current: 1,
		pageSize: 10,
		total: 0,
		pages: 0
	});

	// 查询参数（keyword 搜索关键词，isSystem 是否系统内置；页面类型不做筛选项，由后端 filterOptions 提供）
	const queryParams = ref({
		keyword: '',
		isSystem: undefined
	});

	/** 列表接口返回的筛选项，用于渲染下拉等（filterOptions.isSystem） */
	const filterOptions = ref({});

	// 当前选中的SEO配置详情
	const seoDetail = ref(null);
	const seoDetailLoading = ref(false);

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
		const isSystem = safeParams.isSystem !== undefined ? safeParams.isSystem : queryParams.value.isSystem;

		const requestParams = {
			currentPage,
			pageSize
		};

		// 只有当 keyword 存在时才添加到请求参数中
		if (hasValue(keyword)) {
			requestParams.keyword = keyword;
		}

		// 只有当 isSystem 已定义时才添加到请求参数中
		if (isDefined(isSystem)) {
			requestParams.isSystem = isSystem;
		}

		return requestParams;
	};

	/**
	 * 处理 API 响应数据
	 * @param {Object} response - API 响应
	 * @param {number} pageSize - 当前页面大小
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

		seoList.value = records.map((item) => ({...item, key: item.id}));
		pagination.value = {current, pageSize: size, total, pages};
		filterOptions.value = options;

		logger.log('SEO配置列表获取成功，总数:', total);
	};

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
	 * 分页获取SEO配置列表
	 * @param {Object} params - { currentPage, pageSize, keyword?, isSystem? }
	 * @returns {Promise<Array>}
	 */
	const fetchSeoList = async (params) => {
		let result = null;
		loading.value = true;

		try {
			const requestParams = buildRequestParams(params);
			const response = await seoApi.list(requestParams);

			// 使用正向条件判断
			if (isValidResponse(response)) {
				processApiResponse(response, requestParams.pageSize);
				result = seoList.value;
			} else {
				// API 响应无效，记录错误并返回空结果
				const errorMessage = getErrorMessage(response);
				logger.error(errorMessage);
				seoList.value = [];
				pagination.value = {
					...pagination.value,
					total: 0,
					pages: 0
				};
				// 不抛出异常，而是返回空结果
				result = [];
			}
		} catch (error) {
			// 处理网络错误或其他意外错误
			logger.error('获取SEO配置列表失败:', error);
			seoList.value = [];
			pagination.value = {
				...pagination.value,
				total: 0,
				pages: 0
			};
			result = [];
		} finally {
			loading.value = false;
		}

		return result;
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
		return response.errorMsg || '获取SEO配置列表失败';
	};

	/**
	 * 根据 ID 获取SEO配置详情
	 * @param {number} id - SEO配置 ID
	 * @returns {Promise<Object|null>}
	 */
	const fetchSeoById = async (id) => {
		seoDetailLoading.value = true;
		let result = null;

		try {
			const res = await seoApi.getById(id);
			if (res.success === true && res.data) {
				seoDetail.value = res.data;
				result = res.data;
			} else {
				// API 响应无效，记录错误并返回 null
				const errorMessage = res.errorMsg || '获取SEO配置详情失败';
				logger.error(errorMessage);
				seoDetail.value = null;
				result = null;
			}
		} catch (error) {
			// 处理网络错误或其他意外错误
			logger.error('获取SEO配置详情失败:', error);
			seoDetail.value = null;
			result = null;
		} finally {
			seoDetailLoading.value = false;
		}

		return result;
	};

	/**
	 * 创建SEO配置
	 * @param {Object} body - SEO配置数据
	 * @returns {Promise<Object|boolean>}
	 */
	const createSeo = async (body) => {
		const res = await seoApi.create(body);
		if (res.success === true) {
			logger.log('SEO配置创建成功');
			return res.data || true;
		} else {
			// API 响应失败，抛出错误让上层捕获
			const errorMessage = res.errorMsg || '创建SEO配置失败';
			logger.error(errorMessage);
			throw new Error(errorMessage);
		}
	};

	/**
	 * 修改SEO配置
	 * @param {number} id - SEO配置 ID
	 * @param {Object} body - SEO配置数据
	 * @returns {Promise<Object|boolean>}
	 */
	const updateSeo = async (id, body) => {
		const res = await seoApi.update(id, body);
		if (res.success === true) {
			logger.log('SEO配置修改成功:', id);
			return res.data || true;
		} else {
			// API 响应失败，抛出错误让上层捕获
			const errorMessage = res.errorMsg || '修改SEO配置失败';
			logger.error(errorMessage);
			throw new Error(errorMessage);
		}
	};

	/**
	 * 删除SEO配置（逻辑删除）
	 * @param {number} id - SEO配置 ID
	 * @returns {Promise<boolean>}
	 */
	const deleteSeo = async (id) => {
		let result;

		try {
			const res = await seoApi.delete(id);
			if (res.success === true) {
				logger.log('SEO配置删除成功:', id);
				result = true;
			} else {
				// API 响应失败，记录错误并返回 false
				const errorMessage = res.errorMsg || '删除SEO配置失败';
				logger.error(errorMessage);
				result = false;
			}
		} catch (error) {
			// 处理网络错误或其他意外错误
			logger.error('删除SEO配置失败:', error);
			result = false;
		}

		return result;
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
	 * @param {Object} newParams - { keyword?, isSystem? }
	 */
	const updateQueryParams = (newParams) => {
		queryParams.value = {...queryParams.value, ...newParams};
	};

	/**
	 * 清空SEO配置详情缓存
	 */
	const clearSeoDetail = () => {
		seoDetail.value = null;
	};

	const currentSeoList = computed(() => seoList.value);
	const currentPagination = computed(() => pagination.value);

	return {
		seoList,
		loading,
		pagination,
		queryParams,
		filterOptions,
		seoDetail,
		seoDetailLoading,
		fetchSeoList,
		fetchSeoById,
		createSeo,
		updateSeo,
		deleteSeo,
		updatePagination,
		updateQueryParams,
		clearSeoDetail,
		currentSeoList,
		currentPagination
	};
});
