<template>
  <div class="mb-6 mt-10 p-3 rounded-lg "
       :class="isVerified ? 'bg-gradient-to-r from-green-50 to-emerald-50' : 'bg-gradient-to-r from-blue-50 to-indigo-50'">
    <div class="flex justify-between items-center">
      <div class="flex items-center gap-2">
        <div class="w-2 mt-[2.5px] h-2 rounded-full flex-shrink-0"
             :class="isVerified ? 'bg-green-500' : 'bg-blue-500'"></div>
        <span class="text-sm font-medium flex items-center" :class="isVerified ? 'text-green-700' : 'text-blue-700'">
          {{ isVerified ? '已验证' : '验证码' }}
        </span>
      </div>
      <div v-if="isVerified" class="flex items-center gap-1 text-green-600">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clip-rule="evenodd"/>
        </svg>
      </div>
      <a-button v-else :type="isVerified ? 'default' : 'primary'" size="small" @click="useVerify"
                class="flex items-center gap-1">
        {{ isVerified ? '重新验证' : '开始验证' }}
      </a-button>
    </div>
  </div>
  <Verify @success="handleVerifySuccess" :mode="pop" :captchaType="blockPuzzle"
          :imgSize="{ width: '330px', height: '155px' }" ref="verify"></Verify>


</template>

<script setup>
import {defineExpose, ref} from 'vue'
import logger from '../../utils/logger'
import Verify from "../verifition/Verify.vue"

// 验证码相关配置
const pop = ref('pop')
const blockPuzzle = 'blockPuzzle'
const verify = ref(null)
verify.value = undefined;
const isVerified = ref(false)
const captchaVerification = ref(null)

// 验证成功回调
const handleVerifySuccess = (params) => {
  // params 是验证码返回的二次验证参数
  // 通常包含 token，需和登录数据一起提交给后端
  logger.log('验证码验证成功:', params)
  isVerified.value = true
  captchaVerification.value = params
  // 例如：loginForm.value.captchaVerification = params
}

// 显示验证码弹窗
const useVerify = () => {
  if (verify.value) {
    verify.value.show()
  }
}

// 获取验证状态
const getVerifyStatus = () => {
  return isVerified.value
}

// 重置验证状态
const resetVerifyStatus = () => {
  isVerified.value = false
  captchaVerification.value = null
}

// 获取验证参数
const getCaptchaVerification = () => {
  return captchaVerification.value
}

// 暴露方法给父组件使用
defineExpose({
  getVerifyStatus,
  resetVerifyStatus,
  getCaptchaVerification,
  useVerify
})
</script>