import request from "../../../utils/request.js" //axios

//获取验证图片  以及token
export function reqGet(data) {
    return request({
        url: '/api/captcha/get',
        method: 'post',
        data
    })
}

//滑动或者点选验证
export function reqCheck(data) {
    return request({
        url: '/api/captcha/check',
        method: 'post',
        data
    })
}
 

