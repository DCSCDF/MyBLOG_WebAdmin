<!--
  - [RoleManagement.vue]
  - 角色管理页面：分页列表、详情、编辑、删除、管理权限（权限/权限组关联）
  - 对应后端接口：/api/role/*
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
                                        <a-tag :color="record.superAdmin ? 'red' : 'default'">
                                                {{ record.superAdmin ? '是' : '否' }}
                                        </a-tag>
                                </template>
                                <template v-else-if="column.key === 'isSystem'">
                                        <a-tag :color="record.isSystem ? 'blue' : 'default'">
                                                {{ record.isSystem ? '系统内置' : '自定义' }}
                                        </a-tag>
                                </template>
                                <template v-else-if="column.key === 'status'">
                                        <a-tag :color="record.status === 1 ? 'green' : 'red'">
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
            :width="420"
            title="角色详情"
            @close="selectedRole = null">
                <template v-if="selectedRole">
                        <a-descriptions :column="1" bordered size="small">
                                <a-descriptions-item label="编码">{{ selectedRole.code }}</a-descriptions-item>
                                <a-descriptions-item label="名称">{{ selectedRole.name }}</a-descriptions-item>
                                <a-descriptions-item label="描述">{{ selectedRole.description || '-' }}
                                </a-descriptions-item>
                                <a-descriptions-item label="超级管理员">
                                        {{ selectedRole.superAdmin ? '是' : '否' }}
                                </a-descriptions-item>
                                <a-descriptions-item label="系统内置">{{ selectedRole.isSystem ? '是' : '否' }}
                                </a-descriptions-item>
                                <a-descriptions-item label="排序">{{ selectedRole.sortOrder }}
                                </a-descriptions-item>
                                <a-descriptions-item label="状态">
                                        {{ selectedRole.status === 1 ? '启用' : '禁用' }}
                                </a-descriptions-item>
                                <a-descriptions-item label="创建时间">{{ formatDate(selectedRole.createTime) }}
                                </a-descriptions-item>
                                <a-descriptions-item label="更新时间">{{ formatDate(selectedRole.updateTime) }}
                                </a-descriptions-item>
                        </a-descriptions>
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
            :width="560"
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
                                                <a-space>
                                                        <a-select
                                                            v-model:value="permissionViewMode"
                                                            size="small"
                                                            style="width: 100px">
                                                                <a-select-option value="tree">树形视图</a-select-option>
                                                                <a-select-option value="list">列表视图</a-select-option>
                                                        </a-select>
                                                        <a-button
                                                            v-if="permissionRole && !permissionRole.isSystem"
                                                            size="small"
                                                            type="primary"
                                                            @click="showAddPermissionModal = true">添加权限
                                                        </a-button>
                                                </a-space>
                                        </div>

                                        <!-- 树形展示 -->
                                        <div v-if="permissionViewMode === 'tree'">
                                                <a-tree
                                                    :default-expand-all="true"
                                                    :field-names="{ children: 'children', title: 'name', key: 'id' }"
                                                    :show-line="{ showLeafIcon: false }"
                                                    :tree-data="rolePermissionTreeData"
                                                    block-node>
                                                        <template #title="{ name, code, fromGroup, id }">
                                                                <div
                                                                    class="flex items-center justify-between w-full pr-4">
                                                                        <div class="flex flex-col flex-1">
                                                                                <div
                                                                                    class="flex items-center gap-2">
                                                                                                <span
                                                                                                    class="font-medium">{{
                                                                                                                name
                                                                                                        }}</span>
                                                                                        <a-tag
                                                                                            :color="fromGroup ? 'blue' : 'green'"
                                                                                            size="small">
                                                                                                {{
                                                                                                        fromGroup ? '来自权限组' : '直接添加'
                                                                                                }}
                                                                                        </a-tag>
                                                                                </div>
                                                                                <span
                                                                                    class="text-xs text-gray-500">{{
                                                                                                code
                                                                                        }}</span>
                                                                        </div>
                                                                        <a-popconfirm
                                                                            v-if="!fromGroup"
                                                                            title="确定移除此权限？"
                                                                            @confirm.stop="removePermission(id)">
                                                                                <a-button danger
                                                                                          size="small"
                                                                                          type="link">移除
                                                                                </a-button>
                                                                        </a-popconfirm>
                                                                        <span v-else
                                                                              class="text-gray-400 text-xs">需移除权限组</span>
                                                                </div>
                                                        </template>
                                                </a-tree>
                                                <div v-if="!rolePermissionTreeData.length"
                                                     class="text-gray-400 text-sm py-2">暂无
                                                </div>
                                        </div>

                                        <!-- 列表展示 -->
                                        <a-table
                                            v-else
                                            :columns="permissionColumns"
                                            :data-source="permissionsWithSource"
                                            :loading="roleStore.permissionsDetailLoading"
                                            :pagination="false"
                                            row-key="id"
                                            size="small">
                                                <template #bodyCell="{ column, record }">
                                                        <template v-if="column.key === 'source'">
                                                                <a-tag
                                                                    :color="record.fromGroup ? 'blue' : 'green'">
                                                                        {{
                                                                                record.fromGroup ? '来自权限组' : '直接添加'
                                                                        }}
                                                                </a-tag>
                                                        </template>
                                                        <template v-else-if="column.key === 'action'">
                                                                <a-popconfirm
                                                                    v-if="!record.fromGroup"
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
                                        <div
                                            v-if="permissionViewMode === 'list' && !permissionsWithSource.length"
                                            class="text-gray-400 text-sm py-2">暂无
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
                                        <a-table
                                            :columns="groupColumns"
                                            :data-source="roleStore.roleDetail?.permissionGroups || []"
                                            :pagination="false"
                                            row-key="id"
                                            size="small">
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
                                        <div v-if="!(roleStore.roleDetail?.permissionGroups?.length)"
                                             class="text-gray-400 text-sm py-2">暂无
                                        </div>
                                </div>
                        </template>
                </template>
        </a-drawer>

        <!-- 添加权限弹窗 -->
        <a-modal
            v-model:open="showAddPermissionModal"
            :confirm-loading="addPermissionLoading"
            ok-text="添加"
            title="添加权限"
            @cancel="selectedPermissionId = null"
            @ok="doAddPermission">
                <a-tree-select
                    v-model:value="selectedPermissionId"
                    :field-names="{ children: 'children', label: 'name', value: 'id' }"
                    :filter-tree-node="filterPermissionTreeNode"
                    :loading="permissionListLoading"
                    :show-search="true"
                    :tree-checkable="false"
                    :tree-data="permissionTreeOptions"
                    :tree-node-filter-prop="'name'"
                    placeholder="请选择要添加的权限"
                    style="width: 100%;"
                    tree-default-expand-all
                    @select="onPermissionSelect"/>
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
import {computed, ref, watch} from 'vue';
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
import {InfoCircleOutlined} from "@ant-design/icons-vue";

const roleStore = useRoleStore();
const permissionStore = usePermissionStore();
const permissionGroupStore = usePermissionGroupStore();

// 表格分页配置（与后端 current/size 对应）
const tablePagination = computed(() => ({
        current: roleStore.pagination.current,
        pageSize: roleStore.pagination.pageSize,
        total: roleStore.pagination.total,
        showSizeChanger: true,
        showTotal: (total) => `共 ${total} 条`
}));

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
const permissionViewMode = ref('tree'); // 'tree' 或 'list'

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

// 计算角色权限树形数据
const rolePermissionTreeData = computed(() => {
        if (permissionViewMode.value === 'tree') {
                return buildPermissionTree(permissionsWithSource.value);
        }
        return [];
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
// 验证角色编码格式：2-50字符，只能包含大写字母和下划线
const validateRoleCode = (rule, value) => {
        if (!value || !value.trim()) {
                return Promise.reject('请输入角色编码');
        }
        const trimmedValue = value.trim();
        if (trimmedValue.length < 2 || trimmedValue.length > 50) {
                return Promise.reject('角色编码长度必须在 2-50 个字符之间');
        }
        if (!/^[A-Z_]+$/.test(trimmedValue)) {
                return Promise.reject('角色编码只能包含大写字母和下划线');
        }
        return Promise.resolve();
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
const permissionTreeOptions = ref([]);
const groupOptions = ref([]);

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

function loadRoles() {
        roleStore.fetchRoles({
                currentPage: roleStore.pagination.current,
                pageSize: roleStore.pagination.pageSize
        }).catch((e) => {
                message.error(e?.message || '加载角色列表失败');
        });
}

function onTableChange(pagination) {
        roleStore.updatePagination({
                current: pagination.current,
                pageSize: pagination.pageSize
        });
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

async function submitCreate() {
        // 验证角色编码
        if (!createForm.value?.code || !createForm.value.code.trim()) {
                message.warning('请填写角色编码');
                return;
        }
        const codeValue = createForm.value.code.trim().toUpperCase();
        if (codeValue.length < 2 || codeValue.length > 50) {
                message.warning('角色编码长度必须在 2-50 个字符之间');
                return;
        }
        if (!/^[A-Z_]+$/.test(codeValue)) {
                message.warning('角色编码只能包含大写字母和下划线');
                return;
        }

        // 验证角色名称
        if (!createForm.value?.name || !createForm.value.name.trim()) {
                message.warning('请填写角色名称');
                return;
        }
        // 名称长度限制：最大 50 字符
        if (createForm.value.name.length > 50) {
                message.warning('角色名称不能超过 50 个字符');
                return;
        }
        // 描述长度限制：最大 200 字符
        if (createForm.value.description && createForm.value.description.length > 200) {
                message.warning('角色描述不能超过 200 个字符');
                return;
        }
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

function openDetail(record) {
        selectedRole.value = record;
        detailVisible.value = true;
}

async function openEdit(record) {
        // 系统内置角色不可编辑（双重保护，UI 已经隐藏按钮）
        if (record.isSystem) {
                message.warning('系统内置角色不可修改');
                return;
        }

        // 检查权限冲突：权限组中的权限（如果是父权限，要包含所有子权限）与权限列表不能重复
        try {
                await roleStore.fetchPermissionsDetail(record.id);
                const roleDetail = roleStore.roleDetail;

                if (roleDetail) {
                        // 获取权限组中的所有权限（如果是父权限，要包含所有子权限）
                        const groupPermissionsFlat = [];
                        if (roleDetail.permissionGroups && roleDetail.permissionGroups.length > 0) {
                                // 构建所有权限的 code 映射
                                const allPermissions = await permissionStore.fetchPermissions({
                                        currentPage: 1,
                                        pageSize: 500
                                });
                                const codeMap = new Map();
                                allPermissions.forEach(p => {
                                        codeMap.set(p.code, p);
                                });

                                // 获取每个权限组的权限，并展开父权限的所有子权限
                                for (const group of roleDetail.permissionGroups) {
                                        try {
                                                const groupPerms = await permissionGroupStore.fetchGroupPermissions(group.id);
                                                // 对于每个权限，如果是父权限，需要包含所有子权限
                                                for (const perm of groupPerms) {
                                                        groupPermissionsFlat.push(perm);
                                                        // 检查是否是父权限，如果是，添加所有子权限
                                                        const permInTree = findPermissionInTree(buildPermissionTree(allPermissions), perm.id);
                                                        if (permInTree && hasChildren(permInTree)) {
                                                                const allChildren = flattenPermissionTree([permInTree]);
                                                                allChildren.forEach(child => {
                                                                        if (child.id !== perm.id && !groupPermissionsFlat.find(p => p.id === child.id)) {
                                                                                groupPermissionsFlat.push(child);
                                                                        }
                                                                });
                                                        }
                                                }
                                        } catch (e) {
                                                logger.error('获取权限组权限失败:', e);
                                        }
                                }
                        }

                        // 获取角色直接添加的权限
                        const directPermissions = roleDetail.permissions || [];

                        // 检查是否有重复
                        const groupPermissionCodes = new Set(groupPermissionsFlat.map(p => p.code));
                        const directPermissionCodes = new Set(directPermissions.map(p => p.code));

                        const conflicts = [];
                        for (const code of groupPermissionCodes) {
                                if (directPermissionCodes.has(code)) {
                                        conflicts.push(code);
                                }
                        }

                        if (conflicts.length > 0) {
                                message.warning(`权限冲突：权限组中的权限 "${conflicts.join('", "')}" 与角色直接添加的权限重复，请先移除冲突的权限后再编辑角色`);
                                return;
                        }
                }
        } catch (e) {
                logger.error('检查权限冲突失败:', e);
                // 如果检查失败，仍然允许编辑，但记录错误
        }

        editForm.value = {
                id: record.id,
                name: record.name,
                description: record.description ?? '',
                sortOrder: record.sortOrder ?? 0,
                status: record.status ?? 1
        };
        editVisible.value = true;
}

async function submitEdit() {
        if (!editForm.value?.name || !editForm.value.name.trim()) {
                message.warning('请填写角色名称');
                return;
        }
        // 名称长度限制：最大 50 字符
        if (editForm.value.name.length > 50) {
                message.warning('角色名称不能超过 50 个字符');
                return;
        }
        // 描述长度限制：最大 200 字符
        if (editForm.value.description && editForm.value.description.length > 200) {
                message.warning('角色描述不能超过 200 个字符');
                return;
        }
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
}

async function onDelete(record) {
        // 系统内置角色不可删除（双重保护，UI 已经隐藏按钮）
        if (record.isSystem) {
                message.warning('系统内置角色不可删除');
                return;
        }
        try {
                await roleStore.deleteRole(record.id);
                message.success('删除成功');
                loadRoles();
        } catch (e) {
                message.error(e?.message || '删除失败');
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
        const permissionGroups = roleStore.roleDetail?.permissionGroups || [];
        if (permissionGroups.length === 0) {
                permissionIdsFromGroups.value = new Set();
                return;
        }

        loadingGroupPermissions.value = true;
        const allPermissionIds = new Set();

        try {
                // 并发获取所有权限组的权限列表
                const promises = permissionGroups.map(group =>
                    permissionGroupStore.fetchGroupPermissions(group.id).catch(() => [])
                );
                const results = await Promise.all(promises);

                // 收集所有权限ID
                results.forEach(permissions => {
                        permissions.forEach(permission => {
                                allPermissionIds.add(permission.id);
                        });
                });

                permissionIdsFromGroups.value = allPermissionIds;
        } catch (e) {
                logger.error('加载权限组权限失败:', e);
                permissionIdsFromGroups.value = new Set();
        } finally {
                loadingGroupPermissions.value = false;
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
        if (!permissionRole.value) return;

        // 检查权限是否来自权限组
        if (permissionIdsFromGroups.value.has(permissionId)) {
                message.warning('该权限来自权限组，请通过移除权限组来移除');
                return;
        }

        try {
                await roleStore.removePermissionFromRole(permissionRole.value.id, permissionId);
                message.success('已移除');
                await roleStore.fetchPermissionsDetail(permissionRole.value.id);
                // 重新加载权限组权限列表
                await loadGroupPermissions();
        } catch (e) {
                message.error(e?.message || '移除失败');
        }
}

async function removeGroup(groupId) {
        if (!permissionRole.value) return;
        try {
                await roleStore.removePermissionGroupFromRole(permissionRole.value.id, groupId);
                message.success('已移除');
                await roleStore.fetchPermissionsDetail(permissionRole.value.id);
                // 重新加载权限组权限列表
                await loadGroupPermissions();
        } catch (e) {
                message.error(e?.message || '移除失败');
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
                        // 构建树形结构
                        permissionTreeOptions.value = buildPermissionTree(permissions);
                }).catch((e) => {
                        logger.error(e);
                        message.error('加载权限列表失败');
                }).finally(() => {
                        permissionListLoading.value = false;
                });
        }
});

// 树形选择器过滤函数
function filterPermissionTreeNode(inputValue, node) {
        const name = node.name || '';
        return name.toLowerCase().includes((inputValue || '').toLowerCase());
}

// 处理权限选择
function onPermissionSelect(value, node) {
        selectedPermissionId.value = value;
}

async function doAddPermission() {
        if (!selectedPermissionId.value || !permissionRole.value) {
                message.warning('请选择要添加的权限');
                return;
        }

        // 查找选中的权限对象
        const selectedPermission = permissionOptions.value.find(p => p.id === selectedPermissionId.value);
        if (!selectedPermission) {
                message.error('未找到选中的权限');
                return;
        }

        // 构建 code 映射
        const codeMap = new Map();
        permissionOptions.value.forEach(p => {
                codeMap.set(p.code, p);
        });

        // 获取当前角色的所有权限（包括权限组中的权限）
        const currentPermissions = roleStore.roleDetail?.permissions || [];

        // 构建权限树以检查父子关系
        const allPermissionsTree = buildPermissionTree(permissionOptions.value);
        const selectedPermissionInTree = findPermissionInTree(allPermissionsTree, selectedPermissionId.value);

        if (!selectedPermissionInTree) {
                message.error('未找到权限信息');
                return;
        }

        // 获取权限组中的所有权限（如果是父权限，要包含所有子权限）
        const groupPermissionsFlat = [];
        if (roleStore.roleDetail?.permissionGroups) {
                for (const group of roleStore.roleDetail.permissionGroups) {
                        try {
                                const groupPerms = await permissionGroupStore.fetchGroupPermissions(group.id);
                                // 对于每个权限，如果是父权限，需要包含所有子权限
                                for (const perm of groupPerms) {
                                        groupPermissionsFlat.push(perm);
                                        // 检查是否是父权限，如果是，添加所有子权限
                                        const permInTree = findPermissionInTree(allPermissionsTree, perm.id);
                                        if (permInTree && hasChildren(permInTree)) {
                                                const allChildren = flattenPermissionTree([permInTree]);
                                                allChildren.forEach(child => {
                                                        if (child.id !== perm.id && !groupPermissionsFlat.find(p => p.id === child.id)) {
                                                                groupPermissionsFlat.push(child);
                                                        }
                                                });
                                        }
                                }
                        } catch (e) {
                                logger.error('获取权限组权限失败:', e);
                        }
                }
        }

        // 合并所有已存在的权限（角色直接添加的 + 权限组中的）
        const allExistingPermissions = [...currentPermissions, ...groupPermissionsFlat];

        // 检查冲突
        const conflict = checkPermissionConflict(selectedPermissionInTree, allExistingPermissions, codeMap);
        if (conflict.conflict) {
                message.warning(conflict.reason);
                return;
        }

        addPermissionLoading.value = true;
        try {
                await roleStore.addPermissionToRole(permissionRole.value.id, selectedPermissionId.value);
                message.success('添加成功');
                showAddPermissionModal.value = false;
                selectedPermissionId.value = null;
                await roleStore.fetchPermissionsDetail(permissionRole.value.id);
                // 重新加载权限组权限列表
                await loadGroupPermissions();
        } catch (e) {
                message.error(e?.message || '添加失败');
        } finally {
                addPermissionLoading.value = false;
        }
}

// 在树中查找权限
function findPermissionInTree(tree, permissionId) {
        for (const node of tree) {
                if (node.id === permissionId) {
                        return node;
                }
                if (node.children && node.children.length > 0) {
                        const found = findPermissionInTree(node.children, permissionId);
                        if (found) return found;
                }
        }
        return null;
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

async function doAddGroup() {
        if (!selectedGroupId.value || !permissionRole.value) {
                message.warning('请选择要添加的权限组');
                return;
        }

        // 检查权限冲突：权限组中的权限（如果是父权限，要包含所有子权限）与权限列表不能重复
        try {
                // 获取要添加的权限组的所有权限
                const groupPermissions = await permissionGroupStore.fetchGroupPermissions(selectedGroupId.value);

                // 获取所有权限列表以构建树形结构
                await permissionStore.fetchPermissions({currentPage: 1, pageSize: 500});
                const allPermissions = permissionStore.currentPermissions || [];
                const allPermissionsTree = buildPermissionTree(allPermissions);

                // 展开权限组中的权限（如果是父权限，要包含所有子权限）
                const groupPermissionsFlat = [];
                for (const perm of groupPermissions) {
                        groupPermissionsFlat.push(perm);
                        // 检查是否是父权限，如果是，添加所有子权限
                        const permInTree = findPermissionInTree(allPermissionsTree, perm.id);
                        if (permInTree && hasChildren(permInTree)) {
                                const allChildren = flattenPermissionTree([permInTree]);
                                allChildren.forEach(child => {
                                        if (child.id !== perm.id && !groupPermissionsFlat.find(p => p.id === child.id)) {
                                                groupPermissionsFlat.push(child);
                                        }
                                });
                        }
                }

                // 获取角色直接添加的权限
                const directPermissions = roleStore.roleDetail?.permissions || [];

                // 检查是否有重复
                const groupPermissionCodes = new Set(groupPermissionsFlat.map(p => p.code));
                const directPermissionCodes = new Set(directPermissions.map(p => p.code));

                const conflicts = [];
                for (const code of groupPermissionCodes) {
                        if (directPermissionCodes.has(code)) {
                                conflicts.push(code);
                        }
                }

                if (conflicts.length > 0) {
                        message.warning(`权限冲突：权限组中的权限 "${conflicts.join('", "')}" 与角色直接添加的权限重复，不能同时关联`);
                        return;
                }
        } catch (e) {
                logger.error('检查权限冲突失败:', e);
                message.error('检查权限冲突失败，请稍后重试');
                return;
        }

        addGroupLoading.value = true;
        try {
                await roleStore.addPermissionGroupToRole(permissionRole.value.id, selectedGroupId.value);
                message.success('添加成功');
                showAddGroupModal.value = false;
                selectedGroupId.value = null;
                await roleStore.fetchPermissionsDetail(permissionRole.value.id);
                // 重新加载权限组权限列表
                await loadGroupPermissions();
        } catch (e) {
                message.error(e?.message || '添加失败');
        } finally {
                addGroupLoading.value = false;
        }
}

// 初始加载
loadRoles();
</script>
