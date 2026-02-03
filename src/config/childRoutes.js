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
 * UpdateTime: 2026/2/3 17:53
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
	    name: 'Dashboard',  用于标识路由
	    component: () => import('../pages/Dashboard/Dashboard.vue'), 组件路径
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
		component: () => import('../pages/Dashboard/Dashboard.vue'),
		meta: {
			title: '仪表盘'
		}
	},
	{
		key: 'sub1',
		icon: () => h(FileTextOutlined),
		label: '文章',
		title: '文章',

		path: '/article',
		children: [
			{
				key: 'sub1_1',
				// icon: () => h(FormOutlined),
				label: '新建文章',
				title: '新建文章',
				route: '/user/article/create',

				path: '/user/article/create',
				name: 'articlecreate',
				component: () => import('../pages/Dashboard/Dashboard.vue'),
				meta: {
					title: '新建文章'
				}
			},
			{
				key: 'sub1_2',
				// icon: () => h(FileTextOutlined),
				label: '管理文章',
				title: '管理文章',
				route: '/user/article/manage',

				path: '/user/article/manage',
				name: 'articlemanage',
				component: () => import('../pages/Dashboard/Dashboard.vue'),
				meta: {
					title: '管理文章'
				}
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
		component: () => import('../pages/Dashboard/Dashboard.vue'),
		meta: {
			title: '分类'
		}
	},

	{
		key: '4',
		icon: () => h(MessageOutlined),
		label: '留言',
		title: '留言',
		route: '/user/message',

		path: '/user/message',
		name: 'message',
		component: () => import('../pages/Dashboard/Dashboard.vue'),
		meta: {
			title: '留言'
		}
	},
	{
		key: 'sub2',
		icon: () => h(SettingOutlined),
		label: '设置',
		title: '设置',

		path: '/setting',
		children: [
			{
				key: 'sub2_1',
				// icon: () => h(UserOutlined),
				label: '我的账户',
				title: '我的账户',
				route: '/user/setting/usersetting',

				path: '/user/setting/usersetting',
				name: 'usersetting',
				component: () => import('../pages/Dashboard/UserSetting.vue'),
				meta: {
					title: '我的账户'
				}
			},
		],
	},
	{
		key: 'sub3',
		icon: () => h(DesktopOutlined),
		label: '网站管理',
		title: '网站管理',

		path: '/website',
		children: [
			{
				key: 'sub4',
				// icon: () => h(ControlOutlined),
				label: '系统管理',
				title: '系统管理',
				path: '/system',
				children: [
					{
						key: 'sub2_2',
						// icon: () => h(UserOutlined),
						label: '账号管理',
						title: '账号管理',
						route: '/user/website/system/account',

						path: '/user/website/system/account',
						name: 'account',
						component: () => import('../pages/Dashboard/PermissionSetting.vue'),
						meta: {
							title: '权限设置'
						}

					},
					{
						key: 'sub2_3',
						// icon: () => h(TeamOutlined),
						label: '角色管理',
						title: '角色管理',
						route: '/user/website/system/role',

						path: '/user/website/system/role',
						name: 'role',
						component: () => import('../pages/Dashboard/PermissionSetting.vue'),
						meta: {
							title: '权限设置'
						}
					},
					{
						key: 'sub2_4',
						// icon: () => h(SafetyOutlined),
						label: '权限管理',
						title: '权限管理',
						route: '/user/website/permissionsetting',

						path: '/user/website/permissionsetting',
						name: 'permissionsetting',
						component: () => import('../pages/Dashboard/PermissionSetting.vue'),
						meta: {
							title: '权限设置'
						}
					},
				],
			},
			{
				key: 'sub3_1',
				// icon: () => h(FileTextOutlined),
				label: '页面管理',
				title: '页面管理',
				route: '/user/website/page',

				path: '/user/website/page',
				name: 'page',
				component: () => import('../pages/Dashboard/PermissionSetting.vue'),
				meta: {
					title: '权限设置'
				}
			},
			{
				key: 'sub3_2',
				// icon: () => h(SettingOutlined),
				label: '站点SEO',
				title: '站点SEO',
				route: '/user/website/seo',

				path: '/user/website/seo',
				name: 'seo',
				component: () => import('../pages/Dashboard/PermissionSetting.vue'),
				meta: {
					title: '权限设置'
				}
			},
			{
				key: 'sub3_3',
				// icon: () => h(FormOutlined),
				label: '站点信息',
				title: '站点信息',
				route: '/user/website/info',

				path: '/user/website/info',
				name: 'info',
				component: () => import('../pages/Dashboard/PermissionSetting.vue'),
				meta: {
					title: '权限设置'
				}
			},

		],
	},
]
