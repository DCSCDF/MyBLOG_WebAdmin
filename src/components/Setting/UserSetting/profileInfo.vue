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

<script setup>

</script>

<template>
        <a-card>

                <div class="flex md:mx-6  ">

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
                                                                <a-button class="!text-gray-600">修改</a-button>
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
                                                                <a-button class="!text-gray-600">修改</a-button>
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
                                                                <a-date-picker disabled picker="month"/>
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
                                        <div class="md:flex items-start text-gray-500 ">
                                                <div class="mb-1 py-1 md:mb-0 md:mx-4 w-26">
                                                        账户密码
                                                </div>
                                                <div class="w-full">
                                                        <a-button class="!text-gray-600">
                                                                修改
                                                        </a-button>
                                                </div>
                                        </div>
                                </a-form-item>


                        </a-form>
                </div>
        </a-card>
</template>

<style scoped>

</style>