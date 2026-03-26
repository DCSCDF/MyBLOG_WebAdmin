<!--
  - [SmtpSetting.vue]
  - -------------------------------------------------------------------------------
  - This software is licensed under the MIT License.
  - However, any distribution or modification must retain this copyright notice.
  - See LICENSE for full terms.
  - -------------------------------------------------------------------------------
  - author: "Jiu Liu"
  - author_contact: "QQ: 3209174373, GitHub: https://github.com/DCSCDF"
  - license: "MIT"
  - license_exception: "Mandatory attribution retention"
  - UpdateTime: 2026/2/22
  -
  -->

<template>
        <div class="min-h-100 w-full max-w-full overflow-x-auto">

                <div class="mb-4 flex items-center justify-between lg:mx-2 mt-4 lg:mt-0">
                        <div>
                                <h2 class="font-bold text-lg mb-1">SMTP邮箱设置</h2>
                                <span class="text-sm text-gray-600">配置邮件服务器设置，用于发送系统邮件</span>
                        </div>
                        <a-button :loading="smtpStatusLoading" @click="checkSmtpStatus">
                                <template #icon>
                                        <CheckCircleOutlined v-if="smtpStatus === 'configured'"/>
                                        <CloseCircleOutlined v-else-if="smtpStatus === 'not_configured'"/>
                                </template>
                                {{
                                        smtpStatus === 'configured' ? '已配置' : smtpStatus === 'not_configured' ? '未配置' : '检查状态'
                                }}
                        </a-button>
                </div>

                <div>
                        <a-alert
                            class="mb-4"
                            message="SMTP配置用于系统邮件发送功能。"
                            show-icon
                            type="info"
                        />

                        <a-spin :spinning="loading">
                                <a-form class="w-full">
                                        <a-form-item class="my-4!">
                                                <div class="lg:flex items-start text-gray-500">
                                                        <div class="mb-1 py-1 lg:mb-0 lg:mx-4 w-26">
                                                                SMTP服务器
                                                        </div>
                                                        <div class="w-full">
                                                                <a-input-group class="max-w-md px-0! flex!" compact>
                                                                        <a-input v-model:value="form.host"
                                                                                 disabled
                                                                                 placeholder="smtp.example.com"/>
                                                                        <a-button class="text-gray-600!"
                                                                                  @click="openEditDrawer('host')">
                                                                                <SettingOutlined/>
                                                                                修改
                                                                        </a-button>
                                                                </a-input-group>
                                                        </div>
                                                </div>
                                        </a-form-item>

                                        <a-form-item class="my-4!">
                                                <div class="lg:flex items-start text-gray-500">
                                                        <div class="mb-1 py-1 lg:mb-0 lg:mx-4 w-26">
                                                                端口号
                                                        </div>
                                                        <div class="w-full">
                                                                <a-input-group class="max-w-md px-0! flex!" compact>
                                                                        <a-input-number v-model:value="form.port"
                                                                                        :max="65535"
                                                                                        :min="1"
                                                                                        disabled
                                                                                        placeholder="如：465或587"/>
                                                                        <a-button class="text-gray-600!"
                                                                                  @click="openEditDrawer('port')">
                                                                                <SettingOutlined/>
                                                                                修改
                                                                        </a-button>
                                                                </a-input-group>
                                                        </div>
                                                </div>
                                        </a-form-item>

                                        <a-form-item class="my-4!">
                                                <div class="lg:flex items-start text-gray-500">
                                                        <div class="mb-1 py-1 lg:mb-0 lg:mx-4 w-26">
                                                                用户名
                                                        </div>
                                                        <div class="w-full">
                                                                <a-input-group class="max-w-md px-0! flex!" compact>
                                                                        <a-input v-model:value="form.username"
                                                                                 disabled
                                                                                 placeholder="邮箱地址"/>
                                                                        <a-button class="text-gray-600!"
                                                                                  @click="openEditDrawer('username')">
                                                                                <SettingOutlined/>
                                                                                修改
                                                                        </a-button>
                                                                </a-input-group>
                                                        </div>
                                                </div>
                                        </a-form-item>

                                        <a-form-item class="my-4!">
                                                <div class="lg:flex items-start text-gray-500">
                                                        <div class="mb-1 py-1 lg:mb-0 lg:mx-4 w-26">
                                                                密码
                                                        </div>
                                                        <div class="w-full">
                                                                <a-input-group class="max-w-md px-0! flex!" compact>
                                                                        <a-input-password v-model:value="form.password"
                                                                                          disabled
                                                                                          placeholder="邮箱密码或授权码"/>
                                                                        <a-button class="text-gray-600!"
                                                                                  @click="openEditDrawer('password')">
                                                                                <SettingOutlined/>
                                                                                修改
                                                                        </a-button>
                                                                </a-input-group>
                                                        </div>
                                                </div>
                                        </a-form-item>

                                        <!--                                        <a-form-item class="my-4!">-->
                                        <!--                                                <div class="lg:flex items-start text-gray-500">-->
                                        <!--                                                        <div class="mb-1 py-1 lg:mb-0 lg:mx-4 w-26">-->
                                        <!--                                                                发件人邮箱-->
                                        <!--                                                        </div>-->
                                        <!--                                                        <div class="w-full">-->
                                        <!--                                                                <a-input-group class="max-w-md px-0! flex!" compact>-->
                                        <!--                                                                        <a-input v-model:value="form.fromEmail"-->
                                        <!--                                                                                 disabled-->
                                        <!--                                                                                 placeholder="noreply@example.com"/>-->
                                        <!--                                                                        <a-button class="text-gray-600!"-->
                                        <!--                                                                                  @click="openEditDrawer('fromEmail')">-->
                                        <!--                                                                                <SettingOutlined/>-->
                                        <!--                                                                                修改-->
                                        <!--                                                                        </a-button>-->
                                        <!--                                                                </a-input-group>-->
                                        <!--                                                        </div>-->
                                        <!--                                                </div>-->
                                        <!--                                        </a-form-item>-->

                                        <a-form-item class="my-4!">
                                                <div class="lg:flex items-start text-gray-500">
                                                        <div class="mb-1 py-1 lg:mb-0 lg:mx-4 w-26">
                                                                发件人邮箱
                                                        </div>
                                                        <div class="w-full">
                                                                <a-input-group class="max-w-md px-0! flex!" compact>
                                                                        <a-input v-model:value="form.fromName"
                                                                                 disabled
                                                                                 placeholder=""/>
                                                                        <a-button class="text-gray-600!"
                                                                                  @click="openEditDrawer('fromName')">
                                                                                <SettingOutlined/>
                                                                                修改
                                                                        </a-button>
                                                                </a-input-group>
                                                        </div>
                                                </div>
                                        </a-form-item>

                                        <a-form-item class="my-4!">
                                                <div class="lg:flex items-center text-gray-500">
                                                        <div class="mb-1 py-1 lg:mb-0 lg:mx-4 w-26">
                                                                启用SSL
                                                        </div>
                                                        <div class="w-full">
                                                                <a-switch v-model:checked="form.ssl"
                                                                          checked-children="是"
                                                                          un-checked-children="否"
                                                                          @change="onSslChange"/>
                                                        </div>
                                                </div>
                                        </a-form-item>


                                        <a-form-item class="my-4!">
                                                <div class="lg:flex items-start text-gray-500">
                                                        <div class="mb-1 py-1 lg:mb-0 lg:mx-4 w-26">
                                                                发送测试邮件
                                                        </div>
                                                        <div class="w-full">
                                                                <a-input-group class="max-w-md px-0! flex!" compact>
                                                                        <a-input v-model:value="testEmail"
                                                                                 placeholder="输入邮箱地址"/>
                                                                        <a-button
                                                                            :disabled="!testEmail"
                                                                            :loading="testMailLoading"
                                                                            class="ml-2 text-gray-600!"
                                                                            @click="sendTestMail">
                                                                                发送
                                                                        </a-button>
                                                                </a-input-group>
                                                        </div>
                                                </div>
                                        </a-form-item>


                                        <a-form-item class="my-4!">
                                                <div class="lg:flex items-center text-gray-500">
                                                        <div class="mb-1 py-1 lg:mb-0 lg:mx-4 w-26">
                                                                评论通知
                                                        </div>
                                                        <div class="w-full">
                                                                <a-switch v-model:checked="form.commentEnabled"
                                                                          checked-children="是"
                                                                          un-checked-children="否"
                                                                          @change="onCommentEnabledChange"/>
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
                                            v-if="editingField === 'password'"
                                            v-model:value="editForm.configValue"
                                            :placeholder="editDrawerPlaceholder"
                                        />
                                        <a-input-number
                                            v-else-if="editingField === 'port'"
                                            v-model:value="editForm.configValueNumber"
                                            :max="65535"
                                            :min="1"
                                            class="w-full"
                                            placeholder="如：465或587"
                                            @update:value="onPortChange"
                                        />
                                        <a-switch
                                            v-else-if="editingField === 'ssl'"
                                            v-model:checked="editForm.configValueBool"
                                            checked-children="是"
                                            un-checked-children="否"
                                            @update:checked="onSslEditChange"
                                        />
                                        <a-input
                                            v-else
                                            v-model:value="editForm.configValue"
                                            :placeholder="editDrawerPlaceholder"
                                        />
                                </a-form-item>
                                <div v-if="editingField !== 'ssl'" class="flex justify-end gap-2 mt-4">
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
import {CheckCircleOutlined, CloseCircleOutlined, SettingOutlined} from '@ant-design/icons-vue';
import {configApi} from '../../../api/system/configApi.js';
import {mailApi} from '../../../api/system/mailApi.js';
import {useDrawerWidth} from '../../../utils/useDrawerWidth.js';

