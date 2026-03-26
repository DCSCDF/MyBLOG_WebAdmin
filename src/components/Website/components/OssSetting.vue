<!--
  - [OssSetting.vue]
  - -------------------------------------------------------------------------------
  - This software is licensed under the MIT License.
  - However, any distribution or modification must retain this copyright notice.
  - See LICENSE for full terms.
  - -------------------------------------------------------------------------------
  - author: "Jiu Liu"
  - author_contact: "QQ: 3209174373, GitHub: https://github.com/DCSCDF"
  - license: "MIT"
  - license_exception: "Mandatory attribution retention"
  - UpdateTime: 2026/3/26
  -
  -->

<template>
        <div class="min-h-[400px] w-full max-w-full overflow-x-auto">

                <div class="mb-4 flex items-center justify-between lg:mx-2 mt-4 lg:mt-0">
                        <div>
                                <h2 class="font-bold text-lg mb-1">OSS存储设置</h2>
                                <span class="text-sm text-gray-600">配置对象存储服务，用于文件上传和管理</span>
                        </div>
                        <!--			<a-button :loading="ossStatusLoading" @click="checkOssStatus">-->
                        <!--				<template #icon>-->
                        <!--					<CheckCircleOutlined v-if="ossStatus === 'configured'"/>-->
                        <!--					<CloseCircleOutlined v-else-if="ossStatus === 'not_configured'"/>-->
                        <!--				</template>-->
                        <!--				{{-->
                        <!--					ossStatus === 'configured' ? '已配置' : ossStatus === 'not_configured' ? '未配置' : '检查状态'-->
                        <!--				}}-->
                        <!--			</a-button>-->
                </div>

                <div>
                        <a-alert
                            class="mb-4"
                            message="对象存储配置用于图片、文件等静态资源的存储和访问"
                            show-icon
                            type="info"
                        />

                        <a-spin :spinning="loading">
                                <a-form class="w-full">

                                        <a-form-item class="!my-4">
                                                <div class="lg:flex items-start text-gray-500">
                                                        <div class="mb-1 py-1 lg:mb-0 lg:mx-4 w-26">
                                                                Access Key
                                                        </div>
                                                        <div class="w-full">
                                                                <a-input-group class="max-w-md !px-0 !flex" compact>
                                                                        <a-input-password v-model:value="form.accessKey"
                                                                                          class="flex-1"
                                                                                          disabled
                                                                                          placeholder="请输入 Access Key"/>
                                                                        <a-button class="!text-gray-600"
                                                                                  @click="openEditDrawer('accessKey')">
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
                                                                Secret Key
                                                        </div>
                                                        <div class="w-full">
                                                                <a-input-group class="max-w-md !px-0 !flex" compact>
                                                                        <a-input-password v-model:value="form.secretKey"
                                                                                          class="flex-1"
                                                                                          disabled
                                                                                          placeholder="请输入 Secret Key"/>
                                                                        <a-button class="!text-gray-600"
                                                                                  @click="openEditDrawer('secretKey')">
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
                                                                存储空间(Bucket)
                                                        </div>
                                                        <div class="w-full">
                                                                <a-input-group class="max-w-md !px-0 !flex" compact>
                                                                        <a-input v-model:value="form.bucket"
                                                                                 class="flex-1"
                                                                                 disabled
                                                                                 placeholder="请输入 Bucket 名称"/>
                                                                        <a-button class="!text-gray-600"
                                                                                  @click="openEditDrawer('bucket')">
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
                                                                地域节点
                                                        </div>
                                                        <div class="w-full">
                                                                <a-input-group class="max-w-md !px-0 !flex" compact>
                                                                        <a-input v-model:value="form.endpoint"
                                                                                 class="flex-1"
                                                                                 disabled
                                                                                 placeholder="如：oss-cn-hangzhou.aliyuncs.com"/>
                                                                        <a-button class="!text-gray-600"
                                                                                  @click="openEditDrawer('endpoint')">
                                                                                <SettingOutlined/>
                                                                                修改
                                                                        </a-button>
                                                                </a-input-group>
                                                        </div>
                                                </div>
                                        </a-form-item>

                                        <a-form-item class="!my-4">
                                                <div class="lg:flex items-center text-gray-500">
                                                        <div class="mb-1 py-1 lg:mb-0 lg:mx-4 w-26">
                                                                启用HTTPS
                                                        </div>
                                                        <div class="w-full">
                                                                <a-switch v-model:checked="form.https"
                                                                          checked-children="是"
                                                                          un-checked-children="否"
                                                                          @change="onHttpsChange"/>
                                                        </div>
                                                </div>
                                        </a-form-item>

                                        <a-form-item class="!my-4">
                                                <div class="lg:flex items-start text-gray-500">
                                                        <div class="mb-1 py-1 lg:mb-0 lg:mx-4 w-26">
                                                                测试上传
                                                        </div>
                                                        <div class="w-full">
                                                                <a-button :loading="testUploadLoading"
                                                                          type="primary" @click="testOssConnection">
                                                                        <upload-outlined></upload-outlined>
                                                                        测试 OSS 连接
                                                                </a-button>

                                                                <div v-if="testResult"
                                                                     :class="testResult.type === 'success' ? 'text-green-600' : 'text-red-600'"
                                                                     class="mt-2 text-sm">
                                                                        {{ testResult.message }}
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
                                        <a-input-password
                                            v-if="editingField === 'secretKey'"
                                            v-model:value="editForm.configValue"
                                            :placeholder="editDrawerPlaceholder"
                                        />
                                        <a-switch
                                            v-else-if="editingField === 'https'"
                                            v-model:checked="editForm.configValueBool"
                                            checked-children="是"
                                            un-checked-children="否"
                                            @update:checked="onHttpsEditChange"
                                        />
                                        <a-input
                                            v-else
                                            v-model:value="editForm.configValue"
                                            :placeholder="editDrawerPlaceholder"
                                        />
                                </a-form-item>
                                <div v-if="editingField !== 'https'" class="flex justify-end gap-2 mt-4">
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
import {SettingOutlined, UploadOutlined} from '@ant-design/icons-vue';
import {configApi} from '../../../api/system/configApi.js';
import {ossApi} from '../../../api/system/ossApi.js';
import {useDrawerWidth} from '../../../utils/useDrawerWidth.js';

