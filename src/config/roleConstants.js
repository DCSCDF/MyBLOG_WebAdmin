/*
 * [roleConstants.js]
 * --------------------------------------------------------------------------------
 * 系统角色常量，与 schema 中 sys_role 初始化数据一致。
 * 超级管理员角色：code = SUPER_ADMIN, is_super_admin = 1, is_system = 1
 * --------------------------------------------------------------------------------
 */

/** 超级管理员角色编码（唯一，拥有系统所有权限） */
export const SUPER_ADMIN_ROLE_CODE = 'SUPER_ADMIN';

/**
 * 判断角色是否为超级管理员（按 code 或 superAdmin 字段）
 * @param {Object} role - 角色对象 { code, superAdmin }
 * @returns {boolean}
 */
export function isSuperAdminRole(role) {
	if (!role) return false;
	return role.code === SUPER_ADMIN_ROLE_CODE || role.superAdmin === true;
}
