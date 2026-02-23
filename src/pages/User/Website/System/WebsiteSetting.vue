<!--
  - [WebsiteSetting.vue]
  - -------------------------------------------------------------------------------
  - This software is licensed under the MIT License.
  - However, any distribution or modification must retain this copyright notice.
  - See LICENSE for full terms.
  - -------------------------------------------------------------------------------
  - author: "Jiu Liu"
  - author_contact: "QQ: 3209174373, GitHub: https://github.com/DCSCDF"
  - license: "MIT"
  - license_exception: "Mandatory attribution retention"
  - UpdateTime: 2026/2/21 14:18
  -
  -->

<template>
        <a-card>
                <div class="flex flex-col lg:flex-row gap-4">
                        <!-- 左侧菜单 -->
                        <div class="lg:w-48 flex-shrink-0">
                                <a-menu
                                    v-model:selectedKeys="state.selectedKeys"
                                    :items="items"
                                    :mode="menuMode"
                                    :open-keys="state.openKeys"
                                    class=" h-full"
                                    @click="handleMenuClick"
                                    @openChange="onOpenChange"
                                />
                        </div>

                        <!-- 右侧内容区域 -->
                        <div class="flex-1 min-w-0 overflow-hidden">
                                <!-- 根据选中的菜单项显示对应的内容 -->
                                <div v-if="currentView === '1'" key="basic-setting">
                                        <BasicSetting/>
                                </div>
                                <div v-else-if="currentView === '2'" key="smtp-setting">
                                        <SmtpSetting/>
                                </div>
                                <div v-else-if="currentView === '3'" key="oss-setting">
                                        <OssSetting/>
                                </div>
                                <div v-else-if="currentView === '4'" key="custom-setting">
                                        <CustomSetting/>
                                </div>
                                <div v-else key="default">
                                        <a-empty description="请选择左侧菜单项"/>
                                </div>
                        </div>
                </div>
        </a-card>
</template>

<script setup>
import {computed, reactive, ref} from 'vue';
import {useAppStore} from '../../../../stores/app.js';
import BasicSetting from '../../../../components/Website/components/BasicSetting.vue';
import SmtpSetting from '../../../../components/Website/components/SmtpSetting.vue';
import OssSetting from '../../../../components/Website/components/OssSetting.vue';
import CustomSetting from '../../../../components/Website/components/CustomSetting.vue';

function getItem(label, key) {
        return {
                label,
                key,
        };
}

// 使用 app store 获取设备状态
const appStore = useAppStore();
const isMobile = computed(() => appStore.isMobile);

// 根据设备类型动态设置菜单模式
const menuMode = computed(() => isMobile.value ? 'horizontal' : 'inline');

// 当前显示的视图
const currentView = ref('1');

// 处理菜单点击事件
const handleMenuClick = ({key}) => {
        currentView.value = key;
        // 更新选中的菜单项
        state.selectedKeys = [key];
};

const items = reactive([

        getItem('网站基本设置', '1'),
        getItem('SMTP邮箱', '2'),
        getItem('OSS存储', '3'),
        getItem('自定义配置', '4'),

]);
const state = reactive({
        rootSubmenuKeys: ['sub1', 'sub2', 'sub4'],
        openKeys: ['sub1'],
        selectedKeys: ['1'], // 默认选中第一项
});
const onOpenChange = openKeys => {
        const latestOpenKey = openKeys.find(key => state.openKeys.indexOf(key) === -1);
        if (state.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
                state.openKeys = openKeys;
        } else {
                state.openKeys = latestOpenKey ? [latestOpenKey] : [];
        }
};
</script>

