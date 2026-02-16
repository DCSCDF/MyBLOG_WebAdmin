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
 * UpdateTime: 2026/2/13 15:35
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

	// 分页信息
	const pagination = ref({
		current: 1,
		pageSize: 10,
		total: 0
	});

	// 查询参数
	const queryParams = ref({
		sorter: {},
		filters: {}
	});

	/**
	 * 获取权限列表
	 * @param {Object} params - 查询参数
	 * @param {number} params.currentPage - 当前页码
	 * @param {number} params.pageSize - 页面大小
	 * @returns {Promise<Array>} 权限列表
	 */
	const fetchPermissions = async (params = {}) => {
		loading.value = true;
		try {
			const requestParams = {
				currentPage: params.currentPage || pagination.value.current,
				pageSize: params.pageSize || pagination.value.pageSize,
				...queryParams.value.sorter,
				...queryParams.value.filters
			};

			logger.log('获取权限列表请求参数:', requestParams);

			const response = await permissionApi.permissionList(requestParams);

			if (response.success === true && response.data) {
				const paginationData = response.data;
				const permissionData = paginationData.records || [];
				const total = paginationData.total || 0;

				// 格式化数据
				const formattedData = permissionData.map((item, index) => ({
					...item,
					key: item.id,
					order: item.sortOrder || (index + 1)
				}));

				permissions.value = formattedData;
				pagination.value.total = total;
				pagination.value.current = requestParams.currentPage;
				pagination.value.pageSize = requestParams.pageSize;

				logger.log('权限列表获取成功，总数:', total);
				return formattedData;
			} else {
				const errorMsg = response.errorMsg || '获取权限列表失败';
				logger.error('获取权限列表失败:', errorMsg);
				throw new Error(errorMsg);
			}
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
	 * 更新查询参数
	 * @param {Object} newParams - 新查询参数
	 */
	const updateQueryParams = (newParams) => {
		queryParams.value = {
			...queryParams.value,
			...newParams
		};
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
		queryParams.value = {
			sorter: {},
			filters: {}
		};
		logger.log('权限状态已清理');
	};



	// 计算属性
	const hasPermissions = computed(() => permissions.value.length > 0);
	const currentPermissions = computed(() => permissions.value);

	return {
		// 状态
		permissions,
		loading,
		pagination,
		queryParams,

		// 方法
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