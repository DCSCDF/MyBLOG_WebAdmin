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
  - UpdateTime: 2026/2/2 18:17
  -
  -->

<template>
        <a-card
            :active-tab-key="noTitleKey"
            :tab-list="tabListNoTitle"
            style="width: 100%"
            @tabChange="onTabChange($event, 'noTitleKey')"
        >
                <div v-if="noTitleKey === '我的信息'">
                        <profile-info></profile-info>
                </div>
                <div v-else-if="noTitleKey === '我的头像'">
                        <avatar></avatar>
                </div>
        </a-card>
</template>

<script setup>
import {ref} from 'vue';
import Avatar from "../../components/UserSetting/avatar.vue";
import ProfileInfo from "../../components/UserSetting/profileInfo.vue";

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