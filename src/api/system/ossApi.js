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
};
