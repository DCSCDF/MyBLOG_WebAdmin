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
 * 公共配置查询接口封装。
 * 所有接口无需登录认证即可访问，适用于前端页面获取站点配置信息。
 */

const PUBLIC_CONFIG_BASE_PATH = '/api/public/config';

import request from '../../utils/request.js';

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
		return request.post(PUBLIC_CONFIG_BASE_PATH, params);
	},
};
