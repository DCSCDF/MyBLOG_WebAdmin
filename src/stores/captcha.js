/*
 * [captcha.js]
 * --------------------------------------------------------------------------------
 * This software is licensed under the MIT License.
 * However, any distribution or modification must retain this copyright notice.
 * See LICENSE for full terms.
 * --------------------------------------------------------------------------------
 * author: "Jiu Liu"
 * author_contact: "QQ: 3209174373, GitHub: https://github.com/DCSCDF"
 * license: "MIT"
 * license_exception: "Mandatory attribution retention"
 * UpdateTime: 2026/3/3
 *
 */

import { defineStore } from 'pinia';
import { ref } from 'vue';
import logger from '../utils/logger.js';

/**
 * 验证码状态管理 Store
 * 管理验证码的 ID、类型等信息
 */
export const useCaptchaStore = defineStore('captcha', () => {
	// 验证码 ID（从 /api/captcha/get 接口获取）
	const captchaId = ref(null);
	
	// 验证码类型（SLIDER、WORD_IMAGE_CLICK 等）
	const captchaType = ref(null);
	
	// 是否已验证
	const isVerified = ref(false);
	
	// 完整的验证码数据
	const captchaData = ref(null);

	/**
	 * 设置验证码信息（调用 get 接口后保存）
	 * @param {Object} data - 验证码数据 { id, type, ... }
	 */
	const setCaptchaData = (data) => {
		if (data) {
			captchaId.value = data.id || data.captchaId || null;
			captchaType.value = data.type || null;
			captchaData.value = data;
			
			logger.log('验证码数据已保存:', {
				id: captchaId.value,
				type: captchaType.value
			});
		} else {
			logger.warn('设置验证码数据为空');
		}
	};

	/**
	 * 标记为已验证
	 */
	const setVerified = () => {
		isVerified.value = true;
		logger.log('验证码状态：已验证');
	};

	/**
	 * 重置验证码状态
	 */
	const resetCaptcha = () => {
		captchaId.value = null;
		captchaType.value = null;
		isVerified.value = false;
		captchaData.value = null;
		logger.log('验证码状态已重置');
	};

	/**
	 * 获取验证码 ID
	 * @returns {string|null} 验证码 ID
	 */
	const getCaptchaId = () => {
		return captchaId.value;
	};

	/**
	 * 获取完整的验证码验证参数
	 * @returns {Object|null} { captchaVerification: captchaId }
	 */
	const getCaptchaVerification = () => {
		let result = null;
		
		if (captchaId.value) {
			result = {
				captchaVerification: captchaId.value
			};
		}
		
		return result;
	};

	return {
		captchaId,
		captchaType,
		isVerified,
		captchaData,
		setCaptchaData,
		setVerified,
		resetCaptcha,
		getCaptchaId,
		getCaptchaVerification
	};
});
