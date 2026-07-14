<!--
  - [profileInfo.vue]
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
        <a-card>
                <div class="flex md:mx-6">
                        <a-form class="w-full">
                                <a-form-item class="!my-4">
                                        <div class="md:flex items-start text-gray-500">
                                                <div class="mb-1 py-1 md:mb-0 md:mx-4 w-26">
                                                        用户名
                                                </div>
                                                <div class="w-full">
                                                        <a-input-group
                                                            class="max-w-md !px-0 !flex flex-col"
                                                            compact>
                                                                <a-input
                                                                    :value="userProfile.username || ''"
                                                                    disabled
                                                                />
                                                        </a-input-group>
                                                        <div
                                                            class="text-xs text-gray-400 mt-1"
                                                            style="border-inline-end-width: 0 !important;">
                                                                这是您的唯一标识符，无法更改
                                                        </div>
                                                </div>
                                        </div>
                                </a-form-item>

                                <a-form-item class="!my-4">
                                        <div class="md:flex items-start text-gray-500">
                                                <div class="mb-1 py-1 md:mb-0 md:mx-4 w-26">
                                                        邮箱
                                                </div>
                                                <div class="w-full">
                                                        <a-input-group class="max-w-md !px-0 !flex" compact>
                                                                <a-input
                                                                    :value="userProfile.email || '-'"
                                                                    disabled
                                                                />
                                                                <a-button class="!text-gray-600"
                                                                          @click="openEmailDrawer">
                                                                        <SettingOutlined/>
                                                                        修改
                                                                </a-button>
                                                        </a-input-group>
                                                </div>
                                        </div>
                                </a-form-item>

                                <a-form-item class="!my-4">
                                        <div class="md:flex items-start text-gray-500">
                                                <div class="mb-1 py-1 md:mb-0 md:mx-4 w-26">
                                                        昵称
                                                </div>
                                                <div class="w-full">
                                                        <a-input-group class="max-w-md !px-0 !flex" compact>
                                                                <a-input
                                                                    :value="userProfile.nickname || '-'"
                                                                    disabled
                                                                />
                                                                <a-button class="!text-gray-600"
                                                                          @click="openNicknameDrawer">
                                                                        <SettingOutlined/>
                                                                        修改
                                                                </a-button>
                                                        </a-input-group>
                                                </div>
                                        </div>
                                </a-form-item>

                                <a-form-item class="!my-4">
                                        <div class="md:flex items-start text-gray-500">
                                                <div class="mb-1 py-1 md:mb-0 md:mx-4 w-26">
                                                        简介
                                                </div>
                                                <div class="w-full">
                                                        <a-input-group class="max-w-md !px-0 !flex flex-col" compact>
                                                                <a-textarea
                                                                    :value="userProfile.bio || '还没有填写简介~'"
                                                                    disabled
                                                                    :rows="3"
                                                                    :maxlength="500"
                                                                />
                                                        </a-input-group>
                                                        <a-button class="!text-gray-600 mt-2"
                                                                  @click="openBioDrawer">
                                                                <SettingOutlined/>
                                                                修改
                                                        </a-button>
                                                </div>
                                        </div>
                                </a-form-item>

                                <a-form-item>
                                        <div class="md:flex items-start text-gray-500">
                                                <div class="mb-1 py-1 md:mb-0 md:mx-4 w-26">
                                                        注册日期
                                                </div>
                                                <div class="w-full">
                                                        <a-input-group class="max-w-md !px-0 !flex" compact>
                                                                <a-date-picker
                                                                    :value="userProfile.createTime ? dayjs(userProfile.createTime) : null"
                                                                    disabled
                                                                    format="YYYY-MM-DD HH:mm:ss"
                                                                    picker="date"
                                                                />
                                                        </a-input-group>

                                                        <div
                                                            class="text-xs text-gray-400 mt-1"
                                                            style="border-inline-end-width: 0 !important;">
                                                                这是您创建账户的日期
                                                        </div>
                                                </div>
                                        </div>
                                </a-form-item>

                                <a-form-item>
                                        <div class="md:flex items-start text-gray-500">
                                                <div class="mb-1 py-1 md:mb-0 md:mx-4 w-26">
                                                        账户密码
                                                </div>
                                                <div class="w-full">
                                                        <a-button class="!text-gray-600" @click="openPasswordDrawer">
                                                                <!--                                                                <SettingOutlined/>-->
                                                                修改
                                                        </a-button>
                                                </div>
                                        </div>
                                </a-form-item>
                        </a-form>
                </div>

                <!-- 修改昵称抽屉 -->
                <a-drawer
                    v-model:open="nicknameDrawerVisible"
                    :destroy-on-close="true"
                    :width="drawerWidth"
                    title="修改昵称"
                >
                        <a-form
                            ref="nicknameFormRef"
                            :model="nicknameForm"
                            :rules="nicknameRules"
                            layout="vertical"
                        >
                                <a-form-item label="新昵称" name="nickname">
                                        <a-input
                                            v-model:value="nicknameForm.nickname"
                                            :maxlength="50"
                                            placeholder="请输入新昵称"
                                        />
                                </a-form-item>

                                <div class="flex justify-end gap-2 mt-4">
                                        <a-button @click="handleNicknameCancel">
                                                取消
                                        </a-button>
                                        <a-button
                                            :loading="nicknameSubmitting"
                                            type="primary"
                                            @click="handleNicknameSubmit"
                                        >
                                                保存
                                        </a-button>
                                </div>
                        </a-form>
                </a-drawer>

                <!-- 修改简介抽屉 -->
                <a-drawer
                    v-model:open="bioDrawerVisible"
                    :destroy-on-close="true"
                    :width="drawerWidth"
                    title="修改简介"
                >
                        <a-form
                            ref="bioFormRef"
                            :model="bioForm"
                            :rules="bioRules"
                            layout="vertical"
                        >
                                <a-form-item label="新简介" name="bio">
                                        <a-textarea
                                            v-model:value="bioForm.bio"
                                            :rows="5"
                                            :maxlength="500"
                                            placeholder="请输入新简介（1-500字符）"
                                            show-count
                                        />
                                </a-form-item>

                                <div class="flex justify-end gap-2 mt-4">
                                        <a-button @click="handleBioCancel">
                                                取消
                                        </a-button>
                                        <a-button
                                            :loading="bioSubmitting"
                                            type="primary"
                                            @click="handleBioSubmit"
                                        >
                                                保存
                                        </a-button>
                                </div>
                        </a-form>
                </a-drawer>

                <!-- 修改邮箱抽屉 -->
                <a-drawer
                    v-model:open="emailDrawerVisible"
                    :destroy-on-close="true"
                    :width="drawerWidth"
                    title="修改邮箱"
                    @close="resetEmailState"
                >
                        <!-- 输入邮箱阶段 -->
                        <a-form
                            v-if="emailStage === 'input'"
                            ref="emailFormRef"
                            :model="emailForm"
                            :rules="emailRules"
                            layout="vertical"
                        >
                                <a-form-item label="新邮箱" name="email">
                                        <a-input
                                            v-model:value="emailForm.email"
                                            placeholder="请输入新邮箱"
                                        />
                                </a-form-item>

                                <div class="flex justify-end gap-2 mt-4">
                                        <a-button @click="handleEmailCancel">
                                                取消
                                        </a-button>
                                        <a-button
                                            :loading="emailSubmitting"
                                            type="primary"
                                            @click="handleEmailSubmit"
                                        >
                                                {{ useEmailVerify ? '发送验证码' : '保存' }}
                                        </a-button>
                                </div>
                        </a-form>

                        <!-- 填写验证码阶段 -->
                        <a-form
                            v-else-if="emailStage === 'verify'"
                            layout="vertical"
                        >
                                <a-form-item>
                                        <div class="text-gray-600">
                                                <p>验证码已发送至：<span class="font-medium">{{ maskedEmail }}</span></p>
                                                <p class="text-xs text-gray-400 mt-1">
                                                        验证码有效期：{{ emailCountdown > 0 ? `${emailCountdown}秒后可重新获取` : '已过期' }}
                                                </p>
                                        </div>
                                </a-form-item>

                                <a-form-item label="验证码">
                                        <a-input
                                            v-model:value="emailCode"
                                            :maxlength="6"
                                            placeholder="请输入6位验证码"
                                            @input="handleEmailCodeInput"
                                        />
                                </a-form-item>

                                <div class="flex justify-end gap-2 mt-4">
                                        <a-button @click="handleBackToEmailInput">
                                                返回
                                        </a-button>
                                        <a-button
                                            :loading="emailSubmitting"
                                            type="primary"
                                            @click="handleEmailVerifySubmit"
                                        >
                                                确认修改
                                        </a-button>
                                </div>
                        </a-form>
                </a-drawer>

                <!-- 修改密码抽屉 -->
                <a-drawer
                    v-model:open="passwordDrawerVisible"
                    :destroy-on-close="true"
                    :width="drawerWidth"
                    title="修改密码"
                >
                        <a-form
                            ref="passwordFormRef"
                            :model="passwordForm"
                            :rules="passwordRules"
                            layout="vertical"
                        >
                                <a-form-item label="当前密码" name="oldPassword">
                                        <a-input-password
                                            v-model:value="passwordForm.oldPassword"
                                            placeholder="请输入当前密码"
                                        />
                                </a-form-item>

                                <a-form-item label="新密码" name="newPassword">
                                        <a-input-password
                                            v-model:value="passwordForm.newPassword"
                                            placeholder="请输入新密码"
                                        />
                                </a-form-item>

                                <a-form-item label="确认新密码" name="confirmPassword">
                                        <a-input-password
                                            v-model:value="passwordForm.confirmPassword"
                                            placeholder="请再次输入新密码"
                                        />
                                </a-form-item>

                                <div class="flex justify-end gap-2 mt-4">
                                        <a-button @click="handlePasswordCancel">
                                                取消
                                        </a-button>
                                        <a-button
                                            :loading="passwordSubmitting"
                                            type="primary"
                                            @click="handlePasswordSubmit"
                                        >
                                                确认修改
                                        </a-button>
                                </div>
                        </a-form>
                </a-drawer>
        </a-card>
