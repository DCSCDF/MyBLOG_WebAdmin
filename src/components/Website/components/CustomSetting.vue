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
  - UpdateTime: 2026/2/22
  -
  -->

<template>
        <div class="min-h-[400px] w-full max-w-full overflow-x-auto">

                <div class="mb-4 flex items-center justify-between">
                        <div>
                                <h2 class="font-bold text-lg mb-1">自定义配置</h2>
                                <span class="text-sm text-gray-600">自定义网站配置项，满足个性化需求</span>
                        </div>
                        <a-button type="primary" @click="openCreateModal">
                                <PlusOutlined/>
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

                        <div
                            class="search-filter-bar mb-4 flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center mt-4">
                                <div class="w-full min-w-[200px] max-w-[300px]">
                                        <a-input
                                            v-model:value="searchKeyword"
                                            class="w-full"
                                            placeholder="搜索配置键名或描述"
                                            @press-enter="handleSearch">
                                                <template #prefix>
                                                        <SearchOutlined/>
                                                </template>
                                        </a-input>
                                </div>
                                <div class="flex shrink-0 gap-2 w-full lg:w-auto justify-end">
                                        <a-button type="primary" @click="handleSearch">
                                                <template #icon>
                                                        <SearchOutlined/>
                                                </template>
                                                搜索
                                        </a-button>
                                        <a-button @click="handleReset">重置</a-button>
                                </div>
                        </div>

                        <a-table
                            :columns="columns"
                            :data-source="configList"
                            :loading="loading"
                            :pagination="tablePagination"
                            :scroll="{ x: 1100 }"
                            class="rounded-lg overflow-hidden mt-4"
                            row-key="id"
                            @change="onTableChange">
                                <template #bodyCell="{ column, record }">
                                        <template v-if="column.key === 'configKey'">
                                                {{ record.configKey }}
                                        </template>
                                        <template v-else-if="column.key === 'configValue'">
                                                <span :title="record.configValue"
                                                      class="line-clamp-2">{{ record.configValue }}</span>
                                        </template>
                                        <template v-else-if="column.key === 'dataType'">
                                                <a-tag>{{ record.dataType || 'string' }}</a-tag>
                                        </template>
                                        <template v-else-if="column.key === 'description'">
                                                {{ record.description || '-' }}
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
                                                            @confirm="deleteConfig(record.id)">
                                                                <a-button danger size="small" type="link">删除
                                                                </a-button>
                                                        </a-popconfirm>
                                                </a-space>
                                        </template>
                                </template>
                        </a-table>

                        <!-- 编辑配置值弹窗（仅允许修改 config_value） -->
                        <a-modal
                            v-model:open="editModalVisible"
                            :confirm-loading="editSubmitting"
                            :title="editingConfig ? '编辑配置值' : ''"
                            @cancel="handleEditCancel"
                            @ok="handleEditOk">
                                <a-form v-if="editingConfig" :model="editForm" layout="vertical">
                                        <a-form-item label="配置键名">
                                                <a-input :value="editingConfig.configKey" disabled/>
                                        </a-form-item>
                                        <a-form-item label="数据类型">
                                                <a-input :value="editingConfig.dataType || 'string'" disabled/>
                                        </a-form-item>
                                        <a-form-item label="配置值" name="configValue" required>
                                                <a-input
                                                    v-model:value="editForm.configValue"
                                                    placeholder="请输入配置值"
                                                />
                                        </a-form-item>
                                        <a-form-item v-if="editingConfig.validationRule" label="校验规则">
                                                <span class="text-gray-500">{{ editingConfig.validationRule }}</span>
                                        </a-form-item>
                                        <a-form-item v-if="editingConfig.description" label="说明">
                                                <span class="text-gray-500">{{ editingConfig.description }}</span>
                                        </a-form-item>
                                </a-form>
                        </a-modal>

                        <!-- 新增配置项弹窗 -->
                        <a-modal
                            v-model:open="createModalVisible"
                            :confirm-loading="createSubmitting"
                            title="添加配置项"
                            @cancel="handleCreateCancel"
                            @ok="handleCreateOk">
                                <a-form
                                    ref="createFormRef"
                                    :model="createForm"
                                    :rules="createRules"
                                    layout="vertical">
                                        <a-form-item label="配置键名" name="configKey">
                                                <a-input
                                                    v-model:value="createForm.configKey"
                                                    placeholder="如：custom.theme"
                                                />
                                        </a-form-item>
                                        <a-form-item label="配置值" name="configValue">
                                                <a-input
                                                    v-model:value="createForm.configValue"
                                                    placeholder="请输入配置值"
                                                />
                                        </a-form-item>
                                        <a-form-item label="数据类型" name="dataType">
                                                <a-select
                                                    v-model:value="createForm.dataType"
                                                    allow-clear
                                                    placeholder="不选则默认 string"
                                                    style="width: 100%"
                                                    @change="onDataTypeChange">
                                                        <a-select-option value="string">string</a-select-option>
                                                        <a-select-option value="boolean">boolean</a-select-option>
                                                        <a-select-option value="integer">integer</a-select-option>
                                                        <a-select-option value="json">json</a-select-option>
                                                        <a-select-option value="email">email</a-select-option>
                                                        <a-select-option value="url">url</a-select-option>
                                                        <a-select-option value="text">text</a-select-option>
                                                        <a-select-option :value="DATA_TYPE_CUSTOM">自定义
                                                        </a-select-option>
                                                </a-select>
                                        </a-form-item>
                                        <a-form-item
                                            v-if="createForm.dataType === DATA_TYPE_CUSTOM"
                                            label="自定义数据类型"
                                            name="dataTypeCustom">
                                                <a-input
                                                    v-model:value="createForm.dataTypeCustom"
                                                    placeholder="请输入数据类型，如：number、date"
                                                />
                                        </a-form-item>
                                        <a-form-item label="校验规则" name="validationRule">
                                                <a-input
                                                    v-model:value="createForm.validationRule"
                                                    placeholder="选填，如：max_length=50"
                                                />
                                        </a-form-item>
                                        <a-form-item label="描述" name="description">
                                                <a-input
                                                    v-model:value="createForm.description"
                                                    placeholder="选填"
                                                />
                                        </a-form-item>
                                </a-form>
                        </a-modal>
                </div>
        </div>
