<template>
  <div class="console">
    <n-card :title="nickname"> 早安，开始您一天的工作吧! </n-card>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRootStore } from '@/store/root';
const root = useRootStore();

console.log(root.userId);
console.log(root.refreshToken);

const nickname = computed(() => root.nickname);
</script>

<style lang="scss">
.console {
  margin-top: 10px;
  margin-left: 10px;
  margin-right: 10px;
}
</style>
