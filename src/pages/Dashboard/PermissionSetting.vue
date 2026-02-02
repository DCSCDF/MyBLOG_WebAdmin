<!--
  - [PermissionSetting.vue]
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
                <div v-if="noTitleKey === '权限列表'">

                        1

                </div>
                <div v-else-if="noTitleKey === '权限组'">

                        2

                </div>

        </a-card>
</template>

<script setup>
import {ref} from 'vue';

const tabListNoTitle = [
        {
                key: '权限列表',
                tab: '权限列表',
        },
        {
                key: '权限组',
                tab: '权限组',
        },
];

const key = ref('tab1');
const noTitleKey = ref('权限列表');

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