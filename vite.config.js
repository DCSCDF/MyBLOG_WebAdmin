/*
 * [vite.config.js]
 * --------------------------------------------------------------------------------
 * This software is licensed under the MIT License.
 * However, any distribution or modification must retain this copyright notice.
 * See LICENSE for full terms.
 * --------------------------------------------------------------------------------
 * author: "Jiu Liu"
 * author_contact: "QQ: 3209174373, GitHub: https://github.com/DCSCDF"
 * license: "MIT"
 * license_exception: "Mandatory attribution retention"
 * UpdateTime: 2026/2/2 18:17
 *
 */

import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig(({mode}) => {

	// 加载对应模式的环境变量
	const env = {}
	Object.keys(process.env).forEach(key => {
		if (key.startsWith('VITE_')) {
			env[key] = process.env[key]
		}
	})

	return {
		define: {
			'process.env': env
		},
		plugins: [
			tailwindcss(), //加载 tailwindcss 插件
			vue()
		],
		// 根据模式动态设置基础路径等配置
		mode
	}
})
 