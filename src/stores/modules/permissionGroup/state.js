/*
 * [state.js]
 * --------------------------------------------------------------------------------
 * This software is licensed under the MIT License.
 * However, any distribution or modification must retain this copyright notice.
 * See LICENSE for full terms.
 * --------------------------------------------------------------------------------
 * author: "Jiu Liu"
 * author_contact: "QQ: 3209174373, GitHub: https://github.com/DCSCDF"
 * license: "MIT"
 * license_exception: "Mandatory attribution retention"
 * UpdateTime: 2026/2/18 10:41
 *
 */

import {ref} from 'vue';

/**
 * 权限组状态管理
 * @returns {Object} 状态对象
 */
export const createState = () => {
	// 权限组列表数据
	const permissionGroups = ref([]);
	const loading = ref(false);

	// 分页信息（与后端一致：current, size, total, pages）
	const pagination = ref({
		current: 1,
		pageSize: 10,
		total: 0,
		pages: 0
	});

	// 查询参数：keyword 匹配 name/description，status 0/1，isSystem 0/1
	const queryParams = ref({
		keyword: '',
		status: undefined,
		isSystem: undefined
	});

	// 列表接口返回的 filterOptions（status、isSystem 筛选项）
	const filterOptions = ref({});

	// 当前选中的权限组关联的权限列表（用于详情/管理权限）
	const groupPermissions = ref([]);
	const groupPermissionsLoading = ref(false);

	return {
		permissionGroups,
		loading,
		pagination,
		queryParams,
		filterOptions,
		groupPermissions,
		groupPermissionsLoading
	};
};