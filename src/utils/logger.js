/**
 * 日志工具类 - 统一管理前端日志输出
 * 根据环境变量控制日志输出行为，实现环境适配和安全控制
 *
 * 环境变量说明：
 * - VITE_SHOW_CONSOLE_LOGS: 控制是否显示控制台日志 ('true'/'false')
 * - VITE_DEBUG_MODE: 控制是否显示调试日志 ('true'/'false')
 * - import.meta.env.MODE: 当前运行环境 (development/production/test)
 *
 * 使用方式：
 * import logger from '@/utils/logger';
 * logger.log('普通日志');
 * logger.warn('警告信息');
 * logger.error('错误信息');
 * logger.debug('调试信息');
 */
const logger = {
    /**
     * 普通日志输出
     * 在开发环境或VITE_SHOW_CONSOLE_LOGS为' true '时输出
     */
    log: (...args) => {
        if (import.meta.env.VITE_SHOW_CONSOLE_LOGS === 'true' || import.meta.env.MODE === 'development') {
            console.log(...args);
        }
    },
    /**
     * 警告信息输出
     * 在开发环境或VITE_SHOW_CONSOLE_LOGS为' true '时输出
     */
    warn: (...args) => {
        if (import.meta.env.VITE_SHOW_CONSOLE_LOGS === 'true' || import.meta.env.MODE === 'development') {
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
        if ((import.meta.env.VITE_SHOW_CONSOLE_LOGS === 'true' || import.meta.env.MODE === 'development')
            && import.meta.env.VITE_DEBUG_MODE === 'true') {
            console.debug(...args);
        }
    }
};

export default logger;