<!--
  - [SeoDetailDrawer.vue]
  - -------------------------------------------------------------------------------
  - This software is licensed under the MIT License.
  - However, any distribution or modification must retain this copyright notice.
  - See LICENSE for full terms.
  - -------------------------------------------------------------------------------
  - author: "Jiu Liu"
  - author_contact: "QQ: 3209174373, GitHub: https://github.com/DCSCDF"
  - license: "MIT"
  - license_exception: "Mandatory attribution retention"
  - UpdateTime: 2026/2/21 00:00
  -
  -->

<template>
        <a-drawer
            v-model:open="visible"
            :destroy-on-close="true"
            :width="drawerWidth"
            title="SEO配置详情"
            @close="handleClose">
                <template v-if="seo">
                        <div class="flex flex-col gap-1">
                                <span class="font-medium text-gray-900 text-sm">ID：</span>
                                <span class="text-gray-600 text-sm break-all">{{ seo.id || '-' }}</span>
                        </div>
                        <a-divider/>
                        <div class="flex flex-col gap-1">
                                <span class="font-medium text-gray-900 text-sm">页面类型：</span>
                                <span class="text-gray-600 text-sm break-all">{{ seo.pageType || '-' }}</span>
                        </div>
                        <a-divider/>
                        <div class="flex flex-col gap-1">
                                <span class="font-medium text-gray-900 text-sm">页面ID：</span>
                                <span class="text-gray-600 text-sm break-all">{{ seo.pageId || '-' }}</span>
                        </div>
                        <a-divider/>
                        <div class="flex flex-col gap-1">
                                <span class="font-medium text-gray-900 text-sm">SEO标题：</span>
                                <span class="text-gray-600 text-sm break-all">{{ seo.title || '-' }}</span>
                        </div>
                        <a-divider/>
                        <div class="flex flex-col gap-1">
                                <span class="font-medium text-gray-900 text-sm">SEO关键词：</span>
                                <span class="text-gray-600 text-sm break-all">{{ seo.keywords || '-' }}</span>
                        </div>
                        <a-divider/>
                        <div class="flex flex-col gap-1">
                                <span class="font-medium text-gray-900 text-sm">SEO描述：</span>
                                <span class="text-gray-600 text-sm break-all">{{ seo.description || '-' }}</span>
                        </div>
                        <a-divider/>
                        <div class="flex flex-col gap-1">
                                <span class="font-medium text-gray-900 text-sm">OG标题：</span>
                                <span class="text-gray-600 text-sm break-all">{{ seo.ogTitle || '-' }}</span>
                        </div>
                        <a-divider/>
                        <div class="flex flex-col gap-1">
                                <span class="font-medium text-gray-900 text-sm">OG描述：</span>
                                <span class="text-gray-600 text-sm break-all">{{ seo.ogDescription || '-' }}</span>
                        </div>
                        <a-divider/>
                        <div class="flex flex-col gap-1">
                                <span class="font-medium text-gray-900 text-sm">OG图片URL：</span>
                                <span class="text-gray-600 text-sm break-all">{{ seo.ogImage || '-' }}</span>
                        </div>
                        <a-divider/>
                        <div class="flex flex-col gap-1">
                                <span class="font-medium text-gray-900 text-sm">OG类型：</span>
                                <span class="text-gray-600 text-sm break-all">{{ seo.ogType || '-' }}</span>
                        </div>
                        <a-divider/>
                        <div class="flex flex-col gap-1">
                                <span class="font-medium text-gray-900 text-sm">规范URL：</span>
                                <span class="text-gray-600 text-sm break-all">{{ seo.canonicalUrl || '-' }}</span>
                        </div>
                        <a-divider/>
                        <div class="flex flex-col gap-1">
                                <span class="font-medium text-gray-900 text-sm">Robots：</span>
                                <span class="text-gray-600 text-sm break-all">{{ seo.robots || '-' }}</span>
                        </div>
                        <a-divider/>
                        <div class="flex flex-col gap-1">
                                <span class="font-medium text-gray-900 text-sm">是否系统内置：</span>
                                <span class="text-gray-600 text-sm break-all">
                                        {{ seo.isSystem ? '是' : '否' }}
                                </span>
                        </div>
                        <a-divider/>
                        <div class="flex flex-col gap-1">
                                <span class="font-medium text-gray-900 text-sm">创建时间：</span>
                                <span class="text-gray-600 text-sm break-all">{{ formatDate(seo.createTime) }}</span>
                        </div>
                        <a-divider/>
                        <div class="flex flex-col gap-1">
                                <span class="font-medium text-gray-900 text-sm">更新时间：</span>
                                <span class="text-gray-600 text-sm break-all">{{ formatDate(seo.updateTime) }}</span>
                        </div>
                </template>
        </a-drawer>
</template>

<script setup>
import {computed} from 'vue';
import {formatDate} from '../../../utils/formatDate.js';
import {useDrawerWidth} from '../../../composables/useDrawerWidth.js';

const props = defineProps({
        open: {type: Boolean, default: false},
        seo: {type: Object, default: null}
});

const emit = defineEmits(['update:open', 'close']);

const visible = computed({
        get: () => props.open,
        set: (val) => emit('update:open', val)
});

const {drawerWidth} = useDrawerWidth();

function handleClose() {
        emit('close');
}
</script>
