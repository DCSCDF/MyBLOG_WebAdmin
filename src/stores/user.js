/*
 * [user.js]
 * --------------------------------------------------------------------------------
 * This software is licensed under the MIT License.
 * However, any distribution or modification must retain this copyright notice.
 * See LICENSE for full terms.
 * --------------------------------------------------------------------------------
 * author: "Jiu Liu"
 * author_contact: "QQ: 3209174373, GitHub: https://github.com/DCSCDF"
 * license: "MIT"
 * license_exception: "Mandatory attribution retention"
 * UpdateTime: 2026/2/18 10:50
 *
 */

/*
 * [user.js]
 * --------------------------------------------------------------------------------
 * 用户状态管理 Store
 * 管理用户列表、详情、修改、删除及用户关联的角色
 * --------------------------------------------------------------------------------
 */

import {defineStore} from 'pinia';
import {computed, ref} from 'vue';
import {userApi} from '../api/system/userApi.js';
import logger from '../utils/logger.js';

export const useUserStore = defineStore('user', () => {
	// 用户列表
	const users = ref([]);
	const loading = ref(false);

	// 分页信息（与后端字段对应：current, size, total, pages）
	const pagination = ref({
		current: 1,
		pageSize: 10,
		total: 0,
		pages: 0
	});

	// 查询参数（keyword 搜索用户名/昵称/邮箱，status 0=禁用 1=启用）
	const queryParams = ref({
		keyword: '',
		status: undefined
	});

	/** 列表接口返回的筛选项，用于渲染状态下拉等（filterOptions.status） */
	const filterOptions = ref({});

	// 当前选中的用户详情
	const userDetail = ref(null);
	const userDetailLoading = ref(false);

	// 当前用户的角色列表
	const userRoles = ref([]);
	const userRolesLoading = ref(false);

	/**
	 * 构建请求参数
	 * @param {Object} params - 输入参数
	 * @returns {Object} 处理后的请求参数
	 */
	const buildRequestParams = (params) => {
		const safeParams = params || {};

		const currentPage = safeParams.currentPage ?? pagination.value.current;
		const pageSize = safeParams.pageSize ?? pagination.value.pageSize;
		const keyword = safeParams.keyword ?? queryParams.value.keyword;
		const status = safeParams.status !== undefined ? safeParams.status : queryParams.value.status;

		const requestParams = {
			currentPage,
			pageSize
		};

		// 只有当 keyword 存在时才添加到请求参数中
		if (hasValue(keyword)) {
			requestParams.keyword = keyword;
		}

		// 只有当 status 已定义时才添加到请求参数中
		if (isDefined(status)) {
			requestParams.status = status;
		}

		return requestParams;
	};

	/**
	 * 处理 API 响应数据
	 * @param {Object} response - API 响应
	 * @param {number} pageSize - 当前页面大小
	 */
	const processApiResponse = (response, pageSize) => {
		const {
			records = [],
			total = 0,
			current = 1,
			size = pageSize,
			pages = 0,
			filterOptions: options = {}
		} = response.data;

		users.value = records.map((item) => ({...item, key: item.id}));
		pagination.value = {current, pageSize: size, total, pages};
		filterOptions.value = options;

		logger.log('用户列表获取成功，总数:', total);
	};

	/**
	 * 检查值是否存在（非空、非undefined、非null）
	 * @param {*} value - 待检查的值
	 * @returns {boolean}
	 */
	const hasValue = (value) => {
		return value !== null && value !== undefined && value !== '';
	};

	/**
	 * 检查值是否已定义
	 * @param {*} value - 待检查的值
	 * @returns {boolean}
	 */
	const isDefined = (value) => {
		return value !== undefined;
	};

	/**
	 * 分页获取用户列表
	 * @param {Object} params - { currentPage, pageSize, keyword?, status? }
	 * @returns {Promise<Array>}
	 */
	const fetchUsers = async (params) => {
		let result = null;
		loading.value = true;

		try {
			const requestParams = buildRequestParams(params);
			const response = await userApi.list(requestParams);

			// 使用正向条件判断
			if (isValidResponse(response)) {
				processApiResponse(response, requestParams.pageSize);
				result = users.value;
			} else {
				// API 响应无效，记录错误并返回空结果
				const errorMessage = getErrorMessage(response);
				logger.error(errorMessage);
				users.value = [];
				pagination.value = {
					...pagination.value,
					total: 0,
					pages: 0
				};
				// 不抛出异常，而是返回空结果
				result = [];
			}
		} catch (error) {
			// 处理网络错误或其他意外错误
			logger.error('获取用户列表失败:', error);
			users.value = [];
			pagination.value = {
				...pagination.value,
				total: 0,
				pages: 0
			};
			result = [];
		} finally {
			loading.value = false;
		}

		return result;
	};

	/**
	 * 验证 API 响应是否有效
	 * @param {Object} response - API 响应
	 * @returns {boolean}
	 */
	const isValidResponse = (response) => {
		return response.success === true && response.data !== null && response.data !== undefined;
	};

	/**
	 * 获取错误消息
	 * @param {Object} response - API 响应
	 * @returns {string}
	 */
	const getErrorMessage = (response) => {
		return response.errorMsg || '获取用户列表失败';
	};

	/**
	 * 根据 ID 获取用户详情
	 * @param {number} id - 用户 ID
	 * @returns {Promise<Object|null>}
	 */
	const fetchUserById = async (id) => {
		userDetailLoading.value = true;
		let result = null;

		try {
			const res = await userApi.getById(id);
			if (res.success === true && res.data) {
				userDetail.value = res.data;
				result = res.data;
			} else {
				// API 响应无效，记录错误并返回 null
				const errorMessage = res.errorMsg || '获取用户详情失败';
				logger.error(errorMessage);
				userDetail.value = null;
				result = null;
			}
		} catch (error) {
			// 处理网络错误或其他意外错误
			logger.error('获取用户详情失败:', error);
			userDetail.value = null;
			result = null;
		} finally {
			userDetailLoading.value = false;
		}

		return result;
	};

	/**
	 * 获取用户角色列表
	 * @param {number} id - 用户 ID
	 * @returns {Promise<Array>}
	 */
	const fetchUserRoles = async (id) => {
		userRolesLoading.value = true;
		let result = [];

		try {
			const res = await userApi.getRoles(id);
			if (res.success === true && res.data) {
				userRoles.value = res.data;
				result = res.data;
			} else {
				// API 响应无效，记录错误并返回空数组
				const errorMessage = res.errorMsg || '获取用户角色列表失败';
				logger.error(errorMessage);
				userRoles.value = [];
				result = [];
			}
		} catch (error) {
			// 处理网络错误或其他意外错误
			logger.error('获取用户角色列表失败:', error);
			userRoles.value = [];
			result = [];
		} finally {
			userRolesLoading.value = false;
		}

		return result;
	};

	/**
	 * 修改用户信息
	 * @param {number} id - 用户 ID
	 * @param {Object} body - { nickname?, avatarUrl?, roleId? }
	 * @returns {Promise<Object|boolean>}
	 */
	const updateUser = async (id, body) => {
		const res = await userApi.update(id, body);
		if (res.success === true) {
			logger.log('用户信息修改成功:', id);
			return res.data || true;
		} else {
			// API 响应失败，抛出错误让上层捕获
			const errorMessage = res.errorMsg || '修改用户信息失败';
			logger.error(errorMessage);
			throw new Error(errorMessage);
		}
	};

	/**
	 * 启用/禁用用户
	 * @param {number} id - 用户 ID
	 * @param {number} status - 状态：0=禁用，1=启用
	 * @returns {Promise<boolean>}
	 */
	const updateUserStatus = async (id, status) => {
		let result;

		try {
			const res = await userApi.updateStatus(id, {status});
			if (res.success === true) {
				logger.log('用户状态更新成功:', id, status);
				result = true;
			} else {
				// API 响应失败，记录错误并返回 false
				const errorMessage = res.errorMsg || '更新用户状态失败';
				logger.error(errorMessage);
				result = false;
			}
		} catch (error) {
			// 处理网络错误或其他意外错误
			logger.error('更新用户状态失败:', error);
			result = false;
		}

		return result;
	};

	/**
	 * 删除用户（逻辑删除）
	 * @param {number} id - 用户 ID
	 * @returns {Promise<boolean>}
	 */
	const deleteUser = async (id) => {
		let result;

		try {
			const res = await userApi.delete(id);
			if (res.success === true) {
				logger.log('用户删除成功:', id);
				result = true;
			} else {
				// API 响应失败，记录错误并返回 false
				const errorMessage = res.errorMsg || '删除用户失败';
				logger.error(errorMessage);
				result = false;
			}
		} catch (error) {
			// 处理网络错误或其他意外错误
			logger.error('删除用户失败:', error);
			result = false;
		}

		return result;
	};

	/**
	 * 更新分页
	 * @param {Object} newPagination - { current?, pageSize? }
	 */
	const updatePagination = (newPagination) => {
		pagination.value = {...pagination.value, ...newPagination};
	};

	/**
	 * 更新查询参数
	 * @param {Object} newParams - { keyword?, status? }
	 */
	const updateQueryParams = (newParams) => {
		queryParams.value = {...queryParams.value, ...newParams};
	};

	/**
	 * 清空用户详情缓存
	 */
	const clearUserDetail = () => {
		userDetail.value = null;
		userRoles.value = [];
	};

	const currentUsers = computed(() => users.value);
	const currentPagination = computed(() => pagination.value);

	return {
		users,
		loading,
		pagination,
		queryParams,
		filterOptions,
		userDetail,
		userDetailLoading,
		userRoles,
		userRolesLoading,
		fetchUsers,
		fetchUserById,
		fetchUserRoles,
		updateUser,
		updateUserStatus,
		deleteUser,
		updatePagination,
		updateQueryParams,
		clearUserDetail,
		currentUsers,
		currentPagination
	};
});
