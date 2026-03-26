/*
 * [ossApi.js]
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

import request from '../../utils/request.js';

const OSS_BASE_PATH = '/api/oss';

/**
 * OSS 存储 API
 * 提供图片上传、列表、删除等功能，供当前登录用户管理自己的 OSS 图片
 */
export const ossApi = {
	/**
	 * 测试 OSS 连接
	 * 需要权限: system:config:edit
	 * @returns {Promise<{ code: number, msg: string, data: string }>}
	 */
	getStatus: () => {
		return request.get(`${OSS_BASE_PATH}/test`);
	},

	/**
	 * 上传图片到 OSS
	 * 需要权限: oss:create
	 * @param {File} file - 图片文件（不超过 10MB）
	 * @returns {Promise<{ code: number, msg: string, data: { hash, originalName, size } }>}
	 */
	uploadImage: (file) => {
		const formData = new FormData();
		formData.append('file', file);
		return request.post(`${OSS_BASE_PATH}/upload`, formData, {
			headers: {
				'Content-Type': 'multipart/form-data'
			}
		});
	},

	/**
	 * 分页获取当前用户的图片列表
	 * 需要权限: oss:list
	 * @param {Object} params - {
	 *   currentPage: number,    // 当前页码，从1开始
	 *   pageSize: number,       // 每页数量
	 *   keyword?: string       // 搜索关键词，匹配文件名、哈希值
	 * }
	 * @returns {Promise<{ data: { records, total, size, current, pages } }>}
	 */
	list: (params) => {
		return request.post(`${OSS_BASE_PATH}/list`, params);
	},

	/**
	 * 删除图片（通过哈希值）
	 * 需要权限: oss:delete
	 * @param {string} hash - 图片哈希值（MD5）
	 * @returns {Promise<{ code: number, msg: string, data: null }>}
	 */
	deleteByHash: (hash) => {
		return request.delete(`${OSS_BASE_PATH}/delete/${hash}`);
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