const {drawerWidth} = useDrawerWidth();

/** OSS 系统配置 key（需与后端预置 key 一致） */
const OSS_KEYS = [
        'aliyun.Access-key',
        'aliyun.Secret-key',
        'aliyun.Bucket',
        'aliyun.end-point',
        'aliyun.https-enabled'
];

const KEY_TO_FIELD = {
        'aliyun.Access-key': 'accessKey',
        'aliyun.Secret-key': 'secretKey',
        'aliyun.Bucket': 'bucket',
        'aliyun.end-point': 'endpoint',
        'aliyun.https-enabled': 'https'
};

const FIELD_TO_KEY = {
        accessKey: 'aliyun.Access-key',
        secretKey: 'aliyun.Secret-key',
        bucket: 'aliyun.Bucket',
        endpoint: 'aliyun.end-point',
        https: 'aliyun.https-enabled'
};

const form = reactive({
        accessKey: '',
        secretKey: '',
        bucket: '',
        endpoint: '',
        https: true
});

const loading = ref(false);
// const ossStatus = ref(null);
// const ossStatusLoading = ref(false);
const testResult = ref(null);
const testUploadLoading = ref(false);
const editDrawerVisible = ref(false);
const editFormRef = ref(null);
const editSubmitting = ref(false);
const editingField = ref(null);
const editForm = reactive({
        configValue: '',
        configValueBool: true
});

const editDrawerTitle = computed(() => {
        const titles = {
                accessKey: '修改 Access Key',
                secretKey: '修改 Secret Key',
                bucket: '修改存储空间(Bucket)',
                endpoint: '修改地域节点',
                https: '修改启用HTTPS'
        };
        return editingField.value ? titles[editingField.value] : '修改配置';
});

const editDrawerLabel = computed(() => {
        const labels = {
                accessKey: 'Access Key',
                secretKey: 'Secret Key',
                bucket: '存储空间(Bucket)',
                endpoint: '地域节点',
                https: '启用HTTPS'
        };
        return editingField.value ? labels[editingField.value] : '';
});

const editDrawerPlaceholder = computed(() => {
        const placeholders = {
                accessKey: '请输入 Access Key',
                secretKey: '请输入 Secret Key',
                bucket: '请输入 Bucket 名称',
                endpoint: '如：oss-cn-hangzhou.aliyuncs.com'
        };
        return editingField.value ? placeholders[editingField.value] : '';
});

