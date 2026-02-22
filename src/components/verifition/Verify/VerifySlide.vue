<!--
  - [VerifySlide.vue]
  - -------------------------------------------------------------------------------
  - This software is licensed under the MIT License.
  - However, any distribution or modification must retain this copyright notice.
  - See LICENSE for full terms.
  - -------------------------------------------------------------------------------
  - author: "Jiu Liu"
  - author_contact: "QQ: 3209174373, GitHub: https://github.com/DCSCDF"
  - license: "MIT"
  - license_exception: "Mandatory attribution retention"
  - UpdateTime: 2026/2/17 22:27
  -
  -->

<template>
        <div style="position: relative;">
                <div v-if="type === '2'" :style="{height: (parseInt(setSize.imgHeight) + vSpace) + 'px'}"
                     class="verify-img-out"
                >
                        <div :style="{width: setSize.imgWidth,
                                                   height: setSize.imgHeight,}" class="verify-img-panel">
                                <img :src="backImgSrc" alt=""
                                     style="width:100%;height:100%;display:block" @error="onBackImgError">
                                <div v-show="showRefresh" class="verify-refresh" @click="refresh"><i
                                    class="iconfont icon-refresh"></i>
                                </div>
                                <transition name="tips">
                                        <span v-if="tipWords" :class="passFlag ?'suc-bg':'err-bg'" class="verify-tips">{{
                                                        tipWords
                                                }}</span>
                                </transition>
                        </div>
                </div>
                <!-- 公共部分 -->
                <div :style="{width: setSize.imgWidth,
                                              height: barSize.height,
                                              'line-height':barSize.height}" class="verify-bar-area">
                        <span class="verify-msg" v-text="text"></span>
                        <div
                            :style="{width: (leftBarWidth!==undefined)?leftBarWidth: barSize.height, height: barSize.height, 'border-color': leftBarBorderColor, transaction: transitionWidth}"
                            class="verify-left-bar">
                                <span class="verify-msg" v-text="finishText"></span>
                                <div
                                    :style="{width: barSize.height, height: barSize.height, 'background-color': moveBlockBackgroundColor, left: moveBlockLeft, transition: transitionLeft}"
                                    class="verify-move-block"
                                    @mousedown="start"
                                    @touchstart="start">
                                        <i :class="['verify-icon iconfont', iconClass]"
                                           :style="{color: iconColor}"></i>
                                        <div v-if="type === '2'" :style="{'width':Math.floor(parseInt(setSize.imgWidth)*47/310)+ 'px',
                                  'height': setSize.imgHeight,
                                  'top':'-' + (parseInt(setSize.imgHeight) + vSpace) + 'px',
                                  'background-size': setSize.imgWidth + ' ' + setSize.imgHeight,
                                  }"
                                             class="verify-sub-block">
                                                <img :src="blockImgSrc" alt=""
                                                     style="width:100%;height:100%;display:block;-webkit-user-drag:none;"
                                                     @error="onBlockImgError">
                                        </div>
                                </div>
                        </div>
                </div>
        </div>
</template>
<script type="text/babel">
/**
 * VerifySlide
 * @description 滑块
 * */
