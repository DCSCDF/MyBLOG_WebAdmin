/*
 * [blogApi.js]
 * --------------------------------------------------------------------------------
 * This software is licensed under the MIT License.
 * However, any distribution or modification must retain this copyright notice.
 * See LICENSE for full terms.
 * --------------------------------------------------------------------------------
 * author: "Jiu Liu"
 * author_contact: "QQ: 3209174373, GitHub: https://github.com/DCSCDF"
 * license: "MIT"
 * license_exception: "Mandatory attribution retention"
 * UpdateTime: 2026/3/5
 *
 */

/*
 * 文章管理接口封装，对应后端「文章管理」文档中的 API。
 * 所有接口需登录，请求头携带 token。
 */

const BLOG_BASE_PATH = '/api/blogs';

import request from '../../utils/request.js';

/**
 * 文章管理 API
 * 提供创建文章、列表、详情、更新、删除功能
 */
export const blogApi = {
	/**
	 * 创建文章
	 * 需要权限: article:create
	 * @param {Object} body - {
	 *   title: string,          // 文章标题，最大200字符
	 *   categoryId?: number,   // 分类ID
	 *   summary?: string,       // 文章摘要，最大200字符
	 *   content?: string,      // MD格式的文章内容
	 *   htmlContent?: string,  // HTML格式的文章内容
	 *   coverImage?: string,   // 封面图片URL，http/https链接
	 *   tags?: string          // 标签，多个用逗号分隔
	 * }
	 * @returns {Promise<{ data: { id, message } }>}
	 */
	create: (body) => {
		return request.post(`${BLOG_BASE_PATH}`, body);
	},

	/**
	 * 分页获取当前用户的文章列表
	 * 需要权限: article:list
	 * @param {Object} params - {
	 *   currentPage: number,    // 当前页码，从1开始
	 *   pageSize: number,      // 每页数量
	 *   keyword?: string,      // 搜索关键词，匹配文章标题
	 *   isHidden?: boolean,    // 是否隐藏筛选：null=全部, false=显示, true=隐藏
	 *   isTop?: boolean,       // 是否置顶筛选：null=全部, false=不置顶, true=置顶
	 *   isRecommend?: boolean // 是否推荐筛选：null=全部, false=不推荐, true=推荐
	 * }
	 * @returns {Promise<{ data: { records, total, size, current, pages, filterOptions } }>}
	 */
	list: (params) => {
		return request.post(`${BLOG_BASE_PATH}/list`, params);
	},

	/**
	 * 获取文章详情
	 * 需要权限: article:detail
	 * @param {number} id - 文章ID
	 * @returns {Promise}
	 */
	get: (id) => {
		return request.get(`${BLOG_BASE_PATH}/${id}`);
	},

	/**
	 * 更新文章状态（隐藏、置顶、推荐）
	 * 需要权限: article:edit
	 * @param {number} id - 文章ID
	 * @param {Object} body - {
	 *   isHidden?: boolean,    // 是否隐藏：null=不修改, true=隐藏, false=显示
	 *   isTop?: boolean,       // 是否置顶：null=不修改, true=置顶, false=不置顶
	 *   isRecommend?: boolean  // 是否推荐：null=不修改, true=推荐, false=不推荐
	 * }
	 * @returns {Promise<{ data: { id, message } }>}
	 */
	updateStatus: (id, body) => {
		return request.put(`${BLOG_BASE_PATH}/${id}/status`, body);
	},

	/**
	 * 更新文章内容
	 * 需要权限: article:edit
	 * @param {number} id - 文章ID
	 * @param {Object} body - {
	 *   title?: string,        // 文章标题，最大200字符
	 *   summary?: string,      // 文章摘要，最大200字符
	 *   content?: string,     // MD格式的文章内容
	 *   htmlContent?: string,  // HTML格式的文章内容
	 *   coverImage?: string,   // 封面图片URL，必须为有效的http/https链接
	 *   tags?: string,        // 标签，多个标签用逗号分隔
	 *   categoryId?: number    // 分类ID
	 * }
	 * @returns {Promise<{ data: { id, message } }>}
	 */
	update: (id, body) => {
		return request.put(`${BLOG_BASE_PATH}/${id}`, body);
	},

	/**
	 * 删除文章（逻辑删除）
	 * 需要权限: article:delete
	 * @param {number} id - 文章ID
	 * @returns {Promise<{ data: { id, message } }>}
	 */
	delete: (id) => {
		return request.delete(`${BLOG_BASE_PATH}/${id}`);
	}
};
