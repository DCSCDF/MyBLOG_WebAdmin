<!--
  - [NewArticle.vue]
  - -------------------------------------------------------------------------------
  - This software is licensed under the MIT License.
  - However, any distribution or modification must retain this copyright notice.
  - See LICENSE for full terms.
  - -------------------------------------------------------------------------------
  - author: "Jiu Liu"
  - author_contact: "QQ: 3209174373, GitHub: https://github.com/DCSCDF"
  - license: "MIT"
  - license_exception: "Mandatory attribution retention"
  - UpdateTime: 2026/2/22 10:15
  -
  -->
<template>
        <a-card class="md-editor-container">
                newArticle
                <MdEditor v-model="text"/>
        </a-card>
</template>

<script setup>
import {ref} from 'vue';
import {MdEditor} from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';

const text = ref('开始写作！');
</script>

<style scoped>

</style>

