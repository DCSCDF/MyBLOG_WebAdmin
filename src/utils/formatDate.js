/**
 * 统一日期格式化：返回可展示的字符串，无效值返回 '-'
 * @param {string|number|Date} val
 * @returns {string}
 */
export function formatDate(val) {
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
		} catch {
			result = String(val);
		}
	}
	
	return result;
}
