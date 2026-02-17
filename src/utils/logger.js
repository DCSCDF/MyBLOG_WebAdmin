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
 * UpdateTime: 2026/2/16 20:39
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
 * import logger from '@/utils/logger';
 * logger.log('普通日志');
 * logger.warn('警告信息');
 * logger.error('错误信息');
 * logger.debug('调试信息');
 */
// 输出当前环境信息
const logEnvironmentInfo = () => {
	console.log('%c[Logger] 当前运行环境信息:', 'color: #4CAF50; font-weight: bold;');
	console.log('%c- 运行模式:', 'color: #2196F3;', import.meta.env.MODE);
	console.log('%c- 日志输出:', 'color: #2196F3;', import.meta.env.VITE_SHOW_CONSOLE_LOGS === 'true' ? '启用' : '禁用');
	console.log('%c- 调试模式:', 'color: #2196F3;', import.meta.env.VITE_DEBUG_MODE === 'true' ? '启用' : '禁用');
	console.log('%c- API地址:', 'color: #2196F3;', import.meta.env.VITE_API_BASE_URL);
};

// 注意：环境信息输出已移至 App.vue 中手动调用，避免重复输出

const logger = {
	/**
	 * 输出当前环境信息
	 * 显示运行模式、日志配置、API地址等关键信息
	 */
	environment: () => {
		logEnvironmentInfo();
	},

	/**
	 * 普通日志输出
	 * 在开发环境或VITE_SHOW_CONSOLE_LOGS为' true '时输出
	 */
	log: (...args) => {
		// 当明确设置为 false 时不输出，否则在开发环境或设置为 true 时输出
		const showLogs = import.meta.env.VITE_SHOW_CONSOLE_LOGS !== 'false' &&
		    (import.meta.env.VITE_SHOW_CONSOLE_LOGS === 'true' || import.meta.env.MODE === 'development');
		if (showLogs) {
			console.log(...args);
		}
	},
	/**
	 * 警告信息输出
	 * 在开发环境或VITE_SHOW_CONSOLE_LOGS为' true '时输出
	 */
	warn: (...args) => {
		// 当明确设置为 false 时不输出，否则在开发环境或设置为 true 时输出
		const showLogs = import.meta.env.VITE_SHOW_CONSOLE_LOGS !== 'false' &&
		    (import.meta.env.VITE_SHOW_CONSOLE_LOGS === 'true' || import.meta.env.MODE === 'development');
		if (showLogs) {
			console.warn(...args);
		}
	},
	/**
	 * 错误信息输出
	 * 错误信息总是输出，因为错误通常需要立即关注
	 */
	error: (...args) => {
		console.error(...args);
	},
	/**
	 * 调试信息输出
	 * 仅在开发环境且VITE_SHOW_CONSOLE_LOGS为'true'同时VITE_DEBUG_MODE为' true '时输出
	 */
	debug: (...args) => {
		// debug 日志需要同时满足：不被禁用、在开发环境或启用状态、debug 模式开启
		const showLogs = import.meta.env.VITE_SHOW_CONSOLE_LOGS !== 'false' &&
		    (import.meta.env.VITE_SHOW_CONSOLE_LOGS === 'true' || import.meta.env.MODE === 'development') &&
		    import.meta.env.VITE_DEBUG_MODE === 'true';
		if (showLogs) {
			console.debug(...args);
		}
	}
};

export default logger;