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
                        <a-image
                            :height="150"
                            :preview="false"
                            :src="currentAvatarUrl"
                            :width="150"
                            class="rounded-md border-4 border-gray-200 transition-all duration-300 hover:border-blue-400 hover:scale-105"
                            fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ
                                    1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLs
                                    is7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB
                                    5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgH
                                    QqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrk
                                    l1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae
                                    3dP3PTWBSGcbGzM6GCKqlIBRV0dHRJFarQ0eUT8LH4BnRU0NHR0UEFVdIlFRV7TzRksomPY8uykTk/zewQfKw/9znv4yvJynLv4uLiV2dBoDiBf4qP3/ARuCRAB
                                    EFAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJ
                                    EkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQB
                                    AQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQK
                                    AnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghgg0
                                    Aj8i0JO4OzsrPv69Wv+hi2qPHr0qNvf39+iI97soRIh4f3z58/u7du3SXX7Xt7Z2enevHmzfQe+oSN2apSAPj09TSrb+XKI/f379+08+A0cNRE2ANkupk+ACNPvkSPcAAEibA
                                    CyXUyfABGm3yNHuAECRNgAZLuYPgEirKlHu7u7XdyytGwHAd8jjNyng4OD7vnz51dbPT8/7z58+NB9+/bt6jU/TI+AGWHEnrx48eJ/EsSmHzx40L18+fLyzxF3ZVMjEyDC
                                    iEDjMYZZS5wiPXnyZFbJaxMhQIQRGzHvWR7XCyOCXsOmiDAi1HmPMMQjDpbpEiDCiL358eNHurW/5SnWdIBbXiDCiA38/Pnzrce2YyZ4//59F3ePLNMl4PbpiL2J0L
                                    979+7yDtHDhw8vtzzvdGnEXdvUigSIsCLAWavHp/+qM0BcXMd/q25n1vF57TYBp0a3mUzilePj4+7k5KSLb6gt6ydAhPUzXnoPR0dHl79WGTNCfBnn1u
                                    vSCJdegQhLI1vvCk+fPu2ePXt2tZOYEV6/fn31dz+shwAR1sP1cqvLntbEN9MxA9xcYjsxS1jWR4AIa2Ibzx0tc44fYX/16lV6NDFLXH+YL32jwiACRBiE
                                    bf5KcXoTIsQSpzXx4N28Ja4BQoK7rgXiydbHjx/P25TaQAJEGAguWy0+2Q8PD6/Ki4R8EVl+bzBOnZY95fq9rj9zAkTI2SxdidBHqG9+skdw43borCXO/
                                    ZcJdraPWdv22uIEiLA4q7nvvCug8WTqzQveOH26fodo7g6uFe/a17W3+nFBAkRYENRdb1vkkz1CH9cPsVy/jrhr27PqMYvENYNlHAIesRiBYwRy0V+8iXP8
                                    +/fvX11Mr7L7ECueb/r48eMqm7FuI2BGWDEG8cm+7G3NEOfmdcTQw4h9/55lhm7DekRYKQPZF2ArbXTAyu4kDYB2YxUzwg0gi/41ztHnfQG26HbGel/crVr
                                    m7tNY+/1btkOEAZ2M05r4FB7r9GbAIdxaZYrHdOsgJ/wCEQY0J74TmOKnbxxT9n3FgGGWWsVdowHtjt9Nnvf7yQM2aZU/TIAIAxrw6dOnAWtZZcoEnBpNuTuObW
                                    MEiLAx1HY0ZQJEmHJ3HNvGCBBhY6jtaMoEiJB0Z29vL6ls58vxPcO8/zfrdo5qvKO+d3Fx8Wu8zf1dW4p/cPzLly/dtv9Ts/EbcvGAHhHyfBIhZ6NSiIBTo0LNNtScAB
                                    FyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUo
                                    gAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChUL
                                    MNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121
                                    BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSi
                                    EC/wGgKKC4YMA4TAAAAABJRU5ErkJggg=="
                        />
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

const authStore = useAuthStore();
const {drawerWidth} = useDrawerWidth();

const DEFAULT_AVATAR = 'https://avatars.githubusercontent.com/u/75759503?v=4';

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