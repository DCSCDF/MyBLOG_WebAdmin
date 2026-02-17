<!--
  - [RoleManagement.vue]
  - -------------------------------------------------------------------------------
  - This software is licensed under the MIT License.
  - However, any distribution or modification must retain this copyright notice.
  - See LICENSE for full terms.
  - -------------------------------------------------------------------------------
  - author: "Jiu Liu"
  - author_contact: "QQ: 3209174373, GitHub: https://github.com/DCSCDF"
  - license: "MIT"
  - license_exception: "Mandatory attribution retention"
  - UpdateTime: 2026/2/17 22:26
  -
  -->

<template>

        <a-card>

                <div class="mb-4 flex items-center justify-between">
                        <div>
                                <h2 class="font-bold text-lg mb-1">角色列表</h2>
                                <span class="text-sm text-gray-600">系统内置角色仅支持查看，不可修改、删除。</span>
                        </div>
                        <a-button type="primary" @click="openCreate">新建角色</a-button>
                </div>


                <div
                    class="search-filter-bar mb-4 flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center ">
                        <div class="w-full min-w-[200px] max-w-[300px]">
                                <a-input
                                    v-model:value="searchKeyword"
                                    class="w-full"
                                    placeholder="搜索编码/名称/描述"
                                    @press-enter="handleSearch">
                                        <template #prefix>
                                                <SearchOutlined/>
                                        </template>
                                </a-input>
                        </div>
                        <div class="flex gap-2">
                                <div class="search-filter-item flex items-center gap-1 rounded-md min-w-0 my-1">
                                        <a-select
                                            v-model:value="searchStatus"
                                            allow-clear
                                            placeholder="状态">
                                                <a-select-option v-for="opt in statusFilterOptions" :key="opt.label"
                                                                 :value="opt.value">{{ opt.label }}
                                                </a-select-option>
                                        </a-select>
                                </div>
                                <div class="search-filter-item flex items-center gap-1 rounded-md min-w-0 my-1">
                                        <a-select
                                            v-model:value="searchIsSystem"
                                            allow-clear
                                            placeholder="系统内置">
                                                <a-select-option v-for="opt in isSystemFilterOptions" :key="opt.label"
                                                                 :value="opt.value">{{ opt.label }}
                                                </a-select-option>
                                        </a-select>
                                </div>
                        </div>
                        <div class="flex shrink-0 gap-2 w-full lg:w-auto justify-end ">
                                <a-button type="primary" @click="handleSearch">搜索</a-button>
                                <a-button @click="handleReset">重置</a-button>
                        </div>
                </div>

                <a-table
                    :columns="columns"
                    :data-source="roleStore.currentRoles"
                    :loading="roleStore.loading"
                    :pagination="tablePagination"
                    :scroll="{ x: 1000 }"
                    row-key="id"
                    @change="onTableChange">
                        <template #bodyCell="{ column, record }">
                                <template v-if="column.key === 'superAdmin'">
                                        <a-tag :bordered="false" :color="record.superAdmin ? 'red' : 'default'">
                                                {{ record.superAdmin ? '是' : '否' }}
                                                <!-- 超级管理员角色 code=SUPER_ADMIN，与 schema 中 sys_role 一致 -->
                                        </a-tag>
                                </template>
                                <template v-else-if="column.key === 'isSystem'">
                                        <a-tag :bordered="false" :color="record.isSystem ? 'blue' : 'default'">
                                                {{ record.isSystem ? '系统内置' : '自定义' }}
                                        </a-tag>
                                </template>
                                <template v-else-if="column.key === 'status'">
                                        <a-tag :bordered="false" :color="record.status === 1 ? 'green' : 'red'">
                                                {{ record.status === 1 ? '启用' : '禁用' }}
                                        </a-tag>
                                </template>
                                <template v-else-if="column.key === 'action'">
                                        <a-space>
                                                <a-button size="small" type="link" @click="openDetail(record)">
                                                        查看
                                                </a-button>
                                                <a-button size="small" type="link"
                                                          @click="openPermissionDrawer(record)">权限
                                                </a-button>
                                                <a-button
                                                    v-if="!record.isSystem"
                                                    size="small"
                                                    type="link"
                                                    @click="openEdit(record)">编辑
                                                </a-button>
                                                <a-popconfirm
                                                    v-if="!record.isSystem"
                                                    cancel-text="取消"
                                                    ok-text="确定"
                                                    title="确定删除该角色吗？将级联删除用户-角色、角色-权限、角色-权限组关联。"
                                                    @confirm="onDelete(record)">
                                                        <a-button danger size="small" type="link">删除
                                                        </a-button>
                                                </a-popconfirm>
                                        </a-space>
                                </template>
                        </template>
                </a-table>
        </a-card>

        <!-- 角色详情抽屉 -->
        <a-drawer
            v-model:open="detailVisible"
            :destroy-on-close="true"
            :width="drawerWidth"
            title="角色详情"
            @close="selectedRole = null">
                <template v-if="selectedRole">


                        <div class="flex flex-col gap-1">
                                <span class="font-medium text-gray-900 text-sm">编码：</span>
                                <span
                                    class="text-gray-600 text-sm break-all">{{ selectedRole.code }}</span>
                        </div>
                        <a-divider/>
                        <div class="flex flex-col gap-1">
                                <span class="font-medium text-gray-900 text-sm">名称：</span>
                                <span
                                    class="text-gray-600 text-sm break-all">{{ selectedRole.name }}</span>
                        </div>
                        <a-divider/>
                        <div class="flex flex-col gap-1">
                                <span class="font-medium text-gray-900 text-sm">描述：</span>
                                <span
                                    class="text-gray-600 text-sm break-all">{{ selectedRole.description || '-' }}</span>
                        </div>
                        <a-divider/>
                        <div class="flex flex-col gap-1">
                                <span class="font-medium text-gray-900 text-sm">超级管理员：</span>
                                <span
                                    class="text-gray-600 text-sm break-all"> {{
                                                selectedRole.superAdmin ? '是' : '否'
                                        }}</span>
                        </div>
                        <a-divider/>
                        <div class="flex flex-col gap-1">
                                <span class="font-medium text-gray-900 text-sm">系统内置：</span>
                                <span
                                    class="text-gray-600 text-sm break-all"> {{
                                                selectedRole.isSystem ? '是' : '否'
                                        }}</span>
                        </div>
                        <a-divider/>
                        <div class="flex flex-col gap-1">
                                <span class="font-medium text-gray-900 text-sm">排序：</span>
                                <span
                                    class="text-gray-600 text-sm break-all"> {{
                                                selectedRole.sortOrder
                                        }}</span>
                        </div>
                        <a-divider/>
                        <div class="flex flex-col gap-1">
                                <span class="font-medium text-gray-900 text-sm">状态：</span>
                                <span
                                    class="text-gray-600 text-sm break-all">{{
                                                selectedRole.status === 1 ? '启用' : '禁用'
                                        }}</span>
                        </div>
                        <a-divider/>
                        <div class="flex flex-col gap-1">
                                <span class="font-medium text-gray-900 text-sm">创建时间：</span>
                                <span
                                    class="text-gray-600 text-sm break-all">{{
                                                formatDate(selectedRole.createTime)
                                        }}</span>
                        </div>
                        <a-divider/>
                        <div class="flex flex-col gap-1">
                                <span class="font-medium text-gray-900 text-sm">更新时间：</span>
                                <span
                                    class="text-gray-600 text-sm break-all">{{
                                                formatDate(selectedRole.updateTime)
                                        }}</span>
                        </div>
                        <a-divider/>

                </template>
        </a-drawer>

        <!-- 新建角色弹窗 -->
        <a-modal
            v-model:open="createVisible"
            :confirm-loading="createSubmitting"
            cancel-text="取消"
            ok-text="创建"
            title="新建角色"
            @cancel="createForm = null"
            @ok="submitCreate">
                <a-form
                    v-if="createForm"
                    :layout="'vertical'"
                    :model="createForm"
                    :rules="createRules">
                        <a-form-item label="角色编码" name="code" required>
                                <a-input
                                    v-model:value="createForm.code"
                                    :maxlength="50"
                                    placeholder="角色编码，2-50字符，只能包含大写字母和下划线（如：CUSTOM_ROLE）"
                                    show-count
                                    @input="handleCodeInput"/>
                                <template #extra>
                                        <span class="text-xs text-gray-500">例如：CUSTOM_ROLE、ADMIN_USER</span>
                                </template>
                        </a-form-item>
                        <a-form-item label="角色名称" name="name" required>
                                <a-input v-model:value="createForm.name" :maxlength="50"
                                         placeholder="角色名称，最大 50 字符" show-count/>
                        </a-form-item>
                        <a-form-item label="描述" name="description">
                                <a-textarea v-model:value="createForm.description"
                                            :maxlength="200" :rows="3"
                                            placeholder="角色描述，最大 200 字符（可选）" show-count/>
                        </a-form-item>
                        <a-form-item label="排序" name="sortOrder">
                                <a-input-number v-model:value="createForm.sortOrder" :min="0"
                                                style="width: 100%;"/>
                        </a-form-item>
                        <a-form-item label="状态" name="status">
                                <a-radio-group v-model:value="createForm.status">
                                        <a-radio :value="1">启用</a-radio>
                                        <a-radio :value="0">禁用</a-radio>
                                </a-radio-group>
                        </a-form-item>
                </a-form>
        </a-modal>

        <!-- 编辑角色弹窗 -->
        <a-modal
            v-model:open="editVisible"
            :confirm-loading="editSubmitting"
            cancel-text="取消"
            ok-text="保存"
            title="编辑角色"
            @cancel="editForm = null"
            @ok="submitEdit">
                <a-form
                    v-if="editForm"
                    :layout="'vertical'"
                    :model="editForm"
                    :rules="editRules">
                        <a-form-item label="角色名称" name="name" required>
                                <a-input v-model:value="editForm.name" :maxlength="50" placeholder="角色名称"
                                         show-count/>
                        </a-form-item>
                        <a-form-item label="描述" name="description">
                                <a-textarea v-model:value="editForm.description" :maxlength="200"
                                            :rows="3" placeholder="角色描述" show-count/>
                        </a-form-item>
                        <a-form-item label="排序" name="sortOrder">
                                <a-input-number v-model:value="editForm.sortOrder" :min="0"
                                                style="width: 100%;"/>
                        </a-form-item>
                        <a-form-item label="状态" name="status">
                                <a-radio-group v-model:value="editForm.status">
                                        <a-radio :value="1">启用</a-radio>
                                        <a-radio :value="0">禁用</a-radio>
                                </a-radio-group>
                        </a-form-item>
                </a-form>
        </a-modal>

        <!-- 管理权限抽屉 -->
        <a-drawer
            v-model:open="permissionDrawerVisible"
            :destroy-on-close="true"
            :footer-style="{ textAlign: 'right' }"
            :width="drawerWidth"
            title="角色权限配置"
            @close="onPermissionDrawerClose">
                <template v-if="permissionRole">
                        <div class="mb-4 text-gray-600 text-sm">{{
                                        permissionRole.name
                                }}（{{ permissionRole.code }}）
                        </div>
                        <div class="mb-3 p-2 bg-blue-50 rounded text-xs text-gray-600">
                                <InfoCircleOutlined class="mr-1"/>
                                提示：通过权限组添加的权限会自动同步到权限列表，这些权限只能通过移除权限组来移除。
                        </div>
                        <div v-if="roleStore.permissionsDetailLoading || loadingGroupPermissions"
                             class="flex justify-center py-8">
                                <a-spin size="large"/>
                        </div>
                        <template v-else>
                                <!-- 已关联权限 -->
                                <div class="mb-4">
                                        <div class="flex items-center justify-between mb-2">
                                                <span class="font-medium">已关联权限</span>
                                                <a-button
                                                    v-if="permissionRole && !permissionRole.isSystem"
                                                    size="small"
                                                    type="primary"
                                                    @click="showAddPermissionModal = true">添加权限
                                                </a-button>
                                        </div>
                                        <div class="overflow-x-auto">
                                                <a-table
                                                    :columns="permissionColumns"
                                                    :data-source="permissionsWithSource"
                                                    :loading="roleStore.permissionsDetailLoading"
                                                    :pagination="false"
                                                    :scroll="{ x: 500 }"
                                                    row-key="id"
                                                    size="small"
                                                    table-layout="fixed">
                                                        <template #bodyCell="{ column, record }">
                                                                <template v-if="column.key === 'source'">
                                                                        <a-tag :bordered="false"
                                                                               :color="record.fromGroup ? 'blue' : 'green'">
                                                                                {{
                                                                                        record.fromGroup ? '来自权限组' : '直接添加'
                                                                                }}
                                                                        </a-tag>
                                                                </template>
                                                                <template v-else-if="column.key === 'action'">
                                                                        <a-popconfirm
                                                                            v-if="!record.fromGroup && permissionRole && !permissionRole.isSystem"
                                                                            title="确定移除此权限？"
                                                                            @confirm="removePermission(record.id)">
                                                                                <a-button danger size="small"
                                                                                          type="link">移除
                                                                                </a-button>
                                                                        </a-popconfirm>
                                                                        <span v-else
                                                                              class="text-gray-400 text-xs">需移除权限组</span>
                                                                </template>
                                                        </template>
                                                </a-table>
                                        </div>
                                        <div v-if="!permissionsWithSource.length"
                                             class="text-gray-400 text-sm py-2">没有权限查看
                                        </div>
                                </div>
                                <!-- 已关联权限组 -->
                                <div>
                                        <div class="flex items-center justify-between mb-2">
                                                <span class="font-medium">已关联权限组</span>
                                                <a-button
                                                    v-if="permissionRole && !permissionRole.isSystem"
                                                    size="small"
                                                    type="primary"
                                                    @click="showAddGroupModal = true">添加权限组
                                                </a-button>
                                        </div>
                                        <div class="overflow-x-auto">
                                                <a-table
                                                    :columns="groupColumns"
                                                    :data-source="roleStore.roleDetail?.permissionGroups || []"
                                                    :pagination="false"
                                                    :scroll="{ x: 400 }"
                                                    row-key="id"
                                                    size="small"
                                                    table-layout="fixed">
                                                        <template #bodyCell="{ column, record }">
                                                                <template v-if="column.key === 'action'">
                                                                        <a-popconfirm
                                                                            title="确定移除此权限组？将同时移除该组下所有权限。"
                                                                            @confirm="removeGroup(record.id)">
                                                                                <a-button danger size="small"
                                                                                          type="link">移除
                                                                                </a-button>
                                                                        </a-popconfirm>
                                                                </template>
                                                        </template>
                                                </a-table>
                                        </div>
                                        <div v-if="!(roleStore.roleDetail?.permissionGroups?.length)"
                                             class="text-gray-400 text-sm py-2">没有权限查看
                                        </div>
                                </div>
                        </template>
                </template>
        </a-drawer>

        <!-- 添加权限弹窗（表格选择） -->
        <a-modal
            v-model:open="showAddPermissionModal"
            :confirm-loading="addPermissionLoading"
            ok-text="添加"
            title="添加权限"
            width="560px"
            @cancel="selectedPermissionId = null; addPermissionSearchKeyword = ''"
            @ok="doAddPermission">
                <a-input
                    v-model:value="addPermissionSearchKeyword"
                    allow-clear
                    class="mb-3"
                    placeholder="搜索权限编码/名称">
                        <template #prefix>
                                <SearchOutlined/>
                        </template>
                </a-input>
                <a-table
                    :columns="addPermissionTableColumns"
                    :data-source="addPermissionTableData"
                    :loading="permissionListLoading"
                    :pagination="false"
                    :row-selection="{ type: 'radio', selectedRowKeys: selectedPermissionId ? [selectedPermissionId] : [], onChange: onAddPermissionRowSelect }"
                    :scroll="{ y: 280 }"
                    row-key="id"
                    size="small"/>
                <div v-if="!addPermissionTableData.length && !permissionListLoading"
                     class="text-gray-400 text-sm py-4 text-center">暂无可选权限
                </div>
        </a-modal>

        <!-- 添加权限组弹窗 -->
        <a-modal
            v-model:open="showAddGroupModal"
            :confirm-loading="addGroupLoading"
            ok-text="添加"
            title="添加权限组"
            @cancel="selectedGroupId = null"
            @ok="doAddGroup">
                <a-select
                    v-model:value="selectedGroupId"
                    :field-names="{ label: 'name', value: 'id' }"
                    :filter-option="filterGroupOption"
                    :loading="groupListLoading"
                    :options="groupOptions"
                    placeholder="请选择要添加的权限组"
                    show-search
                    style="width: 100%;"/>
        </a-modal>

