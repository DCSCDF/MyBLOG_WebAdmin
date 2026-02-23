/*
 * [captchaDefaults.js]
 * --------------------------------------------------------------------------------
 * This software is licensed under the MIT License.
 * However, any distribution or modification must retain this copyright notice.
 * See LICENSE for full terms.
 * --------------------------------------------------------------------------------
 * author: "Jiu Liu"
 * author_contact: "QQ: 3209174373, GitHub: https://github.com/DCSCDF"
 * license: "MIT"
 * license_exception: "Mandatory attribution retention"
 * UpdateTime: 2026/2/22 09:00
 *
 */

/**
 * 验证码背景图加载失败时的默认占位图（data URL）
 * 用于接口报错、429、数据不完整或图片加载失败时展示
 */
export const DEFAULT_CAPTCHA_IMAGE_PLACEHOLDER =
    'data:image/svg+xml;charset=utf-8,' +
    encodeURIComponent(
	'<svg xmlns="http://www.w3.org/2000/svg" width="310" height="155" viewBox="0 0 310 155">' +
	'<rect width="100%" height="100%" fill="#f0f0f0"/>' +
	'<text x="50%" y="50%" font-size="14" fill="#999" text-anchor="middle" dy=".3em">加载失败</text>' +
	'</svg>'
    )

/**
 * 滑块拼图块默认图：透明空白图（data URL）
 * 用于滑块小图未加载或加载失败时，不遮挡背景
 */
export const DEFAULT_CAPTCHA_BLOCK_PLACEHOLDER =
    'data:image/svg+xml;charset=utf-8,' +
    encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50"/>')
