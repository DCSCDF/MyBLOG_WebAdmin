/*
 * [auth.js]
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

import {defineStore} from 'pinia';
import {computed, ref} from 'vue';
import logger from '../utils/logger.js';
import {authApi} from '../api/user/auth/authApi.js';

/**
 * 用户认证状态管理 Store
 * 管理用户的登录状态、token 存储和 rememberMe 功能
 */
export const useAuthStore = defineStore('auth', () => {
	// 状态：token 和 rememberMe
	const token = ref(null);
	const rememberMe = ref(false);
	const userProfile = ref(null);

	// 用户权限编码列表
	const userPermissions = ref([]);
	const permissionsLoading = ref(false);

	/**
	 * 从存储中初始化 token
	 * 优先检查 localStorage，再检查 sessionStorage
	 */
	const initTokenFromStorage = () => {
		try {
			const storedToken = localStorage.getItem('token') || sessionStorage.getItem('token');
			const storedRemember = localStorage.getItem('remember') === 'true';

			if (storedToken) {
				token.value = storedToken;
				rememberMe.value = storedRemember;

				// // 恢复用户资料
				// const storedProfile = localStorage.getItem('user_profile');
				// if (storedProfile) {
				// 	userProfile.value = JSON.parse(storedProfile);
				// }

				logger.log('Token 从存储中恢复成功:', {
					tokenLength: storedToken.length,
					rememberMe: storedRemember,
					// hasProfile: !!storedProfile
				});
			} else {
				logger.log('未找到存储的 token');
			}
		} catch (error) {
			logger.error('初始化 token 时发生错误:', error);
			clearToken();
		}
	};

	/**
	 * 登录成功后设置 token 和用户信息
	 * @param {string} newToken - 新的认证 token
	 * @param {boolean} remember - 是否记住登录状态
	 * @param {Object} profile - 用户资料信息
	 */
	const setToken = (newToken, remember, profile = null) => {
		try {
			token.value = newToken;
			rememberMe.value = remember;
			userProfile.value = profile;

			// 根据 remember 选择存储方式
			if (remember) {
				localStorage.setItem('token', newToken);
				localStorage.setItem('remember', 'true');
				sessionStorage.removeItem('token');

				// // 存储用户资料到 localStorage
				// if (profile) {
				// 	localStorage.setItem('user_profile', JSON.stringify(profile));
				// }

				logger.log('Token 已保存到 localStorage (记住登录)');
			} else {
				sessionStorage.setItem('token', newToken);
				localStorage.setItem('remember', 'false');
				localStorage.removeItem('token');
				// localStorage.removeItem('user_profile');

				logger.log('Token 已保存到 sessionStorage (临时登录)');
			}

		} catch (error) {
			logger.error('设置 token 时发生错误:', error);
		}
	};

	/**
	 * 清除 token（退出登录）
	 */
	const clearToken = () => {
		try {
			token.value = null;
			rememberMe.value = false;
			userProfile.value = null;
			userPermissions.value = [];
			permissionsLoading.value = false;

			localStorage.removeItem('token');
			sessionStorage.removeItem('token');
			localStorage.removeItem('remember');
			// localStorage.removeItem('user_profile');

			logger.log('Token 和用户信息已清除');
		} catch (error) {
			logger.error('清除 token 时发生错误:', error);
		}
	};

	/**
	 * 更新用户资料
	 * @param {Object} profile - 新的用户资料
	 */
	const updateUserProfile = (profile) => {
		try {
			userProfile.value = profile;

			// // 如果是记住登录状态，同步更新 localStorage
			// if (rememberMe.value && profile) {
			// 	localStorage.setItem('user_profile', JSON.stringify(profile));
			// 	logger.log('用户资料已更新并保存');
			// }
		} catch (error) {
			logger.error('更新用户资料时发生错误:', error);
		}
	};

	/**
	 * 获取当前用户资料
	 * @returns {Object|null} 用户资料对象或 null
	 */
	const getUserProfile = () => {
		return userProfile.value;
	};

	/**
	 * 获取当前登录用户的权限编码列表
	 * 如果权限列表已存在则直接返回，否则发起请求获取
	 * @returns {Promise<Array<string>>} 权限编码数组
	 */
	const fetchUserPermissions = async () => {
		// 如果已经有权限数据，直接返回
		if (userPermissions.value && userPermissions.value.length > 0) {
			logger.log('权限列表已存在，直接返回:', userPermissions.value);
			return userPermissions.value;
		}

		permissionsLoading.value = true;
		try {
			logger.log('开始获取用户权限列表');
			const response = await authApi.getPermissions();

			if (response.success && response.data) {
				userPermissions.value = response.data;
				logger.log('用户权限列表获取成功:', userPermissions.value);
				return userPermissions.value;
			} else {
				logger.error('获取用户权限列表失败:', response.errorMsg);
				userPermissions.value = [];
				return [];
			}
		} catch (error) {
			logger.error('获取用户权限列表请求异常:', error);
			userPermissions.value = [];
			return [];
		} finally {
			permissionsLoading.value = false;
		}
	};

	/**
	 * 清除用户权限列表
	 */
	const clearUserPermissions = () => {
		userPermissions.value = [];
		permissionsLoading.value = false;
		logger.log('用户权限列表已清除');
	};

	// 计算属性：是否已登录
	const isLoggedIn = computed(() => !!token.value);

	// 计算属性：获取当前 token
	const currentToken = computed(() => token.value);

	// 计算属性：是否记住登录
	const isRememberMe = computed(() => rememberMe.value);

	// 计算属性：是否有用户权限
	const hasUserPermissions = computed(() => userPermissions.value && userPermissions.value.length > 0);

	return {
		// 状态
		token,
		rememberMe,
		userProfile,
		userPermissions,
		permissionsLoading,

		// 方法
		initTokenFromStorage,
		setToken,
		clearToken,
		updateUserProfile,
		getUserProfile,
		fetchUserPermissions,
		clearUserPermissions,

		// 计算属性
		isLoggedIn,
		currentToken,
		isRememberMe,
		hasUserPermissions
	};
});