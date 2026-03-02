<!--
  - [Captcha.vue]
  - -------------------------------------------------------------------------------
  - This software is licensed under the MIT License.
  - However, any distribution or modification must retain this copyright notice.
  - See LICENSE for full terms.
  - -------------------------------------------------------------------------------
  - author: "Jiu Liu"
  - author_contact: "QQ: 3209174373, GitHub: https://github.com/DCSCDF"
  - license: "MIT"
  - license_exception: "Mandatory attribution retention"
  - UpdateTime: 2026/2/18 02:53
  -
  -->

<template>
        <div
            :class="isVerified ? 'bg-gradient-to-r from-green-50 to-emerald-50' : 'bg-gradient-to-r from-blue-50 to-indigo-50'"
            class="mb-6 mt-10 p-3 rounded-lg ">
                <div class="flex justify-between items-center">
                        <div class="flex items-center gap-1">
                                <div :class="isVerified ? 'bg-green-500' : 'bg-blue-500'"
                                     class="w-2 mt-[2px] h-2 rounded-full flex-shrink-0">
                                </div>
                                <span :class="isVerified ? 'text-green-700' : 'text-blue-700'"
                                      class="text-sm font-medium flex items-center">
                                                  {{ isVerified ? '已验证' : '验证码' }}
                                </span>
                        </div>
                        <div v-if="isVerified" class="flex items-center gap-1 text-green-600">
                                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"
                                     xmlns="http://www.w3.org/2000/svg">
                                        <path clip-rule="evenodd"
                                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                              fill-rule="evenodd"/>
                                </svg>
                        </div>
                        <a-button v-else :type="isVerified ? 'default' : 'primary'" class="flex items-center gap-1"
                                  size="small"
                                  @click="useVerify">
                                {{ isVerified ? '重新验证' : '开始验证' }}
                        </a-button>
                </div>
        </div>
</template>

<script setup>
import {onBeforeUnmount, ref} from 'vue'
import logger from '../../utils/logger.js'
import request from '../../utils/request.js'
import {useCaptchaStore} from '../../stores/captcha.js'
import {
        DEFAULT_CAPTCHA_BLOCK_PLACEHOLDER,
        DEFAULT_CAPTCHA_IMAGE_PLACEHOLDER
} from '../../utils/VerifyUtils/captchaDefaults.js'

// 获取验证码 Store 实例
const captchaStore = useCaptchaStore()

