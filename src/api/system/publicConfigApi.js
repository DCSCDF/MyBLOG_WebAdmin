/*
 * [publicConfigApi.js]
 * --------------------------------------------------------------------------------
 * This software is licensed under the MIT License.
 * However, any distribution or modification must retain this copyright notice.
 * See LICENSE for full terms.
 * --------------------------------------------------------------------------------
 * author: "Jiu Liu"
 * author_contact: "QQ: 3209174373, GitHub: https://github.com/DCSCDF"
 * license: "MIT"
 * license_exception: "Mandatory attribution retention"
 * UpdateTime: 2026/3/11
 *
 */

/*
 * 公共配置查询接口封装，对应后端「公共配置查询接口文档」。
 * 所有接口无需登录认证即可访问，适用于前端页面获取站点配置信息。
 */

const PUBLIC_CONFIG_BASE_PATH = '/api/public/config';

import axios from 'axios';

const publicService = axios.create({
	timeout: 40000,
	headers: {
		'X-Requested-With': 'XMLHttpRequest',
		'Content-Type': 'application/json; charset=UTF-8',
	},
});

// 响应拦截器 - 统一处理响应格式，与 request.js 保持一致
publicService.interceptors.response.use(
    async response => {
	    const {data, success, errorMsg, code} = response.data;

	    if (success === false) {
		    throw new Error(errorMsg || '请求失败');
	    }

	    // 成功响应，统一返回格式
	    return {
		    data: data,
		    success: success,
		    errorMsg: errorMsg,
		    code: code
	    };
    },
    error => {
	    return Promise.reject(error);
    }
);

/**
 * 公共配置查询 API
 */
export const publicConfigApi = {
	/**
	 * 根据配置键获取配置值
	 * 按传入的配置键数组查询配置项，支持系统内置配置和用户自定义配置。
	 * @param {Object} params - { keys: string[] }
	 * @returns {Promise<{ data: Array<{ configKey, configValue, dataType, validationRule, description, createTime, updateTime }> }>}
	 */
	getConfig: (params) => {
		return publicService.post(PUBLIC_CONFIG_BASE_PATH, params);
	},
};
