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
  - UpdateTime: 2026/2/21 14:45
  -
  -->

<template>
        <div class="min-h-[400px] w-full max-w-full overflow-x-auto">

                <div class="mb-4 flex items-center justify-between lg:mx-2 mt-4 lg:mt-0">
                        <div>
                                <h2 class="font-bold text-lg mb-1">SMTP邮箱设置</h2>
                                <span class="text-sm text-gray-600">配置邮件服务器设置，用于发送系统邮件</span>
                        </div>
                </div>

                <div>
                        <a-alert
                            class="mb-4"
                            message="SMTP配置用于系统邮件发送功能。"
                            show-icon
                            type="info"
                        />

                        <a-form
                            class="w-full"
                        >

                                <a-form-item class="!my-4">
                                        <div class="lg:flex items-start text-gray-500">
                                                <div class="mb-1 py-1 lg:mb-0 lg:mx-4 w-26">
                                                        SMTP服务器
                                                </div>
                                                <div class="w-full">
                                                        <a-input-group class="max-w-md !px-0 !flex" compact>
                                                                <a-input v-model:value="form.host"
                                                                         placeholder="smtp.example.com"/>
                                                                <a-button class="!text-gray-600"
                                                                >
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
                                                        端口号
                                                </div>
                                                <div class="w-full">
                                                        <a-input-group class="max-w-md !px-0 !flex" compact>
                                                                <a-input-number v-model:value="form.port" :max="65535"
                                                                                :min="1"
                                                                                placeholder="如：465或587"/>
                                                                <a-button class="!text-gray-600"
                                                                >
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
                                                        用户名
                                                </div>
                                                <div class="w-full">
                                                        <a-input-group class="max-w-md !px-0 !flex" compact>
                                                                <a-input v-model:value="form.username"
                                                                         placeholder="邮箱地址"/>
                                                                <a-button class="!text-gray-600"
                                                                >
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
                                                        密码
                                                </div>
                                                <div class="w-full">
                                                        <a-input-group class="max-w-md !px-0 !flex" compact>
                                                                <a-input-password v-model:value="form.password"
                                                                                  placeholder="邮箱密码或授权码"/>
                                                                <a-button class="!text-gray-600"
                                                                >
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
                                                        发件人邮箱
                                                </div>
                                                <div class="w-full">
                                                        <a-input-group class="max-w-md !px-0 !flex" compact>
                                                                <a-input v-model:value="form.fromEmail"
                                                                         placeholder="noreply@example.com"/>
                                                                <a-button class="!text-gray-600"
                                                                >
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
                                                        发件人名称
                                                </div>
                                                <div class="w-full">
                                                        <a-input-group class="max-w-md !px-0 !flex" compact>
                                                                <a-input v-model:value="form.fromName"
                                                                         placeholder="网站名称"/>
                                                                <a-button class="!text-gray-600"
                                                                >
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
                                                        启用SSL
                                                </div>
                                                <div class="w-full">
                                                        <a-switch v-model:checked="form.ssl" checked-children="是"
                                                                  un-checked-children="否"/>

                                                </div>
                                        </div>
                                </a-form-item>

                                <a-form-item class="!my-4">
                                        <div class="lg:flex items-start text-gray-500">
                                                <div class="mb-1 py-1 lg:mb-0 lg:mx-4 w-26">
                                                        测试邮件
                                                </div>
                                                <div class="w-full">
                                                        <a-input-group class="max-w-md !px-0 !flex" compact>
                                                                <a-input v-model:value="testEmail"
                                                                         placeholder="输入邮箱地址"/>
                                                                <a-button class="ml-2 !text-gray-600"
                                                                          @click="testConnection">发送
                                                                </a-button>
                                                        </a-input-group>

                                                </div>
                                        </div>
                                </a-form-item>


                        </a-form>
                </div>
        </div>
</template>

<script setup>
import {reactive, ref} from 'vue';
import {message} from 'ant-design-vue';
import {SettingOutlined} from "@ant-design/icons-vue";

const form = reactive({
        host: '',
        port: 465,
        username: '',
        password: '',
        fromEmail: '',
        fromName: '',
        ssl: true
});

const testEmail = ref('');


const testConnection = () => {
        if (!testEmail.value) {
                message.warning('请输入邮箱地址');
                return;
        }
        message.loading('正在发送...', 1.5)
            .then(() => message.success('邮件发送成功！'));
};
</script>

