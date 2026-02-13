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
 * UpdateTime: 2026/2/13
 *
 */

import {defineStore} from 'pinia';
import {computed, ref} from 'vue';
import logger from '../utils/logger.js';

/**
 * 用户认证状态管理 Store
 * 管理用户的登录状态、token 存储和 rememberMe 功能
 */
export const useAuthStore = defineStore('auth', () => {
	// 状态：token 和 rememberMe
	const token = ref(null);
	const rememberMe = ref(false);
	const userProfile = ref(null);

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

				// 恢复用户资料
				const storedProfile = localStorage.getItem('user_profile');
				if (storedProfile) {
					userProfile.value = JSON.parse(storedProfile);
				}

				logger.log('Token 从存储中恢复成功:', {
					tokenLength: storedToken.length,
					rememberMe: storedRemember,
					hasProfile: !!storedProfile
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

				// 存储用户资料到 localStorage
				if (profile) {
					localStorage.setItem('user_profile', JSON.stringify(profile));
				}

				logger.log('Token 已保存到 localStorage (记住登录)');
			} else {
				sessionStorage.setItem('token', newToken);
				localStorage.setItem('remember', 'false');
				localStorage.removeItem('token');
				localStorage.removeItem('user_profile');

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

			localStorage.removeItem('token');
			sessionStorage.removeItem('token');
			localStorage.removeItem('remember');
			localStorage.removeItem('user_profile');

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

			// 如果是记住登录状态，同步更新 localStorage
			if (rememberMe.value && profile) {
				localStorage.setItem('user_profile', JSON.stringify(profile));
				logger.log('用户资料已更新并保存');
			}
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

	// 计算属性：是否已登录
	const isLoggedIn = computed(() => !!token.value);

	// 计算属性：获取当前 token
	const currentToken = computed(() => token.value);

	// 计算属性：是否记住登录
	const isRememberMe = computed(() => rememberMe.value);

	return {
		// 状态
		token,
		rememberMe,
		userProfile,

		// 方法
		initTokenFromStorage,
		setToken,
		clearToken,
		updateUserProfile,
		getUserProfile,

		// 计算属性
		isLoggedIn,
		currentToken,
		isRememberMe
	};
});