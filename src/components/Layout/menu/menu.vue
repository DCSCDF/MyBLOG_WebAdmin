<!--
  - [menu.vue]
  - -------------------------------------------------------------------------------
  - This software is licensed under the MIT License.
  - However, any distribution or modification must retain this copyright notice.
  - See LICENSE for full terms.
  - -------------------------------------------------------------------------------
  - author: "Jiu Liu"
  - author_contact: "QQ: 3209174373, GitHub: https://github.com/DCSCDF"
  - license: "MIT"
  - license_exception: "Mandatory attribution retention"
  - UpdateTime: 2026/2/18 11:49
  -
  -->

<template>
        <!-- 左侧菜单容器 -->

        <div
            :class="['relative !backdrop-blur-md bg-white/80 lg:bg-transparent flex flex-col transition-all duration-300 ease-in-out h-full border-r border-gray-200', collapsed ? 'w-20' : 'w-60']">
                <!-- 菜单区域 -->
                <div class="flex-1 flex flex-col overflow-y-auto">
                        <div
                            class="h-14 w-auto flex flex-row  items-center  px-auto justify-center border-b border-gray-200">
                                <svg v-if="collapsed" class="icon" height="33"
                                     viewBox="0 0 1024 1024" width="33" xmlns="http://www.w3.org/2000/svg">
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
                                <svg v-if="!collapsed" class="icon" height="33"
                                     viewBox="0 0 1024 1024" width="33" xmlns="http://www.w3.org/2000/svg">
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
                        <a-menu v-model:selectedKeys="state.selectedKeys" :inline-collapsed="collapsed"
                                :items="items"
                                :openKeys="state.openKeys"
                                class="flex-1 !overflow-y-auto !bg-transparent  !p-1 !border-0 "
                                mode="inline"
                                theme="light"
                                @click="handleMenuClick"
                                @update:openKeys="handleOpenChange">


                        </a-menu>
                </div>
        </div>
</template>

<script setup>
import {computed, onMounted, onUnmounted, reactive, watch} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import {childRoutes} from "../../../config/childRoutes.js";
import {useAppStore} from '../../../stores/app.js';

const appStore = useAppStore();

const cleanMenuItem = (routeItem) => {
        const {key, label, title, route, icon, children} = routeItem;

        const item = {
                key,
                label: typeof label === 'string' ? label : '[未知标签]',
                title: typeof title === 'string' ? title : '[未知标题]',
                route,
                icon,
        };

        if (children?.length) {
                item.children = children.map(cleanMenuItem);
        }

        return item;
};

const items = childRoutes.map(cleanMenuItem);
const router = useRouter();
const route = useRoute();

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

// 使用 props 的 collapsed 状态，避免与 store 冲突
const collapsed = computed(() => props.collapsed);


// 菜单状态
const state = reactive({
        selectedKeys: [],
        openKeys: [],
        preOpenKeys: [],
});

// 设备检测
const isMobile = computed(() => appStore.isMobile);

// 侧栏折叠时收起 openKeys，展开时恢复
watch(() => props.collapsed, (newCollapsed) => {
        if (newCollapsed) {
                state.preOpenKeys = state.openKeys.slice();
                state.openKeys = [];
        } else {
                state.openKeys = state.preOpenKeys.slice();
        }
});

// 移动端不展开子菜单
watch(isMobile, (newIsMobile) => {
        if (newIsMobile) {
                state.openKeys = [];
                state.preOpenKeys = [];
        }
});

// 递归查找菜单项
const findMenuItem = (items, key) => {
        let result = null;

        // 遍历所有菜单项
        for (let item of items) {
                // 直接匹配当前项
                if (item.key === key) {
                        result = item;
                        break;
                }

                // 递归查找子菜单
                if (item.children?.length) {
                        const found = findMenuItem(item.children, key);
                        if (found) {
                                result = found;
                                break;
                        }
                }
        }

        return result;
};

// 获取目标 key 的所有父级 key（用于保持展开）
const getParentKeys = (items, targetKey, parentKeys = []) => {
        let result = [];

        for (let item of items) {
                const newParentKeys = [...parentKeys, item.key];
                if (item.key === targetKey) {
                        result = newParentKeys.slice(0, -1);
                        break;
                }
                if (item.children) {
                        const childResult = getParentKeys(item.children, targetKey, newParentKeys);
                        if (childResult.length > 0) {
                                result = childResult;
                                break;
                        }
                }
        }

        return result;
};

// 根据路由路径查找对应的菜单项
const findMenuItemByRoute = (items, routePath) => {
        let result = null;

        for (let item of items) {
                if (item.children?.length) {
                        const found = findMenuItemByRoute(item.children, routePath);
                        if (found) {
                                result = found;
                                break;
                        }
                }
                if (item.route === routePath) {
                        result = item;
                        break;
                }
        }

        return result;
};

// 更新选中状态
const updateSelectedKeys = () => {
        const currentRoute = route.path;
        const matchedItem = findMenuItemByRoute(items, currentRoute);

        if (matchedItem) {
                state.selectedKeys = [matchedItem.key];
                const parentKeys = getParentKeys(items, matchedItem.key);
                state.preOpenKeys = parentKeys;
                // 仅非移动端且侧栏未折叠时展开子菜单；折叠时保持收起，不展开弹窗
                if (!isMobile.value && !props.collapsed) {
                        state.openKeys = parentKeys;
                } else {
                        state.openKeys = [];
                }
        } else {
                // 如果没有匹配到，默认选中第一个菜单
                state.selectedKeys = ['1'];
                // 移动端清空展开状态
                if (isMobile.value) {
                        state.openKeys = [];
                        state.preOpenKeys = [];
                }
        }
};

// 处理菜单展开/收起变化
const handleOpenChange = (newOpenKeys) => {
        let openKeysToUpdate = newOpenKeys;
        let preOpenKeysToUpdate = newOpenKeys;
        
        // 移动端或折叠状态下直接使用新的 openKeys
        if (!(isMobile.value || props.collapsed)) {
                // 桌面端展开状态：允许用户自由控制菜单展开/收起
                // 不强制保持选中项父级展开，让用户可以手动折叠任何菜单
                openKeysToUpdate = newOpenKeys;
                preOpenKeysToUpdate = newOpenKeys;
        }
        
        state.openKeys = openKeysToUpdate;
        state.preOpenKeys = preOpenKeysToUpdate;
};

// 处理菜单点击事件
const handleMenuClick = (e) => {
        const selectedItem = findMenuItem(items, e.key);
        if (selectedItem && selectedItem.route) {
                router.push(selectedItem.route);
                if (appStore.isMobile) {
                        appStore.setMobileSidebarOpen(false);
                }
        }
};

// 组件挂载时初始化选中状态
let cleanupResizeListener = null;

onMounted(() => {
        appStore.updateDeviceStatus();
        cleanupResizeListener = appStore.startResizeListener();
        updateSelectedKeys();
});

// 完全由当前路由驱动选中与展开状态（含刷新后恢复）
watch(() => route.path, () => {
        updateSelectedKeys();
}, {immediate: true});

onUnmounted(() => {
        if (cleanupResizeListener) {
                cleanupResizeListener();
        }
});


</script>