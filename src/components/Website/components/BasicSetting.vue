<!--
  - [BasicSetting.vue]
  - -------------------------------------------------------------------------------
  - This software is licensed under the MIT License.
  - However, any distribution or modification must retain this copyright notice.
  - See LICENSE for full terms.
  - -------------------------------------------------------------------------------
  - author: "Jiu Liu"
  - author_contact: "QQ: 3209174373, GitHub: https://github.com/DCSCDF"
  - license: "MIT"
  - license_exception: "Mandatory attribution retention"
  - UpdateTime: 2026/2/21 14:45
  -
  -->

<template>
        <div class="min-h-[400px] w-full max-w-full overflow-x-auto">

                <div class="mb-4 flex items-center justify-between lg:mx-2 mt-4 lg:mt-0">
                        <div>
                                <h2 class="font-bold text-lg mb-1">网站基本设置</h2>
                                <span class="text-sm text-gray-600">配置网站的基本信息和常规设置</span>
                        </div>
                </div>

                <div>
                        <a-spin :spinning="loading">
                                <a-form class="w-full">
                                        <a-form-item class="!my-4">
                                                <div class="lg:flex items-start text-gray-500">
                                                        <div class="mb-1 py-1 lg:mb-0 lg:mx-4 w-26">
                                                                网站名称
                                                        </div>
                                                        <div class="w-full">
                                                                <a-input-group class="max-w-md !px-0 !flex" compact>
                                                                        <a-input v-model:value="form.siteName"
                                                                                 disabled/>
                                                                        <a-button class="!text-gray-600"
                                                                                  @click="openEditDrawer('siteName')">
                                                                                <SettingOutlined/>
                                                                                修改
                                                                        </a-button>
                                                                </a-input-group>
                                                                <div
                                                                    class="text-xs text-gray-400 mt-1"
                                                                    style="border-inline-end-width: 0 !important;">
                                                                        这是您站点的标题名称，不可为空
                                                                </div>
                                                        </div>
                                                </div>
                                        </a-form-item>

                                        <a-form-item class="!my-4">
                                                <div class="lg:flex items-start text-gray-500">
                                                        <div class="mb-1 py-1 lg:mb-0 lg:mx-4 w-26">
                                                                网站域名
                                                        </div>
                                                        <div class="w-full">
                                                                <a-input-group class="max-w-md !px-0 !flex" compact>
                                                                        <a-input v-model:value="form.domain"
                                                                                 disabled
                                                                                 placeholder="myblog.com"/>
                                                                        <a-button class="!text-gray-600"
                                                                                  @click="openEditDrawer('domain')">
                                                                                <SettingOutlined/>
                                                                                修改
                                                                        </a-button>
                                                                </a-input-group>
                                                        </div>
                                                </div>
                                        </a-form-item>

                                        <a-form-item class="!my-4">
                                                <div class="lg:flex items-start text-gray-500">
                                                        <div class="mb-1 py-1 lg:mb-0 lg:mx-4 w-26">
                                                                网站描述
                                                        </div>
                                                        <div class="w-full">
                                                                <a-input-group class="max-w-md !px-0" compact>
                                                                        <a-textarea v-model:value="form.description"
                                                                                    :rows="3"
                                                                                    disabled
                                                                                    placeholder="请输入网站描述"/>
                                                                </a-input-group>
                                                                <div class="mt-2">
                                                                        <a-button class="!text-gray-600"
                                                                                  @click="openEditDrawer('description')">
                                                                                <SettingOutlined/>
                                                                                修改
                                                                        </a-button>
                                                                </div>
                                                        </div>
                                                </div>
                                        </a-form-item>

                                        <a-form-item class="!my-4">
                                                <div class="lg:flex items-start text-gray-500">
                                                        <div class="mb-1 py-1 lg:mb-0 lg:mx-4 w-26">
                                                                备案号
                                                        </div>
                                                        <div class="w-full">
                                                                <a-input-group class="max-w-md !px-0 !flex" compact>
                                                                        <a-input v-model:value="form.icp"
                                                                                 disabled
                                                                                 placeholder="请输入备案号"/>
                                                                        <a-button class="!text-gray-600"
                                                                                  @click="openEditDrawer('icp')">
                                                                                <SettingOutlined/>
                                                                                修改
                                                                        </a-button>
                                                                </a-input-group>
                                                        </div>
                                                </div>
                                        </a-form-item>

                                        <a-form-item class="!my-4">
                                                <div class="lg:flex items-start text-gray-500">
                                                        <div class="mb-1 py-1 lg:mb-0 lg:mx-4 w-26">
                                                                前端页面地址
                                                        </div>
                                                        <div class="w-full">
                                                                <a-input-group class="max-w-md !px-0 !flex" compact>
                                                                        <a-input v-model:value="form.redirectUrl"
                                                                                 disabled
                                                                                 placeholder="请输入前端页面地址"/>
                                                                        <a-button class="!text-gray-600"
                                                                                  @click="openEditDrawer('redirectUrl')">
                                                                                <SettingOutlined/>
                                                                                修改
                                                                        </a-button>
                                                                </a-input-group>
                                                                <div
                                                                    class="text-xs text-gray-400 mt-1"
                                                                    style="border-inline-end-width: 0 !important;">
                                                                        必须修改，用来同步前台状态。
                                                                </div>
                                                        </div>
                                                </div>
                                        </a-form-item>

                                        <a-form-item class="!my-4">
                                                <div class="lg:flex items-start text-gray-500">
                                                        <div class="mb-1 py-1 lg:mb-0 lg:mx-4 w-26">
                                                                默认角色
                                                        </div>
                                                        <div class="w-full">
                                                                <a-input-group class="max-w-md !px-0 !flex" compact>
                                                                        <a-input v-model:value="form.defaultRoleName"
                                                                                 disabled
                                                                                 placeholder="请选择默认用户角色"/>
                                                                        <a-button class="!text-gray-600"
                                                                                  @click="openEditDrawer('defaultRole')">
                                                                                <SettingOutlined/>
                                                                                修改
                                                                        </a-button>
                                                                </a-input-group>
                                                                <div
                                                                    class="text-xs text-gray-400 mt-1"
                                                                    style="border-inline-end-width: 0 !important;">
                                                                        用户注册时默认分配的角色
                                                                </div>
                                                        </div>
                                                </div>
                                        </a-form-item>
                                </a-form>
                        </a-spin>
                </div>

                <!-- 修改配置项抽屉 -->
                <a-drawer
                    v-model:open="editDrawerVisible"
                    :destroy-on-close="true"
                    :title="editDrawerTitle"
                    :width="drawerWidth"
                    @close="handleEditCancel">
                        <a-form
                            ref="editFormRef"
                            :model="editForm"
                            :rules="editRules"
                            layout="vertical">
                                <a-form-item :label="editDrawerLabel" name="configValue">
                                        <a-select
                                            v-if="editingField === 'defaultRole'"
                                            v-model:value="editForm.configValue"
                                            :filter-option="filterOption"
                                            :loading="rolesLoading"
                                            placeholder="请选择默认用户角色"
                                            show-search>
                                                <a-select-option
                                                    v-for="role in roleOptions"
                                                    :key="role.code"
                                                    :value="role.code">
                                                        {{ role.name }}
                                                </a-select-option>
                                        </a-select>
                                        <a-input
                                            v-else-if="editingField !== 'description'"
                                            v-model:value="editForm.configValue"
                                            :maxlength="editFieldMaxLength"
                                            :placeholder="editDrawerPlaceholder"
                                        />
                                        <a-textarea
                                            v-else
                                            v-model:value="editForm.configValue"
                                            :maxlength="editFieldMaxLength"
                                            :placeholder="editDrawerPlaceholder"
                                            :rows="3"
                                        />
                                </a-form-item>
                                <div class="flex justify-end gap-2 mt-4">
                                        <a-button @click="handleEditCancel">取消</a-button>
                                        <a-button
                                            :loading="editSubmitting"
                                            type="primary"
                                            @click="handleEditSubmit">
                                                保存
                                        </a-button>
                                </div>
                        </a-form>
                </a-drawer>
        </div>