</template>

<script setup>
import {computed, onMounted, reactive, ref} from 'vue';
import {message} from 'ant-design-vue';
import {PlusOutlined, SearchOutlined} from '@ant-design/icons-vue';
import {configApi} from '../../../api/system/configApi.js';

const configList = ref([]);
const loading = ref(false);
const searchKeyword = ref('');

const pagination = reactive({
        current: 1,
        pageSize: 10,
        total: 0,
        showSizeChanger: true,
        showTotal: (total) => `共 ${total} 条`
});

const tablePagination = computed(() => ({
        current: pagination.current,
        pageSize: pagination.pageSize,
        total: pagination.total,
        showSizeChanger: pagination.showSizeChanger,
        showTotal: pagination.showTotal
}));

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
                key: 'configKey',
                dataIndex: 'configKey',
                width: 180
        },
        {
                title: '配置值',
                key: 'configValue',
                width: 220
        },
        {
                title: '数据类型',
                key: 'dataType',
                dataIndex: 'dataType',
                width: 100
        },
        {
                title: '描述',
                key: 'description',
                width: 250
        },
        {
                title: '创建时间',
                dataIndex: 'createTime',
                key: 'createTime',
                width: 180
        },
        {
                title: '操作',
                key: 'action',
                width: 120,
                fixed: 'right'
        }
];

const editModalVisible = ref(false);
const editingConfig = ref(null);
const editSubmitting = ref(false);
const editForm = reactive({
        configValue: ''
});

const DATA_TYPE_CUSTOM = '__custom__';

const createModalVisible = ref(false);
const createFormRef = ref(null);
const createSubmitting = ref(false);
const createForm = reactive({
        configKey: '',
        configValue: '',
        dataType: undefined,
        dataTypeCustom: '',
        validationRule: '',
        description: ''
});
const createRules = {
        configKey: [
                {required: true, message: '请输入配置键名', trigger: 'blur'},
                {max: 100, message: '最多 100 个字符', trigger: 'blur'}
        ],
        configValue: [
                {required: true, message: '请输入配置值', trigger: 'blur'}
        ]
};

function loadCustomList() {
        loading.value = true;
        const params = {
                currentPage: pagination.current,
                pageSize: pagination.pageSize
        };
        if (searchKeyword.value) {
                params.keyword = searchKeyword.value.trim();
        }
        configApi
            .customList(params)
            .then((res) => {
                    const data = res?.data || {};
                    configList.value = data.records || [];
                    pagination.total = data.total ?? 0;
            })
            .catch((e) => {
                    message.error(e?.message || '加载自定义配置列表失败');
            })
            .finally(() => {
                    loading.value = false;
            });
}

