/*
 * [imageUrl.js]
 * --------------------------------------------------------------------------------
 * This software is licensed under the MIT License.
 * However, any distribution or modification must retain this copyright notice.
 * See LICENSE for full terms.
 * --------------------------------------------------------------------------------
 * author: "Jiu Liu"
 * author_contact: "QQ: 3209174373, GitHub: https://github.com/DCSCDF"
 * license: "MIT"
 * license_exception: "Mandatory attribution retention"
 * UpdateTime: 2026/4/9
 *
 */

/**
 * 图片大小枚举
 */
export const ImageSize = {
	SM: 'sm',
	// MD: 'md',
	LG: 'lg',
	// ORIGINAL: 'original'
};

/**
 * 为图片 URL 添加尺寸参数
 * @param {string} url - 原始图片 URL
 * @param {string} size - 尺寸参数，默认为 'sm'
 * @returns {string} 添加参数后的 URL
 */
export const appendImageSize = (url, size = ImageSize.SM) => {
	if (!url || typeof url !== 'string') {
		return url;
	}
	// 如果 URL 已经包含 size 参数，先移除旧的
	const urlWithoutSize = url.replace(/[?&]size=[^&]*/g, '');
	const separator = urlWithoutSize.includes('?') ? '&' : '?';
	return `${urlWithoutSize}${separator}size=${size}`;
};

/**
 * 获取小尺寸缩略图 URL（默认用于列表展示）
 * @param {string} url - 原始图片 URL
 * @returns {string} 添加 size=sm 参数的 URL
 */
export const getSmallImageUrl = (url) => {
	return appendImageSize(url, ImageSize.SM);
};
