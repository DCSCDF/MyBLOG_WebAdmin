/*
 * [config.js]
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

/**
 * 获取分页参数
 * @param {Object} params - 查询参数
 * @param {Object} pagination - 当前分页状态
 * @returns {Object} 分页配置
 */
export const getPageConfig = (params, pagination) => {
	params = params || {};
	return {
		current: params.currentPage ?? params.page ?? pagination.current,
		size: params.pageSize ?? pagination.pageSize
	};
};

/**
 * 获取搜索参数
 * @param {Object} params - 查询参数
 * @param {Object} queryParams - 当前查询参数状态
 * @returns {Object} 搜索配置
 */
export const getSearchConfig = (params, queryParams) => {
	params = params || {};
	return {
		keyword: params.keyword !== undefined ? params.keyword : queryParams.keyword,
		status: params.status !== undefined ? params.status : queryParams.status,
		isSystem: params.isSystem !== undefined ? params.isSystem : queryParams.isSystem
	};
};

/**
 * 检查关键词是否有效
 * @param {*} keyword - 待检查的关键词
 * @returns {boolean} 是否为有效关键词
 */
export const isValidKeyword = (keyword) => {
	return keyword != null && String(keyword).trim() !== '';
};

/**
 * 检查状态值是否有效
 * @param {*} status - 待检查的状态值
 * @returns {boolean} 是否为有效状态值
 */
export const isValidStatus = (status) => {
	return status !== undefined;
};

/**
 * 检查系统标识是否有效
 * @param {*} isSystem - 待检查的系统标识
 * @returns {boolean} 是否为有效系统标识
 */
export const isValidSystemFlag = (isSystem) => {
	return isSystem !== undefined;
};