</template>

<script setup>
import {computed, onMounted, ref} from 'vue';
import {message} from 'ant-design-vue';
import {useAuthStore} from '../../../stores/auth.js';
import {authApi} from '../../../api/user/auth/authApi.js';
import {publicConfigApi} from '../../../api/system/publicConfigApi.js';
import RsaEncryptor from '../../../utils/RsaUtils.js';
import {useRouter} from 'vue-router';
import {useDrawerWidth} from '../../../utils/useDrawerWidth.js';
import {SettingOutlined} from '@ant-design/icons-vue';
import dayjs from 'dayjs';

const authStore = useAuthStore();
const router = useRouter();
const {drawerWidth} = useDrawerWidth();

const userProfile = computed(() => authStore.userProfile || {});

// 修改昵称
const nicknameDrawerVisible = ref(false);
const nicknameFormRef = ref(null);
const nicknameSubmitting = ref(false);
const nicknameForm = ref({
        nickname: ''
});

const nicknameRules = {
        nickname: [
                {required: true, message: '请输入昵称', trigger: 'blur'},
                {min: 1, max: 50, message: '昵称长度为 1-50 个字符', trigger: 'blur'}
        ]
};

function openNicknameDrawer() {
        nicknameForm.value.nickname = userProfile.value.nickname || '';
        nicknameDrawerVisible.value = true;
}

