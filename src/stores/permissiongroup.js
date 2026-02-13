/*
 * [permissiongroup.js]
 * --------------------------------------------------------------------------------
 * This software is licensed under the MIT License.
 * However, any distribution or modification must retain this copyright notice.
 * See LICENSE for full terms.
 * --------------------------------------------------------------------------------
 * author: "Jiu Liu"
 * author_contact: "QQ: 3209174373, GitHub: https://github.com/DCSCDF"
 * license: "MIT"
 * license_exception: "Mandatory attribution retention"
 * UpdateTime: 2026/2/13 16:00
 *
 */

/**
 * 权限组状态管理 Store
 * 专门管理权限组相关的状态和业务逻辑
 */

import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import logger from '../utils/logger.js';

export const usePermissionGroupStore = defineStore('permissionGroup', () => {
	// 权限组状态
	const permissionGroups = ref([]);
	const loading = ref(false);

	// 分页信息
	const pagination = ref({
		current: 1,
		pageSize: 10,
		total: 0
	});

	// 查询参数
	const queryParams = ref({
		sorter: {},
		filters: {}
	});

	/**
	 * 获取权限组列表（模拟数据）
	 * @param {Object} params - 查询参数
	 * @param {number} params.page - 当前页码
	 * @param {number} params.pageSize - 页面大小
	 * @returns {Promise<Array>} 权限组列表数组
	 */
	const fetchPermissionGroups = async (params = {}) => {
		loading.value = true;
		try {
			// 模拟API调用延迟
			await new Promise(resolve => setTimeout(resolve, 300));

			const { page = 1, pageSize = 10 } = params;
			const total = 156;
			const startIndex = (page - 1) * pageSize;
			const endIndex = Math.min(startIndex + pageSize, total);

			const data = [];
			for (let i = startIndex; i < endIndex; i++) {
				data.push({
					key: i,
					id: i + 1,
					order: i + 1,
					name: `权限组名称 ${i + 1}`,
					description: `这是第${i + 1}个权限组的详细描述信息，包含相关的权限配置和使用说明。`,
					status: Math.random() > 0.3 ? '启用' : '禁用',
				});
			}

			permissionGroups.value = data;
			pagination.value.total = total;
			pagination.value.current = page;
			pagination.value.pageSize = pageSize;

			logger.log('权限组列表获取成功，总数:', total);
			return data;
		} catch (error) {
			logger.error('获取权限组列表失败:', error);
			permissionGroups.value = [];
			pagination.value.total = 0;
			throw error;
		} finally {
			loading.value = false;
		}
	};

	/**
	 * 更新分页信息
	 * @param {Object} newPagination - 新的分页信息
	 */
	const updatePagination = (newPagination) => {
		pagination.value = {
			...pagination.value,
			...newPagination
		};
	};

	/**
	 * 更新查询参数
	 * @param {Object} newParams - 新查询参数
	 */
	const updateQueryParams = (newParams) => {
		queryParams.value = {
			...queryParams.value,
			...newParams
		};
	};

	/**
	 * 添加新的权限组
	 * @param {Object} groupData - 权限组数据
	 * @returns {Promise<Object>} 新添加的权限组
	 */
	const addPermissionGroup = async (groupData) => {
		try {
			// 模拟API调用
			await new Promise(resolve => setTimeout(resolve, 500));
			
			const newGroup = {
				key: permissionGroups.value.length,
				id: Date.now(),
				order: permissionGroups.value.length + 1,
				...groupData,
				status: groupData.status || '启用'
			};

			permissionGroups.value.unshift(newGroup);
			pagination.value.total += 1;
			
			logger.log('权限组添加成功:', newGroup.name);
			return newGroup;
		} catch (error) {
			logger.error('添加权限组失败:', error);
			throw error;
		}
	};

	/**
	 * 更新权限组
	 * @param {number} groupId - 权限组ID
	 * @param {Object} updateData - 更新数据
	 * @returns {Promise<Object>} 更新后的权限组
	 */
	const updatePermissionGroup = async (groupId, updateData) => {
		try {
			// 模拟API调用
			await new Promise(resolve => setTimeout(resolve, 500));
			
			const index = permissionGroups.value.findIndex(group => group.id === groupId);
			if (index !== -1) {
				permissionGroups.value[index] = {
					...permissionGroups.value[index],
					...updateData
				};
				
				logger.log('权限组更新成功:', permissionGroups.value[index].name);
				return permissionGroups.value[index];
			} else {
				throw new Error('未找到指定的权限组');
			}
		} catch (error) {
			logger.error('更新权限组失败:', error);
			throw error;
		}
	};

	/**
	 * 删除权限组
	 * @param {number} groupId - 权限组ID
	 * @returns {Promise<boolean>} 删除结果
	 */
	const deletePermissionGroup = async (groupId) => {
		try {
			// 模拟API调用
			await new Promise(resolve => setTimeout(resolve, 500));
			
			const index = permissionGroups.value.findIndex(group => group.id === groupId);
			if (index !== -1) {
				const deletedGroup = permissionGroups.value.splice(index, 1)[0];
				pagination.value.total -= 1;
				
				logger.log('权限组删除成功:', deletedGroup.name);
				return true;
			} else {
				throw new Error('未找到指定的权限组');
			}
		} catch (error) {
			logger.error('删除权限组失败:', error);
			throw error;
		}
	};

	/**
	 * 根据ID获取权限组详情
	 * @param {number} groupId - 权限组ID
	 * @returns {Object|null} 权限组详情或null
	 */
	const getPermissionGroupById = (groupId) => {
		return permissionGroups.value.find(group => group.id === groupId) || null;
	};

	/**
	 * 清理权限组状态
	 */
	const clearPermissionGroupState = () => {
		permissionGroups.value = [];
		loading.value = false;
		pagination.value = {
			current: 1,
			pageSize: 10,
			total: 0
		};
		queryParams.value = {
			sorter: {},
			filters: {}
		};
		logger.log('权限组状态已清理');
	};

	// 计算属性
	const hasPermissionGroups = computed(() => permissionGroups.value.length > 0);
	const currentPermissionGroups = computed(() => permissionGroups.value);

	return {
		// 状态
		permissionGroups,
		loading,
		pagination,
		queryParams,

		// 方法
		fetchPermissionGroups,
		updatePagination,
		updateQueryParams,
		addPermissionGroup,
		updatePermissionGroup,
		deletePermissionGroup,
		getPermissionGroupById,
		clearPermissionGroupState,

		// 计算属性
		hasPermissionGroups,
		currentPermissionGroups
	};
});