</template>

<script setup>
import {computed, onMounted, onUnmounted, ref, watch} from 'vue';
import {message} from 'ant-design-vue';
import {useRoleStore} from '../../../../stores/role.js';
import {usePermissionStore} from '../../../../stores/permission.js';
import {usePermissionGroupStore} from '../../../../stores/permissiongroup.js';
import logger from '../../../../utils/logger.js';
import {
        buildPermissionTree,
        checkPermissionConflict,
        flattenPermissionTree,
        hasChildren
} from '../../../../utils/permissionTree.js';
import {InfoCircleOutlined, SearchOutlined} from "@ant-design/icons-vue";

const roleStore = useRoleStore();
const permissionStore = usePermissionStore();
const permissionGroupStore = usePermissionGroupStore();

// 响应式抽屉宽度
const windowWidth = ref(window.innerWidth);
const drawerWidth = computed(() => windowWidth.value < 768 ? 350 : 600);

// 窗口大小变化处理
const handleResize = () => {
        windowWidth.value = window.innerWidth;
};

// 表格分页配置（与后端 current/size 对应）
const tablePagination = computed(() => ({
        current: roleStore.pagination.current,
        pageSize: roleStore.pagination.pageSize,
        total: roleStore.pagination.total,
        showSizeChanger: true,
        showTotal: (total) => `共 ${total} 条`
}));