// 让 TAC 内部请求复用项目 axios（baseURL/拦截器/代理配置）
// 说明：tac.min.js 默认用 XMLHttpRequest，这里通过 monkey patch 让它走 axios，
//      这样请求会变成如 http://localhost:5173/api/captcha/get（与项目其它 API 一致）
if (typeof window !== 'undefined' && window.CaptchaConfig && !window.__TAC_AXIOS_PATCHED__) {
        window.__TAC_AXIOS_PATCHED__ = true
        const originalDoSendRequest = window.CaptchaConfig.prototype.doSendRequest

        const mapCaptchaTypeToTacType = (t) => {
                const type = t ? String(t) : null
                let result = type

                if (type) {
                        // 兼容旧/自定义字段：blockPuzzle(滑块拼图)、clickWord(点选)
                        if (type === 'blockPuzzle' || type === 'slider' || type === 'SLIDER') {
                                result = 'SLIDER'
                        } else if (type === 'clickWord' || type === 'wordClick' || type === 'WORD_IMAGE_CLICK') {
                                result = 'WORD_IMAGE_CLICK'
                        } else if (type === 'rotate' || type === 'ROTATE') {
                                result = 'ROTATE'
                        } else if (type === 'concat' || type === 'CONCAT') {
                                result = 'CONCAT'
                        } else if (type === 'DISABLED') {
                                result = 'DISABLED'
                        }
                }

                return result
        }


        const normalizeTacGetResponse = (payload) => {
                let result = payload

                if (payload && typeof payload === 'object') {
                        const data = payload.data

                        if (data && typeof data === 'object') {
                                // 支持多种后端返回结构
                                // 兼容嵌套结构后端会返回 { data: { data: {...} } }
                                const nestedData = data.data && typeof data.data === 'object' ? data.data : null
                                const repData = data.repData && typeof data.repData === 'object' ? data.repData : null

                                // 优先从嵌套的 data 中获取，其次从 repData 获取
                                const sourceData = nestedData || repData || data

                                const rawType = sourceData.type ?? sourceData.captchaType ?? data.type ?? data.captchaType
                                const tacType = mapCaptchaTypeToTacType(rawType) ?? 'SLIDER'

                                const backgroundImage =
                                    sourceData.backgroundImage ??
                                    sourceData.originalImage ??
                                    data.backgroundImage ??
                                    data.originalImage

                                const templateImage =
                                    sourceData.templateImage ??
                                    sourceData.jigsawImage ??
                                    data.templateImage ??
                                    data.jigsawImage

                                const id =
                                    sourceData.id ??
                                    sourceData.captchaId ??
                                    data.id ??
                                    data.captchaId ??

                                    sourceData.token ??
                                    data.token ??
                                    null

                                // 获取图片尺寸信息（用于动态计算拼图块大小）
                                const backgroundImageWidth = sourceData.backgroundImageWidth ?? data.backgroundImageWidth ?? 1570
                                const backgroundImageHeight = sourceData.backgroundImageHeight ?? data.backgroundImageHeight ?? 879
                                const templateImageWidth = sourceData.templateImageWidth ?? data.templateImageWidth ?? 110
                                const templateImageHeight = sourceData.templateImageHeight ?? data.templateImageHeight ?? 879

                                const normalizedBackground = backgroundImage || DEFAULT_CAPTCHA_IMAGE_PLACEHOLDER
                                const normalizedTemplate = templateImage || DEFAULT_CAPTCHA_BLOCK_PLACEHOLDER

                                result = {
                                        ...payload,
                                        data: {
                                                ...data,
                                                ...(nestedData ? nestedData : null),
                                                ...(repData ? repData : null),
                                                type: tacType,
                                                id,
                                                backgroundImage: normalizedBackground,
                                                templateImage: normalizedTemplate,
                                                // 传递图片尺寸信息给 TAC
                                                backgroundImageWidth,
                                                backgroundImageHeight,
                                                templateImageWidth,
                                                templateImageHeight,
                                        }
                                }
                        }
                }

                return result
        }

        window.CaptchaConfig.prototype.doSendRequest = function (cfg) {
                let resultPromise

                try {
                        // 使用 axios 实例，保持与项目 API 一致的 baseURL / headers / token / 拦截器
                        const requestPromise = request({
                                url: cfg.url,
                                method: (cfg.method || 'GET').toLowerCase(),
                                data: cfg.data,
                                headers: cfg.headers || {}
                        })

                        resultPromise = requestPromise.then((res) => {
                                let result

                                // request.js 成功返回结构：{ code, data, success, errorMsg }
                                // TAC 期望：{ code:200, data:{} } 或 { code:500, msg:'xxx' }
                                if (res && typeof res === 'object') {
                                        const basePayload = {
                                                code: res.code ?? 200,
                                                data: res.data ?? null,
                                                msg: res.errorMsg
                                        }

                                        // 针对验证码相关接口做结构兼容
                                        if (typeof cfg?.url === 'string') {
                                                // 生成验证码接口：需要解析嵌套的 data 结构
                                                if (cfg.url.includes('/api/captcha/get')) {
                                                        const normalized = normalizeTacGetResponse(basePayload)
                                                        logger.log('[TAC] captcha/get normalized data:', normalized)

                                                        // 保存验证码数据到 Pinia Store
                                                        if (normalized.data && typeof normalized.data === 'object') {
                                                                captchaStore.setCaptchaData(normalized.data)
                                                        }

                                                        result = normalized
                                                }
                                                // 验证验证码接口：需要将内层 data 的 code/msg 提升到外层
                                                else if (cfg.url.includes('/api/captcha/check')) {
                                                        const innerData = res.data
                                                        if (innerData && typeof innerData === 'object' && innerData.code !== undefined) {
                                                                // 将内层的业务错误码和消息提升，让 TAC 能正确识别失败
                                                                result = {
                                                                        code: innerData.code,
                                                                        msg: innerData.msg || innerData.errorMsg || basePayload.msg || '验证失败',
                                                                        data: innerData.data || null
                                                                }
                                                        } else {
                                                                result = basePayload
                                                        }
                                                } else {
                                                        result = basePayload
                                                }
                                        } else {
                                                result = basePayload
                                        }
                                } else {
                                        result = res
                                }

                                return result
                        }).catch((err) => {
                                // request.js 会 reject(Error)，转换为 TAC 可识别的结构
                                return {
                                        code: 4001,
                                        msg: err?.message || '请求失败'
                                }
                        })
                } catch (e) {
                        // 回退到 TAC 原始实现（极端情况下）
                        resultPromise = originalDoSendRequest.call(this, cfg)
                }

                return resultPromise
        }
}


