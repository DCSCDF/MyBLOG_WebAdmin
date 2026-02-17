<!--
  - [UserEditModal.vue]
  - 编辑用户弹窗组件：修改用户昵称、头像、角色
  -->

<template>
	<a-modal
		v-model:open="visible"
		:confirm-loading="submitting"
		cancel-text="取消"
		ok-text="保存"
		title="编辑用户"
		@cancel="handleCancel"
		@ok="handleSubmit">
		<a-form
			v-if="form"
			:layout="'vertical'"
			:model="form"
			:rules="rules">
			<a-form-item label="用户名">
				<a-input :value="user?.username" disabled/>
			</a-form-item>
			<a-form-item label="昵称" name="nickname">
				<a-input
					v-model:value="form.nickname"
					:maxlength="50"
					placeholder="用户昵称，最大 50 字符"
					show-count/>
			</a-form-item>
			<a-form-item label="头像 URL" name="avatarUrl">
				<a-input
					v-model:value="form.avatarUrl"
					:maxlength="200"
					placeholder="头像 URL，最大 200 字符（可留空清空头像）"
					show-count/>
				<template #extra>
					<div v-if="form.avatarUrl" class="mt-2">
						<img
							:src="form.avatarUrl"
							alt="头像预览"
							class="h-16 w-16 rounded-full object-cover"
							onerror="this.style.display='none'"/>
					</div>
				</template>
			</a-form-item>
			<a-form-item label="角色" name="roleId">
				<a-select
					v-model:value="form.roleId"
					:loading="roleListLoading"
					:options="roleOptions"
					allow-clear
					placeholder="选择角色（留空则不修改角色）"
					style="width: 100%;"/>
			</a-form-item>
		</a-form>
	</a-modal>
</template>

<script setup>
import {computed, ref, watch} from 'vue';
import {message} from 'ant-design-vue';
import {useRoleStore} from '../../../stores/role.js';

const props = defineProps({
	open: {
		type: Boolean,
		default: false
	},
	user: {
		type: Object,
		default: null
	}
});

const emit = defineEmits(['update:open', 'submit', 'cancel']);

const roleStore = useRoleStore();
const roleListLoading = ref(false);
const roleOptions = ref([]);
const submitting = ref(false);
const form = ref(null);
/** 打开弹窗时头像 URL 的初始值，用于判断用户是否修改了头像（未修改则不传 avatarUrl） */
const initialAvatarUrl = ref('');

const visible = computed({
	get: () => props.open,
	set: (val) => emit('update:open', val)
});

/**
 * 校验头像 URL：仅接受 http:// 或 https:// 链接
 * @param {string} url - 待校验字符串
 * @returns {boolean}
 */
const isValidAvatarUrl = (url) => {
	if (!url || typeof url !== 'string') return false;
	const trimmed = url.trim();
	if (trimmed === '') return false;
	try {
		const u = new URL(trimmed);
		const protocol = (u.protocol || '').toLowerCase();
		return protocol === 'http:' || protocol === 'https:';
	} catch {
		return false;
	}
};

const rules = {
	nickname: [
		{max: 50, message: '昵称不能超过 50 个字符'}
	],
	avatarUrl: [
		{max: 200, message: '头像 URL 不能超过 200 个字符'},
		{
			validator: (_, value) => {
				const trimmed = (value || '').trim();
				if (trimmed === '') return Promise.resolve();
				if (isValidAvatarUrl(trimmed)) return Promise.resolve();
				return Promise.reject(new Error('头像URL格式无效，请输入有效的 http/https 链接或留空清空头像'));
			},
			trigger: 'blur'
		}
	]
};

/**
 * 加载角色列表
 */
const loadRoles = async () => {
	roleListLoading.value = true;
	try {
		await roleStore.fetchRoles({currentPage: 1, pageSize: 200});
		roleOptions.value = (roleStore.currentRoles || []).map(role => ({
			label: role.name,
			value: role.id
		}));
	} catch (e) {
		console.error('加载角色列表失败:', e);
	} finally {
		roleListLoading.value = false;
	}
};

/**
 * 从用户对象中解析当前角色 ID（用于下拉框回显）
 * @param {Object} user - 用户对象，可能含 roleId / role.id / roles[0].id
 * @returns {number|undefined}
 */
const resolveUserRoleId = (user) => {
	if (!user) return undefined;
	if (user.roleId != null) return user.roleId;
	if (user.role && user.role.id != null) return user.role.id;
	const roles = user.roles;
	if (Array.isArray(roles) && roles.length > 0 && roles[0].id != null) return roles[0].id;
	return undefined;
};

/**
 * 初始化表单（与后端一致：user 含 roles 时用 roles[0] 回显角色，头像初始值用于提交时判断是否修改）
 */
const initForm = () => {
	const defaultAvatar = '';
	if (props.user) {
		const avatar = (props.user.avatarUrl != null && props.user.avatarUrl !== '') ? String(props.user.avatarUrl) : defaultAvatar;
		form.value = {
			nickname: props.user.nickname || '',
			avatarUrl: avatar,
			roleId: resolveUserRoleId(props.user)
		};
		initialAvatarUrl.value = avatar;
	} else {
		form.value = {
			nickname: '',
			avatarUrl: defaultAvatar,
			roleId: undefined
		};
		initialAvatarUrl.value = defaultAvatar;
	}
};

/**
 * 处理取消
 */
const handleCancel = () => {
	form.value = null;
	emit('cancel');
};

/**
 * 处理提交（头像逻辑与后端一致：空/空白=清空传 ''，未修改不传，非空则校验 http/https 后传入）
 */
const handleSubmit = async () => {
	if (!form.value) {
		return;
	}

	if (form.value.nickname && form.value.nickname.length > 50) {
		message.warning('昵称不能超过 50 个字符');
		return;
	}
	if (form.value.avatarUrl && form.value.avatarUrl.length > 200) {
		message.warning('头像 URL 不能超过 200 个字符');
		return;
	}

	const avatarTrimmed = (form.value.avatarUrl ?? '').trim();
	const avatarUnchanged = avatarTrimmed === (initialAvatarUrl.value || '').trim();
	if (!avatarUnchanged && avatarTrimmed !== '' && !isValidAvatarUrl(form.value.avatarUrl)) {
		message.error('头像URL格式无效，请输入有效的 http/https 链接或留空清空头像');
		return;
	}

	submitting.value = true;
	try {
		const updateData = {};

		if (form.value.nickname !== undefined) {
			updateData.nickname = form.value.nickname.trim() || null;
		}
		// 头像：未修改则不传；清空则传 ''；非空则传校验后的 URL
		if (!avatarUnchanged) {
			updateData.avatarUrl = avatarTrimmed === '' ? '' : avatarTrimmed;
		}
		if (form.value.roleId !== undefined && form.value.roleId !== null) {
			updateData.roleId = form.value.roleId;
		}

		emit('submit', updateData);
	} finally {
		submitting.value = false;
	}
};

watch(() => props.open, (newVal) => {
	if (newVal) {
		initForm();
		loadRoles();
	}
});
</script>
