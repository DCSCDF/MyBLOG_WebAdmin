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
 * 提供创建文章功能
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
	}
};
