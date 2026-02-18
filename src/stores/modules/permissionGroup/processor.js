/*
 * [processor.js]
 * --------------------------------------------------------------------------------
 * This software is licensed under the MIT License.
 * However, any distribution or modification must retain this copyright notice.
 * See LICENSE for full terms.
 * --------------------------------------------------------------------------------
 * author: "Jiu Liu"
 * author_contact: "QQ: 3209174373, GitHub: https://github.com/DCSCDF"
 * license: "MIT"
 * license_exception: "Mandatory attribution retention"
 * UpdateTime: 2026/2/18 10:57
 *
 */

/**
 * 状态码转中文：0 禁用，1 启用
 * @param {number} status - 状态码
 * @returns {string} 中文状态
 */
export const statusText = (status) => (status === 1 ? '启用' : '禁用');

/**
 * 处理权限组列表响应数据
 * @param {Object} data - API响应数据
 * @param {number} actualSize - 实际页面大小
 * @param {Object} stateRefs - 状态引用对象
 */
export const processPermissionGroupResponse = (data, actualSize, stateRefs) => {
	const {
		records = [],
		total = 0,
		current: responseDataCurrent = 1,
		size: responseDataSize = actualSize,
		pages = 0,
		filterOptions: responseOptions = {}
	} = data;

	// 分两步 处理避免类型检查错误
	const mappedRecords = (records || []).map((item) => ({
		...item,
		key: item.id,
		order: item.sortOrder ?? item.id,
		status: statusText(item.status),
		statusValue: item.status
	}));

	// 使用类型断言解决类型不匹配
	stateRefs.permissionGroups.value = /** @type {any} */ (mappedRecords);

	stateRefs.pagination.value = {current: responseDataCurrent, pageSize: responseDataSize, total, pages};
	stateRefs.filterOptions.value = responseOptions;
};