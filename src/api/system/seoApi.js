/*
 * [seoApi.js]
 * --------------------------------------------------------------------------------
 * This software is licensed under the MIT License.
 * However, any distribution or modification must retain this copyright notice.
 * See LICENSE for full terms.
 * --------------------------------------------------------------------------------
 * author: "Jiu Liu"
 * author_contact: "QQ: 3209174373, GitHub: https://github.com/DCSCDF"
 * license: "MIT"
 * license_exception: "Mandatory attribution retention"
 * UpdateTime: 2026/2/21 00:00
 *
 */

/*
 * SEO配置管理接口封装，对应后端「SEO配置管理接口文档」中的 API。
 * 所有接口需登录，请求头携带 token。
 */

const SEO_BASE_PATH = '/api/seo';

import request from '../../utils/request.js';

/**
 * SEO配置管理 API
 * 提供SEO配置的分页列表、详情、创建、修改、删除操作
 */
export const seoApi = {
	/**
	 * 分页获取SEO列表
	 * 需要权限: seo:list
	 * @param {Object} params - { currentPage, pageSize, keyword?, pageType?, isSystem? }
	 * @returns {Promise<{ data: { records, total, size, current, pages, filterOptions } }>}
	 */
	list: (params) => {
		return request.post(`${SEO_BASE_PATH}/list`, params);
	},

	/**
	 * 根据 ID 获取SEO详情
	 * 需要权限: seo:list
	 * @param {number} id - SEO配置 ID
	 * @returns {Promise<{ data: Object }>}
	 */
	getById: (id) => {
		return request.get(`${SEO_BASE_PATH}/${id}`);
	},

	/**
	 * 创建SEO配置
	 * 需要权限: seo:create
	 * @param {Object} body - SEO配置数据
	 * @returns {Promise<{ data: Object }>}
	 */
	create: (body) => {
		return request.post(`${SEO_BASE_PATH}`, body);
	},

	/**
	 * 修改SEO配置
	 * 需要权限: seo:edit
	 * @param {number} id - SEO配置 ID
	 * @param {Object} body - SEO配置数据
	 * @returns {Promise<{ data: Object }>}
	 */
	update: (id, body) => {
		return request.put(`${SEO_BASE_PATH}/${id}`, body);
	},

	/**
	 * 删除SEO配置
	 * 需要权限: seo:delete
	 * @param {number} id - SEO配置 ID
	 * @returns {Promise<{ data: string }>}
	 */
	delete: (id) => {
		return request.delete(`${SEO_BASE_PATH}/${id}`);
	},
};
