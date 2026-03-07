/*
 * [commentApi.js]
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
 * 用户评论管理接口封装，对应后端「用户评论管理」文档中的 API。
 * 所有接口需登录，请求头携带 token。
 */

const COMMENT_BASE_PATH = '/api/comment';

import request from '../../utils/request.js';

/**
 * 用户评论管理 API
 * 提供分页列表、修改、删除
 */
export const commentApi = {
	/**
	 * 分页获取当前用户的评论列表
	 * 需要权限: comment:list
	 * @param {Object} params - { currentPage, pageSize, status? }
	 * @returns {Promise<{ data: { records, total, size, current, pages, filterOptions } }>}
	 */
	list: (params) => {
		return request.post(`${COMMENT_BASE_PATH}/list`, params);
	},

	/**
	 * 修改自己的评论
	 * 需要权限: comment:edit
	 * @param {number} id - 评论 ID
	 * @param {Object} body - { content?, website? }
	 * @returns {Promise<{ data: Object }>}
	 */
	update: (id, body) => {
		return request.put(`${COMMENT_BASE_PATH}/${id}`, body);
	},

	/**
	 * 删除自己的评论（逻辑删除，status 置为 3）
	 * 需要权限: comment:delete
	 * @param {number} id - 评论 ID
	 * @returns {Promise<{ data: string }>}
	 */
	delete: (id) => {
		return request.delete(`${COMMENT_BASE_PATH}/${id}`);
	}
};

