/*
 * [authApi.js]
 * --------------------------------------------------------------------------------
 * This software is licensed under the MIT License.
 * However, any distribution or modification must retain this copyright notice.
 * See LICENSE for full terms.
 * --------------------------------------------------------------------------------
 * author: "Jiu Liu"
 * author_contact: "QQ:3209174373, GitHub：https://github.com/DCSCDF"
 * license: "MIT"
 * license_exception: "Mandatory attribution retention"
 * UpdateTime: 2026/2/2 18:13
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
	publicKey: (data) => {
		return request.get(`${AUTH_BASE_PATH}/public-key`, data);
	},

	// 登录API
	login: (data) => {
		return request.post(`${AUTH_BASE_PATH}/login`, data);
	},

	profile: async (data) => {
		let result;
		// 先检查本地存储中是否有 user_profile
		const storedProfile = localStorage.getItem('user_profile');

		if (storedProfile) {
			try {
				// 返回与API响应相同格式的数据
				result = {data: JSON.parse(storedProfile)};
			} catch (error) {
				console.error('解析本地存储的用户信息失败:', error);
				// 如果解析失败，则继续请求API
			}
		}

		if (!result) {
			// 调用API获取用户信息
			const response = await request.post(`${AUTH_BASE_PATH}/profile`, data);
			// 将获取到的用户信息存储到本地存储中
			if (response && response.data) {
				localStorage.setItem('user_profile', JSON.stringify(response.data));
			}
			result = response;
		}

		return result;
	},

	// 退出登录 API
	logout: (data) => {
		return request.post(`${AUTH_BASE_PATH}/logout`, data);
	}

};