// 验证状态
const isVerified = ref(false)
const captchaVerification = ref(null)
const isLoading = ref(false)
let tacInstance = null
const isCaptchaOpen = ref(false)

// 导入 emit 函数
const emit = defineEmits(['status-change'])

// 全局 close-captcha 事件处理函数
const handleGlobalCloseCaptcha = () => {
        if (isCaptchaOpen.value) {
                resetVerifyStatus()
        }
}

// 监听全局 close-captcha 事件（用于切换 tab 时关闭弹窗）
if (typeof window !== 'undefined') {
        window.addEventListener('close-captcha', handleGlobalCloseCaptcha)
}

// 验证成功回调
const handleValidSuccess = (res, _c, tac) => {
        logger.log("验证码验证成功回调...", res)

        try {
                tac?.destroyWindow?.()
        } catch (e) {
                logger.error('销毁 TAC 窗口失败', e)
        }

        // 从 Pinia Store 获取 captchaId（在 get 接口时已保存）
        const captchaId = captchaStore.getCaptchaId()

        logger.log('从 Pinia Store 获取的 captchaId:', captchaId)

        // 标记为已验证
        captchaStore.setVerified()

        // captchaVerification 应该是 GET 接口返回的 ID
        captchaVerification.value = {
                captchaVerification: captchaId, // 使用验证码 ID 作为校验码
                raw: res
        }

        logger.log('设置后的 captchaVerification.value:', captchaVerification.value)

        isVerified.value = true
        emit('status-change', true)
        isCaptchaOpen.value = false
}

// 验证失败回调
const handleValidFail = (res, _c, _tac) => {
        logger.log("验证码验证失败回调...", res)

        // 提取错误信息（此时已经从内层 data 提升到外层）
        const errorMsg = res?.msg || res?.errorMsg || '验证失败'

        logger.error(`验证码验证失败：${errorMsg}`, res)

        // 验证失败后重新加载验证码
        try {
                _tac?.reloadCaptcha?.()
        } catch (e) {
                logger.error('重新加载 TAC 验证码失败', e)
        }
}

// 刷新按钮回调
const handleRefresh = (_el, tac) => {
        tac?.reloadCaptcha?.()
}

// 关闭按钮回调
const handleClose = (_el, tac) => {
        logger.log("关闭按钮触发事件...")
        try {
                tac?.destroyWindow?.()
        } catch (e) {
                logger.error('关闭 TAC 窗口失败', e)
        }
        isCaptchaOpen.value = false
}

// 清理旧的验证码实例和容器
const cleanupOldInstance = () => {
        try {
                if (tacInstance) {
                        tacInstance.destroyWindow?.()
                        tacInstance = null
                }
                const oldTempDiv = document.getElementById('captcha-div-temp')
                if (oldTempDiv) {
                        oldTempDiv.remove()
                }
        } catch (e) {
                logger.error('清理旧实例失败', e)
        }
}

// 创建临时容器
const createTempContainer = () => {
        let tempDiv = document.getElementById('captcha-div-temp')
        if (!tempDiv) {
                tempDiv = document.createElement('div')
                tempDiv.id = 'captcha-div-temp'
                tempDiv.className = 'fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[100000]'
                document.body.appendChild(tempDiv)
        }
        return tempDiv
}

