/*
 * [childRoutes.js]
 * --------------------------------------------------------------------------------
 * This software is licensed under the MIT License.
 * However, any distribution or modification must retain this copyright notice.
 * See LICENSE for full terms.
 * --------------------------------------------------------------------------------
 * author: "Jiu Liu"
 * author_contact: "QQ: 3209174373, GitHub: https://github.com/DCSCDF"
 * license: "MIT"
 * license_exception: "Mandatory attribution retention"
 * UpdateTime: 2026/2/18 09:43
 *
 */

import {
	DesktopOutlined,
	FileTextOutlined,
	MessageOutlined,
	PieChartOutlined,
	SettingOutlined,
	TagsOutlined
} from '@ant-design/icons-vue';
import {h} from 'vue';

/*
{
	    key: '1',   侧边栏唯一的值
	    icon: () => h(PieChartOutlined),  图标
	    label: '仪表盘',  侧边栏直接显示的标题
	    title: '仪表盘', 侧边栏鼠标放上去显示的问题
	    route: '/user/dashboard',  用于标识路由的路径 程序内部逻辑跳转或导航
	    path: '/user/dashboard',   定义 Vue Router 的路由匹配规则
	    name: 'User',  用于标识路由
	    component: () => import('../pages/User/User.vue'), 组件路径
	    meta: {
		title: '仪表盘' 页签标题
	}
},
*/

export const childRoutes = [
	{
		key: '1',
		icon: () => h(PieChartOutlined),
		label: '仪表盘',
		title: '仪表盘',
		route: '/user/dashboard',
		path: '/user/dashboard',
		name: 'Dashboard',
		component: () => import('../pages/User/Dashboard/Dashboard.vue'),
		meta: {title: '仪表盘'},
		description: '查看网站/用户概览'
	},
	{
		key: 'sub1',
		icon: () => h(FileTextOutlined),
		label: '文章',
		title: '文章',
		route: '/user/article/create',
		path: '/article',
		children: [
			{
				key: 'sub1_1',
				label: '新建文章',
				title: '新建文章',
				route: '/user/article/create',
				path: '/user/article/create',
				name: 'articlecreate',
				component: () => import('../pages/User/Dashboard/Dashboard.vue'),
				meta: {title: '新建文章'},
				description: '撰写并发布新的博客文章'
			},
			{
				key: 'sub1_2',
				label: '管理文章',
				title: '管理文章',
				route: '/user/article/manage',
				path: '/user/article/manage',
				name: 'articlemanage',
				component: () => import('../pages/User/Dashboard/Dashboard.vue'),
				meta: {title: '管理文章'},
				description: '编辑、删除或查看已发布的文章'
			},
		],
	},
	{
		key: '3',
		icon: () => h(TagsOutlined),
		label: '分类',
		title: '分类',
		route: '/user/category',
		path: '/user/category',
		name: 'category',
		component: () => import('../pages/User/Dashboard/Dashboard.vue'),
		meta: {title: '分类'},
		description: '管理文章的分类标签体系'
	},
	{
		key: '4',
		icon: () => h(MessageOutlined),
		label: '留言',
		title: '留言',
		route: '/user/message',
		path: '/user/message',
		name: 'message',
		component: () => import('../pages/User/Dashboard/Dashboard.vue'),
		meta: {title: '留言'},
		description: '查看和回复访客留言'
	},
	{
		key: 'sub2',
		icon: () => h(SettingOutlined),
		label: '设置',
		title: '设置',
		route: '/user/setting/usersetting',
		path: '/setting',
		children: [
			{
				key: 'sub2_1',
				label: '我的账户',
				title: '我的账户',
				route: '/user/setting/usersetting',
				path: '/user/setting/usersetting',
				name: 'usersetting',
				component: () => import('../pages/User/Setting/UserSetting.vue'),
				meta: {title: '我的账户'},
				description: '修改个人资料、密码等账户信息'
			},
		],
	},
	{
		key: 'sub3',
		icon: () => h(DesktopOutlined),
		label: '网站管理',
		title: '网站管理',
		route: '/user/website/system/user',
		path: '/website',
		children: [
			{
				key: 'sub4',
				label: '用户管理',
				title: '用户管理',
				route: '/user/website/system/user',
				path: '/system',
				children: [
					{
						key: 'sub2_2',
						label: '账号管理',
						title: '账号管理',
						route: '/user/website/system/user',
						path: '/user/website/system/user',
						name: 'user',
						component: () => import('../pages/User/Website/System/UserManagement.vue'),
						meta: {title: '账号管理'},
						description: '管理后台用户账号'
					},
					{
						key: 'sub2_3',
						label: '角色管理',
						title: '角色管理',
						route: '/user/website/system/role',
						path: '/user/website/system/role',
						name: 'role',
						component: () => import('../pages/User/Website/System/RoleManagement.vue'),
						meta: {title: '角色管理'},
						description: '配置用户角色及其权限范围'
					},
					{
						key: 'sub2_4',
						label: '权限管理',
						title: '权限管理',
						route: '/user/website/permissionsetting',
						path: '/user/website/permissionsetting',
						name: 'permissionsetting',
						component: () => import('../pages/User/Website/System/PermissionSetting.vue'),
						meta: {title: '权限管理'},
						description: '定义系统功能权限点'
					},
				],
			},
			// {
			// 	key: 'sub3_1',
			// 	label: '页面管理',
			// 	title: '页面管理',
			// 	route: '/user/website/page',
			// 	path: '/user/website/page',
			// 	name: 'page',
			// 	component: () => import('../pages/User/Dashboard/Dashboard.vue'),
			// 	meta: {title: '页面管理'},
			// 	description: '管理自定义静态页面（如关于页、友链页）'
			// },
			{
				key: 'sub3_2',
				label: '站点全局SEO',
				title: '站点全局SEO',
				route: '/user/website/seo',
				path: '/user/website/seo',
				name: 'seo',
				component: () => import('../pages/User/Website/System/SeoManagement.vue'),
				meta: {title: '站点全局SEO'},
				description: '配置搜索引擎优化相关参数'
			},
			{
				key: 'sub3_3',
				label: '站点配置',
				title: '站点配置',
				route: '/user/website/SiteInfo',
				path: '/user/website/SiteInfo',
				name: 'SiteInfo',
				component: () => import('../pages/User/Dashboard/Dashboard.vue'),
				meta: {title: '站点配置'},
				description: '设置网站名称、Logo、备案号等基本信息'
			},
		],
	},
];