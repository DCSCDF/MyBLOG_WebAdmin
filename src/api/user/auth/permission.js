/*
 * [permission.js]
 * --------------------------------------------------------------------------------
 * This software is licensed under the MIT License.
 * However, any distribution or modification must retain this copyright notice.
 * See LICENSE for full terms.
 * --------------------------------------------------------------------------------
 * author: "Jiu Liu"
 * author_contact: "QQ: 3209174373, GitHub: https://github.com/DCSCDF"
 * license: "MIT"
 * license_exception: "Mandatory attribution retention"
 * UpdateTime: 2026/2/17 22:27
 *
 */

// API基础路径配置
const AUTH_BASE_PATH = '/api/permission';

import request from '../../../utils/request.js';

/**
 * 用户认证相关的API函数
 */
export const permissionApi = {

	// 获取所有权限列表API
	permissionList: (data = {}) => {
		return request.post(`${AUTH_BASE_PATH}/listAll`, data);
	},


};