const {drawerWidth} = useDrawerWidth();

/** SMTP 系统配置 key（需与后端预置 key 一致） */
const SMTP_KEYS = [
        'smtp.host',
        'smtp.port',
        'smtp.username',
        'smtp.password',
        'smtp.fromEmail',
        'smtp.fromName',
        'smtp.ssl.enabled',
        'smtp.comment.enabled'
];
const KEY_TO_FIELD = {
        'smtp.host': 'host',
        'smtp.port': 'port',
        'smtp.username': 'username',
        'smtp.password': 'password',
        'smtp.fromEmail': 'fromEmail',
        'smtp.fromName': 'fromName',
        'smtp.ssl.enabled': 'ssl',
        'smtp.comment.enabled': 'commentEnabled'
};
const FIELD_TO_KEY = {
        host: 'smtp.host',
        port: 'smtp.port',
        username: 'smtp.username',
        password: 'smtp.password',
        fromEmail: 'smtp.fromEmail',
        fromName: 'smtp.fromName',
        ssl: 'smtp.ssl.enabled',
        commentEnabled: 'smtp.comment.enabled'
};

const form = reactive({
        host: '',
        port: 465,
        username: '',
        password: '',
        fromEmail: '',
        fromName: '',
        ssl: true,
        commentEnabled: false
});

