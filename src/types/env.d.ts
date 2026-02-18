/*
 * [env.d.ts]
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
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}