// 搜索与筛选（'' 表示不传该筛选）
const searchKeyword = ref('');
const searchStatus = ref(undefined);
const searchIsSystem = ref(undefined);

/** 状态下拉选项：来自接口或默认 */
const statusFilterOptions = computed(() => {
        const fromApi = roleStore.filterOptions?.status;
        return fromApi && fromApi.length > 0 ? fromApi : [{value: 0, label: '禁用'}, {value: 1, label: '启用'}];
});
/** 是否系统内置下拉选项：来自接口或默认 */
const isSystemFilterOptions = computed(() => {
        const fromApi = roleStore.filterOptions?.isSystem;
        return fromApi && fromApi.length > 0 ? fromApi : [{value: 0, label: '否'}, {value: 1, label: '是'}];
});

const columns = [
        {title: '编码', dataIndex: 'code', key: 'code', width: 140, ellipsis: true},
        {title: '名称', dataIndex: 'name', key: 'name', width: 120},
        {title: '描述', dataIndex: 'description', key: 'description', width: 180, ellipsis: true},
        // {title: '超级管理员', dataIndex: 'superAdmin', key: 'superAdmin', width: 100},
        {title: '系统内置', dataIndex: 'isSystem', key: 'isSystem', width: 100},
        {title: '排序', dataIndex: 'sortOrder', key: 'sortOrder', width: 80},
        {title: '状态', dataIndex: 'status', key: 'status', width: 80},
        {title: '操作', key: 'action', width: 220, fixed: 'right'}
];