const loading = ref(false);
const testEmail = ref('');
const testMailLoading = ref(false);
const smtpStatus = ref(null); // 'configured' | 'not_configured' | null
const smtpStatusLoading = ref(false);
const editDrawerVisible = ref(false);
const editFormRef = ref(null);
const editSubmitting = ref(false);
const editingField = ref(null);
const editForm = reactive({
        configValue: '',
        configValueNumber: 465,
        configValueBool: true
});

const editDrawerTitle = computed(() => {
        const titles = {
                host: '修改SMTP服务器',
                port: '修改端口号',
                username: '修改用户名',
                password: '修改密码',
                fromEmail: '修改发件人邮箱',
                fromName: '修改发件人邮箱',
                ssl: '修改启用SSL'
        };
        return editingField.value ? titles[editingField.value] : '修改配置';
});

const editDrawerLabel = computed(() => {
        const labels = {
                host: 'SMTP服务器',
                port: '端口号',
                username: '用户名',
                password: '密码',
                fromEmail: '发件人邮箱',
                fromName: '发件人邮箱',
                ssl: '启用SSL'
        };
        return editingField.value ? labels[editingField.value] : '';
});

const editDrawerPlaceholder = computed(() => {
        const placeholders = {
                host: 'smtp.example.com',
                port: '如：465或587',
                username: '邮箱地址',
                password: '邮箱密码或授权码',
                fromEmail: 'noreply@example.com',
                fromName: ''
        };
        return editingField.value ? placeholders[editingField.value] : '';
});

const editRules = computed(() => {
        const required = editingField.value !== 'password';
        const rules = [];
        if (required) {
                rules.push({required: true, message: '请输入配置值', trigger: 'blur'});
        }
        return {configValue: rules};
});

function parsePort(val) {
        const n = Number(val);
        return Number.isFinite(n) && n >= 1 && n <= 65535 ? n : 465;
}

function parseSsl(val) {
        return val === true || val === 'true' || val === '1';
}

function parseBoolean(val) {
        return val === true || val === 'true' || val === '1';
}

function loadSystemConfig() {
        loading.value = true;
        configApi
            .systemList({keys: SMTP_KEYS})
            .then((res) => {
                    const list = res?.data || [];
                    list.forEach((item) => {
                            const field = KEY_TO_FIELD[item.configKey];
                            if (field && form.hasOwnProperty(field)) {
                                    if (field === 'port') {
                                            form.port = parsePort(item.configValue);
                                    } else if (field === 'ssl' || field === 'commentEnabled') {
                                            form[field] = parseBoolean(item.configValue);
                                    } else {
                                            form[field] = item.configValue ?? '';
                                    }
                            }
                    });
            })
            .catch((e) => {
                    message.error(e?.message || '加载SMTP设置失败');
            })
            .finally(() => {
                    loading.value = false;
            });
}

