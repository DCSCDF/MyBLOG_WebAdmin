/*
 * [friendLinkApi.js]
 * --------------------------------------------------------------------------------
 * This software is licensed under the MIT License.
 * However, any distribution or modification must retain this copyright notice.
 * See LICENSE for full terms.
 * --------------------------------------------------------------------------------
 * author: "Jiu Liu"
 * author_contact: "QQ: 3209174373, GitHub: https://github.com/DCSCDF"
 * license: "MIT"
 * license_exception: "Mandatory attribution retention"
 * UpdateTime: 2026/3/1
 *
 */

/*
 * 友情链接管理接口封装，对应后端「友情链接管理」文档中的 API。
 * 所有接口需登录，请求头携带 token。
 */

const FRIEND_LINK_BASE_PATH = '/api/friend-link';

import request from '../../utils/request.js';

/**
 * 友情链接管理 API
 * 提供分页列表、创建、修改、删除
 */
export const friendLinkApi = {
	/**
	 * 分页获取友情链接列表
	 * 需要权限: links:list
	 * @param {Object} params - { currentPage, pageSize, keyword?, status? }
	 * @returns {Promise<{ data: { records, total, size, current, pages, filterOptions } }>}
	 */
	list: (params) => {
		return request.post(`${FRIEND_LINK_BASE_PATH}/list`, params);
	},

	/**
	 * 创建友情链接（后台默认 status=1 已通过）
	 * 需要权限: links:create
	 * @param {Object} body - { name, url, summary?, remark?, imageUrl?, sortOrder? }
	 * @returns {Promise<{ data: Object }>}
	 */
	create: (body) => {
		return request.post(`${FRIEND_LINK_BASE_PATH}`, body);
	},

	/**
	 * 修改友情链接
	 * 需要权限: links:edit
	 * @param {number} id - 友情链接 ID
	 * @param {Object} body - { name?, url?, summary?, remark?, imageUrl?, sortOrder? }
	 * @returns {Promise<{ data: Object }>}
	 */
	update: (id, body) => {
		return request.put(`${FRIEND_LINK_BASE_PATH}/${id}`, body);
	},

	/**
	 * 变更友链审核状态（0=待审核，1=已通过，2=已拒绝）
	 * 需要权限: links:edit
	 * @param {number} id - 友情链接 ID
	 * @param {Object} body - { status: 0|1|2 }
	 * @returns {Promise<{ data: Object }>}
	 */
	updateStatus: (id, body) => {
		return request.put(`${FRIEND_LINK_BASE_PATH}/${id}/status`, body);
	},

	/**
	 * 删除友情链接（逻辑删除，status 置为 3）
	 * 需要权限: links:delete
	 * @param {number} id - 友情链接 ID
	 * @returns {Promise<{ data: string }>}
	 */
	delete: (id) => {
		return request.delete(`${FRIEND_LINK_BASE_PATH}/${id}`);
	},
};
