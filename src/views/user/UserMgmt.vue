<template>
  <div class="user-mgmt">
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
    <user-item
      :show="showModel"
      :roles="roles"
      :organizations="organizations"
      :clients="clients"
      :item-id="itemId"
      @model-show-change="onModelShowChange"
      @refresh-list="queryList"
    />

    <reset-password
      :show="resetModelShow"
      :item-id="itemId"
      @model-show-change="onResetModelShowChange"
      @refresh-list="queryList"
    />
  </div>
</template>

<script setup name="user-mgmt">
import { h, ref, computed } from 'vue';
import BizTable from '@/components/table/BizTable.vue';
import UserItem from './UserItem.vue';
import ResetPassword from './ResetPassword.vue';
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
    title: '用户名',
    key: 'username'
  },
  {
    title: '昵称',
    key: 'nickname'
  },
  {
    title: '创建时间',
    key: 'createdTime'
  },
  {
    title: '电话号码',
    key: 'tel'
  },
  {
    title: '机构',
    key: 'organization',
    render: row => row.organization?.name || '--'
  },
  {
    title: '角色',
    key: 'roles',
    render(row) {
      const tags = row.roles.map(role => {
        return h('div', {}, role.name);
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
        ),
        h(
          NButton,
          {
            size: 'small',
            onClick: () => onResetPasswordd(row)
          },
          { default: () => '重置密码' }
        )
      ];
    }
  }
];

const { data: rolesData } = useQueryList(urls.user.adminRole, undefined, 9999);

const roles = computed(() => {
  return rolesData.value.list;
});

const { data: organizationsData } = useQueryList(urls.organization.list, undefined, 9999);

const organizations = computed(() => {
  return organizationsData.value.list;
});

const { data: clientsData } = useQueryList(urls.client.list, undefined, 9999);

const clients = computed(() => {
  return clientsData.value.list;
});

const { data, loading, pagination, onUpdatePage, onUpdatePageSize, queryList } = useQueryList(urls.user.adminUser);

// 列表数据
const tableData = computed(() =>
  data.value.list.map(item => {
    return {
      ...item,
      createdTime: dayjs(item.createdTime).format('YYYY-MM-DD HH:mm:ss')
    };
  })
);

// 删除列表相关逻辑
const { checkedRowKeys, onCheckedRow, deleteList } = useDeleteList({
  content: '确定删除选中的用户？',
  url: urls.user.adminUser,
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

const onResetModelShowChange = () => {
  resetModelShow.value = !resetModelShow.value;
};

const itemId = ref(0);

const showModel = ref(false);
const resetModelShow = ref(false);

const onResetPasswordd = row => {
  itemId.value = row.id;
  resetModelShow.value = true;
};

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
.user-mgmt {
  height: 100%;
}
</style>
