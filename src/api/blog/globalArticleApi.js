/*
 * [globalArticleApi.js]
 * --------------------------------------------------------------------------------
 * This software is licensed under the MIT License.
 * However, any distribution or modification must retain this copyright notice.
 * See LICENSE for full terms.
 * --------------------------------------------------------------------------------
 * author: "Jiu Liu"
 * author_contact: "QQ: 3209174373, GitHub: https://github.com/DCSCDF"
 * license: "MIT"
 * license_exception: "Mandatory attribution retention"
 * UpdateTime: 2026/3/6 01:56
 *
 */

/*
 * 全局文章管理接口封装，对应后端「全局文章管理」文档中的 API。
 * 所有接口需登录，请求头携带 token。
 * 可以管理所有用户的文章，不受作者限制。
 */

const GLOBAL_ARTICLE_BASE_PATH = '/api/global-article';

import request from '../../utils/request.js';

/**
 * 全局文章管理 API
 * 提供全局文章列表、状态更新、删除功能
 */
export const globalArticleApi = {
	/**
	 * 分页获取所有用户的文章列表
	 * 需要权限: system:article:list
	 * @param {Object} params - {
	 *   currentPage: number,    // 当前页码，从1开始
	 *   pageSize: number,      // 每页数量
	 *   keyword?: string,      // 搜索关键词，匹配文章标题
	 *   isHidden?: boolean,    // 是否隐藏筛选：null=全部, false=显示, true=隐藏
	 *   isTop?: boolean,       // 是否置顶筛选：null=全部, false=不置顶, true=置顶
	 *   isRecommend?: boolean  // 是否推荐筛选：null=全部, false=不推荐, true=推荐
	 * }
	 * @returns {Promise<{ data: { records, total, size, current, pages, filterOptions } }>}
	 */
	list: (params) => {
		return request.post(`${GLOBAL_ARTICLE_BASE_PATH}/list`, params);
	},

	/**
	 * 更新文章状态（隐藏、置顶、推荐）
	 * 需要权限: system:article:edit
	 * @param {number} id - 文章ID
	 * @param {Object} body - {
	 *   isHidden?: boolean,    // 是否隐藏：null=不修改, true=隐藏, false=显示
	 *   isTop?: boolean,       // 是否置顶：null=不修改, true=置顶, false=不置顶
	 *   isRecommend?: boolean  // 是否推荐：null=不修改, true=推荐, false=不推荐
	 * }
	 * @returns {Promise<{ data: { id, message } }>}
	 */
	updateStatus: (id, body) => {
		return request.put(`${GLOBAL_ARTICLE_BASE_PATH}/${id}/status`, body);
	},

	/**
	 * 删除文章（逻辑删除）
	 * 需要权限: system:article:delete
	 * @param {number} id - 文章ID
	 * @returns {Promise<{ data: { id, message } }>}
	 */
	delete: (id) => {
		return request.delete(`${GLOBAL_ARTICLE_BASE_PATH}/${id}`);
	}
};