// 存储所有权限组中的权限ID集合
const permissionIdsFromGroups = ref(new Set());
const loadingGroupPermissions = ref(false);

// 计算权限来源：哪些权限来自权限组，哪些是直接添加的
const permissionsWithSource = computed(() => {
        const permissions = roleStore.roleDetail?.permissions || [];

        // 返回带来源标记的权限列表
        return permissions.map(permission => {
                const fromGroup = permissionIdsFromGroups.value.has(permission.id);
                return {
                        ...permission,
                        fromGroup
                };
        });
});

// 权限配置抽屉内：已关联权限表格列（非系统角色显示操作列）
const permissionColumns = computed(() => {
        const cols = [
                {title: '权限编码', dataIndex: 'code', key: 'code'},
                {title: '权限名称', dataIndex: 'name', key: 'name'},
                {title: '来源', key: 'source', width: 100}
        ];
        if (!permissionRole.value?.isSystem) {
                cols.push({title: '操作', key: 'action', width: 120});
        }
        return cols;
});

// 权限配置抽屉内：已关联权限组表格列
const groupColumns = computed(() => {
        const cols = [
                {title: '权限组名称', dataIndex: 'name', key: 'name'},
                {title: '描述', dataIndex: 'description', key: 'description'}
        ];
        if (!permissionRole.value?.isSystem) {
                cols.push({title: '操作', key: 'action', width: 80});
        }
        return cols;
});

const detailVisible = ref(false);
const selectedRole = ref(null);
const createVisible = ref(false);
const createSubmitting = ref(false);
const createForm = ref(null);
// 验证角色编码格式：2-50 字符，只能包含大写字母和下划线
const validateRoleCode = (_rule, value) => {
        // 统一处理所有验证逻辑，只有一个返回点
        let errorMessage = '';

        if (!value || !value.trim()) {
                errorMessage = '请输入角色编码';
        } else {
                const trimmedValue = value.trim();
                if (trimmedValue.length < 2 || trimmedValue.length > 50) {
                        errorMessage = '角色编码长度必须在 2-50 个字符之间';
                } else if (!/^[A-Z_]+$/.test(trimmedValue)) {
                        errorMessage = '角色编码只能包含大写字母和下划线';
                }
        }

        return errorMessage ? Promise.reject(errorMessage) : Promise.resolve();
};

const createRules = {
        code: [
                {required: true, message: '请输入角色编码'},
                {validator: validateRoleCode, trigger: 'blur'}
        ],
        name: [
                {required: true, message: '请输入角色名称'},
                {max: 50, message: '角色名称不能超过 50 个字符'}
        ],
        description: [
                {max: 200, message: '角色描述不能超过 200 个字符'}
        ]
};
const editVisible = ref(false);
const editSubmitting = ref(false);
const editForm = ref(null);
const editRules = {
        name: [
                {required: true, message: '请输入角色名称'},
                {max: 50, message: '角色名称不能超过 50 个字符'}
        ],
        description: [
                {max: 200, message: '角色描述不能超过 200 个字符'}
        ]
};

const permissionDrawerVisible = ref(false);
const permissionRole = ref(null);
const showAddPermissionModal = ref(false);
const showAddGroupModal = ref(false);
const selectedPermissionId = ref(null);
const selectedGroupId = ref(null);
const addPermissionLoading = ref(false);
const addGroupLoading = ref(false);
const permissionListLoading = ref(false);
const groupListLoading = ref(false);
const permissionOptions = ref([]);
const groupOptions = ref([]);
/** 添加权限弹窗内搜索关键词 */
const addPermissionSearchKeyword = ref('');

// 添加权限弹窗：表格列
const addPermissionTableColumns = [
        {title: '权限编码', dataIndex: 'code', key: 'code', width: 160, ellipsis: true},
        {title: '权限名称', dataIndex: 'name', key: 'name', width: 140, ellipsis: true}
];

// 添加权限弹窗：按关键词过滤后的权限列表
const addPermissionTableData = computed(() => {
        const list = permissionOptions.value || [];
        const kw = (addPermissionSearchKeyword.value || '').trim().toLowerCase();
        if (!kw) return list;
        return list.filter(p => {
                const code = (p.code || '').toLowerCase();
                const name = (p.name || '').toLowerCase();
                return code.includes(kw) || name.includes(kw);
        });
});

