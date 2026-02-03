<!--
  - [breadcrumb.vue]
  - -------------------------------------------------------------------------------
  - This software is licensed under the MIT License.
  - However, any distribution or modification must retain this copyright notice.
  - See LICENSE for full terms.
  - -------------------------------------------------------------------------------
  - author: "Jiu Liu"
  - author_contact: "QQ: 3209174373, GitHub: https://github.com/DCSCDF"
  - license: "MIT"
  - license_exception: "Mandatory attribution retention"
  - UpdateTime: 2026/2/3 22:00
  -
  -->

<template>
        <div class="mx-2">
                <div class="mb-6">
                        <a-breadcrumb>
                                <a-breadcrumb-item>首页</a-breadcrumb-item>
                                <a-breadcrumb-item
                                    v-for="(label, index) in allBreadcrumbLabels"
                                    :key="index"
                                >
                                        {{ label }}
                                </a-breadcrumb-item>
                        </a-breadcrumb>
                </div>

                <div>
                        <h1 class="text-2xl !font-black !mb-2 text-gray-800">{{ currentTitle }}</h1>
                        <p class="text-gray-500 mb-6">{{ currentDescription }}</p>
                </div>
        </div>
</template>

<script setup>
import {useRoute} from 'vue-router';
import {computed} from 'vue';
import {childRoutes} from '../../../config/childRoutes.js';

/**
 * 查找当前路由对应的菜单项及其完整面包屑路径
 * @param {Array} routes 菜单路由树
 * @param {string} targetPath 目标路径（route.path）
 * @param {Array} parentLabels 父级标签累积（递归用）
 * @returns {{item: (Object|null), breadcrumb: string[]}|null} 匹配项和面包屑路径
 */
function findRouteInfo(routes, targetPath, parentLabels = []) {
        let foundResult = null;

        for (const item of routes) {
                if (item.route === targetPath) {
                        foundResult = {
                                item,
                                breadcrumb: [...parentLabels, item.label],
                        };
                        break;
                }

                if (item.children) {
                        const childResult = findRouteInfo(item.children, targetPath, [...parentLabels, item.label]);
                        if (childResult) {
                                foundResult = childResult;
                                break;
                        }
                }
        }

        return foundResult;
}

const route = useRoute();

const routeInfo = computed(() => {
        return findRouteInfo(childRoutes, route.path);
});

const currentTitle = computed(() => {
        return routeInfo.value?.item?.label || '未命名页面';
});

const currentDescription = computed(() => {
        return routeInfo.value?.item?.description || '暂无页面描述';
});

const allBreadcrumbLabels = computed(() => {
        return routeInfo.value?.breadcrumb || [];
});
</script>

<style scoped>
/* 可选样式 */
</style>