function handleNicknameCancel() {
        nicknameDrawerVisible.value = false;
}

async function handleNicknameSubmit() {
        let result = null;

        if (!nicknameFormRef.value) {
                result = {success: false, error: '表单引用不存在'};
        } else {
                try {
                        nicknameSubmitting.value = true;
                        await nicknameFormRef.value.validate();
                        const nickname = nicknameForm.value.nickname.trim();

                        const res = await authApi.updateNickname({nickname});
                        message.success(res?.data?.message || '昵称修改成功');

                        const current = authStore.getUserProfile() || {};
                        authStore.updateUserProfile({
                                ...current,
                                nickname
                        });

                        nicknameDrawerVisible.value = false;
                        result = {success: true};
                } catch (e) {
                        if (e instanceof Error) {
                                message.error(e.message || '昵称修改失败');
                        }
                        result = {success: false, error: e.message || '昵称修改失败'};
                } finally {
                        nicknameSubmitting.value = false;
                }
        }

        return result;
}

// 修改简介
const bioDrawerVisible = ref(false);
const bioFormRef = ref(null);
const bioSubmitting = ref(false);
const bioForm = ref({
        bio: ''
});

const bioRules = {
        bio: [
                {required: true, message: '请输入简介', trigger: 'blur'},
                {min: 1, max: 500, message: '简介长度为 1-500 个字符', trigger: 'blur'}
        ]
};

function openBioDrawer() {
        bioForm.value.bio = userProfile.value.bio || '';
        bioDrawerVisible.value = true;
}

function handleBioCancel() {
        bioDrawerVisible.value = false;
}