/** 添加权限弹窗：表格行选择变更 */
function onAddPermissionRowSelect(selectedRowKeys, selectedRows) {
        selectedPermissionId.value = selectedRowKeys && selectedRowKeys[0] ? selectedRowKeys[0] : null;
}

function formatDate(val) {
        let result = '-';
        if (val) {
                try {
                        result = new Date(val).toLocaleString('zh-CN', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit'
                        });
                } catch (e) {
                        result = String(val);
                }
        }
        return result;
}

/** 加载角色列表（分页与 keyword/status/isSystem 由 store 或入参提供） */
function loadRoles() {
        roleStore.fetchRoles({
                currentPage: roleStore.pagination.current,
                pageSize: roleStore.pagination.pageSize,
                keyword: searchKeyword.value?.trim() || undefined,
                status: (searchStatus.value != null && searchStatus.value !== '') ? searchStatus.value : undefined,
                isSystem: (searchIsSystem.value != null && searchIsSystem.value !== '') ? searchIsSystem.value : undefined
        }).catch((e) => {
                message.error(e?.message || '加载角色列表失败');
        });
}

function onTableChange(pagination) {
        roleStore.updatePagination({current: pagination.current, pageSize: pagination.pageSize});
        loadRoles();
}

/** 搜索：写入 store 并回第一页 */
function handleSearch() {
        roleStore.updatePagination({current: 1});
        roleStore.updateQueryParams({
                keyword: searchKeyword.value?.trim() ?? '',
                status: (searchStatus.value != null && searchStatus.value !== '') ? searchStatus.value : undefined,
                isSystem: (searchIsSystem.value != null && searchIsSystem.value !== '') ? searchIsSystem.value : undefined
        });
        loadRoles();
}

/** 重置：清空条件并刷新 */
function handleReset() {
        searchKeyword.value = '';
        searchStatus.value = undefined;
        searchIsSystem.value = undefined;
        roleStore.updatePagination({current: 1});
        roleStore.updateQueryParams({keyword: '', status: undefined, isSystem: undefined});
        loadRoles();
}

// 处理角色编码输入，自动转换为大写
function handleCodeInput(e) {
        if (createForm.value) {
                createForm.value.code = e.target.value.toUpperCase().replace(/[^A-Z_]/g, '');
        }
}

function openCreate() {
        createForm.value = {
                code: '',
                name: '',
                description: '',
                sortOrder: 0,
                status: 1
        };
        createVisible.value = true;
}

// 验证角色编码
function validateRoleCodeField(code) {
        // 统一处理所有验证逻辑，确保只有一个返回点
        let validationResult = {valid: true, message: '', value: ''};

        // 处理空值情况
        if (!code) {
                validationResult.valid = false;
                validationResult.message = '请填写角色编码';
        } else {
                const codeValue = code.toUpperCase();
                const isValidLength = codeValue.length >= 2 && codeValue.length <= 50;
                const isValidFormat = /^[A-Z_]+$/.test(codeValue);

                if (!isValidLength) {
                        validationResult.valid = false;
                        validationResult.message = '角色编码长度必须在 2-50 个字符之间';
                } else if (!isValidFormat) {
                        validationResult.valid = false;
                        validationResult.message = '角色编码只能包含大写字母和下划线';
                } else {
                        validationResult.value = codeValue;
                }
        }

        return validationResult;
}

// 验证角色名称和描述
function validateRoleNameAndDescription(name, description) {
        // 统一处理所有验证逻辑，确保只有一个返回点
        let validationResult = {valid: true, message: ''};

        if (!name) {
                validationResult.valid = false;
                validationResult.message = '请填写角色名称';
        } else if (name.length > 50) {
                validationResult.valid = false;
                validationResult.message = '角色名称不能超过 50 个字符';
        } else if (description && description.length > 200) {
                validationResult.valid = false;
                validationResult.message = '角色描述不能超过 200 个字符';
        }

        return validationResult;
}

// 执行创建角色的业务逻辑
async function executeCreateRole(codeValue) {
        createSubmitting.value = true;
        try {
                await roleStore.createRole({
                        code: codeValue,
                        name: createForm.value.name.trim(),
                        description: createForm.value.description?.trim() || '',
                        sortOrder: createForm.value.sortOrder ?? 0,
                        status: createForm.value.status ?? 1
                });
                message.success('创建成功');
                createVisible.value = false;
                createForm.value = null;
                loadRoles();
        } catch (e) {
                message.error(e?.message || '创建失败');
        } finally {
                createSubmitting.value = false;
        }
}

async function submitCreate() {
        // 统一验证所有字段，确保只有一个返回点
        let validationPassed = true;
        let errorMessage = '';
        let codeValue = '';

        // 验证角色编码
        const codeValidation = validateRoleCodeField(createForm.value?.code?.trim());
        if (!codeValidation.valid) {
                validationPassed = false;
                errorMessage = codeValidation.message;
        } else {
                codeValue = codeValidation.value;

                // 验证角色名称和描述
                const nameValidation = validateRoleNameAndDescription(
                    createForm.value?.name?.trim(),
                    createForm.value?.description
                );
                if (!nameValidation.valid) {
                        validationPassed = false;
                        errorMessage = nameValidation.message;
                }
        }

        // 统一处理结果
        if (validationPassed) {
                // 所有验证通过，执行业务逻辑
                await executeCreateRole(codeValue);
        } else {
                // 验证失败，显示错误信息
                message.warning(errorMessage);
        }
}

function openDetail(record) {
        selectedRole.value = record;
        detailVisible.value = true;
}

function openEdit(record) {
        // 统一处理逻辑，确保只有一个返回点
        let canEdit = true;

        // 系统内置角色不可编辑（双重保护，UI 已经隐藏按钮）
        if (record.isSystem) {
                message.warning('系统内置角色不可修改');
                canEdit = false;
        }

        // 如果可以编辑，则初始化编辑表单
        if (canEdit) {
                // 重叠校验仅在做“新添加”权限/权限组时执行，接口返回的已有数据不视为冲突
                editForm.value = {
                        id: record.id,
                        name: record.name,
                        description: record.description ?? '',
                        sortOrder: record.sortOrder ?? 0,
                        status: record.status ?? 1
                };
                editVisible.value = true;
        }
}

