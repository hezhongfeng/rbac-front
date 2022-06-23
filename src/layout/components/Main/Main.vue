<template>
  <RouterView>
    <template #default="{ Component, route }">
      <transition :name="getTransitionName" mode="out-in" appear>
        <component :is="Component" :key="route.fullPath" />
      </transition>
    </template>
  </RouterView>
</template>

<script setup name="MainView">
import { computed, unref } from 'vue';

const getTransitionName = computed(() => {
  return unref('zoom-fade');
});
</script>

<style lang="less" scoped></style>
