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
	 * @param {Function} onProgress - 进度回调函数，参数为 0-100 的进度值
	 * @returns {Promise<{ code: number, msg: string, data: { hash, originalName, size } }>}
	 */
	uploadImage: (file, onProgress) => {
		return new Promise((resolve, reject) => {
			const xhr = new XMLHttpRequest();
			const formData = new FormData();
			formData.append('file', file);

			// 进度监听
			if (onProgress && xhr.upload) {
				xhr.upload.onprogress = (event) => {
					if (event.lengthComputable) {
						const percent = Math.round((event.loaded / event.total) * 100);
						onProgress(percent);
					}
				};
			}

			xhr.onload = () => {
				if (xhr.status >= 200 && xhr.status < 300) {
					try {
						const response = JSON.parse(xhr.responseText);
						if (response.success) {
							resolve(response);
						} else {
							reject(new Error(response.errorMsg || '上传失败'));
						}
					} catch (e) {
						reject(new Error('解析响应失败'));
					}
				} else {
					reject(new Error(`上传失败: ${xhr.status}`));
				}
			};

			xhr.onerror = () => reject(new Error('网络错误'));

			const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
			xhr.open('POST', `${baseUrl}${OSS_BASE_PATH}/upload`);
			xhr.setRequestHeader('token', localStorage.getItem('token') || '');
			xhr.send(formData);
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