</template>

<script setup>
import {computed, onMounted, reactive, ref} from 'vue';
import {message} from 'ant-design-vue';
import {SettingOutlined} from '@ant-design/icons-vue';
import {configApi} from '../../../api/system/configApi.js';
import {useDrawerWidth} from '../../../utils/useDrawerWidth.js';
import {useRoleStore} from '../../../stores/role.js';

const {drawerWidth} = useDrawerWidth();
const roleStore = useRoleStore();

/** 系统配置 key 与表单字段映射 */
const BASIC_KEYS = ['site.name', 'site.domain', 'site.description', 'site.icp', 'user_register_default_role', 'site.redirect_url'];
const FIELD_TO_KEY = {
        siteName: 'site.name',
        domain: 'site.domain',
        description: 'site.description',
        icp: 'site.icp',
        defaultRole: 'user_register_default_role',
        redirectUrl: 'site.redirect_url'
};
const KEY_TO_FIELD = {
        'site.name': 'siteName',
        'site.domain': 'domain',
        'site.description': 'description',
        'site.icp': 'icp',
        'user_register_default_role': 'defaultRole',
        'site.redirect_url': 'redirectUrl'
};

const form = reactive({
        siteName: '',
        domain: '',
        description: '',
        icp: '',
        defaultRole: '',
        defaultRoleName: '',
        redirectUrl: ''
});

const loading = ref(false);
const rolesLoading = ref(false);
const editDrawerVisible = ref(false);
const editFormRef = ref(null);
const editSubmitting = ref(false);
const editingField = ref(null);
const editForm = reactive({
        configValue: ''
});
const roleOptions = ref([]);

