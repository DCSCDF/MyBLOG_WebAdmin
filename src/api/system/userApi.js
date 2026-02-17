/*
 * [userApi.js]
 * --------------------------------------------------------------------------------
 * This software is licensed under the MIT License.
 * However, any distribution or modification must retain this copyright notice.
 * See LICENSE for full terms.
 * --------------------------------------------------------------------------------
 * author: "Jiu Liu"
 * author_contact: "QQ: 3209174373, GitHub: https://github.com/DCSCDF"
 * license: "MIT"
 * license_exception: "Mandatory attribution retention"
 * UpdateTime: 2026/2/17
 *
 */

/*
 * [userApi.js]
 * --------------------------------------------------------------------------------
 * 用户管理接口封装，对应后端「账号管理（用户管理）」文档中的 API。
 * 所有接口需登录，请求头携带 token。
 * --------------------------------------------------------------------------------
 */

const USER_BASE_PATH = '/api/user';

import request from '../../utils/request.js';

/**
 * 用户管理 API
 * 提供用户的分页列表、详情、修改、删除及角色关联操作
 */
export const userApi = {
	/**
	 * 分页获取用户列表
	 * 需要权限: system:user:list
	 * @param {Object} params - { currentPage, pageSize, keyword?, status? }
	 * @returns {Promise<{ data: { records, total, size, current, pages } }>}
	 */
	list: (params) => {
		return request.post(`${USER_BASE_PATH}/list`, params);
	},

	/**
	 * 根据 ID 获取用户详情
	 * 需要权限: system:user:list
	 * @param {number} id - 用户 ID
	 * @returns {Promise<{ data: Object }>}
	 */
	getById: (id) => {
		return request.get(`${USER_BASE_PATH}/${id}`);
	},

	/**
	 * 获取用户角色列表
	 * 需要权限: system:user:assignRole
	 * @param {number} id - 用户 ID
	 * @returns {Promise<{ data: Array }>}
	 */
	getRoles: (id) => {
		return request.get(`${USER_BASE_PATH}/${id}/roles`);
	},

	/**
	 * 修改用户信息（昵称/头像/角色）
	 * 需要权限: system:user:edit
	 * @param {number} id - 用户 ID
	 * @param {Object} body - { nickname?, avatarUrl?, roleId? }
	 * @returns {Promise<{ data: Object }>}
	 */
	update: (id, body) => {
		return request.put(`${USER_BASE_PATH}/${id}`, body);
	},

	/**
	 * 启用/禁用用户
	 * 需要权限: system:user:edit
	 * @param {number} id - 用户 ID
	 * @param {Object} body - { status }
	 * @returns {Promise<{ data: string }>}
	 */
	updateStatus: (id, body) => {
		return request.put(`${USER_BASE_PATH}/${id}/status`, body);
	},

	/**
	 * 删除用户（逻辑删除）
	 * 需要权限: system:user:delete
	 * @param {number} id - 用户 ID
	 * @returns {Promise<{ data: string }>}
	 */
	delete: (id) => {
		return request.delete(`${USER_BASE_PATH}/${id}`);
	},
};
