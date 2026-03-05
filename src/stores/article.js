/*
 * [article.js]
 * --------------------------------------------------------------------------------
 * This software is licensed under the MIT License.
 * However, any distribution or modification must retain this copyright notice.
 * See LICENSE for full terms.
 * --------------------------------------------------------------------------------
 * author: "Jiu Liu"
 * author_contact: "QQ: 3209174373, GitHub: https://github.com/DCSCDF"
 * license: "MIT"
 * license_exception: "Mandatory attribution retention"
 * UpdateTime: 2026/3/5
 *
 */

import {defineStore} from 'pinia';
import {ref} from 'vue';

const STORAGE_KEY = 'article_draft';
const DEFAULT_TEXT = '**开始写作！**';

/**
 * 检查内容是否为默认内容或空内容
 * @param {string} content - 待检查的内容
 * @returns {boolean} 如果是默认内容或空内容返回 true
 */
const isDefaultOrEmpty = (content) => {
	let result;

	if (!content || typeof content !== 'string') {
		result = true;
	} else {
		const trimmed = content.trim();
		result = trimmed === '' || trimmed === DEFAULT_TEXT;
	}

	return result;
};

/**
 * 从本地存储加载草稿
 * @returns {Object|null} 草稿对象或 null
 */
const loadFromStorage = () => {
	let result = null;
	
	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored) {
			const draft = JSON.parse(stored);
			if (draft && draft.mdContent && !isDefaultOrEmpty(draft.mdContent)) {
				result = draft;
			}
		}
	} catch (e) {
		console.error('加载草稿失败:', e);
	}
	
	return result;
};

/**
 * 保存草稿到本地存储
 * @param {Object} draft - 草稿对象 { mdContent, htmlContent, lastSaveTime }
 */
const saveToStorage = (draft) => {
	try {
		if (!isDefaultOrEmpty(draft.mdContent)) {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
		}
	} catch (e) {
		console.error('保存草稿失败:', e);
	}
};

/**
 * 清除本地存储的草稿
 */
const clearStorage = () => {
	try {
		localStorage.removeItem(STORAGE_KEY);
	} catch (e) {
		console.error('清除草稿失败:', e);
	}
};

export const useArticleStore = defineStore('article', () => {
	// MD 内容
	const mdContent = ref('');
	// HTML 内容
	const htmlContent = ref('');
	// 最后保存时间
	const lastSaveTime = ref(null);
	// 定时器引用
	let autoSaveTimer = null;
	// 自动保存间隔（毫秒）
	const AUTO_SAVE_INTERVAL = 60 * 1000; // 1分钟

	/**
	 * 初始化：加载本地存储的草稿
	 * @returns {boolean} 是否成功加载了草稿
	 */
	const initDraft = () => {
		let result = false;
		
		const draft = loadFromStorage();
		if (draft) {
			mdContent.value = draft.mdContent || '';
			htmlContent.value = draft.htmlContent || '';
			lastSaveTime.value = draft.lastSaveTime || null;
			result = true;
		}
		
		return result;
	};

	/**
	 * 更新 MD 内容
	 * @param {string} content - 新的 MD 内容
	 */
	const updateMdContent = (content) => {
		mdContent.value = content;
	};

	/**
	 * 更新 HTML 内容
	 * @param {string} content - 新的 HTML 内容
	 */
	const updateHtmlContent = (content) => {
		htmlContent.value = content;
	};

	/**
	 * 保存草稿到本地存储
	 */
	const saveDraft = () => {
		if (!isDefaultOrEmpty(mdContent.value)) {
			const draft = {
				mdContent: mdContent.value,
				htmlContent: htmlContent.value,
				lastSaveTime: Date.now()
			};
			saveToStorage(draft);
			lastSaveTime.value = draft.lastSaveTime;
		}
	};

	/**
	 * 清除草稿
	 */
	const clearDraft = () => {
		clearStorage();
		mdContent.value = '';
		htmlContent.value = '';
		lastSaveTime.value = null;
	};

	/**
	 * 启动自动保存
	 * @param {Function} getMdContent - 获取当前 MD 内容的函数
	 * @param {Function} getHtmlContent - 获取当前 HTML 内容的函数
	 */
	const startAutoSave = (getMdContent, getHtmlContent) => {
		if (autoSaveTimer) {
			clearInterval(autoSaveTimer);
		}
		autoSaveTimer = setInterval(() => {
			const currentMd = getMdContent ? getMdContent() : mdContent.value;
			const currentHtml = getHtmlContent ? getHtmlContent() : htmlContent.value;
			if (currentMd !== mdContent.value) {
				mdContent.value = currentMd;
			}
			if (currentHtml !== htmlContent.value) {
				htmlContent.value = currentHtml;
			}
			saveDraft();
		}, AUTO_SAVE_INTERVAL);
	};

	/**
	 * 停止自动保存
	 */
	const stopAutoSave = () => {
		if (autoSaveTimer) {
			clearInterval(autoSaveTimer);
			autoSaveTimer = null;
		}
	};

	return {
		mdContent,
		htmlContent,
		lastSaveTime,
		initDraft,
		updateMdContent,
		updateHtmlContent,
		saveDraft,
		clearDraft,
		startAutoSave,
		stopAutoSave,
		isDefaultOrEmpty
	};
});
