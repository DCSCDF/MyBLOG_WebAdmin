/*
 * [logger.js]
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

/**
 * 日志
 * 根据环境变量控制日志输出行为
 *
 * 环境变量：
 * - VITE_SHOW_CONSOLE_LOGS: 控制是否显示控制台日志 ('true'/'false')
 * - VITE_DEBUG_MODE: 控制是否显示调试日志 ('true'/'false')
 * - import.meta.env.MODE: 当前运行环境 (development/production/test)
 *
 * 使用：
 * import logger from '@/VerifyUtils/logger';
 * logger.log('普通日志');
 * logger.warn('警告信息');
 * logger.error('错误信息');
 * logger.debug('调试信息');
 */
import {getEnv} from '../config/runtimeEnv.js';

// 输出当前环境信息
const logEnvironmentInfo = () => {
	console.log('%c[Logger] 当前运行环境信息:', 'color: #4CAF50; font-weight: bold;');
	console.log('%c- 运行模式:', 'color: #2196F3;', import.meta.env.MODE);
	console.log('%c- 日志输出:', 'color: #2196F3;', getEnv('VITE_SHOW_CONSOLE_LOGS') === 'true' ? '启用' : '禁用');
	console.log('%c- 调试模式:', 'color: #2196F3;', getEnv('VITE_DEBUG_MODE') === 'true' ? '启用' : '禁用');
	console.log('%c- API地址:', 'color: #2196F3;', getEnv('VITE_API_BASE_URL'));
};


const logger = {

	/**
	 * 输出当前环境信息
	 * 显示运行模式、日志配置、API地址等关键信息
	 */
	environment: () => {
		logEnvironmentInfo();
	},

	/**
	 * 检查是否应该显示日志
	 */
	shouldShowLogs: () => {
		return getEnv('VITE_SHOW_CONSOLE_LOGS') === 'true' ||
		    (import.meta.env.MODE === 'development' && getEnv('VITE_SHOW_CONSOLE_LOGS') !== 'false');
	},

	/**
	 * 普通日志输出
	 */
	log: (...args) => {
		if (logger.shouldShowLogs()) {
			console.log(...args);
		}
	},

	/**
	 * 警告信息输出
	 */
	warn: (...args) => {
		if (logger.shouldShowLogs()) {
			console.warn(...args);
		}
	},

	/**
	 * 错误信息输出
	 */
	error: (...args) => {
		if (logger.shouldShowLogs()) {
			console.error(...args);
		}
	},

	/**
	 * 调试信息输出
	 */
	debug: (...args) => {
		if (logger.shouldShowLogs() && getEnv('VITE_DEBUG_MODE') === 'true') {
			console.debug(...args);
		}
	}
};

export default logger;