async function submitEdit() {
        // 统一验证所有字段，确保只有一个返回点
        let validationPassed = true;
        let errorMessage = '';

        // 验证角色名称
        if (!editForm.value?.name || !editForm.value.name.trim()) {
                validationPassed = false;
                errorMessage = '请填写角色名称';
        } else if (editForm.value.name.length > 50) {
                validationPassed = false;
                errorMessage = '角色名称不能超过 50 个字符';
        } else if (editForm.value.description && editForm.value.description.length > 200) {
                validationPassed = false;
                errorMessage = '角色描述不能超过 200 个字符';
        }

        // 统一处理结果
        if (validationPassed) {
                editSubmitting.value = true;
                try {
                        await roleStore.updateRole(editForm.value.id, {
                                name: editForm.value.name.trim(),
                                description: editForm.value.description?.trim() || '',
                                sortOrder: editForm.value.sortOrder ?? 0,
                                status: editForm.value.status ?? 1
                        });
                        message.success('保存成功');
                        editVisible.value = false;
                        editForm.value = null;
                        loadRoles();
                } catch (e) {
                        message.error(e?.message || '保存失败');
                } finally {
                        editSubmitting.value = false;
                }
        } else {
                message.warning(errorMessage);
        }
}

async function onDelete(record) {
        // 统一处理逻辑，确保只有一个返回点
        let canDelete = true;

        // 系统内置角色不可删除（双重保护，UI 已经隐藏按钮）
        if (record.isSystem) {
                message.warning('系统内置角色不可删除');
                canDelete = false;
        }

        // 如果可以删除，则执行删除操作
        if (canDelete) {
                try {
                        await roleStore.deleteRole(record.id);
                        message.success('删除成功');
                        loadRoles();
                } catch (e) {
                        message.error(e?.message || '删除失败');
                }
        }
}

async function openPermissionDrawer(record) {
        permissionRole.value = record;
        permissionDrawerVisible.value = true;

        // 加载角色权限详情
        try {
                await roleStore.fetchPermissionsDetail(record.id);

                // 加载所有权限组的权限列表，用于判断权限来源
                await loadGroupPermissions();
        } catch (e) {
                message.error(e?.message || '加载权限详情失败');
        }
}

// 加载所有权限组中的权限ID
async function loadGroupPermissions() {
        // 统一处理逻辑，确保只有一个返回点且减少循环嵌套
        const permissionGroups = roleStore.roleDetail?.permissionGroups || [];
        let shouldLoad = permissionGroups.length > 0;

        if (!shouldLoad) {
                permissionIdsFromGroups.value = new Set();
        } else {
                loadingGroupPermissions.value = true;
                const allPermissionIds = new Set();

                try {
                        // 并发获取所有权限组的权限列表
                        const promises = permissionGroups.map(group =>
                            permissionGroupStore.fetchGroupPermissions(group.id).catch(() => [])
                        );
                        const results = await Promise.all(promises);

                        // 使用 flatMap 展平数组并收集所有权限ID
                        const allPermissions = results.flat();
                        allPermissions.forEach(permission => {
                                allPermissionIds.add(permission.id);
                        });

                        permissionIdsFromGroups.value = allPermissionIds;
                } catch (e) {
                        logger.error('加载权限组权限失败:', e);
                        permissionIdsFromGroups.value = new Set();
                } finally {
                        loadingGroupPermissions.value = false;
                }
        }
}

function onPermissionDrawerClose() {
        permissionRole.value = null;
        roleStore.clearRoleDetail();
        permissionIdsFromGroups.value = new Set();
        showAddPermissionModal.value = false;
        showAddGroupModal.value = false;
        selectedPermissionId.value = null;
        selectedGroupId.value = null;
}

async function removePermission(permissionId) {
        // 统一处理逻辑，确保只有一个返回点
        let canRemove = true;
        let errorMessage = '';

        // 检查必要条件
        if (!permissionRole.value) {
                canRemove = false;
                errorMessage = '未找到角色信息';
        } else if (permissionIdsFromGroups.value.has(permissionId)) {
                // 检查权限是否来自权限组
                canRemove = false;
                errorMessage = '该权限来自权限组，请通过移除权限组来移除';
        }

        // 统一处理结果
        if (canRemove) {
                try {
                        await roleStore.removePermissionFromRole(permissionRole.value.id, permissionId);
                        message.success('已移除');
                        await roleStore.fetchPermissionsDetail(permissionRole.value.id);
                        // 重新加载权限组权限列表
                        await loadGroupPermissions();
                } catch (e) {
                        message.error(e?.message || '移除失败');
                }
        } else {
                message.warning(errorMessage);
        }
}

async function removeGroup(groupId) {
        // 统一处理逻辑，确保只有一个返回点
        let canRemove = true;
        let errorMessage = '';

        // 检查必要条件
        if (!permissionRole.value) {
                canRemove = false;
                errorMessage = '未找到角色信息';
        }

        // 统一处理结果
        if (canRemove) {
                try {
                        await roleStore.removePermissionGroupFromRole(permissionRole.value.id, groupId);
                        message.success('已移除');
                        await roleStore.fetchPermissionsDetail(permissionRole.value.id);
                        // 重新加载权限组权限列表
                        await loadGroupPermissions();
                } catch (e) {
                        message.error(e?.message || '移除失败');
                }
        } else {
                message.warning(errorMessage);
        }
}

// 添加权限：拉取权限列表供选择
watch(showAddPermissionModal, (open) => {
        if (open) {
                selectedPermissionId.value = null;
                permissionListLoading.value = true;
                permissionStore.fetchPermissions({currentPage: 1, pageSize: 500}).then(() => {
                        const permissions = permissionStore.currentPermissions || [];
                        permissionOptions.value = permissions;
                }).catch((e) => {
                        logger.error(e);
                        message.error('加载权限列表失败');
                }).finally(() => {
                        permissionListLoading.value = false;
                });
        }
});

