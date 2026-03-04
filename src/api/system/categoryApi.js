/*
 * [categoryApi.js]
 * --------------------------------------------------------------------------------
 * This software is licensed under the MIT License.
 * However, any distribution or modification must retain this copyright notice.
 * See LICENSE for full terms.
 * --------------------------------------------------------------------------------
 * author: "Jiu Liu"
 * author_contact: "QQ: 3209174373, GitHub: https://github.com/DCSCDF"
 * license: "MIT"
 * license_exception: "Mandatory attribution retention"
 * UpdateTime: 2026/3/4
 *
 */

/*
 * 文章分类管理接口封装，对应后端「文章分类管理」文档中的 API。
 * 所有接口需登录，请求头携带 token。
 */

const CATEGORY_BASE_PATH = '/api/categories';

import request from '../../utils/request.js';

/**
 * 文章分类管理 API
 * 提供分页列表、创建、修改、删除
 */
export const categoryApi = {
	/**
	 * 分页获取分类列表
	 * 需要权限: category:list
	 * @param {Object} params - { currentPage, pageSize, keyword?, hidden? }
	 * @returns {Promise<{ data: { records, total, size, current, pages, filterOptions } }>}
	 */
	list: (params) => {
		return request.post(`${CATEGORY_BASE_PATH}/list`, params);
	},

	/**
	 * 创建分类（后台默认 hidden=false）
	 * 需要权限: category:create
	 * @param {Object} body - { name, description?, sortOrder? }
	 * @returns {Promise<{ data: Object }>}
	 */
	create: (body) => {
		return request.post(`${CATEGORY_BASE_PATH}`, body);
	},

	/**
	 * 修改分类
	 * 需要权限: category:edit
	 * @param {number} id - 分类 ID
	 * @param {Object} body - { name?, description?, sortOrder?, hidden? }
	 * @returns {Promise<{ data: Object }>}
	 */
	update: (id, body) => {
		return request.put(`${CATEGORY_BASE_PATH}/${id}`, body);
	},

	/**
	 * 删除分类（物理删除）
	 * 需要权限: category:delete
	 * @param {number} id - 分类 ID
	 * @returns {Promise<{ data: string }>}
	 */
	delete: (id) => {
		return request.delete(`${CATEGORY_BASE_PATH}/${id}`);
	}
};

