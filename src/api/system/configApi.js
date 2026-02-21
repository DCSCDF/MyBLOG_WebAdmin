/*
 * [configApi.js]
 * --------------------------------------------------------------------------------
 * This software is licensed under the MIT License.
 * However, any distribution or modification must retain this copyright notice.
 * See LICENSE for full terms.
 * --------------------------------------------------------------------------------
 * author: "Jiu Liu"
 * author_contact: "QQ: 3209174373, GitHub: https://github.com/DCSCDF"
 * license: "MIT"
 * license_exception: "Mandatory attribution retention"
 * UpdateTime: 2026/2/22
 *
 */

/*
 * 网站配置管理接口封装，对应后端「网站配置管理接口文档」。
 * 所有接口需登录，请求头携带 token。
 */

const CONFIG_BASE_PATH = '/api/config';

import request from '../../utils/request.js';

/**
 * 网站配置管理 API
 */
export const configApi = {
	/**
	 * 按配置键查询系统默认配置项
	 * 需要权限: config:system:list
	 * @param {Object} params - { keys: string[] }
	 * @returns {Promise<{ data: Array<{ configKey, configValue, dataType, validationRule, description, createTime, updateTime }> }>}
	 */
	systemList: (params) => {
		return request.post(`${CONFIG_BASE_PATH}/system/list`, params);
	},

	/**
	 * 用户自定义配置项分页列表
	 * 需要权限: config:custom:list
	 * @param {Object} params - { currentPage, pageSize, keyword? }
	 * @returns {Promise<{ data: { records, total, size, current, pages } }>}
	 */
	customList: (params) => {
		return request.post(`${CONFIG_BASE_PATH}/custom/list`, params);
	},

	/**
	 * 创建用户自定义配置项
	 * 需要权限: config:create
	 * @param {Object} body - { configKey, configValue [, dataType, validationRule, description ] }
	 * @returns {Promise<{ data: { id, configKey, configValue, dataType, validationRule, description, createTime, updateTime } }>}
	 */
	createCustom: (body) => {
		return request.post(`${CONFIG_BASE_PATH}/custom`, body);
	},

	/**
	 * 修改配置项的值（仅 config_value）
	 * 需要权限: config:edit
	 * @param {Object} body - { configKey: string, configValue: string }
	 * @returns {Promise<{ data: Object }>}
	 */
	update: (body) => {
		return request.put(CONFIG_BASE_PATH, body);
	},

	/**
	 * 逻辑删除用户自定义配置项
	 * 需要权限: config:delete
	 * @param {number} id - 配置项主键 ID
	 * @returns {Promise<{ data: string }>}
	 */
	deleteCustom: (id) => {
		return request.delete(`${CONFIG_BASE_PATH}/custom/${id}`);
	},
};
