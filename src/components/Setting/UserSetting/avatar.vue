<!--
  - [avatar.vue]
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
                <div class="flex flex-col items-center justify-center">
                        <!--                        <a-image-->
                        <!--                            :height="150"-->
                        <!--                            :preview="false"-->
                        <!--                            :src="currentAvatarUrl"-->
                        <!--                            :width="150"-->
                        <!--                            class="rounded-md border-4 border-gray-200 transition-all duration-300 hover:border-blue-400 hover:scale-105"-->
                        <!--                            fallback=""-->
                        <!--                        />-->
                        <a-avatar :size="140" :src="currentAvatarUrl">
                                <template #icon>
                                        <UserOutlined/>
                                </template>

                        </a-avatar>

                        <a-divider/>

                        <a-button
                            type="primary"
                            @click="openAvatarDrawer">
                                修改头像
                        </a-button>
                </div>

                <a-drawer
                    v-model:open="avatarDrawerVisible"
                    :destroy-on-close="true"
                    :width="drawerWidth"
                    title="修改头像 URL"
                >
                        <a-form
                            ref="avatarFormRef"
                            :model="avatarForm"
                            :rules="avatarRules"
                            layout="vertical"
                        >
                                <a-form-item
                                    label="头像 URL"
                                    name="avatarUrl"
                                >
                                        <a-input
                                            v-model:value="avatarForm.avatarUrl"
                                            placeholder="请输入头像 URL，支持 http/https，留空则清空头像"
                                        />
                                </a-form-item>
                                <div class="text-xs text-gray-400 mb-4">
                                        必须是有效的 http/https 链接；传空字符串表示清空头像
                                </div>

                                <div class="flex justify-end gap-2 mt-4">
                                        <a-button @click="handleAvatarCancel">
                                                取消
                                        </a-button>
                                        <a-button
                                            :loading="avatarSubmitting"
                                            type="primary"
                                            @click="handleAvatarSubmit"
                                        >
                                                保存
                                        </a-button>
                                </div>
                        </a-form>
                </a-drawer>
        </a-card>
</template>

<script setup>
import {computed, ref} from 'vue';
import {message} from 'ant-design-vue';
import {useAuthStore} from '../../../stores/auth.js';
import {authApi} from '../../../api/user/auth/authApi.js';
import {useDrawerWidth} from '../../../utils/useDrawerWidth.js';
import {UserOutlined} from '@ant-design/icons-vue';


const authStore = useAuthStore();
const {drawerWidth} = useDrawerWidth();

const DEFAULT_AVATAR = '';

const avatarDrawerVisible = ref(false);
const avatarFormRef = ref(null);
const avatarSubmitting = ref(false);
const avatarForm = ref({
        avatarUrl: ''
});

const userProfile = computed(() => authStore.userProfile || {});

const currentAvatarUrl = computed(() => {
        const url = userProfile.value.avatarUrl;
        return url && url.trim() ? url.trim() : DEFAULT_AVATAR;
});

const isValidAvatarUrl = (url) => {
        let isValid = false;

        if (typeof url === 'string') {
                const trimmed = url.trim();
                if (trimmed) {
                        try {
                                const u = new URL(trimmed);
                                const protocol = (u.protocol || '').toLowerCase();
                                isValid = protocol === 'http:' || protocol === 'https:';
                        } catch {
                                // ignore
                        }
                }
        }

        return isValid;
};

const avatarRules = {
        avatarUrl: [
                {max: 200, message: '头像 URL 不能超过 200 个字符'},
                {
                        validator: (_, value) => {
                                const trimmed = (value || '').trim();
                                const isEmpty = trimmed === '';
                                const valid = isEmpty || isValidAvatarUrl(trimmed);
                                return valid
                                    ? Promise.resolve()
                                    : Promise.reject(
                                        new Error('头像URL格式无效，请输入有效的 http/https 链接或留空清空头像')
                                    );
                        },
                        trigger: 'blur'
                }
        ]
};

function openAvatarDrawer() {
        avatarForm.value.avatarUrl = userProfile.value.avatarUrl || '';
        avatarDrawerVisible.value = true;
}

function handleAvatarCancel() {
        avatarDrawerVisible.value = false;
}

async function handleAvatarSubmit() {
        let result = null;

        if (!avatarFormRef.value) {
                result = {success: false, error: '表单引用不存在'};
        } else {
                try {
                        avatarSubmitting.value = true;
                        await avatarFormRef.value.validate();

                        const trimmed = (avatarForm.value.avatarUrl || '').trim();

                        const res = await authApi.updateAvatarUrl({
                                avatarUrl: trimmed
                        });

                        const messageText = res?.data?.message || (trimmed ? '头像URL修改成功' : '头像已清空');
                        message.success(messageText);

                        const current = authStore.getUserProfile() || {};
                        authStore.updateUserProfile({
                                ...current,
                                avatarUrl: trimmed || ''
                        });

                        avatarDrawerVisible.value = false;
                        result = {success: true};
                } catch (e) {
                        if (e instanceof Error) {
                                message.error(e.message || '头像修改失败');
                        }
                        result = {success: false, error: e.message || '头像修改失败'};
                } finally {
                        avatarSubmitting.value = false;
                }
        }

        return result;
}
</script>


<style scoped>

</style>