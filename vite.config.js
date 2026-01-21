import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
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
    server: {
      port: parseInt(process.env.VITE_PORT || '3000'),
      host: process.env.VITE_HOST || 'localhost',
    },
    // 根据模式动态设置基础路径等配置
    mode
  }
})
 