import {aesEncrypt} from "./../utils/ase"
import {resetSize} from './../utils/util'
import {reqCheck, reqGet} from "../../../api/user/auth/captchaApi.js"
import logger from '../../../utils/logger.js'
import {DEFAULT_CAPTCHA_BLOCK_PLACEHOLDER, DEFAULT_CAPTCHA_IMAGE_PLACEHOLDER} from '../utils/captchaDefaults.js'
import {message} from 'ant-design-vue'
import {computed, getCurrentInstance, nextTick, onMounted, reactive, ref, toRefs, watch} from 'vue';
//  "captchaType":"blockPuzzle",
export default {
        name: 'VerifySlide',
        props: {
                captchaType: {
                        type: String,
                },
                type: {
                        type: String,
                        default: '1'
                },
                //弹出式pop，固定fixed
                mode: {
                        type: String,
                        default: 'fixed'
                },
                vSpace: {
                        type: Number,
                        default: 5
                },
                explain: {
                        type: String,
                        default: '向右滑动完成验证'
                },
                imgSize: {
                        type: Object,
                        default() {
                                return {
                                        width: '310px',
                                        height: '155px'
                                }
                        }
                },
                blockSize: {
                        type: Object,
                        default() {
                                return {
                                        width: '50px',
                                        height: '50px'
                                }
                        }
                },
                barSize: {
                        type: Object,
                        default() {
                                return {
                                        width: '310px',
                                        height: '40px'
                                }
                        }
                }
        },
        setup(props, context) {
                const {mode, captchaType, vSpace, imgSize, barSize, type, blockSize, explain} = toRefs(props)
                const {proxy} = getCurrentInstance();
                let secretKey = ref(''),           //后端返回的ase加密秘钥
                    passFlag = ref(''),         //是否通过的标识
                    backImgBase = ref(''),      //验证码背景图片
                    blockBackImgBase = ref(''), //验证滑块的背景图片
                    backToken = ref(''),        //后端返回的唯一token值
                    startMoveTime = ref(''),    //移动开始的时间
                    endMovetime = ref(''),      //移动结束的时间
                    tipsBackColor = ref(''),    //提示词的背景颜色
                    tipWords = ref(''),
                    text = ref(''),
                    finishText = ref(''),
                    setSize = reactive({
                            imgHeight: 0,
                            imgWidth: 0,
                            barHeight: 0,
                            barWidth: 0
                    }),
                    top = ref(0),
                    left = ref(0),
                    moveBlockLeft = ref(undefined),
                    leftBarWidth = ref(undefined),
                    // 移动中样式
                    moveBlockBackgroundColor = ref(undefined),
                    leftBarBorderColor = ref('#ddd'),
                    iconColor = ref(undefined),
                    iconClass = ref('icon-right'),
                    status = ref(false),	    //鼠标状态
                    isEnd = ref(false),		//是够验证完成
                    showRefresh = ref(true),
                    lastGetTime = ref(0),    // 上次请求 get 的时间，用于防抖 429
                    transitionLeft = ref(''),
                    transitionWidth = ref(''),
                    startLeft = ref(0)

                const barArea = computed(() => {
                        return proxy.$el.querySelector('.verify-bar-area')
                })

                const backImgSrc = computed(() => {
                        const v = backImgBase.value
                        if (!v) return DEFAULT_CAPTCHA_IMAGE_PLACEHOLDER
                        return v.startsWith('data:') ? v : 'data:image/png;base64,' + v
                })
                const blockImgSrc = computed(() => {
                        const v = blockBackImgBase.value
                        if (!v) return DEFAULT_CAPTCHA_BLOCK_PLACEHOLDER
                        return v.startsWith('data:') ? v : 'data:image/png;base64,' + v
                })

                const setDefaultImages = () => {
                        backImgBase.value = DEFAULT_CAPTCHA_IMAGE_PLACEHOLDER
                        blockBackImgBase.value = '' // 滑块块用空串即可，blockImgSrc 会走透明占位图
                }
                const onBackImgError = () => {
                        setDefaultImages()
                }
                const onBlockImgError = () => {
                        setDefaultImages()
                }

                function init() {
                        text.value = explain.value
                        getPictrue();
                        nextTick(() => {
                                let {imgHeight, imgWidth, barHeight, barWidth} = resetSize(proxy)
                                setSize.imgHeight = imgHeight
                                setSize.imgWidth = imgWidth
                                setSize.barHeight = barHeight
                                setSize.barWidth = barWidth
                                proxy.$parent.$emit('ready', proxy)
                        })

                        window.removeEventListener("touchmove", function (e) {
                                move(e);
                        });
                        window.removeEventListener("mousemove", function (e) {
                                move(e);
                        });

                        //鼠标松开
                        window.removeEventListener("touchend", function () {
                                end();
                        });
                        window.removeEventListener("mouseup", function () {
                                end();
                        });

                        window.addEventListener("touchmove", function (e) {
                                move(e);
                        });
                        window.addEventListener("mousemove", function (e) {
                                move(e);
                        });

                        //鼠标松开
                        window.addEventListener("touchend", function () {
                                end();
                        });
                        window.addEventListener("mouseup", function () {
                                end();
                        });
                }

                watch(type, () => {
                        init()
                })
                onMounted(() => {
                        // 禁止拖拽
                        init()
                        proxy.$el.onselectstart = function () {
                                return false
                        }
                })

                //鼠标按下
                function start(e) {
                        e = e || window.event
                        if (!e.touches) {  //兼容PC端
                                var x = e.clientX;
                        } else {           //兼容移动端
                                var x = e.touches[0].pageX;
                        }
                        startLeft.value = Math.floor(x - barArea.value.getBoundingClientRect().left);
                        startMoveTime.value = +new Date();    //开始滑动的时间
                        if (isEnd.value == false) {
                                text.value = ''
                                moveBlockBackgroundColor.value = '#337ab7'
                                leftBarBorderColor.value = '#337AB7'
                                iconColor.value = '#fff'
                                e.stopPropagation();
                                status.value = true;
                        }
                }

                //鼠标移动
                function move(e) {
                        e = e || window.event
                        if (status.value && isEnd.value == false) {
                                if (!e.touches) {  //兼容PC端
                                        var x = e.clientX;
                                } else {           //兼容移动端
                                        var x = e.touches[0].pageX;
                                }
                                var bar_area_left = barArea.value.getBoundingClientRect().left;
                                var cursorLeft = x - bar_area_left // 光标相对于滑槽的 left
                                var barWidth = barArea.value.offsetWidth
                                var blockW = parseInt(blockSize.value.width, 10) || parseInt(barSize.value.height, 10)
                                // 用真实光标位置算位移，再限制在 [0, 最大右移]：向左拖不会出现负值，避免误触发校验
                                var delta = cursorLeft - startLeft.value
                                var clamped = Math.max(0, Math.min(barWidth - blockW, delta))
                                moveBlockLeft.value = clamped + "px"
                                leftBarWidth.value = clamped + "px"
                        }
                }

                //鼠标松开
                function end() {
                        endMovetime.value = +new Date();
                        //判断是否重合
                        if (status.value && isEnd.value == false) {
                                var moveLeftDistance = parseInt((moveBlockLeft.value || '').replace('px', ''), 10) || 0;
                                moveLeftDistance = moveLeftDistance * 310 / parseInt(setSize.imgWidth, 10)
                                // 未向右滑动或滑动距离过小则不提交校验，避免向左轻滑误触发
                                if (moveLeftDistance <= 0) {
                                        status.value = false
                                        return
                                }
                                let data = {
                                        captchaType: captchaType.value,
                                        "pointJson": secretKey.value ? aesEncrypt(JSON.stringify({
                                                x: moveLeftDistance,
                                                y: 5.0
                                        }), secretKey.value) : JSON.stringify({x: moveLeftDistance, y: 5.0}),
                                        "token": backToken.value
                                }
                                reqCheck(data).then(response => {
                                        // 注意：由于响应拦截器已经处理了数据结构，
                                        // 实际的数据在 response.data 中
                                        const res = response.data || response;

                                        if (res.repCode == "0000") {
                                                moveBlockBackgroundColor.value = '#5cb85c'
                                                leftBarBorderColor.value = '#5cb85c'
                                                iconColor.value = '#fff'
                                                iconClass.value = 'icon-check'
                                                showRefresh.value = false
                                                isEnd.value = true
                                                passFlag.value = true
                                                tipWords.value = `${((endMovetime.value - startMoveTime.value) / 1000).toFixed(2)}s验证成功`
                                                var captchaVerification = secretKey.value ? aesEncrypt(backToken.value + '---' + JSON.stringify({
                                                        x: moveLeftDistance,
                                                        y: 5.0
                                                }), secretKey.value) : backToken.value + '---' + JSON.stringify({
                                                        x: moveLeftDistance,
                                                        y: 5.0
                                                })
                                                // 验证成功：仅关闭弹窗并通知父组件，不再调用 refresh 避免多余 get
                                                setTimeout(() => {
                                                        tipWords.value = ""
                                                        proxy.$parent.closeBox()
                                                        proxy.$parent.$emit('success', {captchaVerification})
                                                }, 1000)
                                        } else {
                                                moveBlockBackgroundColor.value = '#d9534f'
                                                leftBarBorderColor.value = '#d9534f'
                                                iconColor.value = '#fff'
                                                iconClass.value = 'icon-close'
                                                passFlag.value = false
                                                status.value = false  // 重置拖动状态
                                                isEnd.value = false   // 重置完成状态
                                                setTimeout(function () {
                                                        refresh();
                                                }, 1000);
                                                proxy.$parent.$emit('error', proxy)
                                                tipWords.value = "验证失败"
                                                setTimeout(() => {
                                                        tipWords.value = ""
                                                }, 1000)
                                        }
                                }).catch(error => {
                                        logger.error('验证码验证失败:', error)
                                        moveBlockBackgroundColor.value = '#d9534f'
                                        leftBarBorderColor.value = '#d9534f'
                                        iconColor.value = '#fff'
                                        iconClass.value = 'icon-close'
                                        passFlag.value = false
                                        status.value = false
                                        isEnd.value = false
                                        // 显示具体的错误信息
                                        tipWords.value = error.message || "验证失败"
                                        setTimeout(() => {
                                                refresh();
                                                tipWords.value = ""
                                        }, 1500);
                                })
                                status.value = false;
                        }
                }

                const refresh = () => {
                        showRefresh.value = true
                        finishText.value = ''

                        transitionLeft.value = 'left .3s'
                        moveBlockLeft.value = 0

                        leftBarWidth.value = undefined
                        transitionWidth.value = 'width .3s'

                        leftBarBorderColor.value = '#ddd'
                        moveBlockBackgroundColor.value = '#fff'
                        iconColor.value = '#000'
                        iconClass.value = 'icon-right'
                        isEnd.value = false

                        getPictrue()
                        setTimeout(() => {
                                transitionWidth.value = ''
                                transitionLeft.value = ''
                                text.value = explain.value
                        }, 300)
                }

                // 请求背景图片和验证图片（带防抖，避免 429）
                function getPictrue() {
                        const now = Date.now()
                        // if (now - lastGetTime.value < CAPTCHA_GET_MIN_INTERVAL_MS) {
                        //         const msg = '请求过于频繁，请稍后再试'
                        //         tipWords.value = msg
                        //         message.warning(msg)
                        //         setDefaultImages()
                        //         return
                        // }
                        lastGetTime.value = now

                        const data = {captchaType: captchaType.value}
                        reqGet(data).then(response => {
                                const res = response.data || response

                                if (res.repCode == "0000") {
                                        if (!res.repData ||
                                            !res.repData.originalImageBase64 ||
                                            !res.repData.jigsawImageBase64 ||
                                            !res.repData.token ||
                                            !res.repData.secretKey) {
                                                tipWords.value = "验证码数据不完整，请刷新重试"
                                                logger.error('验证码数据缺失:', res)
                                                setDefaultImages()
                                                return
                                        }
                                        backImgBase.value = res.repData.originalImageBase64
                                        blockBackImgBase.value = res.repData.jigsawImageBase64
                                        backToken.value = res.repData.token
                                        secretKey.value = res.repData.secretKey
                                } else {
                                        tipWords.value = res.repMsg || "获取验证码失败"
                                        setDefaultImages()
                                }
                        }).catch(error => {
                                const msg = error && error.message ? error.message : '网络请求失败，请检查网络连接'
                                tipWords.value = msg
                                message.warning(msg)
                                logger.error('获取验证码图片失败:', error)
                                setDefaultImages()
                        })
                }

                return {
                        secretKey,
                        passFlag,
                        backImgBase,
                        blockBackImgBase,
                        backImgSrc,
                        blockImgSrc,
                        onBackImgError,
                        onBlockImgError,
                        backToken,        //后端返回的唯一token值
                        startMoveTime,    //移动开始的时间
                        endMovetime,      //移动结束的时间
                        tipsBackColor,    //提示词的背景颜色
                        tipWords,
                        text,
                        finishText,
                        setSize,
                        top,
                        left,
                        moveBlockLeft,
                        leftBarWidth,
                        // 移动中样式
                        moveBlockBackgroundColor,
                        leftBarBorderColor,
                        iconColor,
                        iconClass,
                        status,	    //鼠标状态
                        isEnd,		//是够验证完成
                        showRefresh,
                        transitionLeft,
                        transitionWidth,
                        barArea,
                        refresh,
                        start
                }
        },
}
</script>

