<template>


        <a-card
            :active-tab-key="noTitleKey"
            :tab-list="tabListNoTitle"
            style="width: 100%"
            @tabChange="key => onTabChange(key, 'noTitleKey')"
        >
                <div v-if="noTitleKey === '我的信息'">
                        <div class="py-3 ">

                                <!--                                        <a-form-item class="" label="用户名">-->
                                <!--                                                <span class="text-gray-500">username</span>-->
                                <!--                                        </a-form-item>-->
                                <a-form

                                    layout="vertical"
                                    style="max-width: 400px;margin: auto"
                                >

                                        <a-form-item label="昵称">
                                                <a-input placeholder="username">
                                                        <template #prefix>
                                                                <user-outlined/>
                                                        </template>
                                                        <template #suffix>
                                                                <a-tooltip title="Extra information">
                                                                        <info-circle-outlined
                                                                            style="color: rgba(0, 0, 0, 0.45)"/>
                                                                </a-tooltip>
                                                        </template>
                                                </a-input>
                                        </a-form-item>

                                        <a-form-item label="邮箱">
                                                <a-input/>
                                        </a-form-item>

                                        <Captcha ref="captchaRef"></Captcha>

                                        <!--                                        <a-form-item label="创建日期">-->
                                        <!--                                                <a-input style="max-width: 300px;"/>-->
                                        <!--                                        </a-form-item>-->
                                </a-form>
                        </div>

                        <a-divider/>

                        <div class="flex justify-center gap-3.75">
                                <a-button
                                    type="primary">保存更改
                                </a-button>

                        </div>
                </div>
                <div v-else-if="noTitleKey === '我的头像'">
                        <div class="flex flex-col items-center justify-center">
                                <a-image
                                    :height="150"
                                    :preview="false"
                                    :width="150"
                                    class="rounded-md border-4 border-gray-200 transition-all duration-300 hover:border-blue-400 hover:scale-105"
                                    fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3PTWBSGcbGzM6GCKqlIBRV0dHRJFarQ0eUT8LH4BnRU0NHR0UEFVdIlFRV7TzRksomPY8uykTk/zewQfKw/9znv4yvJynLv4uLiV2dBoDiBf4qP3/ARuCRABEFAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghgg0Aj8i0JO4OzsrPv69Wv+hi2qPHr0qNvf39+iI97soRIh4f3z58/u7du3SXX7Xt7Z2enevHmzfQe+oSN2apSAPj09TSrb+XKI/f379+08+A0cNRE2ANkupk+ACNPvkSPcAAEibACyXUyfABGm3yNHuAECRNgAZLuYPgEirKlHu7u7XdyytGwHAd8jjNyng4OD7vnz51dbPT8/7z58+NB9+/bt6jU/TI+AGWHEnrx48eJ/EsSmHzx40L18+fLyzxF3ZVMjEyDCiEDjMYZZS5wiPXnyZFbJaxMhQIQRGzHvWR7XCyOCXsOmiDAi1HmPMMQjDpbpEiDCiL358eNHurW/5SnWdIBbXiDCiA38/Pnzrce2YyZ4//59F3ePLNMl4PbpiL2J0L979+7yDtHDhw8vtzzvdGnEXdvUigSIsCLAWavHp/+qM0BcXMd/q25n1vF57TYBp0a3mUzilePj4+7k5KSLb6gt6ydAhPUzXnoPR0dHl79WGTNCfBnn1uvSCJdegQhLI1vvCk+fPu2ePXt2tZOYEV6/fn31dz+shwAR1sP1cqvLntbEN9MxA9xcYjsxS1jWR4AIa2Ibzx0tc44fYX/16lV6NDFLXH+YL32jwiACRBiEbf5KcXoTIsQSpzXx4N28Ja4BQoK7rgXiydbHjx/P25TaQAJEGAguWy0+2Q8PD6/Ki4R8EVl+bzBOnZY95fq9rj9zAkTI2SxdidBHqG9+skdw43borCXO/ZcJdraPWdv22uIEiLA4q7nvvCug8WTqzQveOH26fodo7g6uFe/a17W3+nFBAkRYENRdb1vkkz1CH9cPsVy/jrhr27PqMYvENYNlHAIesRiBYwRy0V+8iXP8+/fvX11Mr7L7ECueb/r48eMqm7FuI2BGWDEG8cm+7G3NEOfmdcTQw4h9/55lhm7DekRYKQPZF2ArbXTAyu4kDYB2YxUzwg0gi/41ztHnfQG26HbGel/crVrm7tNY+/1btkOEAZ2M05r4FB7r9GbAIdxaZYrHdOsgJ/wCEQY0J74TmOKnbxxT9n3FgGGWWsVdowHtjt9Nnvf7yQM2aZU/TIAIAxrw6dOnAWtZZcoEnBpNuTuObWMEiLAx1HY0ZQJEmHJ3HNvGCBBhY6jtaMoEiJB0Z29vL6ls58vxPcO8/zfrdo5qvKO+d3Fx8Wu8zf1dW4p/cPzLly/dtv9Ts/EbcvGAHhHyfBIhZ6NSiIBTo0LNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiEC/wGgKKC4YMA4TAAAAABJRU5ErkJggg=="
                                    src="https://www.antdv.com/#error"

                                />
                                <a-divider/>
                                <a-button

                                    type="primary">
                                        上传头像
                                </a-button>

                        </div>
                </div>
                <div v-else-if="noTitleKey === '修改密码'">
                        <div class="py-3">
                                <a-form


                                    layout="vertical"
                                    style="max-width: 400px;margin: auto"
                                >
                                        <a-form-item class="mb-4" label="当前密码">
                                                <a-input-password
                                                    class="rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"/>
                                        </a-form-item>
                                        <a-form-item class="mb-4" label="新密码">
                                                <a-input-password
                                                    class="rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"/>
                                        </a-form-item>
                                        <a-form-item class="mb-4" label="确认新密码">
                                                <a-input-password
                                                    class="rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"/>
                                        </a-form-item>
                                        <Captcha ref="captchaRef"></Captcha>
                                </a-form>

                        </div>

                        <a-divider/>

                        <div class="flex  justify-center">
                                <a-button

                                    type="primary">
                                        更新密码
                                </a-button>
                        </div>


                </div>
                <!--                <template #tabBarExtraContent>-->
                <!--                        <a href="#">More</a>-->
                <!--                </template>-->
        </a-card>
</template>

<script setup>
import {ref} from 'vue';
import {InfoCircleOutlined, UserOutlined} from '@ant-design/icons-vue';
import Captcha from "../../components/auth/Captcha.vue";

const tabListNoTitle = [
        {
                key: '我的信息',
                tab: '我的信息',
        },
        {
                key: '我的头像',
                tab: '我的头像',
        },
        {
                key: '修改密码',
                tab: '修改密码',
        },
];
const key = ref('tab1');
const noTitleKey = ref('我的信息');

const onTabChange = (value, type) => {
        console.log(value, type);
        if (type === 'key') {
                key.value = value;
        } else if (type === 'noTitleKey') {
                noTitleKey.value = value;
        }
};
</script>

<style scoped>

</style>