function onTableChange(pag) {
        pagination.current = pag.current;
        pagination.pageSize = pag.pageSize;
        loadCustomList();
}

function handleSearch() {
        pagination.current = 1;
        loadCustomList();
}

function handleReset() {
        searchKeyword.value = '';
        pagination.current = 1;
        loadCustomList();
}

function openEditModal(record) {
        editingConfig.value = record;
        editForm.configValue = record?.configValue ?? '';
        editModalVisible.value = true;
}

function handleEditCancel() {
        editModalVisible.value = false;
        editingConfig.value = null;
        editForm.configValue = '';
}

async function handleEditOk() {
        let isValid = true;
        let configValue = '';

        // 验证必要条件
        if (!editingConfig.value) {
                isValid = false;
        }

        if (isValid) {
                configValue = String(editForm.configValue ?? '').trim();
                if (!configValue) {
                        message.warning('请输入配置值');
                        isValid = false;
                }
        }

        if (isValid) {
                try {
                        editSubmitting.value = true;
                        await configApi.update({
                                configKey: editingConfig.value.configKey,
                                configValue
                        });
                        message.success('配置项更新成功');
                        const index = configList.value.findIndex((item) => item.id === editingConfig.value.id);
                        if (index > -1) {
                                configList.value[index] = {
                                        ...configList.value[index],
                                        configValue
                                };
                        }
                        handleEditCancel();
                } catch (e) {
                        message.error(e?.message || '配置项更新失败');
                } finally {
                        editSubmitting.value = false;
                }
        }
}

function deleteConfig(id) {
        configApi
            .deleteCustom(id)
            .then(() => {
                    message.success('删除成功');
                    loadCustomList();
            })
            .catch((e) => {
                    message.error(e?.message || '删除失败');
            });
}

function onDataTypeChange() {
        if (createForm.dataType !== DATA_TYPE_CUSTOM) {
                createForm.dataTypeCustom = '';
        }
}

function openCreateModal() {
        createForm.configKey = '';
        createForm.configValue = '';
        createForm.dataType = undefined;
        createForm.dataTypeCustom = '';
        createForm.validationRule = '';
        createForm.description = '';
        createModalVisible.value = true;
}

function handleCreateCancel() {
        createModalVisible.value = false;
}

// 验证表单基础条件
function validateFormBasics() {
        let isValid = true;
        
        if (!createFormRef.value) {
                isValid = false;
        }
        
        if (isValid && createForm.dataType === DATA_TYPE_CUSTOM) {
                const customType = String(createForm.dataTypeCustom ?? '').trim();
                if (!customType) {
                        message.warning('请填写自定义数据类型');
                        isValid = false;
                }
        }
        
        return isValid;
}

// 构建请求体数据
function buildRequestBody() {
        const body = {
                configKey: String(createForm.configKey ?? '').trim(),
                configValue: String(createForm.configValue ?? '').trim()
        };
        
        // 处理数据类型
        let dataTypeToSend = null;
        if (createForm.dataType === DATA_TYPE_CUSTOM) {
                dataTypeToSend = String(createForm.dataTypeCustom ?? '').trim();
        } else if (createForm.dataType) {
                dataTypeToSend = createForm.dataType;
        }
        if (dataTypeToSend) {
                body.dataType = dataTypeToSend;
        }
        
        // 处理可选字段
        if (createForm.validationRule) {
                body.validationRule = String(createForm.validationRule).trim();
        }
        if (createForm.description) {
                body.description = String(createForm.description).trim();
        }
        
        return body;
}

// 执行创建操作
async function executeCreateOperation(body) {
        await configApi.createCustom(body);
        message.success('添加成功');
        createModalVisible.value = false;
        pagination.current = 1;
        loadCustomList();
}

async function handleCreateOk() {
        let canProceed = validateFormBasics();
        
        if (canProceed) {
                try {
                        createSubmitting.value = true;
                        await createFormRef.value.validate();
                        
                        // 构建请求数据
                        const body = buildRequestBody();
                        
                        // 执行创建
                        await executeCreateOperation(body);
                        
                } catch (e) {
                        if (!e?.errorFields) {
                                message.error(e?.message || '添加失败');
                        }
                } finally {
                        createSubmitting.value = false;
                }
        }
}

onMounted(() => {
        loadCustomList();
});
</script>
