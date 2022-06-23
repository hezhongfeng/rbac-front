<template>
  <n-menu ref="menuInstRef" :options="asyncRoutes.menus" :value="selectedKey" @update:value="clickMenuItem" />
</template>

<script setup name="Menu">
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAsyncRoutes } from '@/store/asyncRoutes';

const menuInstRef = ref(null);

// 当前路由
const currentRoute = useRoute();

const router = useRouter();

const asyncRoutes = useAsyncRoutes();
// const store = useStore();

// const menus = computed(() => store.getters['asyncroute/getMenus']);

const selectedKey = ref('');

// 跟随页面路由变化，切换菜单选中状态
watch(
  () => currentRoute.fullPath,
  () => {
    if (currentRoute.name.toString() !== 'login') {
      selectedKey.value = currentRoute.name.toString();
    }
  }
);

// 首次进入时候需要更新下Key
onMounted(() => {
  if (currentRoute.name.toString() !== 'login') {
    selectedKey.value = currentRoute.name.toString();
    // 展开对应的菜单
    menuInstRef.value?.showOption(currentRoute.name.toString());
  }
});

// 点击菜单
function clickMenuItem(key) {
  router.push(key);
}
</script>
