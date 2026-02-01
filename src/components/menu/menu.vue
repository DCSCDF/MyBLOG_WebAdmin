<template>
        <!-- 左侧菜单容器 -->

        <div
            :class="['relative  !backdrop-blur-md  bg-white/80 md:bg-transparent flex flex-col transition-all duration-300 ease-in-out h-full border-r border-gray-200', collapsed ? 'w-20' : 'w-50']">
                <!-- 菜单区域 -->
                <div class="relative flex-1 overflow-hidden">
                        <div
                            class="h-16 w-auto flex flex-row  items-center  mx-auto justify-center border-b border-gray-200">
                                <svg v-if="collapsed" class="icon" viewBox="0 0 1024 1024"
                                     xmlns="http://www.w3.org/2000/svg" width="33" height="33">
                                        <path
                                            d="M857.00739476 935.7671032H167.10911369c-43.53532208 0-78.82443536-35.28911328-78.82443538-78.82443535V167.05733215c0-43.53532208 35.28911328-78.82443536 78.82443538-78.82443535h689.89828107c43.53532208 0 78.82443536 35.28911328 78.82443537 78.82443535v689.89828109c0 43.52237669-35.28911328 78.81148997-78.82443537 78.81148996z"
                                            fill="#0E8CFB"></path>
                                        <path
                                            d="M279.09961955 390.48169245c-53.78806518 0-97.58229491-43.78128435-97.58229491-97.58229492 0-53.81395595 43.78128435-97.5952403 97.58229491-97.59524029 53.81395595 0 97.5952403 43.78128435 97.5952403 97.59524029 0 53.80101057-43.78128435 97.58229491-97.5952403 97.58229492z m0-135.99124543c-21.17864613 0-38.39600514 17.24324978-38.39600513 38.42189589s17.21735902 38.39600514 38.39600513 38.39600514 38.4218959-17.21735902 38.42189592-38.39600514-17.24324978-38.4218959-38.42189592-38.42189589z"
                                            fill="#FFFFFF"></path>
                                        <path
                                            d="M857.00739476 935.7671032H167.10911369c-43.53532208 0-78.82443536-35.28911328-78.82443538-78.82443535V561.71026963c0-40.19541333 32.5835283-72.77894163 72.77894164-72.77894163h701.98926855c40.19541333 0 72.77894163 32.5835283 72.77894163 72.77894163v295.23239822c0 43.53532208-35.28911328 78.82443536-78.82443537 78.82443535z"
                                            fill="#4AB2FB"></path>
                                        <path
                                            d="M776.70718578 812.941312H211.11046953c-16.33707298 0-29.59314489-13.24312652-29.59314489-29.59314489s13.24312652-29.59314489 29.59314489-29.59314489h565.59671625c16.33707298 0 29.59314489 13.24312652 29.59314489 29.59314489s-13.24312652 29.59314489-29.59314489 29.59314489zM776.70718578 670.91751822H211.11046953c-16.33707298 0-29.59314489-13.24312652-29.59314489-29.59314489s13.24312652-29.59314489 29.59314489-29.59314488h565.59671625c16.33707298 0 29.59314489 13.24312652 29.59314489 29.59314488s-13.24312652 29.59314489-29.59314489 29.59314489z"
                                            fill="#FFFFFF"></path>
                                        <path
                                            d="M655.90087427 331.7873272H461.69424276c-16.33707298 0-29.59314489-13.24312652-29.59314489-29.59314489s13.24312652-29.59314489 29.59314489-29.59314488h194.20663151c16.33707298 0 29.59314489 13.24312652 29.5931449 29.59314488s-13.24312652 29.59314489-29.5931449 29.59314489z"
                                            fill="#FFFFFF"></path>
                                </svg>
                                <svg v-if="!collapsed" class="icon" viewBox="0 0 1024 1024"
                                     xmlns="http://www.w3.org/2000/svg" width="33" height="33">
                                        <path
                                            d="M857.00739476 935.7671032H167.10911369c-43.53532208 0-78.82443536-35.28911328-78.82443538-78.82443535V167.05733215c0-43.53532208 35.28911328-78.82443536 78.82443538-78.82443535h689.89828107c43.53532208 0 78.82443536 35.28911328 78.82443537 78.82443535v689.89828109c0 43.52237669-35.28911328 78.81148997-78.82443537 78.81148996z"
                                            fill="#0E8CFB"></path>
                                        <path
                                            d="M279.09961955 390.48169245c-53.78806518 0-97.58229491-43.78128435-97.58229491-97.58229492 0-53.81395595 43.78128435-97.5952403 97.58229491-97.59524029 53.81395595 0 97.5952403 43.78128435 97.5952403 97.59524029 0 53.80101057-43.78128435 97.58229491-97.5952403 97.58229492z m0-135.99124543c-21.17864613 0-38.39600514 17.24324978-38.39600513 38.42189589s17.21735902 38.39600514 38.39600513 38.39600514 38.4218959-17.21735902 38.42189592-38.39600514-17.24324978-38.4218959-38.42189592-38.42189589z"
                                            fill="#FFFFFF"></path>
                                        <path
                                            d="M857.00739476 935.7671032H167.10911369c-43.53532208 0-78.82443536-35.28911328-78.82443538-78.82443535V561.71026963c0-40.19541333 32.5835283-72.77894163 72.77894164-72.77894163h701.98926855c40.19541333 0 72.77894163 32.5835283 72.77894163 72.77894163v295.23239822c0 43.53532208-35.28911328 78.82443536-78.82443537 78.82443535z"
                                            fill="#4AB2FB"></path>
                                        <path
                                            d="M776.70718578 812.941312H211.11046953c-16.33707298 0-29.59314489-13.24312652-29.59314489-29.59314489s13.24312652-29.59314489 29.59314489-29.59314489h565.59671625c16.33707298 0 29.59314489 13.24312652 29.59314489 29.59314489s-13.24312652 29.59314489-29.59314489 29.59314489zM776.70718578 670.91751822H211.11046953c-16.33707298 0-29.59314489-13.24312652-29.59314489-29.59314489s13.24312652-29.59314489 29.59314489-29.59314488h565.59671625c16.33707298 0 29.59314489 13.24312652 29.59314489 29.59314488s-13.24312652 29.59314489-29.59314489 29.59314489z"
                                            fill="#FFFFFF"></path>
                                        <path
                                            d="M655.90087427 331.7873272H461.69424276c-16.33707298 0-29.59314489-13.24312652-29.59314489-29.59314489s13.24312652-29.59314489 29.59314489-29.59314488h194.20663151c16.33707298 0 29.59314489 13.24312652 29.5931449 29.59314488s-13.24312652 29.59314489-29.5931449 29.59314489z"
                                            fill="#FFFFFF"></path>
                                </svg>
                                <h1 v-if="!collapsed"
                                    class="text-xl font-semibold mx-1 text-gray-800 dark:text-white text-nowrap">
                                        MyBlog
                                </h1>

                        </div>
                        <a-menu v-model:openKeys="state.openKeys" v-model:selectedKeys="state.selectedKeys"
                                mode="inline"
                                theme="light"
                                :inline-collapsed="collapsed"
                                :items="items"
                                @click="handleMenuClick"
                                class="h-full !overflow-y-auto !bg-transparent  !p-1 !border-0">


                        </a-menu>
                </div>
        </div>
