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
	 * 删除图片（通过哈希值）
	 * 需要权限: oss:delete
	 * @param {string} hash - 图片哈希值（MD5）
	 * @returns {Promise<{ code: number, msg: string, data: null }>}
	 */
	deleteByHash: (hash) => {
		return request.delete(`${OSS_BASE_PATH}/delete/${hash}`);
	},
};
