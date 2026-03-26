<!--
  - [ImagesList.vue]
  - -------------------------------------------------------------------------------
  - This software is licensed under the MIT License.
  - However, any distribution or modification must retain this copyright notice.
  - See LICENSE for full terms.
  - -------------------------------------------------------------------------------
  - author: "Jiu Liu"
  - author_contact: "QQ: 3209174373, GitHub: https://github.com/DCSCDF"
  - license: "MIT"
  - license_exception: "Mandatory attribution retention"
  - UpdateTime: 2026/3/26 21:10
  -
  -->
<template>
        <a-card>
                <a-upload-dragger
                    v-model:fileList="fileList"
                    :multiple="false"
                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    name="file"
                    @change="handleChange"
                    @drop="handleDrop"
                >
                        <p class="ant-upload-text">点击此处上传图片</p>
                        <p class="ant-upload-hint">
                                目前只允许上传图片文件，请勿上传其他文件。
                        </p>
                </a-upload-dragger>


        </a-card>
</template>
<script setup>
import {ref} from 'vue';
import {message} from 'ant-design-vue';


const fileList = ref([]);
const handleChange = info => {
        const status = info.file.status;
        if (status !== 'uploading') {
                console.log(info.file, info.fileList);
        }
        if (status === 'done') {
                message.success(`${info.file.name} file uploaded successfully.`);
        } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
        }
};

function handleDrop(e) {
        console.log(e);
}
</script>