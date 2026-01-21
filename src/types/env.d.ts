// 全局类型定义，用于告知TypeScript编译器关于Vite环境变量的信息
interface ImportMetaEnv {
  /**
   * API请求的基础URL地址
   */
  readonly VITE_API_BASE_URL?: string;

  /**
   * 是否显示控制台日志
   */
  readonly VITE_SHOW_CONSOLE_LOGS?: string;

  /**
   * 是否开启调试模式
   */
  readonly VITE_DEBUG_MODE?: string;

  /**
   * 应用标题
   */
  readonly VITE_APP_TITLE?: string;
  
  /**
   * 当前运行模式
   */
  readonly MODE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}