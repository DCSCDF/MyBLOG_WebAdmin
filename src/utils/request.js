/**
 * HTTP请求
 *
 * 环境变量：
 * - VITE_API_BASE_URL: API请求的基础URL地址
 *
 * 使用：
 * import request from '@/utils/request';
 * request.get('/api/user/info').then(res => {...});
 * request.post('/api/user/login', data).then(res => {...});
 */
import axios from 'axios';
import {handleAjCaptchaResponse} from './captchaInterceptor.js'; // 导入验证码响应处理函数
import {handleApi} from './apiInterceptor.js';
import {tools} from "./tools.js";
// 使用环境变量设置请求的基础URL，支持不同环境下的API地址配置
/* eslint-disable no-undef */
// 从环境变量获取API基础URL，如果未定义则使用默认值
const baseURL = import.meta.env.VITE_API_BASE_URL;
axios.defaults.baseURL = baseURL;


/**
 * 创建一个axios实例
 * 包含预设的配置参数和拦截器
 * @type {import('axios').AxiosInstance}
 */
const service = axios.create({

	// 设置请求超时时间为40秒，避免长时间等待
	timeout: 40000,
	// 默认请求头配置，指定请求来源和数据格式
	headers: {
		'X-Requested-With': 'XMLHttpRequest', // 告诉服务器这是一个Ajax请求
		'Content-Type': 'application/json; charset=UTF-8',// 指定请求数据格式为JSON
	},
})

// 请求拦截器 - 在发送请求前对请求进行处理
service.interceptors.request.use(
    (config) => {
	    const token = tools.getToken(); // 每次请求都重新获取
	    if (token) {
		    config.headers.token = `${token}`;
	    }
	    return config;
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
	    const {repCode, code} = response.data;

	    // 使用验证码处理工具处理Captcha响应码
	    handleAjCaptchaResponse(repCode);

	    // 使用API响应处理工具处理后端响应码
	    if (code !== undefined) {
		    handleApi(code);
	    }

	    return response.data;
    },
    error => {
	    // 响应错误时的处理
	    // 这里可以添加统一的错误处理逻辑
	    return Promise.reject(error);


    }
)

/**
 * 导出配置好的axios实例
 * 提供请求配置、拦截器和错误处理机制
 * 作为模块默认导出，供其他组件或页面导入使用
 */
export default service