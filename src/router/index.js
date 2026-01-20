import { createRouter, createWebHistory } from 'vue-router'

// 导入页面组件
import Login from '../pages/Login.vue'
import Dashboard from '../pages/Dashboard/Dashboard.vue'
import Layout from '../layout/Layout.vue'

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
        meta: { requiresAuth: true },
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

// // 路由守卫
// router.beforeEach((to, from, next) => {
//     const isAuthenticated = localStorage.getItem('token')

//     if (to.meta.requiresAuth && !isAuthenticated) {
//         // 需要认证但未登录
//         next('/login')
//     } else if (to.path === '/login' && isAuthenticated) {
//         // 已登录但访问登录页
//         next('/user/dashboard')
//     } else {
//         next()
//     }
// })

// 设置页面标题
router.afterEach((to) => {
    document.title = `${to.meta.title || '页面'} - MyBlog 管理系统`
})

export default router
