<template>
  <div class="console" @click="onClick">
    <n-card :title="nickname"> 早安，开始您一天的工作吧! </n-card>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useIndexStore } from '@/store/index';
const indexStore = useIndexStore();

const nickname = computed(() => indexStore.nickname);
</script>

<style lang="scss">
.console {
  margin-top: 10px;
  margin-left: 10px;
  margin-right: 10px;
}
</style>
