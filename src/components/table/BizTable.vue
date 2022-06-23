<template>
  <div class="biz-table">
    <biz-table-header :operations="operations" @operate="onOperate"></biz-table-header>
    <biz-table-list
      :columns="columns"
      :data="data"
      :loading="loading"
      :row-key="rowKey"
      :checked-row-keys="checkedRowKeys"
      @update:checked-row-keys="onCheckedRow"
    >
    </biz-table-list>

    <div class="biz-pagination">
      <n-pagination
        show-size-picker
        :page="pagination.page"
        :item-count="pagination.itemCount"
        :page-size="pagination.pageSize"
        @update:page="onUpdatePage"
        @update:page-size="onUpdatePageSize"
      />
    </div>
  </div>
</template>

<script setup>
import BizTableHeader from './BizTableHeader.vue';
import BizTableList from './BizTableList.vue';

defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  operations: {
    type: Array,
    default: () => []
  },
  pagination: {
    type: Object,
    default: () => ({})
  },
  data: {
    type: Array,
    default: () => []
  },
  columns: {
    type: Array,
    default: () => []
  },
  rowKey: {
    type: Function,
    default: () => 'id'
  },
  checkedRowKeys: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['update:checkedRowKeys', 'operate', 'update:page', 'update:page-size']);

const onOperate = function (name) {
  emit('operate', name);
};

const onCheckedRow = keys => {
  emit('update:checkedRowKeys', keys);
};

const onUpdatePage = page => {
  emit('update:page', page);
};

const onUpdatePageSize = pageSize => {
  emit('update:page-size', pageSize);
};
</script>

<style lang="scss">
.biz-table {
  display: flex;
  flex-direction: column;
  height: 100%;
  .biz-pagination {
    margin-top: 10px;
    margin-bottom: 10px;
    .n-pagination {
      justify-content: flex-end;
    }
  }
}
</style>
