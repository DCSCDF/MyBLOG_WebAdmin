/**
 * Captcha响应处理
 * 用于处理Captcha返回的各种响应码
 *
 * 使用：
 * import { handleAjCaptchaResponse } from '@/utils/captchaHandler';
 * handleAjCaptchaResponse(repCode);
 */

import logger from './logger';

/**
 * 处理Captcha响应码
 * 根据不同的响应码进行相应的日志记录和处理
 * @param {string} repCode - 响应码
 * @returns {void}
 */
export const handleAjCaptchaResponse = (repCode) => {
    switch (repCode) {
        case '0000':
            // 请求成功，正常返回数据
            break;
        case '9999':
            logger.error('服务器内部异常');
            break;
        case '0011':
            logger.error('参数不能为空');
            break;
        case '6110':
            logger.error('验证码已失效，请重新获取');
            break;
        case '6111':
            logger.error('验证失败');
            break;
        case '6112':
            logger.error('获取验证码失败,请联系管理员');
            break;
        case '6113':
            logger.error('底图未初始化成功，请检查路径');
            break;
        case '6201':
            logger.error('get接口请求次数超限，请稍后再试!');
            break;
        case '6206':
            logger.error('无效请求，请重新获取验证码');
            break;
        case '6202':
            logger.error('接口验证失败数过多，请稍后再试');
            break;
        case '6204':
            logger.error('check接口请求次数超限，请稍后再试!');
            break;
        default:
            // 其他情况不作特殊处理
            break;
    }
};