const editRules = computed(() => {
        const required = editingField.value !== 'secretKey';
        const rules = [];
        if (required) {
                rules.push({required: true, message: '请输入配置值', trigger: 'blur'});
        }
        return {configValue: rules};
});

function parseBoolean(val) {
        return val === true || val === 'true' || val === '1';
}

function loadSystemConfig() {
        loading.value = true;
        configApi
            .systemList({keys: OSS_KEYS})
            .then((res) => {
                    const list = res?.data || [];
                    list.forEach((item) => {
                            const field = KEY_TO_FIELD[item.configKey];
                            if (field && form.hasOwnProperty(field)) {
                                    if (field === 'https') {
                                            form[field] = parseBoolean(item.configValue);
                                    } else {
                                            form[field] = item.configValue ?? '';
                                    }
                            }
                    });
            })
            .catch((e) => {
                    message.error(e?.message || '加载OSS设置失败');
            })
            .finally(() => {
                    loading.value = false;
            });
}

function openEditDrawer(field) {
        editingField.value = field;
        if (field === 'https') {
                editForm.configValueBool = form.https;
                editForm.configValue = form.https ? 'true' : 'false';
        } else {
                editForm.configValue = form[field] ?? '';
        }
        editDrawerVisible.value = true;
}

function onHttpsEditChange(checked) {
        editForm.configValue = checked ? 'true' : 'false';
}

function onHttpsChange(checked) {
        const configValue = checked ? 'true' : 'false';
        configApi
            .update({configKey: 'aliyun.https-enabled', configValue})
            .then(() => {
                    message.success('保存成功');
                    form.https = checked;
            })
            .catch((e) => {
                    message.error(e?.message || '保存失败');
                    form.https = !checked;
            });
}

function handleEditCancel() {
        editDrawerVisible.value = false;
        editingField.value = null;
        editForm.configValue = '';
        editForm.configValueBool = true;
}

// 验证提交条件
function canSubmit() {
        return editFormRef.value && editingField.value !== 'https';
}

// 构建配置值
function buildConfigValue() {
        return String(editForm.configValue ?? '').trim();
}

// 更新表单数据
function updateFormData(configValue) {
        if (editingField.value === 'https') {
                form.https = parseBoolean(configValue);
        } else {
                form[editingField.value] = configValue;
        }
}

async function handleEditSubmit() {
        let isValid = canSubmit();

        if (isValid) {
                try {
                        editSubmitting.value = true;

                        const configValue = buildConfigValue();

                        if (editingField.value !== 'secretKey') {
                                await editFormRef.value.validate();
                        }

                        const configKey = FIELD_TO_KEY[editingField.value];
                        await configApi.update({configKey, configValue});
                        message.success('保存成功');

                        updateFormData(configValue);
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

async function testOssConnection() {
        testUploadLoading.value = true;
        testResult.value = null;
        try {
                const res = await ossApi.getStatus();

                const msg = res.msg || res.errorMsg;
                if (res.code === 200) {
                        testResult.value = {
                                type: 'success',
                                message: msg || 'OSS 配置已完成且连接正常'
                        };
                        message.success(msg || 'OSS 连接测试成功！');
                } else {
                        testResult.value = {
                                type: 'error',
                                message: msg || 'OSS 连接测试失败'
                        };
                        message.error(msg || 'OSS 连接测试失败');
                }
        } catch (e) {
                testResult.value = {
                        type: 'error',
                        message: e?.message || 'OSS 连接测试失败'
                };
                message.error(e?.message || 'OSS 连接测试失败');
        } finally {
                testUploadLoading.value = false;
        }
}

//
// async function checkOssStatus() {
//         ossStatusLoading.value = true;
//         try {
//                 const res = await ossApi.getStatus();
//
//                 const msg = res.msg || res.errorMsg;
//                 if (res.code === 200) {
//                         ossStatus.value = 'configured';
//                         message.success(msg || 'OSS 配置已完成');
//                 } else {
//                         ossStatus.value = 'not_configured';
//                         message.warning(msg || 'OSS 配置未完成');
//                 }
//         } catch (e) {
//                 ossStatus.value = 'not_configored';
//                 message.error(e?.message || '检查 OSS 状态失败');
//         } finally {
//                 ossStatusLoading.value = false;
//         }
// }

onMounted(() => {
        loadSystemConfig();
});
</script>
