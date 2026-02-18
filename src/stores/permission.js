/*
 * [permission.js]
 * --------------------------------------------------------------------------------
 * This software is licensed under the MIT License.
 * However, any distribution or modification must retain this copyright notice.
 * See LICENSE for full terms.
 * --------------------------------------------------------------------------------
 * author: "Jiu Liu"
 * author_contact: "QQ: 3209174373, GitHub: https://github.com/DCSCDF"
 * license: "MIT"
 * license_exception: "Mandatory attribution retention"
 * UpdateTime: 2026/2/18 10:36
 *
 */

/**
 * 权限状态管理 Store
 * 管理用户权限相关的状态，包括权限列表、权限组等
 */

import {defineStore} from 'pinia';
import {computed, ref} from 'vue';
import {permissionApi} from '../api/user/auth/permission.js';
import logger from '../utils/logger.js';

export const usePermissionStore = defineStore('permission', () => {
	// 权限列表状态
	const permissions = ref([]);
	const loading = ref(false);

	// 分页信息（与后端一致：currentPage/pageSize 请求，响应 current/size/total/pages）
	const pagination = ref({
		current: 1,
		pageSize: 10,
		total: 0,
		pages: 0
	});

	// 查询参数（keyword 模糊匹配 code/name/description）
	const queryParams = ref({
		keyword: ''
	});

	/** 列表接口返回的 filterOptions（权限列表为空对象 {}） */
	const filterOptions = ref({});

	/**
	 * 获取权限列表
	 * @param {Object} params - 查询参数
	 * @param {number} params.currentPage - 当前页码
	 * @param {number} params.pageSize - 页面大小
	 * @returns {Promise<Array>} 权限列表
	 */
	    // 辅助函数：处理参数默认值
	const getCurrentPage = (params) => {
		    const hasCurrentPage = params.currentPage !== undefined;
		    return hasCurrentPage ? params.currentPage : pagination.value.current;
	    };

	const getPageSize = (params) => {
		const hasPageSize = params.pageSize !== undefined;
		return hasPageSize ? params.pageSize : pagination.value.pageSize;
	};

	const getKeyword = (params) => {
		const hasKeywordParam = params.keyword !== undefined;
		return hasKeywordParam ? params.keyword : queryParams.value.keyword;
	};

	// 辅助函数：构建请求参数
	const buildRequestParams = (currentPage, pageSize, keyword) => {
		const requestParams = {currentPage, pageSize};
		const hasValidKeyword = keyword != null && String(keyword).trim().length > 0;
		if (hasValidKeyword) {
			requestParams.keyword = String(keyword).trim();
		}
		return requestParams;
	};

	// 辅助函数：验证响应数据
	const validateResponse = (response) => {
		const isSuccessResponse = response.success === true && response.data != null;
		if (!isSuccessResponse) {
			throw new Error(response.errorMsg || '获取权限列表失败');
		}
		return response.data;
	};

	// 辅助函数：格式化权限数据
	const formatPermissionData = (permissionData) => {
		return permissionData.map((item, index) => ({
			...item,
			key: item.id,
			order: item.sortOrder || (index + 1)
		}));
	};

	// 辅助函数：更新状态
	const updatePermissionState = (formattedData, paginationData, currentPage, pageSize) => {
		permissions.value = formattedData;
		pagination.value = {
			current: paginationData.current ?? currentPage,
			pageSize: paginationData.size ?? pageSize,
			total: paginationData.total || 0,
			pages: paginationData.pages ?? 0
		};
		filterOptions.value = paginationData.filterOptions ?? {};
	};

	/**
	 * 分页获取权限列表（支持 keyword 模糊匹配 code/name/description）
	 * @param {Object} params - { currentPage?, pageSize?, keyword? }
	 */
	const fetchPermissions = async (params = {}) => {
		loading.value = true;
		try {
			// 处理参数
			const currentPage = getCurrentPage(params);
			const pageSize = getPageSize(params);
			const keyword = getKeyword(params);

			// 构建请求参数
			const requestParams = buildRequestParams(currentPage, pageSize, keyword);
			logger.log('获取权限列表请求参数:', requestParams);

			// 发送请求并验证响应
			const response = await permissionApi.permissionList(requestParams);
			const paginationData = validateResponse(response);

			// 处理数据
			const permissionData = paginationData.records || [];
			const formattedData = formatPermissionData(permissionData);

			// 更新状态
			updatePermissionState(formattedData, paginationData, currentPage, pageSize);
			logger.log('权限列表获取成功，总数:', paginationData.total || 0);

			return formattedData;
		} catch (error) {
			logger.error('获取权限列表失败:', error);
			permissions.value = [];
			pagination.value.total = 0;
			throw error;
		} finally {
			loading.value = false;
		}
	};

	/**
	 * 刷新权限列表
	 */
	const refreshPermissions = async () => {
		return await fetchPermissions();
	};

	/**
	 * 更新分页信息
	 * @param {Object} newPagination - 新的分页信息
	 */
	const updatePagination = (newPagination) => {
		pagination.value = {
			...pagination.value,
			...newPagination
		};
	};

	/**
	 * 更新查询参数（keyword 等）
	 * @param {Object} newParams - { keyword? }
	 */
	const updateQueryParams = (newParams) => {
		queryParams.value = {...queryParams.value, ...newParams};
	};

	/**
	 * 清理权限状态
	 */
	const clearPermissionState = () => {
		permissions.value = [];
		loading.value = false;
		pagination.value = {
			current: 1,
			pageSize: 10,
			total: 0
		};
		queryParams.value = {keyword: ''};
		filterOptions.value = {};
		logger.log('权限状态已清理');
	};


	// 计算属性
	const hasPermissions = computed(() => permissions.value.length > 0);
	const currentPermissions = computed(() => permissions.value);

	return {
		permissions,
		loading,
		pagination,
		queryParams,
		filterOptions,
		fetchPermissions,
		refreshPermissions,
		updatePagination,
		updateQueryParams,
		clearPermissionState,

		// 计算属性
		hasPermissions,
		currentPermissions
	};
});