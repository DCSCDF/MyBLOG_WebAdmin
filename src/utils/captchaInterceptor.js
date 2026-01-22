/**
 * Captcha响应处理
 * 用于处理Captcha返回的各种响应码
 *
 * 使用：
 * import { handleAjCaptchaResponse } from '@/utils/captchaInterceptor';
 * handleAjCaptchaResponse(repCode);
 */

import logger from './logger';
import {message} from "ant-design-vue";

// 定义Captcha响应码处理映射对象
const captchaResponseMap = {
    '0000': () => {
        // 请求成功，正常返回数据
    },
    '9999': () => {
        logger.error('服务器内部异常');
    },
    '0011': () => {
        logger.error('参数不能为空');
        message.error('参数不能为空');
    },
    '6110': () => {
        logger.error('验证码已失效，请重新获取');
        message.warning('验证码已失效，请重新获取');
    },
    '6111': () => {
        logger.error('验证失败');
        message.warning('验证失败');
    },
    '6112': () => {
        logger.error('获取验证码失败,请联系管理员');
        message.error('获取验证码失败,请联系管理员');
    },
    '6113': () => {
        logger.error('底图未初始化成功，请检查路径');
        message.error('底图未初始化成功，请检查路径');
    },
    '6201': () => {
        logger.error('get接口请求次数超限，请稍后再试!');
        message.warning('get接口请求次数超限，请稍后再试!');
    },
    '6206': () => {
        logger.error('无效请求，请重新获取验证码');
        message.error('无效请求，请重新获取验证码');
    },
    '6202': () => {
        logger.error('接口验证失败数过多，请稍后再试');
        message.warning('验证失败数过多，请稍后再试');
    },
    '6204': () => {
        logger.error('check接口请求次数超限，请稍后再试!');
        message.warning('请求次数超限，请稍后再试!');
    }
};

/**
 * 处理Captcha响应码
 * 根据不同的响应码进行相应的日志记录和处理
 * @param {string} repCode - 响应码
 * @returns {void}
 */
export const handleAjCaptchaResponse = (repCode) => {
    const handler = captchaResponseMap[repCode];
    if (handler) {
        handler();
    }
    // 如果没有找到对应的处理函数，则不做任何操作
};