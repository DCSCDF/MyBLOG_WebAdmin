/*
 * [tools.js]
 * --------------------------------------------------------------------------------
 * This software is licensed under the MIT License.
 * However, any distribution or modification must retain this copyright notice.
 * See LICENSE for full terms.
 * --------------------------------------------------------------------------------
 * author: "Jiu Liu"
 * author_contact: "QQ: 3209174373, GitHub: https://github.com/DCSCDF"
 * license: "MIT"
 * license_exception: "Mandatory attribution retention"
 * UpdateTime: 2026/2/2 18:17
 *
 */

import { useAuthStore } from '../stores/auth.js';

export const tools = {

	/**
	 * 获取当前token（已废弃，建议直接使用 useAuthStore().currentToken）
	 * @deprecated 使用 useAuthStore().currentToken 替代
	 */
	getToken() {
		const authStore = useAuthStore();
		return authStore.currentToken;
	},
	
	/**
	 * 检查是否已登录（已废弃，建议直接使用 useAuthStore().isLoggedIn）
	 * @deprecated 使用 useAuthStore().isLoggedIn 替代
	 */
	isAuthenticated() {
		const authStore = useAuthStore();
		return authStore.isLoggedIn;
	}
};