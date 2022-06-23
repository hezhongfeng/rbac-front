<template>
  <div class="biz-table-header">
    <biz-table-operations :operations="operations" @operate="onOperate"> </biz-table-operations>
  </div>
</template>

<script setup>
import BizTableOperations from './BizTableOperations.vue';

defineProps({
  operations: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['operate']);

const onOperate = function (name) {
  emit('operate', name);
};
</script>

<style lang="scss">
.biz-table-header {
}
</style>
