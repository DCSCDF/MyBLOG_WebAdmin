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
                        <a-form class="w-full">
                                <a-form-item class="!my-4">
                                        <div class="lg:flex items-start text-gray-500">
                                                <div class="mb-1 py-1 lg:mb-0 lg:mx-4 w-26">
                                                        网站名称
                                                </div>
                                                <div class="w-full">
                                                        <a-input-group class="max-w-md !px-0 !flex" compact>
                                                                <a-input v-model:value="form.siteName"/>
                                                                <a-button class="!text-gray-600"
                                                                >
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
                                                                         placeholder="myblog.com"/>
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
                                                        网站描述
                                                </div>
                                                <div class="w-full">
                                                        <a-input-group class="max-w-md !px-0 " compact>
                                                                <a-textarea v-model:value="form.description" :rows="3"
                                                                            placeholder="请输入网站描述"/>

                                                        </a-input-group>
                                                        <div class="mt-2">
                                                                <a-button class="!text-gray-600"
                                                                >
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
                                                                         placeholder="请输入备案号"/>
                                                                <a-button class="!text-gray-600"
                                                                >
                                                                        <SettingOutlined/>
                                                                        修改
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
import {reactive} from 'vue';
import {SettingOutlined} from "@ant-design/icons-vue";

const form = reactive({
        siteName: '',
        domain: '',
        description: '',
        icp: '',
});


</script>