const editDrawerTitle = computed(() => {
        const labels = {
                siteName: '修改网站名称',
                domain: '修改网站域名',
                description: '修改网站描述',
                icp: '修改备案号',
                defaultRole: '修改默认用户角色',
                redirectUrl: '修改前端页面地址'
        };
        return editingField.value ? labels[editingField.value] : '修改配置';
});

const editDrawerLabel = computed(() => {
        const labels = {
                siteName: '网站名称',
                domain: '网站域名',
                description: '网站描述',
                icp: '备案号',
                defaultRole: '默认用户角色',
                redirectUrl: '前端页面地址'
        };
        return editingField.value ? labels[editingField.value] : '';
});

const editDrawerPlaceholder = computed(() => {
        const placeholders = {
                siteName: '请输入网站名称',
                domain: '如：myblog.com',
                description: '请输入网站描述',
                icp: '请输入备案号',
                defaultRole: '请选择默认用户角色',
                redirectUrl: '请输入前端页面地址，如：https://myblog.com'
        };
        return editingField.value ? placeholders[editingField.value] : '';
});

const editFieldMaxLength = computed(() => {
        const lengths = {
                siteName: 100,
                domain: 100,
                description: 500,
                icp: 100,
                defaultRole: 100,
                redirectUrl: 500
        };
        return lengths[editingField.value] || 100;
});

const editRules = computed(() => {
        const fieldMaxLengths = {
                siteName: 100,
                domain: 100,
                description: 500,
                icp: 100,
                defaultRole: 100,
                redirectUrl: 500
        };

        const maxLength = fieldMaxLengths[editingField.value] || 100;
        const isDefaultRole = editingField.value === 'defaultRole';

        return {
                configValue: [
                        {
                                required: true,
                                message: isDefaultRole ? '请选择默认用户角色' : '请输入配置值',
                                trigger: isDefaultRole ? 'change' : 'blur'
                        },
                        ...(isDefaultRole ? [] : [{
                                max: maxLength,
                                message: `最多 ${maxLength} 个字符`,
                                trigger: 'blur'
                        }])
                ]
        };
});

function loadSystemConfig() {
        loading.value = true;
        loadRoleOptions().then(() => {
                configApi
                    .systemList({keys: BASIC_KEYS})
                    .then((res) => {
                            const list = res?.data || [];
                            list.forEach((item) => {
                                    const field = KEY_TO_FIELD[item.configKey];
                                    if (field && form.hasOwnProperty(field)) {
                                            if (field === 'defaultRole') {
                                                    form[field] = item.configValue ?? '';
                                                    updateDefaultRoleName();
                                            } else {
                                                    form[field] = item.configValue ?? '';
                                            }
                                    }
                            });
                    })
                    .catch((e) => {
                            message.error(e?.message || '加载网站基本设置失败');
                    })
                    .finally(() => {
                            loading.value = false;
                    });
        });
}

async function loadRoleOptions() {
        rolesLoading.value = true;
        try {
                const roles = await roleStore.fetchRoles({currentPage: 1, pageSize: 100, status: 1});
                roleOptions.value = (roles || []).map(role => ({
                        id: role.id,
                        code: role.code,
                        name: role.name
                }));
        } catch (e) {
                console.error('加载角色列表失败:', e);
        } finally {
                rolesLoading.value = false;
        }
}

function updateDefaultRoleName() {
        const roleCode = form.defaultRole;
        if (roleCode) {
                const role = roleOptions.value.find(r => r.code === roleCode);
                form.defaultRoleName = role ? role.name : '';
        } else {
                form.defaultRoleName = '';
        }
}

function filterOption(input, option) {
        return option.componentOptions.children[0].text.toLowerCase().includes(input.toLowerCase());
}

function openEditDrawer(field) {
        editingField.value = field;

        editForm.configValue = form[field] ?? '';
        editDrawerVisible.value = true;
}

function handleEditCancel() {
        editDrawerVisible.value = false;
        editingField.value = null;
        editForm.configValue = '';
}

async function handleEditSubmit() {
        let hasError = false;

        if (!editFormRef.value) {
                hasError = true;
        }

        if (!hasError) {
                try {
                        editSubmitting.value = true;
                        await editFormRef.value.validate();
                        const configKey = FIELD_TO_KEY[editingField.value];
                        const configValue = String(editForm.configValue ?? '').trim();
                        await configApi.update({configKey, configValue});
                        message.success('保存成功');
                        form[editingField.value] = configValue;
                        if (editingField.value === 'defaultRole') {
                                updateDefaultRoleName();
                        }
                        editDrawerVisible.value = false;
                } catch (e) {
                        if (!e?.errorFields) {
                                message.error(e?.message || '保存失败');
                        }
                } finally {
                        editSubmitting.value = false;
                }
        }
}

onMounted(() => {
        loadSystemConfig();
});
</script>