async function handleBioSubmit() {
        let result = null;

        if (!bioFormRef.value) {
                result = {success: false, error: '表单引用不存在'};
        } else {
                try {
                        bioSubmitting.value = true;
                        await bioFormRef.value.validate();
                        const bio = bioForm.value.bio.trim();

                        const res = await authApi.updateBio({bio});
                        message.success(res?.data?.message || '简介修改成功');

                        const current = authStore.getUserProfile() || {};
                        authStore.updateUserProfile({
                                ...current,
                                bio
                        });

                        bioDrawerVisible.value = false;
                        result = {success: true};
                } catch (e) {
                        if (e instanceof Error) {
                                message.error(e.message || '简介修改失败');
                        }
                        result = {success: false, error: e.message || '简介修改失败'};
                } finally {
                        bioSubmitting.value = false;
                }
        }

        return result;
}

// 修改邮箱
const emailDrawerVisible = ref(false);
const emailFormRef = ref(null);
const emailSubmitting = ref(false);
const emailForm = ref({
        email: ''
});

// 邮箱验证模式相关状态
const emailStage = ref('input'); // input-输入邮箱 | verify-填写验证码
const maskedEmail = ref('');
const emailCode = ref('');
const emailCountdown = ref(0);
const emailCountdownTimer = ref(null);
const emailExpiresIn = ref(300);
const useEmailVerify = ref(false); // 是否启用邮箱验证码模式

