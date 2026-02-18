/*
 * [permissionTree.js]
 * --------------------------------------------------------------------------------
 * This software is licensed under the MIT License.
 * However, any distribution or modification must retain this copyright notice.
 * See LICENSE for full terms.
 * --------------------------------------------------------------------------------
 * author: "Jiu Liu"
 * author_contact: "QQ: 3209174373, GitHub: https://github.com/DCSCDF"
 * license: "MIT"
 * license_exception: "Mandatory attribution retention"
 * UpdateTime: 2026/2/18 10:53
 *
 */

/**
 * 权限树形结构处理工具函数
 */

/**
 * 将扁平权限列表转换为树形结构
 * @param {Array} permissions - 扁平权限列表
 * @param {string} parentField - 父级字段名，默认为 'parentId'
 * @param {string} idField - ID字段名，默认为 'id'
 * @returns {Array} 树形结构权限列表
 */
export function buildPermissionTree(permissions, parentField = 'parentId', idField = 'id') {
	let tree = [];

	if (hasValidPermissions(permissions)) {
		// 如果没有parentId字段，尝试根据code推断层级关系
		if (shouldBuildFromCode(permissions, parentField)) {
			tree = buildTreeFromCode(permissions);
		} else {
			tree = buildTreeFromParentId(permissions, parentField, idField);
		}
	}

	return tree;
}

/**
 * 检查权限列表是否有效
 * @param {Array} permissions - 权限列表
 * @returns {boolean}
 */
function hasValidPermissions(permissions) {
	return permissions && permissions.length > 0;
}

/**
 * 检查是否应该根据code构建树形结构
 * @param {Array} permissions - 权限列表
 * @param {string} parentField - 父级字段名
 * @returns {boolean}
 */
function shouldBuildFromCode(permissions, parentField) {
	return !permissions.some(p => p[parentField] !== undefined && p[parentField] !== null);
}

/**
 * 根据parentId字段构建树形结构
 * @param {Array} permissions - 权限列表
 * @param {string} parentField - 父级字段名
 * @param {string} idField - ID字段名
 * @returns {Array} 树形结构
 */
function buildTreeFromParentId(permissions, parentField, idField) {
	// 创建ID映射并同时构建树形结构
	const idMap = new Map();
	const tree = [];

	permissions.forEach(permission => {
		// 创建节点
		const node = {...permission, children: []};
		idMap.set(permission[idField], node);

		// 处理父子关系
		const parentId = permission[parentField];
		if (hasParent(parentId, idMap)) {
			// 有父级，添加到父级的children中
			const parent = idMap.get(parentId);
			if (!parent.children) {
				parent.children = [];
			}
			parent.children.push(node);
		} else {
			// 没有父级，是根节点
			tree.push(node);
		}
	});

	return tree;
}

/**
 * 检查是否有有效的父级
 * @param {*} parentId - 父级ID
 * @param {Map} idMap - ID映射
 * @returns {boolean}
 */
function hasParent(parentId, idMap) {
	return parentId && idMap.has(parentId);
}

/**
 * 根据权限 code 推断层级关系构建树形结构
 * 规则：直接父级 = 当前 code 去掉最后一段
 * 例如：
 * - system 是顶级父权限（根节点）
 * - system:user、system:role 是 system 的子权限
 * - system:role:edit 是 system:role 的子权限
 * @param {Array} permissions - 扁平权限列表
 * @returns {Array} 树形结构权限列表
 */
