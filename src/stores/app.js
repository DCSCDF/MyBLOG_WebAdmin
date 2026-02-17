/*
 * [app.js]
 * --------------------------------------------------------------------------------
 * This software is licensed under the MIT License.
 * However, any distribution or modification must retain this copyright notice.
 * See LICENSE for full terms.
 * --------------------------------------------------------------------------------
 * author: "Jiu Liu"
 * author_contact: "QQ: 3209174373, GitHub: https://github.com/DCSCDF"
 * license: "MIT"
 * license_exception: "Mandatory attribution retention"
 * UpdateTime: 2026/2/13 18:38
 *
 */

/**
 * 应用全局状态管理 Store
 */

import {defineStore} from 'pinia';
import {ref, computed} from 'vue';
import logger from '../utils/logger.js';

export const useAppStore = defineStore('app', () => {
	// 侧边栏状态
	const sidebarCollapsed = ref(false);
	const mobileSidebarOpen = ref(false);

	// 设备检测
	const isMobile = ref(window.innerWidth < 768);

	// 主题设置 (暂未使用)
	// const theme = ref('light'); // 'light' | 'dark'

	// 加载状态
	const isLoading = ref(false);

	// 全局提示消息
	const notifications = ref([]);

	// 窗口大小变化监听器
	let resizeTimer = null;
	let cleanupFunction = null;

	/**
	 * 切换侧边栏折叠状态
	 */
	const toggleSidebar = () => {
		sidebarCollapsed.value = !sidebarCollapsed.value;
		logger.log(`侧边栏状态切换: ${sidebarCollapsed.value ? '收起' : '展开'}`);
	};

	/**
	 * 设置侧边栏状态
	 * @param {boolean} collapsed - 是否折叠
	 */
	const setSidebarCollapsed = (collapsed) => {
		sidebarCollapsed.value = collapsed;
		logger.log(`侧边栏状态设置: ${collapsed ? '收起' : '展开'}`);
	};

	/**
	 * 切换移动端侧边栏
	 */
	const toggleMobileSidebar = () => {
		mobileSidebarOpen.value = !mobileSidebarOpen.value;
		logger.log(`移动端侧边栏切换: ${mobileSidebarOpen.value ? '打开' : '关闭'}`);
	};

	/**
	 * 设置移动端侧边栏状态
	 * @param {boolean} open - 是否打开
	 */
	const setMobileSidebarOpen = (open) => {
		mobileSidebarOpen.value = open;
		logger.log(`移动端侧边栏设置: ${open ? '打开' : '关闭'}`);
	};

	/**
	 * 更新设备状态
	 */
	const updateDeviceStatus = () => {
		const newIsMobile = window.innerWidth < 768;

		// 只有当状态真正改变时才更新和记录日志
		if (isMobile.value !== newIsMobile) {
			isMobile.value = newIsMobile;
			// 在移动端自动关闭侧边栏
			if (isMobile.value) {
				mobileSidebarOpen.value = false;
			}
			// 可以在这里添加其他设备相关的逻辑
			logger.log(`设备状态更新: ${isMobile.value ? '移动端' : '桌面端'}`);
		}
	};

	/**
	 * 开始监听窗口大小变化
	 */
	const startResizeListener = () => {
		let localCleanupFunction = () => {
		};

		if (typeof window !== 'undefined') {
			const handleResize = () => {
				clearTimeout(resizeTimer);
				resizeTimer = setTimeout(() => {
					updateDeviceStatus();
				}, 100);
			};

			window.addEventListener('resize', handleResize);

			// 设置清理函数
			localCleanupFunction = () => {
				window.removeEventListener('resize', handleResize);
				clearTimeout(resizeTimer);
			};
		}

		// 更新全局cleanupFunction引用
		cleanupFunction = localCleanupFunction;
		return localCleanupFunction;
	};

	/**
	 * 设置主题 (暂未使用)
	 * @param {'light'|'dark'} newTheme - 主题模式
	 */
	// const setTheme = (newTheme) => {
	// 	theme.value = newTheme;
	// 	document.documentElement.setAttribute('data-theme', newTheme);
	// 	localStorage.setItem('theme', newTheme);
	// 	logger.log(`主题设置为: ${newTheme}`);
	// };

	/**
	 * 初始化主题 (暂未使用)
	 */
	// const initTheme = () => {
	// 	const savedTheme = localStorage.getItem('theme') || 'light';
	// 	setTheme(savedTheme);
	// };

	// 组件卸载时清理资源
	if (typeof window !== 'undefined') {
		const handleBeforeUnload = () => {
			clearTimeout(resizeTimer);
			if (cleanupFunction) {
				cleanupFunction();
			}
		};

		window.addEventListener('beforeunload', handleBeforeUnload);
	}

	/**
	 * 设置加载状态
	 * @param {boolean} loading - 是否加载中
	 */
	const setLoading = (loading) => {
		isLoading.value = loading;
	};

	/**
	 * 添加通知消息
	 * @param {Object} notification - 通知对象
	 * @param {string} notification.type - 消息类型: success, error, warning, info
	 * @param {string} notification.message - 消息内容
	 * @param {number} notification.duration - 显示时长(毫秒)
	 */
	const addNotification = (notification) => {
		const id = Date.now();
		const newNotification = {
			id,
			type: notification.type || 'info',
			message: notification.message || '',
			duration: notification.duration || 3000,
			timestamp: new Date()
		};

		notifications.value.push(newNotification);

		// 自动移除
		if (newNotification.duration > 0) {
			setTimeout(() => {
				removeNotification(id);
			}, newNotification.duration);
		}

		logger.log(`添加通知: ${newNotification.message}`);
	};

	/**
	 * 移除通知消息
	 * @param {number} id - 通知ID
	 */
	const removeNotification = (id) => {
		const index = notifications.value.findIndex(n => n.id === id);
		if (index > -1) {
			notifications.value.splice(index, 1);
			logger.log(`移除通知 ID: ${id}`);
		}
	};

	/**
	 * 清除所有通知
	 */
	const clearNotifications = () => {
		notifications.value = [];
		logger.log('清除所有通知');
	};

	/**
	 * 清理应用状态
	 */
	const clearAppState = () => {
		sidebarCollapsed.value = false;
		mobileSidebarOpen.value = false;
		// theme.value = 'light'; // 主题状态清理暂未使用
		isLoading.value = false;
		notifications.value = [];
		clearTimeout(resizeTimer);
		if (cleanupFunction) {
			cleanupFunction();
		}
		cleanupFunction = null;
		logger.log('应用状态已清理');
	};

	// 计算属性
	const isSidebarCollapsed = computed(() => sidebarCollapsed.value);
	const isMobileSidebarOpen = computed(() => mobileSidebarOpen.value);
	// const currentTheme = computed(() => theme.value); // 主题功能暂未使用
	const activeNotifications = computed(() => notifications.value);

	return {
		// 状态
		sidebarCollapsed,
		mobileSidebarOpen,
		isMobile,
		// theme, // 主题状态暂未使用
		isLoading,
		notifications,

		// 方法
		toggleSidebar,
		setSidebarCollapsed,
		toggleMobileSidebar,
		setMobileSidebarOpen,
		updateDeviceStatus,
		startResizeListener,
		// setTheme, // 主题方法暂未使用
		// initTheme, // 主题初始化暂未使用
		setLoading,
		addNotification,
		removeNotification,
		clearNotifications,
		clearAppState,

		// 计算属性
		isSidebarCollapsed,
		isMobileSidebarOpen,
		// currentTheme, // 主题计算属性暂未使用
		activeNotifications
	};
});