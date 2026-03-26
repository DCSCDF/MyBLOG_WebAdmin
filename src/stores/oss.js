/*
 * [oss.js]
 * --------------------------------------------------------------------------------
 * This software is licensed under the MIT License.
 * However, any distribution or modification must retain this copyright notice.
 * See LICENSE for full terms.
 * --------------------------------------------------------------------------------
 * author: "Jiu Liu"
 * author_contact: "QQ: 3209174373, GitHub: https://github.com/DCSCDF"
 * license: "MIT"
 * license_exception: "Mandatory attribution retention"
 * UpdateTime: 2026/3/26
 *
 */

import {defineStore} from 'pinia';
import {computed, ref} from 'vue';
import {ossApi} from '../api/system/ossApi.js';
import logger from '../utils/logger.js';

export const useOssStore = defineStore('oss', () => {
	// 图片列表
	const images = ref([]);
	const loading = ref(false);
	const uploading = ref(false);

	// 分页信息
	const pagination = ref({
		current: 1,
		pageSize: 10,
		total: 0,
		pages: 0
	});

	// 查询参数
	const queryParams = ref({
		keyword: ''
	});

	/**
	 * 检查值是否存在（非空、非 undefined、非 null）
	 */
	const hasValue = (value) => {
		return value !== null && value !== undefined && value !== '';
	};

	/**
	 * 构建请求参数
	 */
	const buildRequestParams = (params) => {
		const safeParams = params || {};

		// 基础分页参数
		const requestParams = {
			currentPage: safeParams.currentPage ?? pagination.value.current,
			pageSize: safeParams.pageSize ?? pagination.value.pageSize
		};

		// 可选查询参数 - 关键字
		const keyword = safeParams.keyword ?? queryParams.value.keyword;
		if (hasValue(keyword)) {
			requestParams.keyword = keyword;
		}

		return requestParams;
	};

	/**
	 * 处理 API 响应数据
	 */
	const processApiResponse = (response, pageSize) => {
		const {
			records = [],
			total = 0,
			current = 1,
			size = pageSize,
			pages = 0
		} = response.data;

		images.value = records.map((item) => ({...item, key: item.id}));
		pagination.value = {current, pageSize: size, total, pages};
		logger.log('用户 OSS 图片列表获取成功，总数:', total);
	};

	/**
	 * 验证 API 响应是否有效
	 */
	const isValidResponse = (response) => {
		return response.success === true && response.data !== null && response.data !== undefined;
	};

	/**
	 * 获取错误消息
	 */
	const getErrorMessage = (response) => {
		return response.errorMsg || '获取 OSS 图片列表失败';
	};

	/**
	 * 统一处理 API 成功/失败响应
	 */
	const handleApiResult = (res, successLog, errorMsgDefault) => {
		if (res.success === true) {
			logger.log(successLog);
			return res.data !== undefined && res.data !== null ? res.data : true;
		}
		const errorMessage = res.errorMsg || errorMsgDefault;
		logger.error(errorMessage);
		throw new Error(errorMessage);
	};

	/**
	 * 分页获取当前用户的图片列表
	 */
	const fetchImages = async (params) => {
		let result = null;
		loading.value = true;
		try {
			const requestParams = buildRequestParams(params);
			const response = await ossApi.list(requestParams);

			if (isValidResponse(response)) {
				processApiResponse(response, requestParams.pageSize);
				result = images.value;
			} else {
				const errorMessage = getErrorMessage(response);
				logger.error(errorMessage);
				images.value = [];
				pagination.value = {...pagination.value, total: 0, pages: 0};
				result = [];
			}
		} catch (error) {
			logger.error('获取 OSS 图片列表失败:', error);
			images.value = [];
			pagination.value = {...pagination.value, total: 0, pages: 0};
			result = [];
		} finally {
			loading.value = false;
		}
		return result;
	};

	/**
	 * 上传图片
	 * @param {File} file - 图片文件
	 * @returns {Promise<{ hash: string, originalName: string, size: number }>}
	 */
	const uploadImage = async (file) => {
		uploading.value = true;
		try {
			const res = await ossApi.uploadImage(file);
			const result = handleApiResult(res, '图片上传成功', '上传图片失败');
			logger.log('图片上传成功:', result);
			return result;
		} finally {
			uploading.value = false;
		}
	};

	/**
	 * 删除图片（通过哈希值）
	 */
	const deleteImage = async (hash) => {
		const res = await ossApi.deleteByHash(hash);
		return handleApiResult(res, '图片删除成功', '删除图片失败');
	};

	/**
	 * 获取图片预览 URL
	 */
	const getImageUrl = (hash) => {
		return `${import.meta.env.VITE_API_BASE_URL || ''}/api/images/${hash}`;
	};

	/**
	 * 更新分页
	 */
	const updatePagination = (newPagination) => {
		pagination.value = {...pagination.value, ...newPagination};
	};

	/**
	 * 更新查询参数
	 */
	const updateQueryParams = (newParams) => {
		queryParams.value = {...queryParams.value, ...newParams};
	};

	const currentImages = computed(() => images.value);
	const currentPagination = computed(() => pagination.value);
	const isUploading = computed(() => uploading.value);

	return {
		images,
		loading,
		uploading,
		pagination,
		queryParams,
		fetchImages,
		uploadImage,
		deleteImage,
		getImageUrl,
		updatePagination,
		updateQueryParams,
		currentImages,
		currentPagination,
		isUploading
	};
});
