<template>
  <div class="logout" />
</template>

<script setup name="LogOut">
import { onMounted, nextTick } from 'vue';
import { useIndexStore } from '@/store/index';
import { useRouter } from 'vue-router';

onMounted(() => {
  logout();
});

const indexStore = useIndexStore();
const router = useRouter();

const logout = () => {
  indexStore.updateToken('');
  indexStore.updateUserId(null);
  // 等待清除完毕
  nextTick(() => {
    router.push('/login');
  });
};
</script>

<style lang="scss">
.logout {
}
</style>
