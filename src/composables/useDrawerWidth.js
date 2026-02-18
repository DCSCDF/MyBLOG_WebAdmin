import { computed, onMounted, onUnmounted, ref } from 'vue';

/**
 * 响应式抽屉宽度：小屏 350px，大屏 600px；需在组件内监听 resize。
 * @returns {{ windowWidth: Ref<number>, drawerWidth: ComputedRef<number>, handleResize: () => void }}
 */
export function useDrawerWidth() {
	const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1024);
	const drawerWidth = computed(() => (windowWidth.value < 768 ? 350 : 600));

	function handleResize() {
		windowWidth.value = window.innerWidth;
	}

	onMounted(() => {
		window.addEventListener('resize', handleResize);
	});
	onUnmounted(() => {
		window.removeEventListener('resize', handleResize);
	});

	return { windowWidth, drawerWidth, handleResize };
}
