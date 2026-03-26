/*
 * [globalOssApi.js]
 * --------------------------------------------------------------------------------
 * This software is licensed under the MIT License.
 * However, any distribution or modification must retain this copyright notice.
 * See LICENSE for full terms.
 * --------------------------------------------------------------------------------
 * author: "Jiu Liu"
 * author_contact: "QQ: 3209174373, GitHub: https://github.com/DCSCDF"
 * license: "MIT"
 * license_exception: "Mandatory attribution retention"
 * UpdateTime: 2026/3/26
 *
 */

/*
 * 全局 OSS 管理接口封装，对应后端「全局 OSS 管理」文档中的 API。
 * 所有接口需登录，请求头携带 token。
 * 用于管理员查看和删除所有用户上传的 OSS 图片。
 */

const GLOBAL_OSS_BASE_PATH = '/api/global-oss';

import request from '../../utils/request.js';

/**
 * 全局 OSS 管理 API
 * 提供全局图片列表、删除功能
 */
export const globalOssApi = {
	/**
	 * 分页获取所有用户上传的图片列表
	 * 需要权限: system:oss:list
	 * @param {Object} params - {
	 *   currentPage: number,    // 当前页码，从1开始
	 *   pageSize: number,       // 每页数量
	 *   keyword?: string        // 搜索关键词，匹配文件名、哈希值、用户名
	 * }
	 * @returns {Promise<{ data: { records, total, size, current, pages } }>}
	 */
	list: (params) => {
		return request.post(`${GLOBAL_OSS_BASE_PATH}/list`, params);
	},

	/**
	 * 删除图片（通过哈希值）
	 * 需要权限: system:oss:delete
	 * @param {string} hash - 图片哈希值（MD5）
	 * @returns {Promise<{ data: null }>}
	 */
	delete: (hash) => {
		return request.delete(`${GLOBAL_OSS_BASE_PATH}/${hash}`);
	},

	/**
	 * 获取图片（公开接口）
	 * 通过哈希值获取 OSS 中的图片
	 * @param {string} hash - 图片哈希值（MD5）
	 * @returns {Promise<Blob>} 图片二进制数据
	 */
	getImage: (hash) => {
		return request.get(`/api/images/${hash}`, {
			responseType: 'blob'
		});
	}
};
