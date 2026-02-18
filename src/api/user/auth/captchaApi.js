/*
 * [captchaApi.js]
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

import request from "../../../utils/request.js" //axios

//获取验证图片  以及token
export function reqGet(data) {
	return request({
		url: '/api/captcha/get',
		method: 'post',
		data
	})
}

//滑动或者点选验证
export function reqCheck(data) {
	return request({
		url: '/api/captcha/check',
		method: 'post',
		data
	})
}
 

