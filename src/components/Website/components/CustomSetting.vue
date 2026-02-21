<!--
  - [CustomSetting.vue]
  - -------------------------------------------------------------------------------
  - This software is licensed under the MIT License.
  - However, any distribution or modification must retain this copyright notice.
  - See LICENSE for full terms.
  - -------------------------------------------------------------------------------
  - author: "Jiu Liu"
  - author_contact: "QQ: 3209174373, GitHub: https://github.com/DCSCDF"
  - license: "MIT"
  - license_exception: "Mandatory attribution retention"
  - UpdateTime: 2026/2/21 14:45
  -
  -->

<template>
        <div class="min-h-[400px] w-full max-w-full overflow-x-auto">

                <div class="mb-4 flex items-center justify-between">
                        <div>
                                <h2 class="font-bold text-lg mb-1">自定义配置</h2>
                                <span class="text-sm text-gray-600">自定义网站配置项，满足个性化需求</span>
                        </div>
                        <a-button type="primary" @click="addConfig">
                                <plus-outlined/>
                                添加配置项
                        </a-button>
                </div>

                <div>
                        <a-alert
                            class="my-4"
                            message="除非你的网站页面是自己开发的，你知道你在干什么，否则不要动这些设置。"
                            show-icon
                            type="info"
                        />

                        <a-table
                            :columns="columns"
                            :data-source="configList"
                            :pagination="tablePagination"
                            :scroll="{ x: 1000 }"
                            class="rounded-lg overflow-hidden mt-4"
                            row-key="id"
                            @change="onTableChange"
                        >
                                <template #bodyCell="{column, record}">
                                        <template v-if="column.key === 'key'">
                                                {{ record.key }}
                                        </template>
                                        <template v-else-if="column.key === 'value'">
                                                {{ record.value }}
                                        </template>
                                        <template v-else-if="column.key === 'description'">
                                                {{ record.description }}
                                        </template>
                                        <template v-else-if="column.key === 'action'">
                                                <a-space>
                                                        <a-button size="small" type="link"
                                                                  @click="openEditModal(record)">修改
                                                        </a-button>
                                                        <a-popconfirm
                                                            cancel-text="取消"
                                                            ok-text="确定"
                                                            title="确定删除此配置项吗？"
                                                            @confirm="deleteConfig(record.id)"
                                                        >
                                                                <a-button danger size="small" type="link">删除
                                                                </a-button>
                                                        </a-popconfirm>
                                                </a-space>
                                        </template>
                                </template>
                        </a-table>

                        <!-- 编辑配置项弹窗 -->
                        <a-modal
                            v-model:open="editModalVisible"
                            :title="editingConfig ? '编辑配置项' : '添加配置项'"
                            @cancel="handleEditCancel"
                            @ok="handleEditOk"
                        >
                                <a-form :model="editForm" layout="vertical">
                                        <a-form-item label="配置键名" name="key">
                                                <a-input v-model:value="editForm.key" placeholder="请输入配置键名"/>
                                        </a-form-item>
                                        <a-form-item label="配置值" name="value">
                                                <a-input v-model:value="editForm.value" placeholder="请输入配置值"/>
                                        </a-form-item>
                                        <a-form-item label="配置描述" name="description">
                                                <a-input v-model:value="editForm.description"
                                                         placeholder="请输入配置描述"/>
                                        </a-form-item>
                                </a-form>
                        </a-modal>

                </div>
        </div>
</template>

<script setup>
import {computed, reactive, ref} from 'vue';
import {message} from 'ant-design-vue';
import {PlusOutlined} from '@ant-design/icons-vue';

const configList = ref([
        {
                id: 1,
                key: 'site_theme',
                value: 'light',
                description: '网站主题模式'
        },
        {
                id: 2,
                key: 'max_upload_size',
                value: '10MB',
                description: '最大上传文件大小'
        }
]);

let nextId = 3;

// 编辑相关
const editModalVisible = ref(false);
const editingConfig = ref(null);
const editForm = reactive({
        key: '',
        value: '',
        description: ''
});

// 分页相关
const pagination = reactive({
        current: 1,
        pageSize: 10,
        total: 0,
        showSizeChanger: true,
        showTotal: (total) => `共 ${total} 条`
});

// 计算属性：表格分页配置
const tablePagination = computed(() => ({
        current: pagination.current,
        pageSize: pagination.pageSize,
        total: configList.value.length,
        showSizeChanger: pagination.showSizeChanger,
        showTotal: pagination.showTotal
}));

// 处理表格变化（分页）
const onTableChange = (pag) => {
        pagination.current = pag.current;
        pagination.pageSize = pag.pageSize;
};


const columns = [
        {
                title: 'ID',
                dataIndex: 'id',
                key: 'id',
                width: 80,
                fixed: 'left'
        },
        {
                title: '配置键名',
                key: 'key',
                width: 180
        },
        {
                title: '配置值',
                key: 'value',
                width: 220
        },
        {
                title: '描述',
                key: 'description',
                width: 250
        },
        {
                title: '操作',
                key: 'action',
                width: 120,
                fixed: 'right'
        }
];

// 打开编辑弹窗
const openEditModal = (record = null) => {
        editingConfig.value = record;
        if (record) {
                // 编辑现有配置
                editForm.key = record.key;
                editForm.value = record.value;
                editForm.description = record.description;
        } else {
                // 添加新配置
                editForm.key = '';
                editForm.value = '';
                editForm.description = '';
        }
        editModalVisible.value = true;
};

// 处理编辑确认
const handleEditOk = () => {
        if (!editForm.key || !editForm.value) {
                message.warning('请填写完整的配置键名和值');
                return;
        }

        if (editingConfig.value) {
                // 更新现有配置
                const index = configList.value.findIndex(item => item.id === editingConfig.value.id);
                if (index > -1) {
                        configList.value[index] = {
                                ...configList.value[index],
                                key: editForm.key,
                                value: editForm.value,
                                description: editForm.description
                        };
                        message.success('配置项更新成功');
                }
        } else {
                // 添加新配置
                configList.value.push({
                        id: nextId++,
                        key: editForm.key,
                        value: editForm.value,
                        description: editForm.description
                });
                message.success('配置项添加成功');
                // 更新总条数
                pagination.total = configList.value.length;
        }

        handleEditCancel();
};

// 处理编辑取消
const handleEditCancel = () => {
        editModalVisible.value = false;
        editingConfig.value = null;
        editForm.key = '';
        editForm.value = '';
        editForm.description = '';
};

const addConfig = () => {
        configList.value.push({
                id: nextId++,
                key: '',
                value: '',
                description: ''
        });
        // 更新总条数
        pagination.total = configList.value.length;
};

const deleteConfig = (id) => {
        const index = configList.value.findIndex(item => item.id === id);
        if (index > -1) {
                configList.value.splice(index, 1);
                message.success('配置项删除成功');
                // 更新总条数
                pagination.total = configList.value.length;
                // 如果当前页没有数据且不是第一页，回到上一页
                if (configList.value.length > 0 &&
                    (pagination.current - 1) * pagination.pageSize >= configList.value.length) {
                        pagination.current = Math.max(1, pagination.current - 1);
                }
        }
};


</script>