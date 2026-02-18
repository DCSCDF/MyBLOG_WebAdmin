/*
 * [index.js]
 * --------------------------------------------------------------------------------
 * This software is licensed under the MIT License.
 * However, any distribution or modification must retain this copyright notice.
 * See LICENSE for full terms.
 * --------------------------------------------------------------------------------
 * author: "Jiu Liu"
 * author_contact: "QQ: 3209174373, GitHub: https://github.com/DCSCDF"
 * license: "MIT"
 * license_exception: "Mandatory attribution retention"
 * UpdateTime: 2026/2/18 09:51
 *
 */

import {createRouter, createWebHistory} from 'vue-router'

// 导入页面组件
import Login from '../pages/Login.vue';
import Layout from '../layout/Layout.vue';
import {useAuthStore} from '../stores/auth.js';
import logger from '../utils/logger.js';

import {childRoutes} from "../config/childRoutes.js"

const routes = [
	{
		path: '/',
		redirect: '/login'
	},
	{
		path: '/login',
		name: 'Login',
		component: Login,
		meta: {
			requiresAuth: false,
			title: '登录'
		}
	},
	{
		path: '/user',
		component: Layout,
		meta: {requiresAuth: true},
		redirect: '/user/dashboard',
		children: childRoutes,
	}
]


const router = createRouter({
	history: createWebHistory(),
	routes
})


// 路由守卫（Vue Router 4 签名为 to, from, next）
router.beforeEach((to, from, next) => {
	let nextRoute = null;
	try {
		const token = useAuthStore().currentToken;
		const isAuthenticated = Boolean(token);
		if (to.meta.requiresAuth && !isAuthenticated) {
			nextRoute = '/login';
		} else if (to.path === '/login' && isAuthenticated) {
			nextRoute = '/user/dashboard';
		}
	} catch (error) {
		logger.error('路由守卫错误:', error);
		nextRoute = '/login';
	}
	if (nextRoute !== null) {
		next(nextRoute);
	} else {
		next();
	}
});

// 设置页面标题
router.afterEach((to) => {
	document.title = `${to.meta.title || '页面'} - MyBlog 管理系统`
})

export default router
