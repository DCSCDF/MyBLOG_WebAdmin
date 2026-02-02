<template>


        <a-card
            :active-tab-key="noTitleKey"
            :tab-list="tabListNoTitle"
            style="width: 100%"
            @tabChange="key => onTabChange(key, 'noTitleKey')"
        >
                <div v-if="noTitleKey === '我的信息'">
                        <div class="py-3 flex md:mx-6  ">

                                <a-form class="w-full">
                                        <a-form-item class="!my-4">
                                                <div class="md:flex items-start text-gray-500 ">
                                                        <div class="mb-1 py-1 md:mb-0 md:mx-4 w-26">
                                                                用户名
                                                        </div>
                                                        <div class="w-full">
                                                                <a-input-group
                                                                    class="max-w-md !px-0 !flex flex-col "
                                                                    compact>
                                                                        <a-input disabled
                                                                                 value="username"/>
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
                                                <div class="md:flex items-start text-gray-500 ">
                                                        <div class="mb-1 py-1 md:mb-0 md:mx-4 w-26">
                                                                昵称
                                                        </div>
                                                        <div class="w-full">
                                                                <a-input-group class="max-w-md !px-0 !flex" compact>
                                                                        <a-input disabled value="用户名"/>
                                                                        <a-button>设置</a-button>
                                                                </a-input-group>
                                                        </div>
                                                </div>
                                        </a-form-item>
                                        <a-form-item class="!my-4">
                                                <div class="md:flex items-start text-gray-500 ">
                                                        <div class="mb-1 py-1 md:mb-0 md:mx-4 w-26">
                                                                邮箱
                                                        </div>
                                                        <div class="w-full">
                                                                <a-input-group class="max-w-md !px-0 !flex" compact>
                                                                        <a-input disabled value="username@email.com"/>
                                                                        <a-button>设置</a-button>
                                                                </a-input-group>
                                                        </div>
                                                </div>
                                        </a-form-item>
                                        <a-form-item>
                                                <div class="md:flex items-start text-gray-500 ">
                                                        <div class="mb-1 py-1 md:mb-0 md:mx-4 w-26">
                                                                注册日期
                                                        </div>
                                                        <div class="w-full">
                                                                <a-input-group class="max-w-md !px-0 !flex" compact>
                                                                        <a-date-picker disabled picker="month"
                                                                        />
                                                                </a-input-group>
                                                        </div>
                                                </div>
                                        </a-form-item>

                                        <a-form-item>
                                                <div class="md:flex items-start text-gray-500 ">
                                                        <div class="mb-1 py-1 md:mb-0 md:mx-4 w-26">
                                                                注册日期
                                                        </div>
                                                        <a-button :size="size" type="primary">
                                                                <template #icon>
                                                                        <DownloadOutlined/>
                                                                </template>
                                                                Download
                                                        </a-button>
                                                </div>
                                        </a-form-item>
                                </a-form>
                        </div>

                </div>
                <div v-else-if="noTitleKey === '我的头像'">
                        <div class="flex flex-col items-center justify-center">
                                <a-image
                                    :height="150"
                                    :preview="false"
                                    :width="150"
                                    class="rounded-md border-4 border-gray-200 transition-all duration-300 hover:border-blue-400 hover:scale-105"
                                    fallback="data:image/png;base64,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"
                                    src="https://www.antdv.com/#error"

                                />
                                <a-divider/>
                                <a-button

                                    type="primary">
                                        上传头像
                                </a-button>

                        </div>
                </div>
                <!--                <template #tabBarExtraContent>-->
                <!--                        <a href="#">More</a>-->
                <!--                </template>-->
        </a-card>
</template>

<script setup>
import {ref} from 'vue';

import {DownloadOutlined} from '@ant-design/icons-vue';

const tabListNoTitle = [
        {
                key: '我的信息',
                tab: '我的信息',
        },
        {
                key: '我的头像',
                tab: '我的头像',
        },
];
const key = ref('tab1');
const noTitleKey = ref('我的信息');

const onTabChange = (value, type) => {
        console.log(value, type);
        if (type === 'key') {
                key.value = value;
        } else if (type === 'noTitleKey') {
                noTitleKey.value = value;
        }
};
</script>

<style scoped>

</style>