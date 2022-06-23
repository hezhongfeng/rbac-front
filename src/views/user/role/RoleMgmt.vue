<template>
  <div class="role-mgmt">
    <biz-table
      :operations="operations"
      :loading="loading"
      :columns="columns"
      :data="tableData"
      :pagination="pagination"
      :row-key="rowKey"
      :checked-row-keys="checkedRowKeys"
      @operate="onOperate"
      @update:checked-row-keys="onCheckedRow"
      @update:page="onUpdatePage"
      @update:page-size="onUpdatePageSize"
    />

    <role-item
      :show="showModel"
      :permissions="permissions"
      :item-id="itemId"
      @model-show-change="onModelShowChange"
      @refresh-list="queryList"
    />
  </div>
</template>

<script setup name="user-mgmt">
import { h, ref, computed } from 'vue';
import BizTable from '@/components/table/BizTable.vue';
import RoleItem from './RoleItem.vue';
import { NButton } from 'naive-ui';
import useQueryList from '@/composables/useQueryList';
import useDeleteList from '@/composables/useDeleteList';
import urls from '@/common/urls';
import dayjs from 'dayjs';

const columns = [
  {
    type: 'selection'
  },
  {
    title: '角色名称',
    key: 'name'
  },
  {
    title: '创建时间',
    key: 'createdTime'
  },
  {
    title: '更新时间',
    key: 'updatedTime'
  },
  {
    title: '简介',
    key: 'description'
  },
  {
    title: '权限',
    key: 'permissions',
    render(row) {
      const tags = row.permissions.map(permission => {
        return h('div', {}, permission.name);
      });
      return tags;
    }
  },
  {
    title: '操作',
    key: 'actions',
    render(row) {
      return [
        h(
          NButton,
          {
            size: 'small',
            onClick: () => onEdit(row),
            style: { marginRight: '5px' }
          },
          { default: () => '编辑' }
        )
      ];
    }
  }
];

const { data: permissionsData } = useQueryList(urls.user.adminPermission, undefined, 9999);

const permissions = computed(() => {
  return permissionsData.value.list;
});

const { data, loading, pagination, onUpdatePage, onUpdatePageSize, queryList } = useQueryList(urls.user.adminRole);

// 列表数据
const tableData = computed(() =>
  data.value.list.map(item => {
    return {
      ...item,
      createdTime: dayjs(item.createdTime).format('YYYY-MM-DD HH:mm:ss'),
      updatedTime: dayjs(item.updatedTime).format('YYYY-MM-DD HH:mm:ss')
    };
  })
);

// 删除列表相关逻辑
const { checkedRowKeys, onCheckedRow, deleteList } = useDeleteList({
  content: '确定删除选中的角色？',
  url: urls.user.adminRole,
  callback: () => {
    queryList();
  }
});

const operations = computed(() => {
  return [
    {
      name: 'create',
      label: '新增',
      type: 'primary'
    },
    {
      name: 'delete',
      label: '删除',
      disabled: checkedRowKeys.value.length === 0
    }
  ];
});

const onOperate = function (name) {
  operationFucs.get(name)();
};

const create = () => {
  showModel.value = true;
  itemId.value = 0;
};

const onModelShowChange = () => {
  showModel.value = !showModel.value;
};

const itemId = ref(0);

const showModel = ref(false);

const onEdit = row => {
  itemId.value = row.id;
  showModel.value = true;
};

const rowKey = row => row['id'];

// operation 函数集合
const operationFucs = new Map();
operationFucs.set('create', create);
operationFucs.set('delete', deleteList);
</script>

<style lang="scss">
.role-mgmt {
  height: 100%;
}
</style>
