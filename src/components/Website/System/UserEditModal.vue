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
							@error="handleImageError"/>
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
	// 单一返回点：只有有效协议才返回 true
	let isValid = false;
	
	if (typeof url === 'string') {
		const trimmed = url.trim();
		if (trimmed) {
			try {
				const u = new URL(trimmed);
				const protocol = (u.protocol || '').toLowerCase();
				isValid = protocol === 'http:' || protocol === 'https:';
			} catch {
				// URL 解析失败，保持 false
			}
		}
	}
	
	return isValid;
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
				
				// 单一返回点：根据验证结果决定 resolve 或 reject
				const isEmpty = trimmed === '';
				const isAvatarValid = isValidAvatarUrl(trimmed);
				const isValid = isEmpty || isAvatarValid;
				
				return isValid 
					? Promise.resolve()
					: Promise.reject(new Error('头像URL格式无效，请输入有效的 http/https 链接或留空清空头像'));
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
		const roles = roleStore.currentRoles || [];
		roleOptions.value = roles.map(role => ({
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
	// 使用单一返回点模式
	let roleId = undefined;
	
	if (user) {
		// 优先检查直接的 roleId 属性
		if (user.roleId != null) {
			roleId = user.roleId;
		}
		// 检查 role 对象
		else {
			if (user.role && user.role.id != null) {
				roleId = user.role.id;
			}
			// 检查 roles 数组
			else {
				const roles = user.roles;
				if (Array.isArray(roles) && roles.length > 0 && roles[0].id != null) {
					roleId = roles[0].id;
				}
			}
		}
	}
	
	return roleId;
};

/**
 * 初始化表单（与后端一致：user 含 roles 时用 roles[0] 回显角色，头像初始值用于提交时判断是否修改）
 */
const initForm = () => {
	const defaultAvatar = '';
	
	// 使用单一逻辑路径初始化表单
	const userData = props.user || {};
	
	const hasValidAvatar = userData.avatarUrl && userData.avatarUrl !== '';
	const avatar = hasValidAvatar ? String(userData.avatarUrl) : defaultAvatar;
	
	form.value = {
		nickname: userData.nickname || '',
		avatarUrl: avatar,
		roleId: resolveUserRoleId(userData)
	};
	initialAvatarUrl.value = avatar;
};

/**
 * 处理图片加载错误
 * @param {Event} event - 错误事件
 */
const handleImageError = (event) => {
	const imgElement = event.target;
	if (imgElement) {
		imgElement.style.display = 'none';
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
 * 验证表单数据
 * @returns {{isValid: boolean, errorMessage: string}}
 */
const validateForm = () => {
	// 使用单一返回点模式
	let isValid = true;
	let errorMessage = '';
	
	// 表单存在性验证
	if (!form.value) {
		isValid = false;
		errorMessage = '表单数据不存在';
	}
	
	// 昵称验证
	const nicknameLength = form.value?.nickname?.length || 0;
	if (nicknameLength > 50) {
		isValid = false;
		errorMessage = '昵称不能超过 50 个字符';
	}
	
	// 头像URL长度验证
	const avatarUrlLength = form.value?.avatarUrl?.length || 0;
	if (avatarUrlLength > 200) {
		isValid = false;
		errorMessage = '头像 URL 不能超过 200 个字符';
	}

	// 头像URL格式验证
	const avatarTrimmed = (form.value?.avatarUrl ?? '').trim();
	const avatarInitial = (initialAvatarUrl.value || '').trim();
	const hasAvatarChanged = avatarTrimmed !== avatarInitial;
	const isAvatarInvalid = avatarTrimmed && !isValidAvatarUrl(form.value?.avatarUrl);
	const shouldShowError = hasAvatarChanged && isAvatarInvalid;
	
	if (shouldShowError) {
		isValid = false;
		errorMessage = '头像URL格式无效，请输入有效的 http/https 链接或留空清空头像';
	}

	return { 
		isValid, 
		errorMessage 
	};
};

/**
 * 构建更新数据
 * @returns {Object} 更新数据对象
 */
const buildUpdateData = () => {
	const updateData = {};

	// 处理昵称
	if (form.value.nickname !== undefined) {
		updateData.nickname = form.value.nickname.trim() || null;
	}

	// 处理头像
	const avatarTrimmed = (form.value.avatarUrl ?? '').trim();
	const avatarInitial = (initialAvatarUrl.value || '').trim();
	const hasAvatarChanged = avatarTrimmed !== avatarInitial;
	
	if (hasAvatarChanged) {
		updateData.avatarUrl = avatarTrimmed;
	}

	// 处理角色
	if (form.value.roleId != null) {
		updateData.roleId = form.value.roleId;
	}

	return updateData;
};

/**
 * 处理提交
 */
const handleSubmit = async () => {
	const validationResult = validateForm();
	
	// 使用单一返回点模式
	if (validationResult.isValid) {
		// 执行提交逻辑
		submitting.value = true;
		try {
			const updateData = buildUpdateData();
			emit('submit', updateData);
		} finally {
			submitting.value = false;
		}
	} else {
		message.warning(validationResult.errorMessage);
	}
};

watch(() => props.open, (newVal) => {
	if (newVal) {
		initForm();
		loadRoles();
	}
});
</script>
