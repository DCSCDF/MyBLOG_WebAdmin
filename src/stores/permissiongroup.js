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
		try {
			const requestParams = buildPermissionGroupQueryParams(params, state);
			const res = await permissionGroupApi.list(requestParams);

			if (res.success !== true || !res.data) {
				const errorMsg = res.errorMsg || '获取权限组列表失败';
				logger.error('获取权限组列表失败:', errorMsg);
				permissionGroups.value = [];
				pagination.value.total = 0;
				// 抛出业务逻辑错误
				const businessError = new Error(errorMsg);
				businessError.type = 'BUSINESS_ERROR';
				throw businessError;
			}

			processPermissionGroupResponse(res.data, requestParams.pageSize, state);
			logger.log('权限组列表获取成功，总数:', res.data.total);
			return permissionGroups.value;
		} catch (error) {
			logger.error('获取权限组列表异常:', error);
			permissionGroups.value = [];
			pagination.value.total = 0;
			// 区分业务错误和系统异常
			if (error.type === 'BUSINESS_ERROR') {
				throw error; // 直接重新抛出业务错误
			} else {
				// 包装系统异常
				const systemError = new Error(`权限组列表获取系统异常: ${error.message}`);
				systemError.type = 'SYSTEM_ERROR';
				throw systemError;
			}
		} finally {
			loading.value = false;
		}
	};

	/**
	 * 根据 ID 获取权限组详情
	 * @param {number} id - 权限组 ID
	 * @returns {Promise<Object>}
	 */
	const fetchPermissionGroupById = async (id) => {
		try {
			const res = await permissionGroupApi.getById(id);
			if (res.success !== true || !res.data) {
				const errorMsg = res.errorMsg || '获取权限组详情失败';
				logger.error('获取权限组详情失败:', errorMsg);
				throw new Error(errorMsg);
			}
			return res.data;
		} catch (error) {
			logger.error('获取权限组详情异常:', error);
			// 将错误包装后重新抛出，保持错误链
			throw new Error(`权限组详情获取异常: ${error.message}`);
		}
	};

	/**
	 * 获取权限组关联的权限列表
	 * @param {number} id - 权限组 ID
	 * @returns {Promise<Array>}
	 */
	const fetchGroupPermissions = async (id) => {
		groupPermissionsLoading.value = true;
		try {
			const res = await permissionGroupApi.getPermissions(id);
			if (res.success !== true) {
				const errorMsg = res.errorMsg || '获取权限组权限失败';
				logger.error('获取权限组权限失败:', errorMsg);
				groupPermissions.value = [];
				throw new Error(errorMsg);
			}
			groupPermissions.value = res.data || [];
			return groupPermissions.value;
		} catch (error) {
			logger.error('获取权限组权限异常:', error);
			groupPermissions.value = [];
			// 将错误包装后重新抛出，保持错误链
			throw new Error(`权限组权限获取异常: ${error.message}`);
		} finally {
			groupPermissionsLoading.value = false;
		}
	};

	/**
	 * 创建权限组
	 * @param {Object} body - { name, description?, sortOrder?, status? }
	 * @returns {Promise<Object>}
	 */
	const createPermissionGroup = async (body) => {
		try {
			const res = await permissionGroupApi.create(body);
			if (res.success !== true) {
				const errorMsg = res.errorMsg || '创建权限组失败';
				logger.error('创建权限组失败:', errorMsg);
				throw new Error(errorMsg);
			}
			logger.log('权限组创建成功');
			return res.data;
		} catch (error) {
			logger.error('创建权限组异常:', error);
			// 将错误包装后重新抛出，保持错误链
			throw new Error(`权限组创建异常: ${error.message}`);
		}
	};

	/**
	 * 修改权限组（系统内置不可修改）
	 * @param {number} id - 权限组 ID
	 * @param {Object} body - { name, description?, sortOrder?, status? }
	 * @returns {Promise<Object>}
	 */
	const updatePermissionGroup = async (id, body) => {
		try {
			const res = await permissionGroupApi.update(id, body);
			if (res.success !== true) {
				const errorMsg = res.errorMsg || '修改权限组失败';
				logger.error('修改权限组失败:', errorMsg);
				throw new Error(errorMsg);
			}
			logger.log('权限组更新成功:', id);
			return res.data;
		} catch (error) {
			logger.error('更新权限组异常:', error);
			// 将错误包装后重新抛出，保持错误链
			throw new Error(`权限组更新异常: ${error.message}`);
		}
	};

	/**
	 * 删除权限组（系统内置不可删除）
	 * @param {number} id - 权限组 ID
	 * @returns {Promise<void>}
	 */
	const deletePermissionGroup = async (id) => {
		try {
			const res = await permissionGroupApi.delete(id);
			if (res.success !== true) {
				const errorMsg = res.errorMsg || '删除权限组失败';
				logger.error('删除权限组失败:', errorMsg);
				throw new Error(errorMsg);
			}
			logger.log('权限组删除成功:', id);
		} catch (error) {
			logger.error('删除权限组异常:', error);
			// 将错误包装后重新抛出，保持错误链
			throw new Error(`权限组删除异常: ${error.message}`);
		}
	};

	/**
	 * 为权限组添加权限
	 * @param {number} groupId - 权限组 ID
	 * @param {number} permissionId - 权限 ID
	 */
	const addPermissionToGroup = async (groupId, permissionId) => {
		try {
			const res = await permissionGroupApi.addPermission(groupId, {permissionId});
			if (res.success !== true) {
				const errorMsg = res.errorMsg || '添加权限失败';
				logger.error('添加权限失败:', errorMsg);
				throw new Error(errorMsg);
			}
			logger.log('权限组添加权限成功:', groupId, permissionId);
		} catch (error) {
			logger.error('权限组添加权限异常:', error);
			// 将错误包装后重新抛出，保持错误链
			throw new Error(`权限组添加权限异常: ${error.message}`);
		}
	};

	/**
	 * 从权限组移除权限
	 * @param {number} groupId - 权限组 ID
	 * @param {number} permissionId - 权限 ID
	 */
	const removePermissionFromGroup = async (groupId, permissionId) => {
		try {
			const res = await permissionGroupApi.removePermission(groupId, permissionId);
			if (res.success !== true) {
				const errorMsg = res.errorMsg || '移除权限失败';
				logger.error('移除权限失败:', errorMsg);
				throw new Error(errorMsg);
			}
			logger.log('权限组移除权限成功:', groupId, permissionId);
		} catch (error) {
			logger.error('权限组移除权限异常:', error);
			// 将错误包装后重新抛出，保持错误链
			throw new Error(`权限组移除权限异常: ${error.message}`);
		}
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
