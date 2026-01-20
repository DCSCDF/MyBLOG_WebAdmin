<template>
    <div class="mb-6 mt-10 p-3 rounded-lg "
        :class="isVerified ? 'bg-linear-to-r from-green-50 to-emerald-50' : 'bg-linear-to-r from-blue-50 to-indigo-50'">
        <div class="flex justify-between items-center">
            <div class="flex items-center gap-2">
                <div class="w-2 h-2 rounded-full" :class="isVerified ? 'bg-green-500' : 'bg-blue-500'"></div>
                <span class="text-sm font-medium" :class="isVerified ? 'text-green-700' : 'text-blue-700'">
                    {{ isVerified ? '已验证' : '验证码' }}
                </span>
            </div>
            <a-button :type="isVerified ? 'type' : 'primary'" size="small" @click="useVerify"
                class="flex items-center gap-1">
                {{ isVerified ? '重新验证' : '开始验证' }}
            </a-button>
        </div>
    </div>
    <Verify Verify @success="handleVerifySuccess" :mode="pop" :captchaType="blockPuzzle"
        :imgSize="{ width: '330px', height: '155px' }" ref="verify"></Verify>



</template>

<script setup>
import { ref } from 'vue'
import Verify from "../verifition/Verify.vue"

// 验证码相关配置
const pop = ref('pop')
const blockPuzzle = 'blockPuzzle'
const verify = ref(null)
const isVerified = ref(false)

// 验证成功回调
const handleVerifySuccess = (params) => {
    // params 是验证码返回的二次验证参数
    // 通常包含 token，需和登录数据一起提交给后端
    console.log('验证码验证成功:', params)
    isVerified.value = true
    // 例如：loginForm.value.captchaVerification = params
}

// 显示验证码弹窗
const useVerify = () => {
    if (verify.value) {
        verify.value.show()
    }
}
</script>