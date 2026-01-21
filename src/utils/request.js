import axios from 'axios';

// 使用环境变量设置请求的基础URL
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;

/**
 * 创建一个axios实例
 * @type {import('axios').AxiosInstance}
 */
const service = axios.create({
    // 请求超时时间设置为40秒
    timeout: 40000,
    // 默认请求头配置
    headers: {
        'X-Requested-With': 'XMLHttpRequest', // 告诉服务器这是一个Ajax请求
        'Content-Type': 'application/json; charset=UTF-8' // 指定请求数据格式为JSON
    },
})

// 请求拦截器 - 在发送请求前对请求进行处理
service.interceptors.request.use(
    config => {
        // 可在此处添加请求前的逻辑，如添加token等
        return config
    },
    error => {
        // 请求错误时的处理 - 需要返回Promise.reject
        return Promise.reject(error)
    }
)

// 响应拦截器 - 对响应数据进行处理
service.interceptors.response.use(
    response => {
        // 提取响应中的data部分并返回
        return response.data
    },
    error => {
        // 响应错误时的处理
        // 这里可以添加统一的错误处理逻辑
        return Promise.reject(error)
    }
)

// 导出配置好的axios实例
export default service