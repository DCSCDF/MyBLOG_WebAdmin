<template>
        <div class="pt-6">
                <h3 class="text-2xl font-bold text-gray-800 mb-2">创建账户</h3>
                <p class="text-gray-600 mb-8">加入我们</p>

                <a-form :model="registerForm" :rules="registerRules" layout="vertical" @finish="handleRegister"
                        @validate="onValidate">
                        <a-form-item label="用户名" name="username" @change="onFieldChange">
                                <a-input v-model:value="registerForm.username" placeholder="输入用户名" size="large"
                                         class="rounded-lg">
                                        <template #prefix>
                                                <UserOutlined/>
                                        </template>
                                </a-input>
                        </a-form-item>

                        <a-form-item label="邮箱" name="email" @change="onFieldChange">
                                <a-input v-model:value="registerForm.email" type="email" placeholder="输入邮箱地址"
                                         size="large"
                                         class="rounded-lg">
                                        <template #prefix>
                                                <MailOutlined/>
                                        </template>
                                </a-input>
                        </a-form-item>

                        <a-form-item label="密码" name="password" @change="onFieldChange">
                                <a-input-password v-model:value="registerForm.password" placeholder="设置密码"
                                                  size="large"
                                                  class="rounded-lg">

                                        <LockOutlined/>

                                </a-input-password>
                        </a-form-item>

                        <a-form-item label="确认密码" name="confirmPassword" @change="onFieldChange">
                                <a-input-password v-model:value="registerForm.confirmPassword" placeholder="确认密码"
                                                  size="large"
                                                  class="rounded-lg">

                                        <LockOutlined/>

                                </a-input-password>
                        </a-form-item>
                        <Captcha ref="captchaRef" @status-change="handleCaptchaStatusChange"></Captcha>
                        <a-form-item name="agreement" valuePropName="checked">
                                <a-checkbox v-model:checked="registerForm.agreement" @change="onFieldChange">
                    <span class="text-sm text-gray-700">
                        我同意
                        <a href="#" class="text-blue-600 hover:text-blue-700">
                            服务条款
                        </a>
                        和
                        <a href="#" class="text-blue-600 hover:text-blue-700">
                            隐私政策
                        </a>
                    </span>
                                </a-checkbox>
                        </a-form-item>

                        <a-button type="primary" size="large" html-type="submit" :loading="registerLoading"
                                  :disabled="!isVerified || !isFormValid"
                                  class="w-full h-10 rounded-lg text-base font-semibold flex items-center justify-center">
                                创建账户
                        </a-button>
                </a-form>
        </div>
</template>

<script setup>
import {nextTick, ref, watch} from 'vue'
import {LockOutlined, MailOutlined, UserOutlined} from '@ant-design/icons-vue'
import Captcha from "./Captcha.vue";

const registerForm = ref({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        agreement: false
})

const registerLoading = ref(false)
const captchaRef = ref(null)
const isVerified = ref(false)
const isFormValid = ref(false)
captchaRef.value = undefined


// 监听密码变化，更新确认密码验证状态
watch(() => registerForm.value.password, () => {
        updateFormValidation();
});

// 监听确认密码变化，更新表单验证状态
watch(() => registerForm.value.confirmPassword, () => {
        updateFormValidation();
});

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
                const usernameValid = registerForm.value.username &&
                    registerForm.value.username.length >= 3 &&
                    /^(?!\d+$)/.test(registerForm.value.username)

                // 检查邮箱规则
                const emailValid = registerForm.value.email &&
                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerForm.value.email)

                // 检查密码规则
                const passwordValid = registerForm.value.password &&
                    registerForm.value.password.length >= 6

                // 检查确认密码规则
                const confirmPasswordValid = registerForm.value.confirmPassword &&
                    registerForm.value.confirmPassword === registerForm.value.password

                // 检查协议同意规则
                const agreementValid = registerForm.value.agreement

                if (usernameValid && emailValid && passwordValid && confirmPasswordValid && agreementValid) {
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
const onValidate = async () => {
        await updateFormValidation()
}

const registerRules = {
        username: [
                {required: true, message: '请输入用户名', trigger: 'change'},
                {min: 3, max: 20, message: '用户名长度3-20个字符', trigger: 'change'},
                {
                        pattern: /^(?!\d+$)/,
                        message: '用户名不能为纯数字',
                        trigger: 'change'
                }
        ],
        email: [
                {required: true, message: '请输入邮箱', trigger: 'change'},
                {type: 'email', message: '请输入有效的邮箱地址', trigger: 'change'}
        ],
        password: [
                {required: true, message: '请输入密码', trigger: 'change'},
                {min: 6, message: '密码至少6个字符', trigger: 'change'}
        ],
        confirmPassword: [
                {required: true, message: '请确认密码', trigger: 'change'},
                {
                        validator: (_, value) => {
                                let error = null;
                                
                                if (!value) {
                                        error = new Error('请确认密码');
                                } else if (value !== registerForm.value.password) {
                                        error = new Error('两次输入密码不一致');
                                }
                                
                                return error ? Promise.reject(error) : Promise.resolve();
                        },
                        trigger: 'change'
                }
        ],
        agreement: [
                {
                        validator: (_, value) => {
                                return value ? Promise.resolve() : Promise.reject(new Error('请同意服务条款'));
                        },
                        trigger: 'change'
                }
        ]
}

const handleRegister = async () => {
        registerLoading.value = true
        // try {
        //   // 使用request实例发送注册请求
        //   const response = await request.post('/api/auth/register', {
        //     username: registerForm.value.username,
        //     email: registerForm.value.email,
        //     password: registerForm.value.password
        //   });
        //
        //   logger.log('注册成功', response);
        //   message.success('注册成功，请登录');
        //
        //   // 可以选择跳转到登录页面或其他操作
        // } catch (error) {
        //   logger.error('注册失败:', error);
        //
        //   // 根据错误类型显示不同的错误信息
        //   const errorMsg = error.response?.data?.message || '注册失败，请稍后再试.';
        //   message.error(errorMsg);
        // } finally {
        //   registerLoading.value = false;
        // }
}
</script>

<style scoped>
</style>