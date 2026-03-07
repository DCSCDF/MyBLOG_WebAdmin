/*
 * [systemCommentApi.js]
 * --------------------------------------------------------------------------------
 * This software is licensed under the MIT License.
 * However, any distribution or modification must retain this copyright notice.
 * See LICENSE for full terms.
 * --------------------------------------------------------------------------------
 * author: "Jiu Liu"
 * author_contact: "QQ: 3209174373, GitHub: https://github.com/DCSCDF"
 * license: "MIT"
 * license_exception: "Mandatory attribution retention"
 * UpdateTime: 2026/3/8
 *
 */

/*
 * 全局评论管理接口封装，对应后端「全局评论管理」文档中的 API。
 * 所有接口需登录，请求头携带 token。
 */

const SYSTEM_COMMENT_BASE_PATH = '/api/system/comment';

import request from '../../utils/request.js';

/**
 * 全局评论管理 API
 * 提供分页列表、修改、删除、审核
 */
export const systemCommentApi = {
	/**
	 * 分页获取所有评论列表
	 * 需要权限: system:comment:list
	 * @param {Object} params - { currentPage, pageSize, keyword?, status? }
	 * @returns {Promise<{ data: { records, total, size, current, pages, filterOptions } }>}
	 */
	list: (params) => {
		return request.post(`${SYSTEM_COMMENT_BASE_PATH}/list`, params);
	},

	/**
	 * 修改任意评论
	 * 需要权限: system:comment:edit
	 * @param {number} id - 评论 ID
	 * @param {Object} body - { content?, website? }
	 * @returns {Promise<{ data: Object }>}
	 */
	update: (id, body) => {
		return request.put(`${SYSTEM_COMMENT_BASE_PATH}/${id}`, body);
	},

	/**
	 * 删除任意评论（逻辑删除，status 置为 3）
	 * 需要权限: system:comment:delete
	 * @param {number} id - 评论 ID
	 * @returns {Promise<{ data: string }>}
	 */
	delete: (id) => {
		return request.delete(`${SYSTEM_COMMENT_BASE_PATH}/${id}`);
	},

	/**
	 * 审核评论（修改状态）
	 * 需要权限: system:comment:approve
	 * @param {number} id - 评论 ID
	 * @param {Object} body - { status: 0|1|2 }
	 * @returns {Promise<{ data: Object }>}
	 */
	approve: (id, body) => {
		return request.put(`${SYSTEM_COMMENT_BASE_PATH}/${id}/approve`, body);
	}
};

