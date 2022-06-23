<template>
  <div class="biz-table-list">
    <n-data-table
      ref="table"
      :loading="loading"
      :columns="columns"
      :data="data"
      :row-key="rowKey"
      :checked-row-keys="checkedRowKeys"
      @update:checked-row-keys="onCheckedRow"
    />
  </div>
</template>

<script setup>
defineProps({
  loading: {
    type: Boolean,
    default: false
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

const emit = defineEmits(['update:checkedRowKeys']);

const onCheckedRow = keys => {
  emit('update:checkedRowKeys', keys);
};
</script>

<style lang="scss">
.biz-table-list {
  height: calc(100% - 54px - 48px);
  overflow-y: auto;
}
</style>
