/*
 * [tools.js]
 * --------------------------------------------------------------------------------
 * This software is licensed under the MIT License.
 * However, any distribution or modification must retain this copyright notice.
 * See LICENSE for full terms.
 * --------------------------------------------------------------------------------
 * author: "Jiu Liu"
 * author_contact: "QQ:3209174373, GitHub：https://github.com/DCSCDF"
 * license: "MIT"
 * license_exception: "Mandatory attribution retention"
 * UpdateTime: 2026/2/2 18:13
 *
 */

export const tools = {

	getToken() {
		const remember = localStorage.getItem('remember') === 'true';
		return remember
		    ? localStorage.getItem('token')
		    : sessionStorage.getItem('token');
	},
};