// 验证添加权限的参数
function validateAddPermissionParams() {
        // 统一处理逻辑，确保只有一个返回点
        let result = {valid: true, message: '', type: 'error'};

        const hasValidParameters = selectedPermissionId.value && permissionRole.value;
        if (!hasValidParameters) {
                result.valid = false;
                result.message = '请选择要添加的权限';
                result.type = 'warning';
        }

        return result;
}

// 查找选中的权限
function findSelectedPermission() {
        // 统一处理逻辑，确保只有一个返回点
        let result = {valid: true, message: '', permission: null};

        const selectedPermission = permissionOptions.value.find(p => p.id === selectedPermissionId.value);
        const permissionFound = Boolean(selectedPermission);
        if (!permissionFound) {
                result.valid = false;
                result.message = '未找到选中的权限';
        } else {
                result.permission = selectedPermission;
        }

        return result;
}

// 构建权限树和映射
function buildPermissionStructure() {
        // 统一处理逻辑，确保只有一个返回点
        let result = {valid: true, message: '', tree: null, selectedNode: null, codeMap: null};

        const allPermissionsTree = buildPermissionTree(permissionOptions.value);
        const selectedPermissionInTree = findPermissionInTree(allPermissionsTree, selectedPermissionId.value);
        const permissionInTreeFound = Boolean(selectedPermissionInTree);

        if (!permissionInTreeFound) {
                result.valid = false;
                result.message = '未找到权限信息';
        } else {
                const codeMap = permissionOptions.value.reduce((map, p) => {
                        map.set(p.code, p);
                        return map;
                }, new Map());

                result.tree = allPermissionsTree;
                result.selectedNode = selectedPermissionInTree;
                result.codeMap = codeMap;
        }

        return result;
}

// 处理权限添加结果
async function handleAddPermissionResult(validationResult, permissionData) {
        if (validationResult.valid) {
                try {
                        // 检查权限冲突
                        const conflictResult = await checkPermissionConflicts(
                            permissionData.selectedNode,
                            permissionData.tree,
                            permissionData.codeMap
                        );

                        const hasConflict = conflictResult.hasConflict;
                        if (hasConflict) {
                                message.warning(conflictResult.reason);
                        } else {
                                // 执行添加操作
                                addPermissionLoading.value = true;
                                await roleStore.addPermissionToRole(permissionRole.value.id, selectedPermissionId.value);
                                message.success('添加成功');
                                showAddPermissionModal.value = false;
                                selectedPermissionId.value = null;
                                await roleStore.fetchPermissionsDetail(permissionRole.value.id);
                                await loadGroupPermissions();
                        }
                } catch (e) {
                        message.error(e?.message || '添加失败');
                } finally {
                        addPermissionLoading.value = false;
                }
        } else {
                // 显示验证错误信息
                const isWarningType = validationResult.type === 'warning';
                if (isWarningType) {
                        message.warning(validationResult.message);
                } else {
                        message.error(validationResult.message);
                }
        }
}

async function doAddPermission() {
        // 统一处理逻辑，确保只有一个返回点
        let canProceed = true;
        let validationResult = null;
        let permissionData = null;

        // 参数验证
        const paramValidation = validateAddPermissionParams();
        if (!paramValidation.valid) {
                canProceed = false;
                validationResult = paramValidation;
        }

        // 查找选中的权限
        if (canProceed) {
                const permissionResult = findSelectedPermission();
                if (!permissionResult.valid) {
                        canProceed = false;
                        validationResult = permissionResult;
                } else {
                        permissionData = {permission: permissionResult.permission};
                }
        }

        // 构建权限结构
        if (canProceed) {
                const structureResult = buildPermissionStructure();
                if (!structureResult.valid) {
                        canProceed = false;
                        validationResult = structureResult;
                } else {
                        permissionData = {
                                ...permissionData,
                                tree: structureResult.tree,
                                selectedNode: structureResult.selectedNode,
                                codeMap: structureResult.codeMap
                        };
                }
        }

        // 统一处理最终结果
        if (canProceed) {
                await handleAddPermissionResult(
                    {valid: true},
                    permissionData
                );
        } else {
                await handleAddPermissionResult(validationResult, null);
        }
}

// 在树中查找权限
function findPermissionInTree(tree, permissionId) {
        // 统一处理逻辑，确保只有一个返回点
        let result = null;

        for (const node of tree) {
                if (node.id === permissionId) {
                        result = node;
                        break;
                }
                if (node.children && node.children.length > 0) {
                        const found = findPermissionInTree(node.children, permissionId);
                        if (found) {
                                result = found;
                                break;
                        }
                }
        }

        return result;
}

// 检查权限冲突
async function checkPermissionConflicts(selectedPermission, allPermissionsTree, codeMap) {
        // 统一处理逻辑
        let result;

        const currentPermissions = roleStore.roleDetail?.permissions || [];
        const groupPermissionsFlat = [];

        // 如果有权限组，获取所有权限组的权限
        if (roleStore.roleDetail?.permissionGroups?.length) {
                try {
                        // 并发获取所有权限组的权限
                        const groupPromises = roleStore.roleDetail.permissionGroups.map(group =>
                            permissionGroupStore.fetchGroupPermissions(group.id)
                        );
                        const allGroupPermissions = await Promise.all(groupPromises);

                        const flattenedGroupPermissions = allGroupPermissions.flat();
                        const existingPermissionIds = new Set();

                        // 单次遍历处理：同时收集基础权限和展开子权限
                        for (const perm of flattenedGroupPermissions) {
                                // 避免重复处理
                                if (existingPermissionIds.has(perm.id)) continue;

                                // 添加基础权限
                                groupPermissionsFlat.push(perm);
                                existingPermissionIds.add(perm.id);

                                // 如果是父权限，立即展开所有子权限
                                const permInTree = findPermissionInTree(allPermissionsTree, perm.id);
                                if (permInTree && hasChildren(permInTree)) {
                                        const allChildren = flattenPermissionTree([permInTree]);
                                        for (const child of allChildren) {
                                                if (child.id !== perm.id && !existingPermissionIds.has(child.id)) {
                                                        groupPermissionsFlat.push(child);
                                                        existingPermissionIds.add(child.id);
                                                }
                                        }
                                }
                        }
                } catch (e) {
                        logger.error('获取权限组权限失败:', e);
                        // 发生错误时不阻止操作，保持默认的 result 值
                }
        }

        // 合并所有已存在的权限
        const allExistingPermissions = [...currentPermissions, ...groupPermissionsFlat];

        // 检查冲突
        const conflict = checkPermissionConflict(selectedPermission, allExistingPermissions, codeMap);
        result = {
                hasConflict: conflict.conflict,
                reason: conflict.reason
        };

        return result;
}

