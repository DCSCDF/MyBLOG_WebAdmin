/*
 * [mailApi.js]
 * -------------------------------------------------------------------------------
 * This software is licensed under the MIT License.
 * However, any distribution or modification must retain this copyright notice.
 * See LICENSE for full terms.
 * -------------------------------------------------------------------------------
 * author: "Jiu Liu"
 * author_contact: "QQ: 3209174373, GitHub: https://github.com/DCSCDF"
 * license: "MIT"
 * license_exception: "Mandatory attribution retention"
 * UpdateTime: 2026/2/22
 *
 */

import request from '../../utils/request.js';

const MAIL_BASE_PATH = '/api/mail';

/**
 * 邮件 API
 */
export const mailApi = {
	/**
	 * 发送测试邮件
	 * 需要权限: system:config:edit
	 * @param {Object} body - { to: string, subject?: string, content?: string }
	 * @returns {Promise<{ code: number, msg: string, data: null }>}
	 */
	sendTestMail: (body) => {
		return request.post(`${MAIL_BASE_PATH}/test`, body);
	},

	/**
	 * 检查 SMTP 配置状态
	 * 需要权限: system:config:edit
	 * @returns {Promise<{ code: number, msg: string, data: string }>}
	 */
	getStatus: () => {
		return request.get(`${MAIL_BASE_PATH}/status`);
	},
};
