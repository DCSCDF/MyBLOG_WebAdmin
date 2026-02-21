/*
 * [useDrawerWidth.js]
 * --------------------------------------------------------------------------------
 * This software is licensed under the MIT License.
 * However, any distribution or modification must retain this copyright notice.
 * See LICENSE for full terms.
 * --------------------------------------------------------------------------------
 * author: "Jiu Liu"
 * author_contact: "QQ: 3209174373, GitHub: https://github.com/DCSCDF"
 * license: "MIT"
 * license_exception: "Mandatory attribution retention"
 * UpdateTime: 2026/2/18 11:07
 *
 */

import {computed, onMounted, onUnmounted, ref} from 'vue';

/**
 * 响应式抽屉宽度：小屏 350px，大屏 600px；需在组件内监听 resize。
 * @returns {Object} 返回包含响应式属性的对象
 * @returns {import('vue').Ref<number>} returns.windowWidth - 窗口宽度响应式引用
 * @returns {import('vue').ComputedRef<number>} returns.drawerWidth - 抽屉宽度计算属性
 * @returns {Function} returns.handleResize - 处理窗口大小变化的函数
 */
export function useDrawerWidth() {
	const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1024);
	const drawerWidth = computed(() => (windowWidth.value < 1024 ? 350 : 600));

	function handleResize() {
		windowWidth.value = window.innerWidth;
	}

	onMounted(() => {
		window.addEventListener('resize', handleResize);
	});
	onUnmounted(() => {
		window.removeEventListener('resize', handleResize);
	});

	// 虽然 handleResize 在这里被定义，但在某些使用场景中可能不需要直接调用
	// 保留它是为了保持 API 的一致性
	return {windowWidth, drawerWidth};
}