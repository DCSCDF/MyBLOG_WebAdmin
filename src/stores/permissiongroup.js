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
 * UpdateTime: 2026/2/17 07:45
 *
 */

/*
 * [permissiongroup.js]
 * --------------------------------------------------------------------------------
 * 权限组状态管理 Store
 * 对接后端 /api/permission-group 相关接口：列表、详情、修改、删除及关联权限
 * --------------------------------------------------------------------------------
 */

import {defineStore} from 'pinia';
import {computed, ref} from 'vue';
import {permissionGroupApi} from '../api/system/permissionGroupApi.js';
import logger from '../utils/logger.js';

/** 状态码转中文：0 禁用，1 启用 */
const statusText = (status) => (status === 1 ? '启用' : '禁用');

export const usePermissionGroupStore = defineStore('permissionGroup', () => {
	const permissionGroups = ref([]);
	const loading = ref(false);

	// 分页信息（与后端一致：current, size, total, pages）
	const pagination = ref({
		current: 1,
		pageSize: 10,
		total: 0,
		pages: 0
	});

	// 查询参数：keyword 匹配 name/description，status 0/1，isSystem 0/1
	const queryParams = ref({
		keyword: '',
		status: undefined,
		isSystem: undefined
	});

	/** 列表接口返回的 filterOptions（status、isSystem 筛选项） */
	const filterOptions = ref({});

	// 当前选中的权限组关联的权限列表（用于详情/管理权限）
	const groupPermissions = ref([]);
	const groupPermissionsLoading = ref(false);

	/**
	 * 分页获取权限组列表（支持 keyword/status/isSystem）
	 * @param {Object} params - { currentPage?, pageSize?, keyword?, status?, isSystem? }
	 * @returns {Promise<Array>}
	 */
	const fetchPermissionGroups = async (params = {}) => {
		loading.value = true;
		try {
			const currentPage = params.currentPage ?? params.page ?? pagination.value.current;
			const pageSize = params.pageSize ?? pagination.value.pageSize;
			const keyword = params.keyword !== undefined ? params.keyword : queryParams.value.keyword;
			const status = params.status !== undefined ? params.status : queryParams.value.status;
			const isSystem = params.isSystem !== undefined ? params.isSystem : queryParams.value.isSystem;
			const requestParams = { currentPage, pageSize };
			if (keyword != null && String(keyword).trim() !== '') requestParams.keyword = String(keyword).trim();
			if (status !== undefined) requestParams.status = status;
			if (isSystem !== undefined) requestParams.isSystem = isSystem;
			const res = await permissionGroupApi.list(requestParams);
			if (res.success !== true || !res.data) {
				throw new Error(res.errorMsg || '获取权限组列表失败');
			}
			const {records = [], total = 0, current = 1, size = pageSize, pages = 0, filterOptions: options = {}} = res.data;
			permissionGroups.value = (records || []).map((item) => ({
				...item,
				key: item.id,
				order: item.sortOrder ?? item.id,
				status: statusText(item.status),
				statusValue: item.status
			}));
			pagination.value = { current, pageSize: size, total, pages };
			filterOptions.value = options;
			logger.log('权限组列表获取成功，总数:', total);
			return permissionGroups.value;
		} catch (error) {
			logger.error('获取权限组列表失败:', error);
			permissionGroups.value = [];
			pagination.value.total = 0;
			throw error;
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
				throw new Error(res.errorMsg || '获取权限组详情失败');
			}
			return res.data;
		} catch (error) {
			logger.error('获取权限组详情失败:', error);
			throw error;
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
				throw new Error(res.errorMsg || '获取权限组权限失败');
			}
			groupPermissions.value = res.data || [];
			return groupPermissions.value;
		} catch (error) {
			logger.error('获取权限组权限失败:', error);
			groupPermissions.value = [];
			throw error;
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
				throw new Error(res.errorMsg || '创建权限组失败');
			}
			logger.log('权限组创建成功');
			return res.data;
		} catch (error) {
			logger.error('创建权限组失败:', error);
			throw error;
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
				throw new Error(res.errorMsg || '修改权限组失败');
			}
			logger.log('权限组更新成功:', id);
			return res.data;
		} catch (error) {
			logger.error('更新权限组失败:', error);
			throw error;
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
				throw new Error(res.errorMsg || '删除权限组失败');
			}
			logger.log('权限组删除成功:', id);
		} catch (error) {
			logger.error('删除权限组失败:', error);
			throw error;
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
				throw new Error(res.errorMsg || '添加权限失败');
			}
			logger.log('权限组添加权限成功:', groupId, permissionId);
		} catch (error) {
			logger.error('权限组添加权限失败:', error);
			throw error;
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
				throw new Error(res.errorMsg || '移除权限失败');
			}
			logger.log('权限组移除权限成功:', groupId, permissionId);
		} catch (error) {
			logger.error('权限组移除权限失败:', error);
			throw error;
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
		queryParams.value = { keyword: '', status: undefined, isSystem: undefined };
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