</template>

<script setup>
import {h, reactive, watch,} from 'vue';
import {
        DesktopOutlined,
        FileTextOutlined,
        MessageOutlined,
        PieChartOutlined,
        SettingOutlined,
        TagsOutlined,
} from '@ant-design/icons-vue';
import {useRouter} from 'vue-router';

const router = useRouter();

const props = defineProps({
        collapsed: {
                type: Boolean,
                default: false
        },
        toggleCollapsed: {
                type: Function,
                default: () => {
                }
        }
});


const state = reactive({
        selectedKeys: ['1'],
        openKeys: [''],
        preOpenKeys: [''],
});

// 监听props中的collapsed变化，更新openKeys状态
watch(() => props.collapsed, (newCollapsed) => {
        if (newCollapsed) {
                state.openKeys = [];
        } else {
                state.openKeys = state.preOpenKeys;
        }
});

const items = reactive([
        {
                key: '1',
                icon: () => h(PieChartOutlined),
                label: '仪表盘',
                title: '仪表盘',
                route: '/user/dashboard'
        },


        {
                key: 'sub1',
                icon: () => h(FileTextOutlined),
                label: '文章',
                title: '文章',
                route: '/user/',
                children: [
                        {
                                key: 'sub1_1',
                                // icon: () => h(FormOutlined),
                                label: '新建文章',
                                title: '新建文章',
                        },
                        {
                                key: 'sub1_2',
                                // icon: () => h(FileTextOutlined),
                                label: '管理文章',
                                title: '管理文章',
                        },
                ],
        },

        {
                key: '3',
                icon: () => h(TagsOutlined),
                label: '分类',
                title: '分类',
                route: '/user/'
        },

        {
                key: '4',
                icon: () => h(MessageOutlined),
                label: '留言',
                title: '留言',
                route: '/user/'
        },

        {
                key: 'sub2',
                icon: () => h(SettingOutlined),
                label: '设置',
                title: '设置',
                children: [
                        {
                                key: 'sub2_1',
                                // icon: () => h(UserOutlined),
                                label: '我的账户',
                                title: '我的账户',
                                route: '/user/'
                        },

                        {
                                key: 'sub4',
                                // icon: () => h(ControlOutlined),
                                label: '系统管理',
                                title: '系统管理',
                                children: [
                                        {
                                                key: 'sub2_2',
                                                // icon: () => h(UserOutlined),
                                                label: '账号管理',
                                                title: '账号管理',
                                        },
                                        {
                                                key: 'sub2_3',
                                                // icon: () => h(TeamOutlined),
                                                label: '角色管理',
                                                title: '角色管理',
                                        },
                                        {
                                                key: 'sub2_4',
                                                // icon: () => h(SafetyOutlined),
                                                label: '权限管理',
                                                title: '权限管理',
                                        },
                                ],
                        },
                ],
        },
        {
                key: 'sub3',
                icon: () => h(DesktopOutlined),
                label: '网站管理',
                title: '网站管理',
                children: [
                        {
                                key: 'sub3_1',
                                // icon: () => h(FileTextOutlined),
                                label: '页面',
                                title: '页面',
                        },
                        {
                                key: 'sub3_2',
                                // icon: () => h(SettingOutlined),
                                label: 'SEO',
                                title: 'SEO',
                        },
                        {
                                key: 'sub3_3',
                                // icon: () => h(FormOutlined),
                                label: '站点信息',
                                title: '站点信息',
                        },

                ],
        },

]);

watch(
    () => state.openKeys,
    (_val, oldVal) => {
            state.preOpenKeys = oldVal;
    },
);

// 处理菜单点击事件
const handleMenuClick = (e) => {
        const selectedItem = items.find(item => item.key === e.key);
        if (selectedItem && selectedItem.route) {
                router.push(selectedItem.route); // 跳转到对应路由
        }
};

</script>