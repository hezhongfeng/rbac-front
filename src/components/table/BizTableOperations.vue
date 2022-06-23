<template>
  <div class="biz-table-operations">
    <n-button
      v-for="operation in operations"
      :key="operation.name"
      :size="operation.size"
      :disabled="operation.disabled"
      :class="operation.class"
      :type="operation.type"
      @click="onOperate(operation.name)"
    >
      {{ operation.label }}
    </n-button>
  </div>
</template>

<script setup>
defineProps({
  operations: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['operate']);

const onOperate = name => {
  emit('operate', name);
};
</script>

<style lang="scss">
.biz-table-operations {
  margin-top: 5px;
  margin-bottom: 5px;
  margin-left: 15px;
  .n-button {
    margin-top: 5px;
    margin-right: 5px;
    margin-bottom: 5px;
  }
}
</style>
