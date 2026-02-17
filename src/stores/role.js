/*
 * [role.js]
 * --------------------------------------------------------------------------------
 * This software is licensed under the MIT License.
 * However, any distribution or modification must retain this copyright notice.
 * See LICENSE for full terms.
 * --------------------------------------------------------------------------------
 * author: "Jiu Liu"
 * author_contact: "QQ: 3209174373, GitHub: https://github.com/DCSCDF"
 * license: "MIT"
 * license_exception: "Mandatory attribution retention"
 * UpdateTime: 2026/2/17 07:21
 *
 */

/*
 * [role.js]
 * --------------------------------------------------------------------------------
 * 角色状态管理 Store
 * 管理角色列表、详情、修改、删除及角色关联的权限/权限组
 * 超级管理员角色与 schema 中 sys_role 初始化一致：
 *   INSERT INTO sys_role (code, name, description, is_super_admin, is_system, sort_order, status)
 *   VALUES ('SUPER_ADMIN', '超级管理员', '拥有系统所有权限，只能有一个', 1, 1, 100, 1)
 * --------------------------------------------------------------------------------
 */

/** 超级管理员角色编码（唯一，拥有系统所有权限） */
export const SUPER_ADMIN_ROLE_CODE = 'SUPER_ADMIN';

/**
 * 判断角色是否为超级管理员
 * @param {Object} role - 角色对象 { code, superAdmin }
 */
export function isSuperAdminRole(role) {
	if (!role) return false;
	return role.code === SUPER_ADMIN_ROLE_CODE || role.superAdmin === true;
}

import {defineStore} from 'pinia';
import {computed, ref} from 'vue';
import {roleApi} from '../api/system/roleApi.js';
import logger from '../utils/logger.js';

