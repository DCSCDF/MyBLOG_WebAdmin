<!--
  - [doclist.vue]
  - -------------------------------------------------------------------------------
  - This software is licensed under the MIT License.
  - However, any distribution or modification must retain this copyright notice.
  - See LICENSE for full terms.
  - -------------------------------------------------------------------------------
  - author: "Jiu Liu"
  - author_contact: "QQ: 3209174373, GitHub: https://github.com/DCSCDF"
  - license: "MIT"
  - license_exception: "Mandatory attribution retention"
  - UpdateTime: 2026/3/11 05:38
  -
  -->
<template>
        <a-card>
                <vue3-markdown-it :source="markdownContent"/>

        </a-card>
</template>


<script setup>
import {ref} from 'vue'
import Vue3MarkdownIt from 'vue3-markdown-it'
import 'highlight.js/styles/monokai.css';
import 'github-markdown-css/github-markdown.css'

const markdownContent = ref(`



# 标题

这是一段**加粗**的文字。

- 列表项1
- 列表项2

\`\`\`javascript
console.log('Hello World')
\`\`\`




`)
</script>


