/*
 * [builder.js]
 * --------------------------------------------------------------------------------
 * This software is licensed under the MIT License.
 * However, any distribution or modification must retain this copyright notice.
 * See LICENSE for full terms.
 * --------------------------------------------------------------------------------
 * author: "Jiu Liu"
 * author_contact: "QQ: 3209174373, GitHub: https://github.com/DCSCDF"
 * license: "MIT"
 * license_exception: "Mandatory attribution retention"
 * UpdateTime: 2026/2/18 10:45
 *
 */

import { 
	getPageConfig, 
	getSearchConfig, 
	isValidKeyword, 
	isValidStatus, 
	isValidSystemFlag 
} from './config.js';

/**
 * 添加有效的关键词到请求参数
 * @param {Object} requestParams - 请求参数对象
 * @param {string} keyword - 关键词
 */
export const addKeywordToRequest = (requestParams, keyword) => {
	if (isValidKeyword(keyword)) {
		requestParams.keyword = String(keyword).trim();
	}
};

/**
 * 添加有效的状态到请求参数
 * @param {Object} requestParams - 请求参数对象
 * @param {number} status - 状态值
 */
export const addStatusToRequest = (requestParams, status) => {
	if (isValidStatus(status)) {
		requestParams.status = status;
	}
};

/**
 * 添加有效的系统标识到请求参数
 * @param {Object} requestParams - 请求参数对象
 * @param {number} isSystem - 系统标识
 */
export const addSystemFlagToRequest = (requestParams, isSystem) => {
	if (isValidSystemFlag(isSystem)) {
		requestParams.isSystem = isSystem;
	}
};

/**
 * 构建基础请求参数
 * @param {Object} pageConfig - 分页配置
 * @returns {Object} 基础请求参数
 */
export const buildBaseRequestParams = (pageConfig) => {
	return {
		currentPage: pageConfig.current,
		pageSize: pageConfig.size
	};
};

/**
 * 构建权限组查询参数
 * @param {Object} params - 查询参数
 * @param {Object} stateRefs - 状态引用对象
 * @returns {Object} 处理后的请求参数
 */
export const buildPermissionGroupQueryParams = (params, stateRefs) => {
	const pageConfig = getPageConfig(params, stateRefs.pagination.value);
	const searchConfig = getSearchConfig(params, stateRefs.queryParams.value);

	const requestParams = buildBaseRequestParams(pageConfig);

	addKeywordToRequest(requestParams, searchConfig.keyword);
	addStatusToRequest(requestParams, searchConfig.status);
	addSystemFlagToRequest(requestParams, searchConfig.isSystem);

	return requestParams;
};