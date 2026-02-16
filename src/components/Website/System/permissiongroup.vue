<!--
  - [permissiongroup.vue]
  - 权限组管理：分页列表、查看详情、编辑、删除（仅非系统内置）、管理关联权限
  - 对接 API：/api/permission-group/*
  -->

<template>
	<a-card>
		<div class="mb-4 flex items-center justify-between">
			<div>
				<h2 class="font-bold text-lg mb-1">权限组管理</h2>
				<span class="text-sm text-gray-600">系统内置权限组仅支持查看，不可修改、删除。</span>
			</div>
			<a-button type="primary" @click="openCreate">新建权限组</a-button>
		</div>

		<a-table
			:columns="columns"
			:data-source="tableData"
			:loading="loading"
			:pagination="paginationConfig"
			:scroll="{ x: 900 }"
			table-layout="fixed"
			row-key="id"
			@change="handleTableChange">
			<template #bodyCell="{ column, record }">
				<template v-if="column.key === 'operation'">
					<a-space>
						<a-button size="small" type="link" @click="viewDetail(record)">查看</a-button>
						<a-button v-if="!record.isSystem" size="small" type="link" @click="openEdit(record)">编辑</a-button>
						<a-popconfirm
							v-if="!record.isSystem"
							title="确定删除该权限组吗？将级联删除权限-权限组、角色-权限组关联。"
							ok-text="确定"
							cancel-text="取消"
							@confirm="onDelete(record)">
							<a-button size="small" type="link" danger>删除</a-button>
						</a-popconfirm>
						<a-button size="small" type="link" @click="openPermissionDrawer(record)">关联权限</a-button>
					</a-space>
				</template>
				<template v-else-if="column.key === 'status'">
					<a-tag :color="record.status === '启用' ? 'green' : 'red'">
						{{ record.status }}
					</a-tag>
				</template>
				<template v-else-if="column.key === 'isSystem'">
					<a-tag :color="record.isSystem ? 'blue' : 'default'">
						{{ record.isSystem ? '系统内置' : '自定义' }}
					</a-tag>
				</template>
			</template>
		</a-table>

		<!-- 查看权限组详情抽屉 -->
		<a-drawer
			v-model:open="viewDrawerVisible"
			title="权限组详情"
			:width="420"
			:destroy-on-close="true"
			@close="currentPermissionGroup = null">
			<template v-if="currentPermissionGroup">
				<a-descriptions :column="1" bordered size="small">
					<a-descriptions-item label="排序顺序">{{ currentPermissionGroup.order }}</a-descriptions-item>
					<a-descriptions-item label="权限组名称">{{ currentPermissionGroup.name }}</a-descriptions-item>
					<a-descriptions-item label="描述">{{ currentPermissionGroup.description || '-' }}</a-descriptions-item>
					<a-descriptions-item label="状态">
						<a-tag :color="currentPermissionGroup.status === '启用' ? 'green' : 'red'">
							{{ currentPermissionGroup.status }}
						</a-tag>
					</a-descriptions-item>
					<a-descriptions-item label="系统内置">{{ currentPermissionGroup.isSystem ? '是' : '否' }}</a-descriptions-item>
					<a-descriptions-item label="创建时间">{{ formatDate(currentPermissionGroup.createTime) }}</a-descriptions-item>
					<a-descriptions-item label="更新时间">{{ formatDate(currentPermissionGroup.updateTime) }}</a-descriptions-item>
				</a-descriptions>
			</template>
		</a-drawer>

		<!-- 新建权限组弹窗 -->
		<a-modal
			v-model:open="createVisible"
			title="新建权限组"
			ok-text="创建"
			cancel-text="取消"
			:confirm-loading="createSubmitting"
			@ok="submitCreate"
			@cancel="createForm = null">
			<a-form v-if="createForm" :model="createForm" layout="vertical" :rules="createRules">
				<a-form-item label="权限组名称" name="name" required>
					<a-input v-model:value="createForm.name" placeholder="权限组名称，最大 50 字符" :maxlength="50" show-count />
				</a-form-item>
				<a-form-item label="描述" name="description">
					<a-textarea v-model:value="createForm.description" placeholder="权限组描述，最大 200 字符（可选）" :maxlength="200" :rows="3" show-count />
				</a-form-item>
				<a-form-item label="排序" name="sortOrder">
					<a-input-number v-model:value="createForm.sortOrder" :min="0" placeholder="数字越大越靠前" style="width: 100%;" />
				</a-form-item>
				<a-form-item label="状态" name="status">
					<a-radio-group v-model:value="createForm.status">
						<a-radio :value="1">启用</a-radio>
						<a-radio :value="0">禁用</a-radio>
					</a-radio-group>
				</a-form-item>
			</a-form>
		</a-modal>

		<!-- 编辑权限组弹窗 -->
		<a-modal
			v-model:open="editVisible"
			title="编辑权限组"
			ok-text="保存"
			cancel-text="取消"
			:confirm-loading="editSubmitting"
			@ok="submitEdit"
			@cancel="editForm = null">
			<a-form v-if="editForm" :model="editForm" layout="vertical" :rules="editRules">
				<a-form-item label="权限组名称" name="name" required>
					<a-input v-model:value="editForm.name" placeholder="权限组名称，最大 50 字符" :maxlength="50" show-count />
				</a-form-item>
				<a-form-item label="描述" name="description">
					<a-textarea v-model:value="editForm.description" placeholder="权限组描述，最大 200 字符（可选）" :maxlength="200" :rows="3" show-count />
				</a-form-item>
				<a-form-item label="排序" name="sortOrder">
					<a-input-number v-model:value="editForm.sortOrder" :min="0" placeholder="数字越大越靠前" style="width: 100%;" />
				</a-form-item>
				<a-form-item label="状态" name="status">
					<a-radio-group v-model:value="editForm.status">
						<a-radio :value="1">启用</a-radio>
						<a-radio :value="0">禁用</a-radio>
					</a-radio-group>
				</a-form-item>
			</a-form>
		</a-modal>

		<!-- 关联权限抽屉 -->
		<a-drawer
			v-model:open="permissionDrawerVisible"
			title="权限组关联权限"
			:width="520"
			:destroy-on-close="true"
			:footer-style="{ textAlign: 'right' }"
			@close="onPermissionDrawerClose">
			<template v-if="selectedGroup">
				<div class="mb-4 text-gray-600 text-sm">{{ selectedGroup.name }}</div>
				<div class="flex items-center justify-between mb-2">
					<span class="font-medium">已关联权限</span>
					<a-button v-if="!selectedGroup.isSystem" type="primary" size="small" @click="showAddPermission = true">添加权限</a-button>
				</div>
				<a-table
					:columns="permissionTableColumns"
					:data-source="permissionGroupStore.currentGroupPermissions"
					:loading="permissionGroupStore.groupPermissionsLoading"
					:pagination="false"
					size="small"
					row-key="id">
					<template #bodyCell="{ column, record }">
						<template v-if="column.key === 'action'">
							<a-popconfirm title="确定移除此权限？" @confirm="removePermission(record.id)">
								<a-button type="link" size="small" danger>移除</a-button>
							</a-popconfirm>
						</template>
					</template>
				</a-table>
				<div v-if="!permissionGroupStore.currentGroupPermissions.length && !permissionGroupStore.groupPermissionsLoading" class="text-gray-400 text-sm py-2">暂无</div>
			</template>
		</a-drawer>

		<!-- 添加权限弹窗 -->
		<a-modal
			v-model:open="showAddPermission"
			title="添加权限"
			ok-text="添加"
			:confirm-loading="addPermissionLoading"
			@ok="doAddPermission"
			@cancel="selectedPermissionId = null">
			<a-select
				v-model:value="selectedPermissionId"
				placeholder="请选择要添加的权限"
				style="width: 100%;"
				:loading="permissionOptionsLoading"
				show-search
				:filter-option="filterPermissionOption"
				:options="permissionOptions"
				:field-names="{ label: 'name', value: 'id' }" />
		</a-modal>
	</a-card>
</template>

<script setup>
import { computed, ref, watch, onMounted } from 'vue';
import { message } from 'ant-design-vue';
import { usePermissionGroupStore } from '../../../stores/permissiongroup.js';
import { usePermissionStore } from '../../../stores/permission.js';
import logger from '../../../utils/logger.js';

const permissionGroupStore = usePermissionGroupStore();
const permissionStore = usePermissionStore();

const tableData = computed(() => permissionGroupStore.currentPermissionGroups);
const loading = computed(() => permissionGroupStore.loading);
const paginationConfig = computed(() => ({
	current: permissionGroupStore.pagination.current,
	pageSize: permissionGroupStore.pagination.pageSize,
	total: permissionGroupStore.pagination.total,
	showSizeChanger: true,
	showTotal: (total) => `共 ${total} 条`
}));

const columns = [
	{ title: '排序顺序', dataIndex: 'order', key: 'order', width: 100 },
	{ title: '权限组名称', dataIndex: 'name', key: 'name', width: 160 },
	{ title: '权限组描述', dataIndex: 'description', key: 'description', width: 220, ellipsis: true },
	{ title: '状态', dataIndex: 'status', key: 'status', width: 90 },
	{ title: '系统内置', dataIndex: 'isSystem', key: 'isSystem', width: 100 },
	{ title: '操作', key: 'operation', fixed: 'right', width: 260 }
];

// 关联权限表格列（非系统内置显示操作列）
const permissionTableColumns = computed(() => {
	const cols = [
		{ title: '权限编码', dataIndex: 'code', key: 'code' },
		{ title: '权限名称', dataIndex: 'name', key: 'name' }
	];
	if (selectedGroup.value && !selectedGroup.value.isSystem) {
		cols.push({ title: '操作', key: 'action', width: 80 });
	}
	return cols;
});

const viewDrawerVisible = ref(false);
const currentPermissionGroup = ref(null);
const createVisible = ref(false);
const createSubmitting = ref(false);
const createForm = ref(null);
const editVisible = ref(false);
const editSubmitting = ref(false);
const editForm = ref(null);
// 创建表单验证规则（与文档一致：name 必填最大 50 字符，description 可选最大 200 字符）
const createRules = {
	name: [
		{ required: true, message: '请输入权限组名称' },
		{ max: 50, message: '权限组名称不能超过 50 个字符' }
	],
	description: [
		{ max: 200, message: '权限组描述不能超过 200 个字符' }
	]
};

// 编辑表单验证规则（与文档一致：name 必填最大 50 字符，description 可选最大 200 字符）
const editRules = {
	name: [
		{ required: true, message: '请输入权限组名称' },
		{ max: 50, message: '权限组名称不能超过 50 个字符' }
	],
	description: [
		{ max: 200, message: '权限组描述不能超过 200 个字符' }
	]
};
const permissionDrawerVisible = ref(false);
const selectedGroup = ref(null);
const showAddPermission = ref(false);
const selectedPermissionId = ref(null);
const addPermissionLoading = ref(false);
const permissionOptionsLoading = ref(false);
const permissionOptions = ref([]);

function formatDate(val) {
	if (!val) return '-';
	try {
		return new Date(val).toLocaleString('zh-CN', {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit'
		});
	} catch (e) {
		return String(val);
	}
}

function loadTableData() {
	permissionGroupStore.fetchPermissionGroups({
		currentPage: paginationConfig.value.current,
		pageSize: paginationConfig.value.pageSize
	}).catch((e) => {
		message.error(e?.message || '加载权限组列表失败');
	});
}

function handleTableChange(pagination) {
	permissionGroupStore.updatePagination({
		current: pagination.current,
		pageSize: pagination.pageSize
	});
	permissionGroupStore.updateQueryParams({ pagination, filters: {}, sorter: {} });
	loadTableData();
}

function openCreate() {
	createForm.value = {
		name: '',
		description: '',
		sortOrder: 0,
		status: 1
	};
	createVisible.value = true;
}

async function submitCreate() {
	if (!createForm.value?.name || !createForm.value.name.trim()) {
		message.warning('请填写权限组名称');
		return;
	}
	// 名称长度限制：最大 50 字符
	if (createForm.value.name.length > 50) {
		message.warning('权限组名称不能超过 50 个字符');
		return;
	}
	// 描述长度限制：最大 200 字符
	if (createForm.value.description && createForm.value.description.length > 200) {
		message.warning('权限组描述不能超过 200 个字符');
		return;
	}
	createSubmitting.value = true;
	try {
		await permissionGroupStore.createPermissionGroup({
			name: createForm.value.name.trim(),
			description: createForm.value.description?.trim() || '',
			sortOrder: createForm.value.sortOrder ?? 0,
			status: createForm.value.status ?? 1
		});
		message.success('创建成功');
		createVisible.value = false;
		createForm.value = null;
		loadTableData();
	} catch (e) {
		message.error(e?.message || '创建失败');
	} finally {
		createSubmitting.value = false;
	}
}

function viewDetail(record) {
	currentPermissionGroup.value = record;
	viewDrawerVisible.value = true;
}

function openEdit(record) {
	// 系统内置权限组不可编辑
	if (record.isSystem) {
		message.warning('系统内置权限组不可修改');
		return;
	}
	editForm.value = {
		id: record.id,
		name: record.name,
		description: record.description ?? '',
		sortOrder: record.sortOrder ?? record.order ?? 0,
		status: record.statusValue ?? (record.status === '启用' ? 1 : 0)
	};
	editVisible.value = true;
}

async function submitEdit() {
	if (!editForm.value?.name || !editForm.value.name.trim()) {
		message.warning('请填写权限组名称');
		return;
	}
	// 名称长度限制：最大 50 字符
	if (editForm.value.name.length > 50) {
		message.warning('权限组名称不能超过 50 个字符');
		return;
	}
	// 描述长度限制：最大 200 字符
	if (editForm.value.description && editForm.value.description.length > 200) {
		message.warning('权限组描述不能超过 200 个字符');
		return;
	}
	editSubmitting.value = true;
	try {
		await permissionGroupStore.updatePermissionGroup(editForm.value.id, {
			name: editForm.value.name.trim(),
			description: editForm.value.description?.trim() || '',
			sortOrder: editForm.value.sortOrder ?? 0,
			status: editForm.value.status ?? 1
		});
		message.success('保存成功');
		editVisible.value = false;
		editForm.value = null;
		loadTableData();
	} catch (e) {
		message.error(e?.message || '保存失败');
	} finally {
		editSubmitting.value = false;
	}
}

async function onDelete(record) {
	// 系统内置权限组不可删除（虽然按钮已隐藏，但这里再加一层保护）
	if (record.isSystem) {
		message.warning('系统内置权限组不可删除');
		return;
	}
	try {
		await permissionGroupStore.deletePermissionGroup(record.id);
		message.success('删除成功');
		loadTableData();
	} catch (e) {
		message.error(e?.message || '删除失败');
	}
}

function openPermissionDrawer(record) {
	selectedGroup.value = record;
	permissionDrawerVisible.value = true;
	permissionGroupStore.fetchGroupPermissions(record.id).catch((e) => {
		message.error(e?.message || '加载关联权限失败');
	});
}

function onPermissionDrawerClose() {
	selectedGroup.value = null;
	showAddPermission.value = false;
	selectedPermissionId.value = null;
}

watch(showAddPermission, (open) => {
	if (open) {
		selectedPermissionId.value = null;
		permissionOptionsLoading.value = true;
		permissionStore.fetchPermissions({ currentPage: 1, pageSize: 500 }).then(() => {
			permissionOptions.value = permissionStore.currentPermissions || [];
		}).catch((e) => {
			logger.error(e);
			message.error('加载权限列表失败');
		}).finally(() => {
			permissionOptionsLoading.value = false;
		});
	}
});

function filterPermissionOption(input, option) {
	const name = (option?.name ?? option?.label ?? '').toString();
	return name.toLowerCase().includes((input || '').toLowerCase());
}

async function doAddPermission() {
	if (!selectedPermissionId.value || !selectedGroup.value) {
		message.warning('请选择要添加的权限');
		return;
	}
	// 系统内置权限组不可添加权限（虽然按钮已隐藏，但这里再加一层保护）
	if (selectedGroup.value.isSystem) {
		message.warning('系统内置权限组不可修改');
		return;
	}
	addPermissionLoading.value = true;
	try {
		await permissionGroupStore.addPermissionToGroup(selectedGroup.value.id, selectedPermissionId.value);
		message.success('添加成功');
		showAddPermission.value = false;
		selectedPermissionId.value = null;
		await permissionGroupStore.fetchGroupPermissions(selectedGroup.value.id);
	} catch (e) {
		message.error(e?.message || '添加失败');
	} finally {
		addPermissionLoading.value = false;
	}
}

async function removePermission(permissionId) {
	if (!selectedGroup.value) return;
	// 系统内置权限组不可移除权限（虽然按钮已隐藏，但这里再加一层保护）
	if (selectedGroup.value.isSystem) {
		message.warning('系统内置权限组不可修改');
		return;
	}
	try {
		await permissionGroupStore.removePermissionFromGroup(selectedGroup.value.id, permissionId);
		message.success('已移除');
		await permissionGroupStore.fetchGroupPermissions(selectedGroup.value.id);
	} catch (e) {
		message.error(e?.message || '移除失败');
	}
}

onMounted(() => {
	loadTableData();
});
</script>