const emailRules = {
        email: [
                {required: true, message: '请输入邮箱', trigger: 'blur'},
                {type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur'}
        ]
};

const emailVerifyRules = {
        code: [
                {required: true, message: '请输入验证码', trigger: 'blur'},
                {len: 6, message: '验证码为6位数字', trigger: 'blur'}
        ]
};

// 获取邮箱验证模式配置
async function fetchEmailVerifyConfig() {
        try {
                const response = await publicConfigApi.getConfig({keys: ['reg.use-email']});
                if (response.success && response.data && response.data.length > 0) {
                        const config = response.data.find(item => item.configKey === 'reg.use-email');
                        useEmailVerify.value = config?.configValue === 'true';
                }
        } catch (error) {
                console.error('获取邮箱验证配置失败:', error);
                useEmailVerify.value = false;
        }
}

// 掩码邮箱显示
function maskEmail(email) {
        if (!email) return '';
        const parts = email.split('@');
        if (parts.length !== 2 || !parts[1]) return email;
        return parts[0].slice(0, 2) + '***@' + parts[1];
}

// 开始倒计时
function startEmailCountdown(seconds) {
        if (emailCountdownTimer.value) clearInterval(emailCountdownTimer.value);
        emailCountdown.value = seconds;
        emailCountdownTimer.value = setInterval(() => {
                emailCountdown.value--;
                if (emailCountdown.value <= 0) {
                        clearInterval(emailCountdownTimer.value);
                        emailCountdownTimer.value = null;
                }
        }, 1000);
}

function openEmailDrawer() {
        emailForm.value.email = userProfile.value.email || '';
        emailCode.value = '';
        emailStage.value = 'input';
        emailDrawerVisible.value = true;
}

function handleEmailCancel() {
        emailDrawerVisible.value = false;
        resetEmailState();
}

function resetEmailState() {
        emailForm.value.email = '';
        emailCode.value = '';
        emailStage.value = 'input';
        if (emailCountdownTimer.value) {
                clearInterval(emailCountdownTimer.value);
                emailCountdownTimer.value = null;
        }
        emailCountdown.value = 0;
}

async function handleEmailSubmit() {
        if (!emailFormRef.value) {
                return;
        }

        try {
                await emailFormRef.value.validate();
                const email = emailForm.value.email.trim();

                if (useEmailVerify.value) {
                        // 验证码模式：先发送验证码
                        emailSubmitting.value = true;
                        try {
                                const res = await authApi.changeEmailCode({email});
                                emailStage.value = 'verify';
                                maskedEmail.value = maskEmail(email);
                                emailExpiresIn.value = res?.data?.expiresIn || 300;
                                startEmailCountdown(emailExpiresIn.value);
                                message.success(res?.data?.message || '验证码已发送到您的新邮箱');
                        } catch (e) {
                                message.error(e?.message || '发送验证码失败');
                        } finally {
                                emailSubmitting.value = false;
                        }
                } else {
                        // 直接模式：直接修改邮箱
                        emailSubmitting.value = true;
                        try {
                                const res = await authApi.updateEmail({email});
                                message.success(res?.data?.message || '邮箱修改成功');

                                const current = authStore.getUserProfile() || {};
                                authStore.updateUserProfile({
                                        ...current,
                                        email
                                });

                                emailDrawerVisible.value = false;
                                resetEmailState();
                        } catch (e) {
                                message.error(e?.message || '邮箱修改失败');
                        } finally {
                                emailSubmitting.value = false;
                        }
                }
        } catch (e) {
                // 表单验证失败
        }
}

async function handleEmailVerifySubmit() {
        if (!emailCode.value || emailCode.value.length !== 6) {
                message.warning('请输入6位验证码');
                return;
        }

        emailSubmitting.value = true;
        try {
                const res = await authApi.changeEmailConfirm({
                        email: emailForm.value.email.trim(),
                        code: emailCode.value
                });
                message.success(res?.data?.message || '邮箱修改成功');

                const current = authStore.getUserProfile() || {};
                authStore.updateUserProfile({
                        ...current,
                        email: emailForm.value.email.trim()
                });

                emailDrawerVisible.value = false;
                resetEmailState();
        } catch (e) {
                message.error(e?.message || '邮箱修改失败');
        } finally {
                emailSubmitting.value = false;
        }
}

function handleEmailCodeInput(e) {
        emailCode.value = e.target.value.replace(/\D/g, '');
}

function handleBackToEmailInput() {
        emailStage.value = 'input';
        emailCode.value = '';
        if (emailCountdownTimer.value) {
                clearInterval(emailCountdownTimer.value);
                emailCountdownTimer.value = null;
        }
        emailCountdown.value = 0;
}

// 修改密码
const passwordDrawerVisible = ref(false);
const passwordFormRef = ref(null);
const passwordSubmitting = ref(false);
const passwordForm = ref({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
});

const passwordRules = {
        oldPassword: [
                {required: true, message: '请输入当前密码', trigger: 'blur'},
                {min: 6, message: '密码至少 6 个字符', trigger: 'blur'}
        ],
        newPassword: [
                {required: true, message: '请输入新密码', trigger: 'blur'},
                {min: 6, message: '密码至少 6 个字符', trigger: 'blur'}
        ],
        confirmPassword: [
                {
                        validator: (_, value) => {
                                let result = Promise.resolve();

                                if (!value) {
                                        result = Promise.reject(new Error('请确认新密码'));
                                } else if (value !== passwordForm.value.newPassword) {
                                        result = Promise.reject(new Error('两次输入的密码不一致'));
                                }

                                return result;
                        },
                        trigger: 'blur'
                }
        ]
};

function openPasswordDrawer() {
        passwordForm.value.oldPassword = '';
        passwordForm.value.newPassword = '';
        passwordForm.value.confirmPassword = '';
        passwordDrawerVisible.value = true;
}

function handlePasswordCancel() {
        passwordDrawerVisible.value = false;
}

async function handlePasswordSubmit() {
        let result = null;

        if (!passwordFormRef.value) {
                result = {success: false, error: '表单引用不存在'};
        } else {
                try {
                        passwordSubmitting.value = true;
                        await passwordFormRef.value.validate();

                        const publicKeyRes = await authApi.publicKey();
                        if (!publicKeyRes?.data?.publicKey) {
                                result = {success: false, error: '获取公钥失败，请稍后重试'};
                        } else {
                                const publicKey = publicKeyRes.data.publicKey;
                                const oldEncrypted = RsaEncryptor.encrypt(passwordForm.value.oldPassword, publicKey);
                                const newEncrypted = RsaEncryptor.encrypt(passwordForm.value.newPassword, publicKey);

                                const res = await authApi.updatePassword({
                                        old_password: oldEncrypted,
                                        new_password: newEncrypted
                                });

                                message.success(res?.data?.message || '密码修改成功，请重新登录');
                                passwordDrawerVisible.value = false;

                                // 清除本地登录状态并跳转登录页
                                authStore.clearToken();
                                await router.push('/login');
                                result = {success: true};
                        }
                } catch (e) {
                        if (e instanceof Error) {
                                message.error(e.message || '密码修改失败');
                        }
                        result = {success: false, error: e.message || '密码修改失败'};
                } finally {
                        passwordSubmitting.value = false;
                }
        }

        return result;
}

onMounted(() => {
        fetchEmailVerifyConfig();
});
</script>
