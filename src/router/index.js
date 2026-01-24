import {createRouter, createWebHistory} from 'vue-router'

// 导入页面组件
import Login from '../pages/Login.vue'
import Layout from '../layout/Layout.vue'
import {tools} from "../utils/tools.js";
import logger from "../utils/logger.js";

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
		children: [
			{
				path: 'dashboard',
				name: 'Dashboard',
				component: () => import('../pages/Dashboard/Dashboard.vue'),
				meta: {
					title: '仪表盘'
				}
			},
			{
				path: 'usersetting',
				name: 'usersetting',
				component: () => import('../pages/Dashboard/UserSetting.vue'),
				meta: {
					title: '用户设置'
				}
			},
			// {
			//     path: 'profile',
			//     name: 'Profile',
			//     component: () => import('../pages/Profile.vue'),
			//     meta: {
			//         title: '个人资料'
			//     }
			// },
			// {
			//     path: 'settings',
			//     name: 'Settings',
			//     component: () => import('../pages/Settings.vue'),
			//     meta: {
			//         title: '系统设置'
			//     }
			// }
		]
	}
]

const router = createRouter({
	history: createWebHistory(),
	routes
})


// 路由守卫
router.beforeEach((to, from, next) => {
	try {
		// 检查是否有token
		const token = tools.getToken();
		const isAuthenticated = !!token; // 转为布尔值

		if (to.meta.requiresAuth && !isAuthenticated) {
			// 需要认证但未登录
			next('/login')
		} else if (to.path === '/login' && isAuthenticated) {
			// 已登录但访问登录页
			next('/user/dashboard')
		} else {
			next()
		}
	} catch (error) {
		logger.error('路由守卫错误:', error);
		// 发生错误时，重定向到登录页
		next('/login');
	}
})

// 设置页面标题
router.afterEach((to) => {
	document.title = `${to.meta.title || '页面'} - MyBlog 管理系统`
})

export default router
