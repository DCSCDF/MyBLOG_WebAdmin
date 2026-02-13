# Pinia 状态管理

本项目现已全面采用 Pinia 进行状态管理

## Store 结构

### 1. 认证状态管理 (`auth.js`)

**位置**: `src/stores/auth.js`

管理用户认证相关状态：

- Token 管理（支持记住登录/临时登录）
- 用户资料管理
- 登录状态跟踪
- 数据持久化（localStorage/sessionStorage）

**核心功能**:

```javascript
const authStore = useAuthStore();

// 状态
authStore.token          // 当前token
authStore.userProfile    // 用户资料
authStore.isLoggedIn     // 登录状态

// 方法
authStore.setToken(token, rememberMe, profile)  // 设置token
authStore.clearToken()                          // 清除认证状态
authStore.updateUserProfile(profile)            // 更新用户资料
```

### 2. 应用状态管理 (`app.js`)

**位置**: `src/stores/app.js`

管理应用级别状态：

- 侧边栏折叠状态
- 移动端适配
- 主题设置
- 全局通知
- 加载状态

**核心功能**:

```javascript
const appStore = useAppStore();

// 状态
appStore.sidebarCollapsed      // 侧边栏是否折叠
appStore.mobileSidebarOpen     // 移动端侧边栏是否打开
appStore.theme                 // 当前主题
appStore.notifications         // 通知消息

// 方法
appStore.toggleSidebar()       // 切换侧边栏
appStore.setTheme('dark')      // 设置主题
appStore.addNotification({...}) // 添加通知
```

### 3. 权限状态管理 (`permission.js`)

**位置**: `src/stores/permission.js`

管理权限相关数据：

- 权限列表
- 权限组
- 分页信息
- 查询参数

**核心功能**:

```javascript
const permissionStore = usePermissionStore();

// 状态
permissionStore.permissions        // 权限列表
permissionStore.permissionGroups   // 权限组
permissionStore.pagination         // 分页信息

// 方法
permissionStore.fetchPermissions()     // 获取权限列表
permissionStore.fetchPermissionGroups() // 获取权限组
permissionStore.updatePagination({...}) // 更新分页
```

## 使用示例

### 在组件中使用

```js

import {useAuthStore, useAppStore, usePermissionStore} from '@/stores';

const authStore = useAuthStore();
const appStore = useAppStore();
const permissionStore = usePermissionStore();

// 响应式状态
const isLoggedIn = computed(() => authStore.isLoggedIn);
const userProfile = computed(() => authStore.getUserProfile());
const isMobile = computed(() => appStore.isMobile);

// 方法调用
const handleLogin = () => {
	authStore.setToken(token, rememberMe, profile);
};

const toggleSidebar = () => {
	appStore.toggleSidebar();
};

```

### 在 Composition API 中使用

```javascript
import {useAuthStore} from '@/stores/auth';

export function useUser() {
	const authStore = useAuthStore();

	const login = async (credentials) => {
		const response = await api.login(credentials);
		authStore.setToken(response.token, credentials.remember);
	};

	const logout = () => {
		authStore.clearToken();
	};

	return {
		login,
		logout,
		isLoggedIn: computed(() => authStore.isLoggedIn),
		userProfile: computed(() => authStore.getUserProfile())
	};
}
```

## 状态同步机制

### 1. 数据持久化

- **Token**: 根据 `rememberMe` 状态选择 localStorage 或 sessionStorage
- **主题**: 自动保存到 localStorage
- **用户资料**: 登录时自动保存，登出时清除

### 2. 响应式更新

- 所有状态变更都会自动触发相关组件更新
- 支持跨组件状态共享
- 提供计算属性简化状态访问

### 3. 状态清理

```javascript
// 清理特定 store 状态
authStore.$reset();
appStore.clearAppState();
permissionStore.clearPermissionState();

// 或者清理所有状态
useResetStore(); // 自定义组合函数
```

### 3. 错误处理

```javascript
try {
	await authStore.setToken(token, rememberMe);
} catch (error) {
	// 统一错误处理
	appStore.addNotification({
		type: 'error',
		message: '登录失败: ' + error.message
	});
}
```