watch(showAddGroupModal, (open) => {
        if (open) {
                selectedGroupId.value = null;
                groupListLoading.value = true;
                permissionGroupStore.fetchPermissionGroups({currentPage: 1, pageSize: 200}).then(() => {
                        groupOptions.value = permissionGroupStore.currentPermissionGroups || [];
                }).catch((e) => {
                        logger.error(e);
                        message.error('加载权限组列表失败');
                }).finally(() => {
                        groupListLoading.value = false;
                });
        }
});

function filterGroupOption(input, option) {
        const name = option?.name ?? option?.label ?? '';
        return name.toLowerCase().includes((input || '').toLowerCase());
}

// 验证添加权限组的参数
function validateAddGroupParams() {
        // 统一处理逻辑，确保只有一个返回点
        let result = {valid: true, message: ''};

        const hasValidParams = selectedGroupId.value && permissionRole.value;
        if (!hasValidParams) {
                result.valid = false;
                result.message = '请选择要添加的权限组';
        }

        return result;
}

// 展开权限组权限
function expandGroupPermissions(groupPermissions, allPermissionsTree) {
        // 统一处理逻辑，确保只有一个返回点
        let result = {permissions: [], ids: new Set()};

        const expandedPermissions = [];
        const existingIds = new Set();

        // 单次遍历处理：同时收集基础权限和展开子权限
        for (const perm of groupPermissions) {
                const shouldProcess = !existingIds.has(perm.id);
                if (shouldProcess) {
                        // 添加基础权限
                        expandedPermissions.push(perm);
                        existingIds.add(perm.id);

                        // 如果是父权限，立即展开所有子权限
                        const permInTree = findPermissionInTree(allPermissionsTree, perm.id);
                        const isParentPermission = permInTree && hasChildren(permInTree);
                        if (isParentPermission) {
                                const allChildren = flattenPermissionTree([permInTree]);
                                for (const child of allChildren) {
                                        const isDifferentChild = child.id !== perm.id;
                                        const isNewChild = !existingIds.has(child.id);
                                        if (isDifferentChild && isNewChild) {
                                                expandedPermissions.push(child);
                                                existingIds.add(child.id);
                                        }
                                }
                        }
                }
        }

        result.permissions = expandedPermissions;
        result.ids = existingIds;
        return result;
}

// 检查权限冲突
function checkGroupPermissionConflicts(groupPermissionsFlat, directPermissions) {
        // 统一处理逻辑，确保只有一个返回点
        let result = {hasConflict: false, conflicts: []};

        const groupPermissionCodes = new Set(groupPermissionsFlat.map(p => p.code));
        const directPermissionCodes = new Set(directPermissions.map(p => p.code));

        const conflicts = [];
        for (const code of groupPermissionCodes) {
                const hasConflict = directPermissionCodes.has(code);
                if (hasConflict) {
                        conflicts.push(code);
                }
        }

        result.hasConflict = conflicts.length > 0;
        result.conflicts = conflicts;
        return result;
}

// 执行添加权限组操作
async function executeAddGroup() {
        addGroupLoading.value = true;
        try {
                await roleStore.addPermissionGroupToRole(permissionRole.value.id, selectedGroupId.value);
                message.success('添加成功');
                showAddGroupModal.value = false;
                selectedGroupId.value = null;
                await roleStore.fetchPermissionsDetail(permissionRole.value.id);
                await loadGroupPermissions();
        } catch (e) {
                message.error(e?.message || '添加失败');
        } finally {
                addGroupLoading.value = false;
        }
}

async function doAddGroup() {
        // 统一处理逻辑，确保只有一个返回点
        let canProceed = true;
        let errorMessage = '';

        // 参数验证
        const paramValidation = validateAddGroupParams();
        if (!paramValidation.valid) {
                canProceed = false;
                errorMessage = paramValidation.message;
        }

        // 权限冲突检查
        let groupPermissionsFlat = [];
        let directPermissions = [];

        if (canProceed) {
                try {
                        // 获取权限组权限
                        const groupPermissions = await permissionGroupStore.fetchGroupPermissions(selectedGroupId.value);

                        // 获取所有权限构建树形结构
                        await permissionStore.fetchPermissions({currentPage: 1, pageSize: 500});
                        const allPermissions = permissionStore.currentPermissions || [];
                        const allPermissionsTree = buildPermissionTree(allPermissions);

                        // 展开权限组权限
                        const expansionResult = expandGroupPermissions(groupPermissions, allPermissionsTree);
                        groupPermissionsFlat = expansionResult.permissions;

                        // 获取角色直接权限
                        directPermissions = roleStore.roleDetail?.permissions || [];

                        // 检查冲突
                        const conflictCheck = checkGroupPermissionConflicts(groupPermissionsFlat, directPermissions);
                        if (conflictCheck.hasConflict) {
                                canProceed = false;
                                errorMessage = `权限冲突：权限组中的权限 "${conflictCheck.conflicts.join('", "')}" 与角色直接添加的权限重复，不能同时关联`;
                        }
                } catch (e) {
                        logger.error('检查权限冲突失败:', e);
                        canProceed = false;
                        errorMessage = '检查权限冲突失败，请稍后重试';
                }
        }

        // 统一处理结果
        if (canProceed) {
                await executeAddGroup();
        } else {
                message.warning(errorMessage);
        }
}

// 初始加载
loadRoles();

onMounted(() => {
        window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
        window.removeEventListener('resize', handleResize);
});
</script>
