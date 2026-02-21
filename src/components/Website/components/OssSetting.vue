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
  - UpdateTime: 2026/2/21 14:45
  -
  -->

<template>
        <div class="min-h-[400px] w-full max-w-full overflow-x-auto">

                <div class="mb-4 flex items-center justify-between lg:mx-2 mt-4 lg:mt-0">
                        <div>
                                <h2 class="font-bold text-lg mb-1">OSS存储设置</h2>
                                <span class="text-sm text-gray-600">配置对象存储服务，用于文件上传和管理</span>
                        </div>
                </div>

                <div>
                        <a-alert
                            class="mb-4"
                            message="对象存储配置用于图片、文件等静态资源的存储和访问"
                            show-icon
                            type="info"
                        />

                        <a-form
                            class="w-full"
                        >
                                <a-form-item class="!my-4">
                                        <div class="lg:flex items-start text-gray-500">
                                                <div class="mb-1 py-1 lg:mb-0 lg:mx-4 w-26">
                                                        存储服务商
                                                </div>
                                                <div class="w-full">
                                                        <a-input-group class="max-w-md !px-0 !flex" compact>
                                                                <a-select v-model:value="form.provider" class="flex-1"
                                                                          placeholder="请选择存储服务商">
                                                                        <a-select-option value="aliyun">阿里云 OSS
                                                                        </a-select-option>
                                                                        <a-select-option value="tencent">腾讯云 COS
                                                                        </a-select-option>
                                                                        <a-select-option value="qiniu">七牛云 Kodo
                                                                        </a-select-option>
                                                                        <a-select-option value="aws">AWS S3
                                                                        </a-select-option>
                                                                </a-select>
                                                                <a-button class="!text-gray-600">
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
                                                        Access Key
                                                </div>
                                                <div class="w-full">
                                                        <a-input-group class="max-w-md !px-0 !flex" compact>
                                                                <a-input-password v-model:value="form.accessKey"
                                                                                  class="flex-1"
                                                                                  placeholder="请输入 Access Key"/>
                                                                <a-button class="!text-gray-600">
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
                                                                                  placeholder="请输入 Secret Key"/>
                                                                <a-button class="!text-gray-600">
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
                                                                         placeholder="请输入 Bucket 名称"/>
                                                                <a-button class="!text-gray-600">
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
                                                                         placeholder="如：oss-cn-hangzhou.aliyuncs.com"/>
                                                                <a-button class="!text-gray-600">
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
                                                        自定义域名
                                                </div>
                                                <div class="w-full">
                                                        <a-input-group class="max-w-md !px-0 !flex" compact>
                                                                <a-input v-model:value="form.customDomain"
                                                                         class="flex-1"
                                                                         placeholder="如：https://cdn.example.com"/>
                                                                <a-button class="!text-gray-600">
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
                                                        文件访问路径
                                                </div>
                                                <div class="w-full">
                                                        <a-input-group class="max-w-md !px-0 !flex" compact>
                                                                <a-input v-model:value="form.baseUrl"
                                                                         class="flex-1"
                                                                         placeholder="文件基础访问URL"/>
                                                                <a-button class="!text-gray-600">
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
                                                        <a-switch v-model:checked="form.https" checked-children="是"
                                                                  un-checked-children="否"/>
                                                </div>
                                        </div>
                                </a-form-item>

                                <a-form-item class="!my-4">
                                        <div class="lg:flex items-start text-gray-500">
                                                <div class="mb-1 py-1 lg:mb-0 lg:mx-4 w-26">
                                                        测试上传
                                                </div>
                                                <div class="w-full">

                                                        <a-upload
                                                            :before-upload="beforeUpload"
                                                            :max-count="1"
                                                            accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx"
                                                            class="flex-1"
                                                        >
                                                                <a-button class="w-full">
                                                                        <upload-outlined></upload-outlined>
                                                                        点击上传测试文件
                                                                </a-button>
                                                        </a-upload>

                                                        <div v-if="testResult" class="mt-2 text-sm text-green-600">
                                                                上传成功：{{ testResult }}
                                                        </div>
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
import {SettingOutlined, UploadOutlined} from '@ant-design/icons-vue';

const form = reactive({
        provider: undefined,
        accessKey: '',
        secretKey: '',
        bucket: '',
        endpoint: '',
        customDomain: '',
        baseUrl: '',
        https: true
});

const testResult = ref('');

const beforeUpload = (file) => {
        // 模拟上传测试
        message.loading('正在上传测试文件...', 1.5)
            .then(() => {
                    testResult.value = `https://example.com/uploads/${file.name}`;
                    message.success('文件上传测试成功！');
            });
        return false; // 阻止实际上传
};
</script>

