/*
 * [roleApi.js]
 * --------------------------------------------------------------------------------
 * This software is licensed under the MIT License.
 * However, any distribution or modification must retain this copyright notice.
 * See LICENSE for full terms.
 * --------------------------------------------------------------------------------
 * author: "Jiu Liu"
 * author_contact: "QQ: 3209174373, GitHub: https://github.com/DCSCDF"
 * license: "MIT"
 * license_exception: "Mandatory attribution retention"
 * UpdateTime: 2026/2/17 22:27
 *
 */

/*
 * [roleApi.js]
 * --------------------------------------------------------------------------------
 * 角色管理接口封装，对应后端「角色与权限组管理」文档中的角色相关 API。
 * 所有接口需登录，请求头携带 token。
 * --------------------------------------------------------------------------------
 */

const ROLE_BASE_PATH = '/api/role';

import request from '../../utils/request.js';

/**
 * 角色管理 API
 * 提供角色的分页列表、详情、修改、删除及权限/权限组关联操作
 */
export const roleApi = {

	/**
	 * 创建角色
	 * 需要权限: system:role:create
	 * @param {Object} body - { code, name, description?, sortOrder?, status? }
	 * @returns {Promise<{ data: Object }>}
	 */
	create: (body) => {
		return request.post(`${ROLE_BASE_PATH}`, body);
	},

	/**
	 * 分页获取角色列表
	 * 需要权限: system:role:list
	 * @param {Object} params - { currentPage, pageSize }
	 * @returns {Promise<{ data: { records, total, size, current, pages } }>}
	 */
	list: (params) => {
		return request.post(`${ROLE_BASE_PATH}/list`, params);
	},

	/**
	 * 根据 ID 获取角色详情
	 * 需要权限: system:role:list
	 * @param {number} id - 角色 ID
	 * @returns {Promise<{ data: Object }>}
	 */
	getById: (id) => {
		return request.get(`${ROLE_BASE_PATH}/${id}`);
	},

	/**
	 * 修改角色（系统内置角色不可修改）
	 * 需要权限: system:role:edit
	 * @param {number} id - 角色 ID
	 * @param {Object} body - { name, description?, sortOrder?, status? }
	 * @returns {Promise<{ data: Object }>}
	 */
	update: (id, body) => {
		return request.put(`${ROLE_BASE_PATH}/${id}`, body);
	},

	/**
	 * 删除角色（系统内置/默认注册角色不可删除，会级联删除关联）
	 * 需要权限: system:role:delete
	 * @param {number} id - 角色 ID
	 * @returns {Promise<{ data: string }>}
	 */
	delete: (id) => {
		return request.delete(`${ROLE_BASE_PATH}/${id}`);
	},

	/**
	 * 获取角色关联的权限和权限组列表
	 * 需要权限: system:role:list
	 * @param {number} id - 角色 ID
	 * @returns {Promise<{ data: { role, permissions, permissionGroups } }>}
	 */
	getPermissionsDetail: (id) => {
		return request.get(`${ROLE_BASE_PATH}/${id}/permissions-detail`);
	},

	/**
	 * 为角色添加单个权限（仅非系统内置角色）
	 * 需要权限: system:role:addPermission
	 * @param {number} id - 角色 ID
	 * @param {Object} body - { permissionId }
	 * @returns {Promise<{ data: string }>}
	 */
	addPermission: (id, body) => {
		return request.post(`${ROLE_BASE_PATH}/${id}/permissions`, body);
	},

	/**
	 * 从角色移除单个权限
	 * 需要权限: system:role:removePermission
	 * @param {number} id - 角色 ID
	 * @param {number} permissionId - 权限 ID
	 * @returns {Promise<{ data: string }>}
	 */
	removePermission: (id, permissionId) => {
		return request.delete(`${ROLE_BASE_PATH}/${id}/permissions/${permissionId}`);
	},

	/**
	 * 为角色添加权限组（权限组内权限会同步到角色）
	 * 需要权限: system:role:addPermissionGroup
	 * @param {number} id - 角色 ID
	 * @param {Object} body - { groupId }
	 * @returns {Promise<{ data: string }>}
	 */
	addPermissionGroup: (id, body) => {
		return request.post(`${ROLE_BASE_PATH}/${id}/permission-groups`, body);
	},

	/**
	 * 从角色移除权限组（会同时移除该组包含的所有权限）
	 * 需要权限: system:role:removePermissionGroup
	 * @param {number} id - 角色 ID
	 * @param {number} groupId - 权限组 ID
	 * @returns {Promise<{ data: string }>}
	 */
	removePermissionGroup: (id, groupId) => {
		return request.delete(`${ROLE_BASE_PATH}/${id}/permission-groups/${groupId}`);
	},
};
