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

                <div class="mb-4 flex items-center justify-between">
                        <div>
                                <h2 class="font-bold text-lg mb-1">新建文档</h2>
                                <span
                                    class="text-sm text-gray-600">在这里编写你的文章，工具栏可以点击空白区域左右拖动。</span>
                        </div>
                        <a-button type="primary" @click="">提交文章</a-button>
                </div>


                <MdEditor v-model="text" :toolbars="toolbars"/>
        </a-card>
</template>

<script setup>
import {ref} from 'vue';
import {MdEditor} from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';

const toolbars = [
        'bold',
        'underline',
        'italic',
        '-',
        'title',
        'strikeThrough',
        'sub',
        'sup',
        'quote',
        'unorderedList',
        'orderedList',
        'task',
        '-',
        'codeRow',
        'code',
        'link',
        'image',
        'table',
        'mermaid',
        'katex',
        '-',
        'revoke',
        'next',
        // 'save',
        '=',
        'pageFullscreen',
        'fullscreen',
        'preview',
        'previewOnly',
        'htmlPreview',
        'catalog',
];

const text = ref('**开始写作！**');


</script>

<style scoped>

</style>

