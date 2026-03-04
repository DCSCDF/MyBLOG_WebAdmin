/*
 * [childRoutes.js]
 * -------------------------------------------------------------------------------
 * This software is licensed under the MIT License.
 * However, any distribution or modification must retain this copyright notice.
 * See LICENSE for full terms.
 * -------------------------------------------------------------------------------
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
	    permission: null  null为空默认都显示  如果为布尔true则是父元素 子元素没用权限的时候会跟随隐藏
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
		name: 'dashboard',
		component: () => import('../pages/User/Dashboard/Dashboard.vue'),
		meta: {title: '仪表盘'},
		description: '查看网站/用户概览',
		permission: null
	},
	{
		key: 'sub1',
		icon: () => h(FileTextOutlined),
		label: '文章',
		title: '文章',
		path: '/article',
		permission: true,
		children: [
			{
				key: 'sub1_1',
				label: '新建文章',
				title: '新建文章',
				route: '/user/article/create',
				path: '/user/article/create',
				name: 'articlecreate',
				component: () => import('../pages/User/Article/NewArticle.vue'),
				meta: {title: '新建文章'},
				description: '撰写并发布新的博客文章',
				permission: 'article:create'
			},
			{
				key: 'sub1_2',
				label: '管理文章',
				title: '管理文章',
				route: '/user/article/manage',
				path: '/user/article/manage',
				name: 'articlemanage',
				component: () => import('../pages/User/Article/ListArticle.vue'),
				meta: {title: '管理文章'},
				description: '编辑、删除或查看已发布的文章',
				permission: 'article:list'
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
		component: () => import('../pages/User/Category/Category.vue'),
		meta: {title: '分类'},
		description: '管理文章的分类标签体系',
		permission: 'category:list'
	},
	{
		key: '4',
		icon: () => h(MessageOutlined),
		label: '留言',
		title: '留言',
		route: '/user/message',
		path: '/user/message',
		name: 'message',
		component: () => import('../pages/User/Message/Message.vue'),
		meta: {title: '留言'},
		description: '查看和回复访客留言',
		permission: 'comment:list'
	},
	{
		key: '5',
		icon: () => h(MessageOutlined),
		label: '网站外链',
		title: '网站外链',
		route: '/user/links',
		path: '/user/links',
		name: 'links',
		component: () => import('../pages/User/Links/LinksSetting.vue'),
		meta: {title: '网站外链'},
		description: '网站的友情链�/外部链接',
		permission: 'links:list'
	},
	{
		key: 'sub2',
		icon: () => h(SettingOutlined),
		label: '设置',
		title: '设置',
		path: '/setting',
		permission: null,
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
				description: '修改个人资料、密码等账户信息',
				permission: null,
			},
		],
	},
	{
		key: 'sub3',
		icon: () => h(DesktopOutlined),
		label: '网站管理',
		title: '网站管理',
		path: '/website',
		permission: true,
		children: [
			{
				key: 'sub3_1',
				label: '用户管理',
				title: '用户管理',
				path: '/system',
				permission: true,
				children: [
					{
						key: 'sub3_1_1',
						label: '账号管理',
						title: '账号管理',
						route: '/user/website/system/user',
						path: '/user/website/system/user',
						name: 'user',
						component: () => import('../pages/User/Website/System/UserManagement.vue'),
						meta: {title: '账号管理'},
						description: '管理后台用户账号',
						permission: 'system:user:list'
					},
					{
						key: 'sub3_1_2',
						label: '角色管理',
						title: '角色管理',
						route: '/user/website/system/role',
						path: '/user/website/system/role',
						name: 'role',
						component: () => import('../pages/User/Website/System/RoleManagement.vue'),
						meta: {title: '角色管理'},
						description: '配置用户角色及其权限范围',
						permission: 'system:role:list'
					},
					{
						key: 'sub3_1_3',
						label: '权限管理',
						title: '权限管理',
						route: '/user/website/permissionsetting',
						path: '/user/website/permissionsetting',
						name: 'permissionsetting',
						component: () => import('../pages/User/Website/System/PermissionSetting.vue'),
						meta: {title: '权限管理'},
						description: '定义系统功能权限点',
						permission: 'system:permission'
					},
				],
			},
			{
				key: 'sub3_2',
				label: '内容管理',
				title: '内容管理',
				path: '/content',
				permission: true,
				children: [
					{
						key: 'sub3_2_1',
						label: '全局文章管理',
						title: '全局文章管理',
						route: '/user/website/content/article',
						path: '/user/website/content/article',
						name: 'globalArticle',
						component: () => import('../pages/User/Dashboard/Dashboard.vue'),
						meta: {title: '全局文章管理'},
						description: '管理所有用户的文章',
						permission: 'system:article:list'
					},
					{
						key: 'sub3_2_2',
						label: '全局分类管理',
						title: '全局分类管理',
						route: '/user/website/content/category',
						path: '/user/website/content/category',
						name: 'globalCategory',
						component: () => import('../pages/User/Dashboard/Dashboard.vue'),
						meta: {title: '全局分类管理'},
						description: '管理所有用户的分类',
						permission: 'system:category:list'
					},
					{
						key: 'sub3_2_3',
						label: '全局评论管理',
						title: '全局评论管理',
						route: '/user/website/content/message',
						path: '/user/website/content/message',
						name: 'globalMessage',
						component: () => import('../pages/User/Dashboard/Dashboard.vue'),
						meta: {title: '全局评论管理'},
						description: '管理所有用户的评论',
						permission: 'system:comment:list'
					}
				]

			},
			{
				key: 'sub3_3',
				label: '站点全局SEO',
				title: '站点全局SEO',
				route: '/user/website/seo',
				path: '/user/website/seo',
				name: 'seo',
				component: () => import('../pages/User/Website/System/SeoManagement.vue'),
				meta: {title: '站点全局SEO'},
				description: '配置搜索引擎优化相关参数',
				permission: 'system:seo:list'
			},
			{
				key: 'sub3_4',
				label: '站点配置',
				title: '站点配置',
				route: '/user/website/siteInfo',
				path: '/user/website/siteInfo',
				name: 'siteInfo',
				component: () => import('../pages/User/Website/System/WebsiteSetting.vue'),
				meta: {title: '站点配置'},
				description: '设置网站名称、备案号等基本信息',
				permission: 'system:config:system:list'
			},
		],
	},
];