function openEditDrawer(field) {
        editingField.value = field;
        if (field === 'port') {
                editForm.configValueNumber = form.port;
                editForm.configValue = String(form.port);
        } else if (field === 'ssl') {
                editForm.configValueBool = form.ssl;
                editForm.configValue = form.ssl ? 'true' : 'false';
        } else {
                editForm.configValue = form[field] ?? '';
        }
        editDrawerVisible.value = true;
}

function onPortChange(val) {
        editForm.configValue = val != null ? String(val) : '';
}

function onSslEditChange(checked) {
        editForm.configValue = checked ? 'true' : 'false';
}

function onSslChange(checked) {
        const configValue = checked ? 'true' : 'false';
        configApi
            .update({configKey: 'smtp.ssl.enabled', configValue})
            .then(() => {
                    message.success('保存成功');
                    form.ssl = checked;
            })
            .catch((e) => {
                    message.error(e?.message || '保存失败');
                    form.ssl = !checked;
            });
}

function onCommentEnabledChange(checked) {
        const configValue = checked ? 'true' : 'false';
        configApi
            .update({configKey: 'smtp.comment.enabled', configValue})
            .then(() => {
                    message.success('保存成功');
                    form.commentEnabled = checked;
            })
            .catch((e) => {
                    message.error(e?.message || '保存失败');
                    form.commentEnabled = !checked;
            });
}

function handleEditCancel() {
        editDrawerVisible.value = false;
        editingField.value = null;
        editForm.configValue = '';
        editForm.configValueNumber = 465;
        editForm.configValueBool = true;
}

// 验证提交条件
function canSubmit() {
        return editFormRef.value && editingField.value !== 'ssl';
}

// 构建配置值
function buildConfigValue() {
        let configValue = editForm.configValue;

        if (editingField.value === 'port') {
                configValue = editForm.configValueNumber != null
                    ? String(editForm.configValueNumber)
                    : '';
        }

        return String(configValue ?? '').trim();
}

// 更新表单数据
function updateFormData(configValue) {
        if (editingField.value === 'port') {
                form.port = parsePort(configValue);
        } else {
                form[editingField.value] = configValue;
        }
}

async function handleEditSubmit() {
        let isValid = canSubmit();

        if (isValid) {
                try {
                        editSubmitting.value = true;

                        // 构建配置值
                        const configValue = buildConfigValue();

                        // 验证非密码字段
                        if (editingField.value !== 'password') {
                                await editFormRef.value.validate();
                        }

                        // 更新配置
                        const configKey = FIELD_TO_KEY[editingField.value];
                        await configApi.update({configKey, configValue});
                        message.success('保存成功');

                        // 更新表单显示
                        updateFormData(configValue);
                        editDrawerVisible.value = false;

                } catch (e) {
                        // 处理业务错误
                        if (!e?.errorFields) {
                                message.error(e?.message || '保存失败');
                        }
                } finally {
                        editSubmitting.value = false;
                }
        }
}

async function sendTestMail() {
        // 验证邮箱地址
        if (!testEmail.value) {
                message.warning('请输入邮箱地址');
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(testEmail.value)) {
                message.warning('请输入有效的邮箱地址');
        } else {
                testMailLoading.value = true;
                try {
                        const res = await mailApi.sendTestMail({
                                to: testEmail.value
                        });

                        // request.js 成功时返回 { data, success, errorMsg, code }
                        // API 返回格式是 { code, msg, data }，所以 msg 变成了 errorMsg
                        const msg = res.msg || res.errorMsg;
                        if (res.code === 200) {
                                message.success(msg || '邮件发送成功');
                        } else {
                                message.error(msg || '邮件发送失败');
                        }
                } catch (e) {
                        message.error(e?.message || '邮件发送失败');
                } finally {
                        testMailLoading.value = false;
                }
        }
}

async function checkSmtpStatus() {
        smtpStatusLoading.value = true;
        try {
                const res = await mailApi.getStatus();

                // request.js 成功时返回 { data, success, errorMsg, code }
                const msg = res.msg || res.errorMsg;
                if (res.code === 200) {
                        smtpStatus.value = 'configured';
                        message.success(msg || 'SMTP 配置已完成');
                } else {
                        smtpStatus.value = 'not_configured';
                        message.warning(msg || 'SMTP 配置未完成');
                }
        } catch (e) {
                smtpStatus.value = 'not_configured';
                message.error(e?.message || '检查 SMTP 状态失败');
        } finally {
                smtpStatusLoading.value = false;
        }
}

onMounted(() => {
        loadSystemConfig();
        // checkSmtpStatus();
});
</script>
