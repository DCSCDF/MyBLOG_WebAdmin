/*
 * [comment.js]
 * --------------------------------------------------------------------------------
 * This software is licensed under the MIT License.
 * However, any distribution or modification must retain this copyright notice.
 * See LICENSE for full terms.
 * --------------------------------------------------------------------------------
 * author: "Jiu Liu"
 * author_contact: "QQ: 3209174373, GitHub: https://github.com/DCSCDF"
 * license: "MIT"
 * license_exception: "Mandatory attribution retention"
 * UpdateTime: 2026/3/8
 *
 */

import {defineStore} from 'pinia';
import {computed, ref} from 'vue';
import {commentApi} from '../api/user/commentApi.js';
import logger from '../utils/logger.js';

export const useCommentStore = defineStore('comment', () => {
	// 评论列表
	const comments = ref([]);
	const loading = ref(false);

	// 分页信息（与后端字段对应：current, size, total, pages）
	const pagination = ref({
		current: 1,
		pageSize: 10,
		total: 0,
		pages: 0
	});

	// 查询参数（keyword 匹配评论者名称/邮箱/内容，status 筛选状态）
	const queryParams = ref({
		keyword: '',
		status: undefined
	});

	/** 列表接口返回的筛选项，用于渲染状态下拉（filterOptions.status） */
	const filterOptions = ref({});

	/**
	 * 检查值是否已定义
	 * @param {*} value - 待检查的值
	 * @returns {boolean}
	 */
	const isDefined = (value) => {
		return value !== undefined;
	};

	/**
	 * 构建请求参数
	 * @param {Object} params - 输入参数
	 * @returns {Object} 处理后的请求参数
	 */
	const buildRequestParams = (params) => {
		const safeParams = params || {};

		const currentPage = safeParams.currentPage ?? pagination.value.current;
		const pageSize = safeParams.pageSize ?? pagination.value.pageSize;
		const status = safeParams.status !== undefined ? safeParams.status : queryParams.value.status;

		const requestParams = {
			currentPage,
			pageSize
		};

		if (isDefined(status)) {
			requestParams.status = status;
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
			pages = 0,
			filterOptions: options = {}
		} = response.data;

		comments.value = records.map((item) => ({...item, key: item.id}));
		pagination.value = {current, pageSize: size, total, pages};
		filterOptions.value = options;
		logger.log('评论列表获取成功，总数:', total);
	};

	/**
	 * 验证 API 响应是否有效
	 * @param {Object} response - API 响应
	 * @returns {boolean}
	 */
	const isValidResponse = (response) => {
		return response.success === true && response.data !== null && response.data !== undefined;
	};

	/**
	 * 获取错误消息
	 * @param {Object} response - API 响应
	 * @returns {string}
	 */
	const getErrorMessage = (response) => {
		return response.errorMsg || '获取评论列表失败';
	};

	/**
	 * 分页获取评论列表
	 * @param {Object} params - { currentPage, pageSize, status? }
	 * @returns {Promise<Array>}
	 */
	const fetchComments = async (params) => {
		let result = null;
		loading.value = true;
		try {
			const requestParams = buildRequestParams(params);
			const response = await commentApi.list(requestParams);

			if (isValidResponse(response)) {
				processApiResponse(response, requestParams.pageSize);
				result = comments.value;
			} else {
				const errorMessage = getErrorMessage(response);
				logger.error(errorMessage);
				comments.value = [];
				pagination.value = {...pagination.value, total: 0, pages: 0};
				result = [];
			}
		} catch (error) {
			logger.error('获取评论列表失败:', error);
			comments.value = [];
			pagination.value = {...pagination.value, total: 0, pages: 0};
			result = [];
		} finally {
			loading.value = false;
		}
		return result;
	};

	/**
	 * 统一处理 API 成功/失败响应
	 * @param {Object} res - 接口响应
	 * @param {string} successLog - 成功时日志文案
	 * @param {string} errorMsgDefault - 失败时默认错误文案
	 * @returns {Object|boolean}
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
	 * 修改评论
	 * @param {number} id - 评论 ID
	 * @param {Object} body - { content?, website? }
	 * @returns {Promise<Object|boolean>}
	 */
	const updateComment = async (id, body) => {
		const res = await commentApi.update(id, body);
		return handleApiResult(res, '评论修改成功: ' + id, '修改评论失败');
	};

	/**
	 * 删除评论（逻辑删除，status 置为 3）
	 * @param {number} id - 评论 ID
	 * @returns {Promise<boolean>}
	 */
	const deleteComment = async (id) => {
		const res = await commentApi.delete(id);
		return handleApiResult(res, '评论删除成功: ' + id, '删除评论失败');
	};

	/**
	 * 更新分页
	 * @param {Object} newPagination - { current?, pageSize? }
	 */
	const updatePagination = (newPagination) => {
		pagination.value = {...pagination.value, ...newPagination};
	};

	/**
	 * 更新查询参数
	 * @param {Object} newParams - { keyword?, status? }
	 */
	const updateQueryParams = (newParams) => {
		queryParams.value = {...queryParams.value, ...newParams};
	};

	const currentComments = computed(() => comments.value);
	const currentPagination = computed(() => pagination.value);

	return {
		comments,
		loading,
		pagination,
		queryParams,
		filterOptions,
		fetchComments,
		updateComment,
		deleteComment,
		updatePagination,
		updateQueryParams,
		currentComments,
		currentPagination
	};
});