// 显示验证码弹窗（TAC）
const useVerify = () => {
        let shouldProceed = true

        logger.log('useVerify 被调用，isCaptchaOpen:', isCaptchaOpen.value)

        // 检查加载状态
        if (isLoading.value) {
                logger.log('正在加载中，返回')
                shouldProceed = false
        }

        // 检查 TAC 是否已加载
        if (shouldProceed && (typeof window === 'undefined' || typeof window.TAC !== 'function')) {
                logger.error('TAC 验证码未正确加载：window.TAC 不存在')
                shouldProceed = false
        }

        // 只有满足条件才执行
        if (shouldProceed) {
                isLoading.value = true

                // 先清理旧的实例和容器
                cleanupOldInstance()

                // TAC 验证码配置对象
                const captchaConfig = {
                        requestCaptchaDataUrl: "/api/captcha/get",
                        validCaptchaUrl: "/api/captcha/check",
                        bindEl: "#captcha-div-temp",
                        validSuccess: handleValidSuccess,
                        validFail: handleValidFail,
                        btnRefreshFun: handleRefresh,
                        btnCloseFun: handleClose
                }

                // 样式配置
                const styleConfig = {
                        width: 360,
                        height: 280,
                        blockSize: 50,
                        blockY: 140,
                        barHeight: 50,
                        barWidth: 320
                }

                try {
                        // 创建临时容器
                        createTempContainer()

                        logger.log('开始创建 TAC 实例...')
                        tacInstance = new window.TAC(captchaConfig, styleConfig)
                        tacInstance.init()
                        isCaptchaOpen.value = true
                        logger.log('TAC 实例创建成功，isCaptchaOpen:', isCaptchaOpen.value)

                        // 防御性兜底
                        setTimeout(() => {
                                try {
                                        const c = tacInstance?.C
                                        if (c && c.currentCaptchaData && !Array.isArray(c.currentCaptchaData.trackList)) {
                                                c.currentCaptchaData.trackList = []
                                        }
                                } catch {
                                        // ignore
                                }
                        }, 300)
                } catch (e) {
                        logger.error("初始化 TAC 验证码失败", e)
                } finally {
                        isLoading.value = false
                }
        }
}

// 组件卸载时清理资源（防止切换 tab 时残留）
onBeforeUnmount(() => {
        try {
                if (tacInstance) {
                        tacInstance.destroyWindow?.()
                        tacInstance = null
                }
                // 移除临时容器
                const tempDiv = document.getElementById('captcha-div-temp')
                if (tempDiv) {
                        tempDiv.remove()
                }
                // 移除全局事件监听
                if (typeof window !== 'undefined') {
                        window.removeEventListener('close-captcha', handleGlobalCloseCaptcha)
                }
        } catch (e) {
                logger.error('组件卸载时清理 TAC 失败', e)
        }
        isCaptchaOpen.value = false
})

// 获取验证状态
const getVerifyStatus = () => {
        return isVerified.value
}

// 重置验证状态
const resetVerifyStatus = () => {
        const wasVerified = isVerified.value;
        isVerified.value = false
        captchaVerification.value = null

        // 重置 Pinia Store 中的验证码状态
        captchaStore.resetCaptcha()

        // 关闭并清理 TAC 实例
        try {
                if (tacInstance) {
                        tacInstance.destroyWindow?.()
                        tacInstance = null
                }
                // 移除临时容器
                const tempDiv = document.getElementById('captcha-div-temp')
                if (tempDiv) {
                        tempDiv.remove()
                }
        } catch (e) {
                logger.error('重置验证码状态时清理 TAC 失败', e)
        }
        isCaptchaOpen.value = false

        // 如果之前是已验证状态，则发送状态变化通知
        if (wasVerified) {
                emit('status-change', false)
        }
}

// 获取验证参数
const getCaptchaVerification = () => {
        const verification = captchaStore.getCaptchaVerification()
        logger.log('getCaptchaVerification 返回:', verification)
        return verification
}

// 暴露方法给父组件使用
defineExpose({
        getVerifyStatus,
        resetVerifyStatus,
        getCaptchaVerification,
        useVerify
})
</script>