export const useRoleStore = defineStore('role', () => {
	// 角色列表
	const roles = ref([]);
	const loading = ref(false);

	// 分页信息（与后端字段对应：current, size, total, pages）
	const pagination = ref({
		current: 1,
		pageSize: 10,
		total: 0,
		pages: 0
	});

	// 查询参数：keyword 匹配 code/name/description，status 0/1，isSystem 0/1
	const queryParams = ref({
		keyword: '',
		status: undefined,
		isSystem: undefined
	});

	/** 列表接口返回的 filterOptions（status、isSystem 筛选项） */
	const filterOptions = ref({});

	// 当前选中的角色详情（含权限、权限组）
	const roleDetail = ref(null);
	const permissionsDetailLoading = ref(false);

	/**
	 * 分页获取角色列表（支持 keyword/status/isSystem）
	 * @param {Object} params - { currentPage?, pageSize?, keyword?, status?, isSystem? }
	 * @returns {Promise<Array>}
	 */
	const fetchRoles = async (params = {}) => {
		loading.value = true;
		try {
			const currentPage = params.currentPage ?? pagination.value.current;
			const pageSize = params.pageSize ?? pagination.value.pageSize;
			const keyword = params.keyword !== undefined ? params.keyword : queryParams.value.keyword;
			const status = params.status !== undefined ? params.status : queryParams.value.status;
			const isSystem = params.isSystem !== undefined ? params.isSystem : queryParams.value.isSystem;
			const requestParams = { currentPage, pageSize };
			if (keyword != null && String(keyword).trim() !== '') requestParams.keyword = String(keyword).trim();
			if (status !== undefined) requestParams.status = status;
			if (isSystem !== undefined) requestParams.isSystem = isSystem;
			const res = await roleApi.list(requestParams);
			if (res.success !== true || !res.data) {
				throw new Error(res.errorMsg || '获取角色列表失败');
			}
			const {records = [], total = 0, current = 1, size = pageSize, pages = 0, filterOptions: options = {}} = res.data;
			roles.value = (records || []).map((item) => ({...item, key: item.id}));
			pagination.value = { current, pageSize: size, total, pages };
			filterOptions.value = options;
			logger.log('角色列表获取成功，总数:', total);
			return roles.value;
		} catch (error) {
			logger.error('获取角色列表失败:', error);
			roles.value = [];
			pagination.value.total = 0;
			throw error;
		} finally {
			loading.value = false;
		}
	};

	/**
	 * 根据 ID 获取角色详情
	 * @param {number} id - 角色 ID
	 * @returns {Promise<Object>}
	 */
	const fetchRoleById = async (id) => {
		try {
			const res = await roleApi.getById(id);
			if (res.success !== true || !res.data) {
				throw new Error(res.errorMsg || '获取角色详情失败');
			}
			return res.data;
		} catch (error) {
			logger.error('获取角色详情失败:', error);
			throw error;
		}
	};

	/**
	 * 获取角色关联的权限和权限组
	 * @param {number} id - 角色 ID
	 * @returns {Promise<{ role, permissions, permissionGroups }>}
	 */
	const fetchPermissionsDetail = async (id) => {
		permissionsDetailLoading.value = true;
		try {
			const res = await roleApi.getPermissionsDetail(id);
			if (res.success !== true || !res.data) {
				throw new Error(res.errorMsg || '获取权限详情失败');
			}
			const data = res.data;
			// 后端可能返回合并后的 permissions（直接分配 + 权限组），同一权限若既在组内又单独出现会重复，按 id 去重
			if (data.permissions && Array.isArray(data.permissions)) {
				const seen = new Set();
				data.permissions = data.permissions.filter((p) => {
					if (seen.has(p.id)) return false;
					seen.add(p.id);
					return true;
				});
			}
			roleDetail.value = data;
			return data;
		} catch (error) {
			logger.error('获取角色权限详情失败:', error);
			roleDetail.value = null;
			throw error;
		} finally {
			permissionsDetailLoading.value = false;
		}
	};

	/**
	 * 创建角色
	 * @param {Object} body - { name, description?, sortOrder?, status? }
	 * @returns {Promise<Object>}
	 */
	const createRole = async (body) => {
		try {
			const res = await roleApi.create(body);
			if (res.success !== true) {
				throw new Error(res.errorMsg || '创建角色失败');
			}
			logger.log('角色创建成功');
			return res.data;
		} catch (error) {
			logger.error('创建角色失败:', error);
			throw error;
		}
	};

	/**
	 * 修改角色
	 * @param {number} id - 角色 ID
	 * @param {Object} body - { name, description?, sortOrder?, status? }
	 * @returns {Promise<Object>}
	 */
	const updateRole = async (id, body) => {
		try {
			const res = await roleApi.update(id, body);
			if (res.success !== true) {
				throw new Error(res.errorMsg || '修改角色失败');
			}
			logger.log('角色修改成功:', id);
			return res.data;
		} catch (error) {
			logger.error('修改角色失败:', error);
			throw error;
		}
	};

	/**
	 * 删除角色
	 * @param {number} id - 角色 ID
	 * @returns {Promise<void>}
	 */
	const deleteRole = async (id) => {
		try {
			const res = await roleApi.delete(id);
			if (res.success !== true) {
				throw new Error(res.errorMsg || '删除角色失败');
			}
			logger.log('角色删除成功:', id);
		} catch (error) {
			logger.error('删除角色失败:', error);
			throw error;
		}
	};

	/**
	 * 为角色添加权限
	 * @param {number} roleId - 角色 ID
	 * @param {number} permissionId - 权限 ID
	 */
	const addPermissionToRole = async (roleId, permissionId) => {
		try {
			const res = await roleApi.addPermission(roleId, {permissionId});
			if (res.success !== true) {
				throw new Error(res.errorMsg || '添加权限失败');
			}
			logger.log('角色添加权限成功:', roleId, permissionId);
		} catch (error) {
			logger.error('角色添加权限失败:', error);
			throw error;
		}
	};

	/**
	 * 从角色移除权限
	 * @param {number} roleId - 角色 ID
	 * @param {number} permissionId - 权限 ID
	 */
	const removePermissionFromRole = async (roleId, permissionId) => {
		try {
			const res = await roleApi.removePermission(roleId, permissionId);
			if (res.success !== true) {
				throw new Error(res.errorMsg || '移除权限失败');
			}
			logger.log('角色移除权限成功:', roleId, permissionId);
		} catch (error) {
			logger.error('角色移除权限失败:', error);
			throw error;
		}
	};

	/**
	 * 为角色添加权限组
	 * @param {number} roleId - 角色 ID
	 * @param {number} groupId - 权限组 ID
	 */
	const addPermissionGroupToRole = async (roleId, groupId) => {
		try {
			const res = await roleApi.addPermissionGroup(roleId, {groupId});
			if (res.success !== true) {
				throw new Error(res.errorMsg || '添加权限组失败');
			}
			logger.log('角色添加权限组成功:', roleId, groupId);
		} catch (error) {
			logger.error('角色添加权限组失败:', error);
			throw error;
		}
	};

	/**
	 * 从角色移除权限组
	 * @param {number} roleId - 角色 ID
	 * @param {number} groupId - 权限组 ID
	 */
	const removePermissionGroupFromRole = async (roleId, groupId) => {
		try {
			const res = await roleApi.removePermissionGroup(roleId, groupId);
			if (res.success !== true) {
				throw new Error(res.errorMsg || '移除权限组失败');
			}
			logger.log('角色移除权限组成功:', roleId, groupId);
		} catch (error) {
			logger.error('角色移除权限组失败:', error);
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
	 * 更新查询参数（keyword/status/isSystem）
	 * @param {Object} newParams - { keyword?, status?, isSystem? }
	 */
	const updateQueryParams = (newParams) => {
		queryParams.value = {...queryParams.value, ...newParams};
	};

	/**
	 * 清空角色详情缓存
	 */
	const clearRoleDetail = () => {
		roleDetail.value = null;
	};

	const currentRoles = computed(() => roles.value);
	const currentPagination = computed(() => pagination.value);

	return {
		roles,
		loading,
		pagination,
		queryParams,
		filterOptions,
		roleDetail,
		permissionsDetailLoading,
		fetchRoles,
		fetchRoleById,
		fetchPermissionsDetail,
		createRole,
		updateRole,
		deleteRole,
		addPermissionToRole,
		removePermissionFromRole,
		addPermissionGroupToRole,
		removePermissionGroupFromRole,
		updatePagination,
		updateQueryParams,
		clearRoleDetail,
		currentRoles,
		currentPagination
	};
});
