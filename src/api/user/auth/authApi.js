/*
 * [authApi.js]
 * --------------------------------------------------------------------------------
 * This software is licensed under the MIT License.
 * However, any distribution or modification must retain this copyright notice.
 * See LICENSE for full terms.
 * --------------------------------------------------------------------------------
 * author: "Jiu Liu"
 * author_contact: "QQ: 3209174373, GitHub: https://github.com/DCSCDF"
 * license: "MIT"
 * license_exception: "Mandatory attribution retention"
 * UpdateTime: 2026/2/13 17:35
 *
 */

// API基础路径配置
const AUTH_BASE_PATH = '/api/auth';

import request from '../../../utils/request.js';

/**
 * 用户认证相关的API函数
 */
export const authApi = {

	// 获取公钥API
	publicKey: () => {
		return request.get(`${AUTH_BASE_PATH}/public-key`);
	},

	// 登录API
	login: (data) => {
		return request.post(`${AUTH_BASE_PATH}/login`, data);
	},

	profile: async () => {
		return request.post(`${AUTH_BASE_PATH}/profile`)
	},

	// 退出登录 API
	logout: (data) => {
		return request.post(`${AUTH_BASE_PATH}/logout`, data);
	},

	/**
	 * 用户注册 API（需先调用 publicKey 获取公钥与 tempToken，密码需 RSA 加密）
	 * @param {Object} data - { username, email, password, tempToken, captchaVerification }
	 */
	register: (data) => {
		return request.post(`${AUTH_BASE_PATH}/register`, data);
	}

};