function buildTreeFromCode(permissions) {
	let tree = [];

	if (permissions && permissions.length > 0) {
		// 创建 code 到权限的映射并同时构建树形结构
		const codeMap = new Map();

		// 按 code 段数排序，段数少的在前（父级先于子级处理）
		const sortedPermissions = [...permissions].sort((a, b) => {
			const aParts = a.code.split(':').length;
			const bParts = b.code.split(':').length;
			return aParts - bParts;
		});

		sortedPermissions.forEach(permission => {
			// 创建节点
			const node = {...permission, children: []};
			codeMap.set(permission.code, node);

			const code = permission.code;
			const parts = code.split(':');

			// 直接父级 = 去掉最后一段后的 code
			const parentCode = parts.length > 1 ? parts.slice(0, -1).join(':') : '';

			if (parentCode && codeMap.has(parentCode)) {
				const parent = codeMap.get(parentCode);
				if (!parent.children) {
					parent.children = [];
				}
				parent.children.push(node);
			} else {
				tree.push(node);
			}
		});
	}

	return tree;
}

/**
 * 将树形结构扁平化
 * @param {Array} tree - 树形结构权限列表
 * @returns {Array} 扁平权限列表
 */
export function flattenPermissionTree(tree) {
	const result = [];

	function traverse(nodes) {
		nodes.forEach(node => {
			result.push(node);
			if (node.children && node.children.length > 0) {
				traverse(node.children);
			}
		});
	}

	traverse(tree);
	return result;
}

/**
 * 获取所有子权限ID（包括自身）
 * @param {Object} permission - 权限对象
 * @param {string} idField - ID字段名
 * @returns {Array} 所有子权限ID数组
 */
export function getAllChildrenIds(permission, idField = 'id') {
	const ids = [permission[idField]];

	if (permission.children && permission.children.length > 0) {
		permission.children.forEach(child => {
			ids.push(...getAllChildrenIds(child, idField));
		});
	}

	return ids;
}

/**
 * 检查权限是否有子权限
 * @param {Object} permission - 权限对象
 * @returns {boolean}
 */
export function hasChildren(permission) {
	return permission.children && permission.children.length > 0;
}

/**
 * 根据 code 查找权限的父权限 code
 * @param {string} code - 权限 code
 * @param {Map} codeMap - code 到权限的映射
 * @returns {string|null} 父权限 code，如果没有则返回 null
 */
export function getParentCode(code, codeMap) {
	let result = null;
	const parts = code.split(':');

	if (parts.length > 1) {
		const parentCode = parts.slice(0, -1).join(':');
		if (codeMap.has(parentCode)) {
			result = parentCode;
		}
	}

	return result;
}

/**
 * 检查权限是否与已存在的权限冲突
 * 规则：父权限和子权限不能同时存在
 * @param {Object} permission - 要检查的权限
 * @param {Array} existingPermissions - 已存在的权限列表（扁平）
 * @param {Map} codeMap - code 到权限的映射（用于查找父子关系）
 * @returns {Object} { conflict: boolean, reason: string }
 */
export function checkPermissionConflict(permission, existingPermissions, codeMap) {
	let result = {conflict: false, reason: ''};
	const existingCodes = new Set(existingPermissions.map(p => p.code));
	const permissionCode = permission.code;

	// 检查是否已存在相同的权限
	if (existingCodes.has(permissionCode)) {
		result = {conflict: true, reason: '该权限已存在'};
	} else {
		// 检查父权限冲突
		const parentCode = getParentCode(permissionCode, codeMap);
		if (parentCode && existingCodes.has(parentCode)) {
			result = {
				conflict: true,
				reason: `该权限的父权限 "${parentCode}" 已存在，不能同时关联父权限和子权限`
			};
		} else {
			// 检查子权限冲突：如果当前权限是父权限，检查是否有子权限已存在
			if (permission.children && permission.children.length > 0) {
				const childCodes = flattenPermissionTree([permission]).map(p => p.code);
				for (const childCode of childCodes) {
					if (childCode !== permissionCode && existingCodes.has(childCode)) {
						result = {
							conflict: true,
							reason: `该权限的子权限 "${childCode}" 已存在，不能同时关联父权限和子权限`
						};
						break; // 找到冲突后立即退出循环
					}
				}
			}
		}
	}

	return result;
}
