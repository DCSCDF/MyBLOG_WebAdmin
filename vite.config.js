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
 * UpdateTime: 2026/2/18 10:54
 *
 */

import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import fs from 'fs'
import path from 'path'


// 加载所有环境变量
const allEnvVars = {}
Object.keys(process.env).forEach(key => {
	if (key.startsWith('VITE_')) {
		allEnvVars[key] = process.env[key]
	}
})

// 可配置的变量列表
const configurableVars = [
	'VITE_API_BASE_URL',
	'VITE_USE_MOCK',
	'VITE_DEBUG_MODE',
	'VITE_SHOW_CONSOLE_LOGS'
]

// 筛选可配置的环境变量
const configurableEnv = {}
configurableVars.forEach(key => {
	if (allEnvVars[key]) {
		configurableEnv[key] = allEnvVars[key]
	}
})

// 排除可配置变量后的环境变量
const defineEnv = {}
Object.keys(allEnvVars).forEach(key => {
	if (!configurableVars.includes(key)) {
		defineEnv[key] = allEnvVars[key]
	}
})

// 生成内联脚本
const inlineScript = `(function() {
  try {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/env-config.json', false);
    xhr.send(null);
    if (xhr.status === 200) {
      var cfg = JSON.parse(xhr.responseText);
      if (cfg && cfg.env) {
        window.__RUNTIME_CONFIG__ = cfg.env;
        return;
      }
    }
  } catch(e) {}
  window.__RUNTIME_CONFIG__ = {
${Object.entries(configurableEnv).map(([key, value]) => `    '${key}': '${value}'`).join(',\n')}
  };
})();`

// 异步脚本
const asyncScript = `(function() {
  fetch('/env-config.json')
    .then(function(r) { return r.json(); })
    .then(function(data) {
      if (data && data.env) {
        window.__RUNTIME_CONFIG__ = data.env;
      }
    })
    .catch(function() {});
})();`

// JSON 配置
const jsonConfig = {
	version: '1.0',
	lastModified: new Date().toISOString(),
	configurable: true,
	env: configurableEnv
}

// @ts-expect-error closeBundle 是 Vite 插件钩子
const configPlugin = {
	name: 'generate-config-file',
	apply: 'build',
	closeBundle() {
		const distDir = path.resolve(process.cwd(), 'dist')
		if (!fs.existsSync(distDir)) {
			fs.mkdirSync(distDir, {recursive: true})
		}

		fs.writeFileSync(path.join(distDir, 'env-config.json'), JSON.stringify(jsonConfig, null, 2), 'utf-8')

		const indexPath = path.join(distDir, 'index.html')
		if (fs.existsSync(indexPath)) {
			let htmlContent = fs.readFileSync(indexPath, 'utf-8')
			htmlContent = htmlContent.replace('</head>', `  <script>${inlineScript}</script>\n  <script>${asyncScript}</script>\n</head>`)
			fs.writeFileSync(indexPath, htmlContent, 'utf-8')
		}

		console.log('dist/env-config.json')
		console.log('配置已内联到 index.html')
	}
}

// https://vite.dev/config/
export default defineConfig({
	define: {
		'process.env': defineEnv
	},
	plugins: [
		tailwindcss(),
		vue(),
		configPlugin
	]
})
