<template>
  <div class="pt-2">
    <h3 class="text-2xl font-bold text-gray-800 mb-2">欢迎回来</h3>
    <p class="text-gray-600 mb-8">登陆你的账户继续</p>

    <a-form :model="loginForm" :rules="loginRules" layout="vertical" @finish="handleLogin" @validate="onValidate">
      <a-form-item label="用户名" name="username" @change="onFieldChange">
        <a-input v-model:value="loginForm.username" class="rounded-lg" placeholder="输入用户名" size="large">
          <UserOutlined/>
        </a-input>
      </a-form-item>

      <a-form-item label="密码" name="password" @change="onFieldChange">
        <a-input-password v-model:value="loginForm.password" class="rounded-lg" placeholder="输入密码" size="large">
          <LockOutlined/>
        </a-input-password>
      </a-form-item>

      <Captcha ref="captchaRef" @status-change="handleCaptchaStatusChange"></Captcha>

      <div class="flex items-center justify-between mb-6">
        <a-checkbox v-model:checked="loginForm.remember">
          记住我
        </a-checkbox>
        <a class="text-blue-600 hover:text-blue-700 text-sm" href="#">
          忘记密码?
        </a>
      </div>

      <a-button :disabled="!isVerified || !isFormValid" :loading="loginLoading"
                class="w-full h-10 rounded-lg text-base font-semibold flex items-center justify-center"
                html-type="submit" size="large"
                type="primary">
        登陆
      </a-button>
    </a-form>
  </div>
</template>

<script setup>
import {nextTick, ref} from 'vue'
import {LockOutlined, UserOutlined} from '@ant-design/icons-vue'
import Captcha from './Captcha.vue'
import logger from "../../utils/logger.js";
import {message} from "ant-design-vue";

const loginForm = ref({
  username: '',
  password: '',
  remember: false
})

const loginLoading = ref(false)
const captchaRef = ref(null)
const isVerified = ref(false)
const isFormValid = ref(false)
captchaRef.value = undefined;


// 更新表单验证状态的方法
const updateFormValidation = async () => {
  await nextTick()

  // 检查表单是否有效
  try {
    isFormValid.value = await validateForm()
  } catch {
    isFormValid.value = false
  }
}

// 表单验证方法
const validateForm = () => {
  return new Promise((resolve) => {
    // 检查用户名规则
    const usernameValid = loginForm.value.username &&
        loginForm.value.username.length >= 3 &&
        /^(?!\d+$)/.test(loginForm.value.username)

    // 检查密码规则
    const passwordValid = loginForm.value.password &&
        loginForm.value.password.length >= 6

    if (usernameValid && passwordValid) {
      resolve(true)
    } else {
      resolve(false)
    }
  })
}

// 验证码状态变化处理
const handleCaptchaStatusChange = (status) => {
  isVerified.value = status
}

// 字段变化处理
const onFieldChange = async () => {
  await updateFormValidation()
}

// 表单验证回调
const onValidate = async (name, status) => {
  await updateFormValidation()
}

const loginRules = {
  username: [
    {required: true, message: '请输入用户名', trigger: 'change'},
    {min: 3, message: '用户名至少3个字符', trigger: 'change'},
    {
      pattern: /^(?!\d+$)/,
      message: '用户名不能为纯数字',
      trigger: 'change'
    }
  ],
  password: [
    {required: true, message: '请输入密码', trigger: 'change'},
    {min: 6, message: '密码至少6个字符', trigger: 'change'}
  ]
}

const handleLogin = async () => {
  loginLoading.value = true

  // 从验证码组件获取验证参数
  let captchaVerification = null
  if (captchaRef.value) {
    captchaVerification = captchaRef.value.getCaptchaVerification()
  }

  logger.log('Captcha 校验码:', captchaVerification)
  logger.log('Login 表单数据:', {
    username: loginForm.value.username,
    password: loginForm.value.password,
    checkRemember: loginForm.value.remember,
    captchaVerification
  })

  // 处理登陆逻辑，将验证码参数传递给后端
  try {
    // 示例登录请求
    // const response = await loginApi.login({
    //   username: loginForm.value.username,
    //   password: loginForm.value.password,
    //   captchaVerification: captchaVerification
    // })

    // 登录成功后的处理...
    logger.log('Login 成功')
    message.success('登陆成功');
  } catch (error) {
    logger.error('Login 失败:', error)

    // 错误处理
    message.error('登陆失败:未知的错误,请联系管理员.');
  } finally {
    loginLoading.value = false
  }
 
}
</script>

