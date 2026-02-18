/*
 * [permissiongroup.js]
 * --------------------------------------------------------------------------------
 * This software is licensed under the MIT License.
 * However, any distribution or modification must retain this copyright notice.
 * See LICENSE for full terms.
 * --------------------------------------------------------------------------------
 * author: "Jiu Liu"
 * author_contact: "QQ: 3209174373, GitHub: https://github.com/DCSCDF"
 * license: "MIT"
 * license_exception: "Mandatory attribution retention"
 * UpdateTime: 2026/2/18 10:47
 *
 */


import {defineStore} from 'pinia';
import {computed} from 'vue';
import {permissionGroupApi} from '../api/system/permissionGroupApi.js';
import logger from '../utils/logger.js';
import {createState} from './modules/permissionGroup/state.js';
import {buildPermissionGroupQueryParams} from './modules/permissionGroup/builder.js';
import {processPermissionGroupResponse} from './modules/permissionGroup/processor.js';

export const usePermissionGroupStore = defineStore('permissionGroup', () => {
	// 初始化状态
	const state = createState();
	const {
		permissionGroups,
		loading,
		pagination,
		queryParams,
		filterOptions,
		groupPermissions,
		groupPermissionsLoading
	} = state;


	/**
	 * 分页获取权限组列表（支持 keyword/status/isSystem）
	 * @returns {Promise<Array>}
	 * @param {Object} params - 查询参数对象
	 * @param {number} [params.currentPage] - 当前页码
	 * @param {number} [params.page] - 页码（备选）
	 * @param {number} [params.pageSize] - 每页大小
	 * @param {string} [params.keyword] - 关键词搜索
	 * @param {number} [params.status] - 状态筛选
	 * @param {number} [params.isSystem] - 是否系统权限组
	 */
	const fetchPermissionGroups = async (params) => {
		loading.value = true;
		let result = [];

		try {
			const requestParams = buildPermissionGroupQueryParams(params, state);
			const res = await permissionGroupApi.list(requestParams);

			if (res.success === true && res.data) {
				processPermissionGroupResponse(res.data, requestParams.pageSize, state);
				logger.log('权限组列表获取成功，总数:', res.data.total);
				result = permissionGroups.value;
			} else {
				// API 响应无效，记录错误并返回空数组
				const errorMsg = res.errorMsg || '获取权限组列表失败';
				logger.error('获取权限组列表失败:', errorMsg);
				permissionGroups.value = [];
				pagination.value.total = 0;
				result = [];
			}
		} catch (error) {
			// 处理网络错误或其他意外错误
			logger.error('获取权限组列表异常:', error);
			permissionGroups.value = [];
			pagination.value.total = 0;
			result = [];
		} finally {
			loading.value = false;
		}

		return result;
	};

	/**
	 * 根据 ID 获取权限组详情
	 * @param {number} id - 权限组 ID
	 * @returns {Promise<Object|null>}
	 */
	const fetchPermissionGroupById = async (id) => {
		let result;

		try {
			const res = await permissionGroupApi.getById(id);
			if (res.success === true && res.data) {
				result = res.data;
			} else {
				// API 响应无效，记录错误并返回 null
				const errorMsg = res.errorMsg || '获取权限组详情失败';
				logger.error('获取权限组详情失败:', errorMsg);
				result = null;
			}
		} catch (error) {
			// 处理网络错误或其他意外错误
			logger.error('获取权限组详情异常:', error);
			result = null;
		}

		return result;
	};

	/**
	 * 获取权限组关联的权限列表
	 * @param {number} id - 权限组 ID
	 * @returns {Promise<Array>}
	 */
	const fetchGroupPermissions = async (id) => {
		groupPermissionsLoading.value = true;
		let result = [];

		try {
			const res = await permissionGroupApi.getPermissions(id);
			if (res.success === true) {
				groupPermissions.value = res.data || [];
				result = groupPermissions.value;
			} else {
				// API 响应失败，记录错误并返回空数组
				const errorMsg = res.errorMsg || '获取权限组权限失败';
				logger.error('获取权限组权限失败:', errorMsg);
				groupPermissions.value = [];
				result = [];
			}
		} catch (error) {
			// 处理网络错误或其他意外错误
			logger.error('获取权限组权限异常:', error);
			groupPermissions.value = [];
			result = [];
		} finally {
			groupPermissionsLoading.value = false;
		}

		return result;
	};

	/**
	 * 创建权限组
	 * @param {Object} body - { name, description?, sortOrder?, status? }
	 * @returns {Promise<Object|boolean>}
	 */
	const createPermissionGroup = async (body) => {
		let result;

		try {
			const res = await permissionGroupApi.create(body);
			if (res.success === true) {
				logger.log('权限组创建成功');
				result = res.data || true;
			} else {
				// API 响应失败，记录错误并返回 false
				const errorMsg = res.errorMsg || '创建权限组失败';
				logger.error('创建权限组失败:', errorMsg);
				result = false;
			}
		} catch (error) {
			// 处理网络错误或其他意外错误
			logger.error('创建权限组异常:', error);
			result = false;
		}

		return result;
	};

	/**
	 * 修改权限组（系统内置不可修改）
	 * @param {number} id - 权限组 ID
	 * @param {Object} body - { name, description?, sortOrder?, status? }
	 * @returns {Promise<Object|boolean>}
	 */
	const updatePermissionGroup = async (id, body) => {
		let result;

		try {
			const res = await permissionGroupApi.update(id, body);
			if (res.success === true) {
				logger.log('权限组更新成功:', id);
				result = res.data || true;
			} else {
				// API 响应失败，记录错误并返回 false
				const errorMsg = res.errorMsg || '修改权限组失败';
				logger.error('修改权限组失败:', errorMsg);
				result = false;
			}
		} catch (error) {
			// 处理网络错误或其他意外错误
			logger.error('更新权限组异常:', error);
			result = false;
		}

		return result;
	};

	/**
	 * 删除权限组（系统内置不可删除）
	 * @param {number} id - 权限组 ID
	 * @returns {Promise<boolean>}
	 */
	const deletePermissionGroup = async (id) => {
		let result;

		try {
			const res = await permissionGroupApi.delete(id);
			if (res.success === true) {
				logger.log('权限组删除成功:', id);
				result = true;
			} else {
				// API 响应失败，记录错误并返回 false
				const errorMsg = res.errorMsg || '删除权限组失败';
				logger.error('删除权限组失败:', errorMsg);
				result = false;
			}
		} catch (error) {
			// 处理网络错误或其他意外错误
			logger.error('删除权限组异常:', error);
			result = false;
		}

		return result;
	};

	/**
	 * 为权限组添加权限
	 * @param {number} groupId - 权限组 ID
	 * @param {number} permissionId - 权限 ID
	 * @returns {Promise<boolean>}
	 */
	const addPermissionToGroup = async (groupId, permissionId) => {
		let result;

		try {
			const res = await permissionGroupApi.addPermission(groupId, {permissionId});
			if (res.success === true) {
				logger.log('权限组添加权限成功:', groupId, permissionId);
				result = true;
			} else {
				// API 响应失败，记录错误并返回 false
				const errorMsg = res.errorMsg || '添加权限失败';
				logger.error('添加权限失败:', errorMsg);
				result = false;
			}
		} catch (error) {
			// 处理网络错误或其他意外错误
			logger.error('权限组添加权限异常:', error);
			result = false;
		}

		return result;
	};

	/**
	 * 从权限组移除权限
	 * @param {number} groupId - 权限组 ID
	 * @param {number} permissionId - 权限 ID
	 * @returns {Promise<boolean>}
	 */
	const removePermissionFromGroup = async (groupId, permissionId) => {
		let result;

		try {
			const res = await permissionGroupApi.removePermission(groupId, permissionId);
			if (res.success === true) {
				logger.log('权限组移除权限成功:', groupId, permissionId);
				result = true;
			} else {
				// API 响应失败，记录错误并返回 false
				const errorMsg = res.errorMsg || '移除权限失败';
				logger.error('移除权限失败:', errorMsg);
				result = false;
			}
		} catch (error) {
			// 处理网络错误或其他意外错误
			logger.error('权限组移除权限异常:', error);
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
	 * @param {Object} newParams - { sorter?, filters? }
	 */
	const updateQueryParams = (newParams) => {
		queryParams.value = {...queryParams.value, ...newParams};
	};

	/**
	 * 根据 ID 从当前列表中取权限组（用于本地展示）
	 * @param {number} id - 权限组 ID
	 * @returns {Object|null}
	 */
	const getPermissionGroupById = (id) => {
		return permissionGroups.value.find((g) => g.id === id) || null;
	};

	/**
	 * 清空权限组状态
	 */
	const clearPermissionGroupState = () => {
		permissionGroups.value = [];
		loading.value = false;
		groupPermissions.value = [];
		groupPermissionsLoading.value = false;
		pagination.value = {current: 1, pageSize: 10, total: 0, pages: 0};
		queryParams.value = {keyword: '', status: undefined, isSystem: undefined};
		filterOptions.value = {};
		logger.log('权限组状态已清理');
	};

	const hasPermissionGroups = computed(() => permissionGroups.value.length > 0);
	const currentPermissionGroups = computed(() => permissionGroups.value);
	const currentGroupPermissions = computed(() => groupPermissions.value);

	return {
		permissionGroups,
		loading,
		pagination,
		queryParams,
		filterOptions,
		groupPermissions,
		groupPermissionsLoading,
		fetchPermissionGroups,
		fetchPermissionGroupById,
		fetchGroupPermissions,
		createPermissionGroup,
		updatePermissionGroup,
		deletePermissionGroup,
		addPermissionToGroup,
		removePermissionFromGroup,
		updatePagination,
		updateQueryParams,
		getPermissionGroupById,
		clearPermissionGroupState,
		hasPermissionGroups,
		currentPermissionGroups,
		currentGroupPermissions
	};
});
