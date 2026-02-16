/*
 * [apiInterceptor.js]
 * --------------------------------------------------------------------------------
 * This software is licensed under the MIT License.
 * However, any distribution or modification must retain this copyright notice.
 * See LICENSE for full terms.
 * --------------------------------------------------------------------------------
 * author: "Jiu Liu"
 * author_contact: "QQ: 3209174373, GitHub: https://github.com/DCSCDF"
 * license: "MIT"
 * license_exception: "Mandatory attribution retention"
 UpdateTime: 2026/2/16 18:00
 *
 */

/**
 * 后端API响应处理
 * 用于处理后端API返回的各种响应码
 */

import logger from '../utils/logger.js';
import { useAuthStore } from '../stores/auth.js';

// 定义API响应码处理映射对象
const apiResponseMap = {
	'200': () => {
		// 请求成功，正常返回数据
	},
	'400': () => {
		logger.error('请求参数错误');
	},
	'401': () => {
		logger.error('未授权，请先登录');
		
		// 使用 Pinia store 清除认证状态
		const authStore = useAuthStore();
		authStore.clearToken();

		// 跳转到登录页
		window.location.href = '/login';
	},
	'403': () => {
		logger.error('拒绝访问，权限不足');
	},
	'404': () => {
		logger.error('请求的资源不存在');
	},
	'408': () => {
		logger.error('请求超时');
	},
	'429': () => {
		logger.error('请求过于频繁');
	},
	'500': () => {
		logger.error('服务器内部错误');
	},
	'502': () => {
		logger.error('网关错误');
	},
	'503': () => {
		logger.error('服务不可用');
	},
	'504': () => {
		logger.error('网关超时');
	}
};

/**
 * 处理后端响应码
 * 根据不同的响应码进行相应的日志记录和处理
 * @param {string|number} code - 响应码
 * @returns {void}
 */
export const handleApi = (code) => {
	// 将数字转换为字符串进行匹配
	const codeStr = code.toString();
	const handler = apiResponseMap[codeStr];
	
	if (handler) {
		handler();
	} else {
		// 处理未定义的状态码
		logger.warn(`未定义的响应码: ${code}`);
	}
};