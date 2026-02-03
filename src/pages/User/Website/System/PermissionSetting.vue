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
  - UpdateTime: 2026/2/2 18:23
  -
  -->

<template>
        <div>
                <a-segmented
                    v-model:value="currentSegment"
                    :options="segmentOptions"
                    style="margin-bottom: 20px"
                    @change="onSegmentChange"
                />

                <div v-if="currentSegment === '权限列表'">
                        <permission></permission>
                </div>
                <div v-else-if="currentSegment === '权限组'">
                        <permissiongroup></permissiongroup>
                </div>
        </div>
</template>

<script setup>
import {ref} from 'vue';
import Permission from "../../../../components/Website/System/showpermission.vue";
import Permissiongroup from "../../../../components/Website/System/permissiongroup.vue";

const segmentOptions = ['权限列表', '权限组'];
const currentSegment = ref('权限列表');

const onSegmentChange = (value) => {
        currentSegment.value = value;
};
</script>

<style scoped>
</style>