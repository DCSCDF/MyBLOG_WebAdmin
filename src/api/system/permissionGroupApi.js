/*
 * [permissionGroupApi.js]
 * --------------------------------------------------------------------------------
 * This software is licensed under the MIT License.
 * However, any distribution or modification must retain this copyright notice.
 * See LICENSE for full terms.
 * --------------------------------------------------------------------------------
 * author: "Jiu Liu"
 * author_contact: "QQ: 3209174373, GitHub: https://github.com/DCSCDF"
 * license: "MIT"
 * license_exception: "Mandatory attribution retention"
 * UpdateTime: 2026/2/17 03:44
 *
 */

/*
 * [permissionGroupApi.js]
 * --------------------------------------------------------------------------------
 * 权限组管理接口封装，对应后端「角色与权限组管理」文档中的权限组相关 API。
 * 所有接口需登录，请求头携带 token。
 * --------------------------------------------------------------------------------
 */

const PERMISSION_GROUP_BASE_PATH = '/api/permission-group';

import request from '../../utils/request.js';

/**
 * 权限组管理 API
 * 提供权限组的分页列表、详情、修改、删除及关联权限的增删
 */
export const permissionGroupApi = {

	/**
	 * 创建权限组
	 * 需要权限: system:permission_group:create
	 * @param {Object} body - { name, description?, sortOrder?, status? }
	 * @returns {Promise<{ data: Object }>}
	 */
	create: (body) => {
		return request.post(`${PERMISSION_GROUP_BASE_PATH}`, body);
	},

	/**
	 * 分页获取权限组列表
	 * 需要权限: system:permission_group:list
	 * @param {Object} params - { currentPage, pageSize }
	 * @returns {Promise<{ data: { records, total, size, current, pages } }>}
	 */
	list: (params) => {
		return request.post(`${PERMISSION_GROUP_BASE_PATH}/list`, params);
	},

	/**
	 * 根据 ID 获取权限组详情
	 * 需要权限: system:permission_group:list
	 * @param {number} id - 权限组 ID
	 * @returns {Promise<{ data: Object }>}
	 */
	getById: (id) => {
		return request.get(`${PERMISSION_GROUP_BASE_PATH}/${id}`);
	},

	/**
	 * 修改权限组（系统内置权限组不可修改）
	 * 需要权限: system:permission_group:edit
	 * @param {number} id - 权限组 ID
	 * @param {Object} body - { name, description?, sortOrder?, status? }
	 * @returns {Promise<{ data: Object }>}
	 */
	update: (id, body) => {
		return request.put(`${PERMISSION_GROUP_BASE_PATH}/${id}`, body);
	},

	/**
	 * 删除权限组（系统内置不可删除，会级联删除关联）
	 * 需要权限: system:permission_group:delete
	 * @param {number} id - 权限组 ID
	 * @returns {Promise<{ data: string }>}
	 */
	delete: (id) => {
		return request.delete(`${PERMISSION_GROUP_BASE_PATH}/${id}`);
	},

	/**
	 * 获取权限组关联的权限列表
	 * 需要权限: system:permission_group:list
	 * @param {number} id - 权限组 ID
	 * @returns {Promise<{ data: Array }>}
	 */
	getPermissions: (id) => {
		return request.get(`${PERMISSION_GROUP_BASE_PATH}/${id}/permissions`);
	},

	/**
	 * 为权限组添加单个权限（仅非系统内置权限组）
	 * 需要权限: system:permission_group:addPermission
	 * @param {number} id - 权限组 ID
	 * @param {Object} body - { permissionId }
	 * @returns {Promise<{ data: string }>}
	 */
	addPermission: (id, body) => {
		return request.post(`${PERMISSION_GROUP_BASE_PATH}/${id}/permissions`, body);
	},

	/**
	 * 从权限组移除单个权限
	 * 需要权限: system:permission_group:removePermission
	 * @param {number} id - 权限组 ID
	 * @param {number} permissionId - 权限 ID
	 * @returns {Promise<{ data: string }>}
	 */
	removePermission: (id, permissionId) => {
		return request.delete(`${PERMISSION_GROUP_BASE_PATH}/${id}/permissions/${permissionId}`);
	},
};
