// 日志工具函数，根据环境决定是否输出日志
const logger = {
  log: (...args) => {
    if (import.meta.env.VITE_SHOW_CONSOLE_LOGS === 'true' || import.meta.env.MODE === 'development') {
      console.log(...args);
    }
  },
  warn: (...args) => {
    if (import.meta.env.VITE_SHOW_CONSOLE_LOGS === 'true' || import.meta.env.MODE === 'development') {
      console.warn(...args);
    }
  },
  error: (...args) => {
    // 错误信息总是输出，因为错误通常需要立即关注
    console.error(...args);
  },
  debug: (...args) => {
    if ((import.meta.env.VITE_SHOW_CONSOLE_LOGS === 'true' || import.meta.env.MODE === 'development') 
        && import.meta.env.VITE_DEBUG_MODE === 'true') {
      console.debug(...args);
    }
  }
};

export default logger;