/*
 * [util.js]
 * --------------------------------------------------------------------------------
 * This software is licensed under the MIT License.
 * However, any distribution or modification must retain this copyright notice.
 * See LICENSE for full terms.
 * --------------------------------------------------------------------------------
 * author: "Jiu Liu"
 * author_contact: "QQ: 3209174373, GitHub: https://github.com/DCSCDF"
 * license: "MIT"
 * license_exception: "Mandatory attribution retention"
 * UpdateTime: 2026/2/17 22:27
 *
 */

export function resetSize(vm) {
	let img_width, img_height, bar_width, bar_height;	//图片的宽度、高度，移动条的宽度、高度

	const parentWidth = vm.$el.parentNode.offsetWidth || window.innerWidth;
	const parentHeight = vm.$el.parentNode.offsetHeight || window.innerHeight;

	// 使用 includes 方法替代 indexOf !== -1 的否定判断
	if (vm.imgSize.width.includes('%')) {
		img_width = parseInt(vm.imgSize.width) / 100 * parentWidth + 'px'
	} else {
		img_width = vm.imgSize.width;
	}

	if (vm.imgSize.height.includes('%')) {
		img_height = parseInt(vm.imgSize.height) / 100 * parentHeight + 'px'
	} else {
		img_height = vm.imgSize.height
	}

	if (vm.barSize.width.includes('%')) {
		bar_width = parseInt(vm.barSize.width) / 100 * parentWidth + 'px'
	} else {
		bar_width = vm.barSize.width
	}

	if (vm.barSize.height.includes('%')) {
		bar_height = parseInt(vm.barSize.height) / 100 * parentHeight + 'px'
	} else {
		bar_height = vm.barSize.height
	}

	return {imgWidth: img_width, imgHeight: img_height, barWidth: bar_width, barHeight: bar_height}
}

/**
 * 创建响应式尺寸调整器
 * @param {Object} vm - Vue 组件实例
 * @param {Function} callback - 尺寸变化回调函数
 * @returns {Function} 清理函数
 */
export function createResponsiveResizer(vm, callback) {
	let resizeTimer = null;
	
	const handleResize = () => {
		// 防抖处理
		clearTimeout(resizeTimer);
		resizeTimer = setTimeout(() => {
			const newSize = resetSize(vm);
			if (callback && typeof callback === 'function') {
				callback(newSize);
			}
		}, 100);
	};
	
	// 添加事件监听器
	window.addEventListener('resize', handleResize);
	
	// 立即执行一次
	setTimeout(() => {
		handleResize();
	}, 0);
	
	// 返回清理函数
	return () => {
		clearTimeout(resizeTimer);
		window.removeEventListener('resize', handleResize);
	};
}
