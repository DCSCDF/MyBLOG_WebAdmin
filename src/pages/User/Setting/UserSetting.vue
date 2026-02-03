<!--
  - [UserSetting.vue]
  - -------------------------------------------------------------------------------
  - This software is licensed under the MIT License.
  - However, any distribution or modification must retain this copyright notice.
  - See LICENSE for full terms.
  - -------------------------------------------------------------------------------
  - author: "Jiu Liu"
  - author_contact: "QQ: 3209174373, GitHub: https://github.com/DCSCDF"
  - license: "MIT"
  - license_exception: "Mandatory attribution retention"
  - UpdateTime: 2026/2/2 18:23
  -
  -->

<template>
        <a-segmented
            v-model:value="noTitleKey"
            :options="segmentedOptions"
            class="custom-segmented !mb-6"
        />


        <div v-if="noTitleKey === '我的信息'">
                <profile-info></profile-info>
        </div>
        <div v-else-if="noTitleKey === '我的头像'">
                <avatar></avatar>
        </div>


</template>

<script setup>
import {ref} from 'vue';
import Avatar from "../../../components/Setting/UserSetting/avatar.vue";
import ProfileInfo from "../../../components/Setting/UserSetting/profileInfo.vue";

const segmentedOptions = [
        {
                label: '我的信息',
                value: '我的信息',
        },
        {
                label: '我的头像',
                value: '我的头像',
        },
];

const key = ref('tab1');
const noTitleKey = ref('我的信息');

// 移除原来的 onTabChange 函数，因为 a-segmented 使用 v-model 自动处理
</script>

<style scoped>

</style>