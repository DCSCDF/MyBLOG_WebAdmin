<!--
  - [Dashboard.vue]
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

        <div class="relative h-30 rounded-lg mb-6">
                <img
                    :src="cardBgImg"
                    alt="Dashboard Background"
                    class="w-full h-full object-cover"
                />
                <div
                    class="absolute inset-0 flex items-center justify-between p-1 sm:p-6">
                        <div class="my-auto text-white mx-3">
                                <p class="!m-0">Hi，欢迎使用MyBlog平台</p>
                                <div class="h-4"></div>
                                <p class="!m-0">
                                        轻松创建、发布您的文章，方便的的后台管理，降低学习成本。</p>
                        </div>
                </div>
        </div>

        <a-card :bordered="false" title="Frequently Asked Questions 问答">
                <a-collapse ghost>
                        <a-collapse-panel key="1" header="我要如何获得发布文章等的权限">
                                <p>获得相对应的权限可以练习网站管理员，向您的账户添加对应的角色。</p>
                        </a-collapse-panel>
                        <a-collapse-panel key="2" header="如何联系我">
                                <p>邮箱：3209174373@qq.com , QQ：3209174373。</p>
                        </a-collapse-panel>
                        <a-collapse-panel key="3" header="如何提交反馈发现的 Bug">
                                <p>Github：https://github.com/DCSCDF</p>
                        </a-collapse-panel>
                </a-collapse>
        </a-card>

        <!--        <a-empty :description="null"/>-->
</template>

<script setup>
import cardBgImg from '../../../assets/img/card_bg.png';
</script>

<style scoped>

</style>
