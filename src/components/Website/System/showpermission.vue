<!--
  - [showpermission.vue]
  - -------------------------------------------------------------------------------
  - This software is licensed under the MIT License.
  - However, any distribution or modification must retain this copyright notice.
  - See LICENSE for full terms.
  - -------------------------------------------------------------------------------
  - author: "Jiu Liu"
  - author_contact: "QQ: 3209174373, GitHub: https://github.com/DCSCDF"
  - license: "MIT"
  - license_exception: "Mandatory attribution retention"
  - UpdateTime: 2026/2/3 22:48
  -
  -->
<template>
        <a-card>
                <div class="flex justify-between items-start mb-4">
                        <div class="flex items-center">
                                <h2 class="font-bold text-lg whitespace-nowrap">权限列表</h2>
                                <span
                                    class="text-sm text-gray-600 ml-2">( 当前仅作为查看权限用，无法修改。 )</span>
                        </div>

                </div>
                <a-table :columns="columns" :data-source="data" :pagination="{ pageSize: 20 }"
                         :scroll="{ x:800 }"
                         table-layout="fixed">
                        <template #bodyCell="{ column }">
                                <template v-if="column.key === 'operation'">
                                        <a>查看</a>
                                </template>
                        </template>
                </a-table>

        </a-card>
</template>
<script setup>

const columns = [
        {
                title: '排序顺序',
                dataIndex: 'order',
                key: 'order',
                width: 16,
        },
        {
                title: '权限编码',
                width: 30,
                dataIndex: 'code',
                key: 'code',

        },
        {
                title: '权限名称',
                width: 30,
                dataIndex: 'name',
                key: 'name',

        },
        {
                title: '权限描述',
                dataIndex: 'description',
                key: 'description',
                width: 40,
        },
        {
                title: '操作',
                key: 'operation',
                fixed: 'right',
                width: 12,
        },
];
const data = [];
for (let i = 0; i < 32; i++) {
        data.push({
                order: i,
                name: `权限名称 ${i}`,
                description: `权限描述权限描述. ${i}`,
                code: `权限编码. ${i}`,
        });
}

</script>