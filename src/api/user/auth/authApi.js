/*
 * [authApi.js]
 * --------------------------------------------------------------------------------
 * This software is licensed under the MIT License.
 * However, any distribution or modification must retain this copyright notice.
 * See LICENSE for full terms.
 * --------------------------------------------------------------------------------
 * author: "Jiu Liu"
 * author_contact: "QQ: 3209174373, GitHub: https://github.com/DCSCDF"
 * license: "MIT"
 * license_exception: "Mandatory attribution retention"
 * UpdateTime: 2026/2/18 06:59
 *
 */

// API基础路径配置
const AUTH_BASE_PATH = '/api/auth';

import request from '../../../utils/request.js';

/**
 * 用户认证相关的API函数
 */
export const authApi = {

	// 获取公钥API
	publicKey: () => {
		return request.get(`${AUTH_BASE_PATH}/public-key`);
	},

	// 登录API
	login: (data) => {
		return request.post(`${AUTH_BASE_PATH}/login`, data);
	},

	/**
	 * 获取当前登录用户资料
	 */
	profile: async () => {
		return request.post(`${AUTH_BASE_PATH}/profile`)
	},

	// 退出登录 API
	logout: (data) => {
		return request.post(`${AUTH_BASE_PATH}/logout`, data);
	},

	/**
	 * 用户注册 API（需先调用 publicKey 获取公钥与 tempToken，密码需 RSA 加密）
	 * @param {Object} data - { username, email, password, tempToken, captchaVerification }
	 */
	register: (data) => {
		return request.post(`${AUTH_BASE_PATH}/register`, data);
	},

	/**
	 * 发送注册验证码 API（当系统配置 reg.use-email=true 时使用）
	 * @param {Object} data - { username, email, password, tempToken, captchaVerification }
	 */
	registerCode: (data) => {
		return request.post(`${AUTH_BASE_PATH}/register/code`, data);
	},

	/**
	 * 确认注册 API（当系统配置 reg.use-email=true 时使用）
	 * @param {Object} data - { email, code }
	 */
	registerConfirm: (data) => {
		return request.post(`${AUTH_BASE_PATH}/register/confirm`, data);
	},

	/**
	 * 修改密码
	 * @param {Object} data - { old_password, new_password } 加密后的原密码和新密码
	 */
	updatePassword: (data) => {
		return request.post(`${AUTH_BASE_PATH}/update-password`, data);
	},

	/**
	 * 修改昵称
	 * @param {Object} data - { nickname }
	 */
	updateNickname: (data) => {
		return request.post(`${AUTH_BASE_PATH}/update-nickname`, data);
	},

	/**
	 * 修改头像 URL
	 * @param {Object} data - { avatarUrl }
	 */
	updateAvatarUrl: (data) => {
		return request.post(`${AUTH_BASE_PATH}/update-avatar-url`, data);
	},

	/**
	 * 修改邮箱（直接模式，无需验证码）
	 * 当系统配置 reg.use-email=false 时使用
	 * @param {Object} data - { email }
	 */
	updateEmail: (data) => {
		return request.post(`${AUTH_BASE_PATH}/update-email`, data);
	},

	/**
	 * 发送邮箱变更验证码
	 * 当系统配置 reg.use-email=true 时使用
	 * @param {Object} data - { email }
	 */
	changeEmailCode: (data) => {
		return request.post(`${AUTH_BASE_PATH}/change-email/code`, data);
	},

	/**
	 * 确认邮箱变更（验证邮箱验证码）
	 * 当系统配置 reg.use-email=true 时使用
	 * @param {Object} data - { email, code }
	 */
	changeEmailConfirm: (data) => {
		return request.post(`${AUTH_BASE_PATH}/change-email/confirm`, data);
	},

	/**
	 * 获取当前登录用户的权限编码列表
	 * 用于前端路由、按钮展示等权限控制
	 * 返回的编码列表已自动展开父权限所包含的全部子权限
	 */
	getPermissions: () => {
		return request.post(`${AUTH_BASE_PATH}/permissions`);
	},

	/**
	 * 发送找回密码验证码
	 * 当系统配置 reg.use-email=true 时可用
	 * @param {Object} data - { usernameOrEmail, tempToken, captchaVerification }
	 */
	findPasswordCode: (data) => {
		return request.post(`${AUTH_BASE_PATH}/find-password/code`, data);
	},

	/**
	 * 确认找回密码（重置密码）
	 * @param {Object} data - { usernameOrEmail, code, newPassword }
	 */
	findPasswordConfirm: (data) => {
		return request.post(`${AUTH_BASE_PATH}/find-password/confirm`, data);
	},

};