/**
 * 运行时配置工具
 * 从打包后的配置文件中读取配置，支持修改后热更新
 */

// 获取配置的核心函数
function getConfig() {
  if (typeof window !== 'undefined' && window.__RUNTIME_CONFIG__) {
    return window.__RUNTIME_CONFIG__
  }
  return {}
}

// 获取单个配置
export function getEnv(key) {
  const config = getConfig()
  return config[key] || null
}

// 刷新配置（强制从 JSON 重新加载）
export function refreshConfig() {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined') {
      var xhr = new XMLHttpRequest()
      xhr.open('GET', '/env-config.json', true)
      xhr.onload = function() {
        if (xhr.status === 200) {
          try {
            var data = JSON.parse(xhr.responseText)
            if (data && data.env) {
              window.__RUNTIME_CONFIG__ = data.env
              console.log('[RuntimeConfig] 配置已刷新')
              resolve(true)
              return
            }
          } catch(e) {}
        }
        resolve(false)
      }
      xhr.onerror = function() { resolve(false) }
      xhr.send()
    } else {
      resolve(false)
    }
  })
}

// 便捷访问器
export const VITE_API_BASE_URL = () => getEnv('VITE_API_BASE_URL')
export const VITE_USE_MOCK = () => getEnv('VITE_USE_MOCK')
export const VITE_DEBUG_MODE = () => getEnv('VITE_DEBUG_MODE')
export const VITE_SHOW_CONSOLE_LOGS = () => getEnv('VITE_SHOW_CONSOLE_LOGS')