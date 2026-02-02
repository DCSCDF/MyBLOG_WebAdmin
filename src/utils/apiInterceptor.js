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
 * UpdateTime: 2026/2/2 18:17
 *
 */

/**
 * 后端API响应处理
 * 用于处理后端API返回的各种响应码
 */

import logger from './logger';

// 定义API响应码处理映射对象
const apiResponseMap = {
	'200': () => {
		// 请求成功，正常返回数据
	},
	'400': () => {
		logger.error('请求参数错误');
	},
	'401': () => {
		logger.error('未授权，401');
		localStorage.removeItem('token');
		sessionStorage.removeItem('token');

		// 使用window.location 跳转
		// window.location.href = '/';
	},
	'403': () => {
		logger.error('拒绝访问');
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
 * @param {string} code - 响应码
 * @returns {void}
 */
export const handleApi = (code) => {
	const handler = apiResponseMap[code];
	if (handler) {
		handler();
	}
	// 如果没有找到对应的处理函数，则不做任何操作
};