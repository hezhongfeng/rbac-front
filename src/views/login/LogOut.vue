<template>
  <div class="logout" />
</template>

<script setup name="LogOut">
import { onMounted, nextTick } from 'vue';
import { useRootStore } from '@/store/root';
import { useRouter } from 'vue-router';

onMounted(() => {
  logout();
});

const root = useRootStore();
const router = useRouter();

const logout = () => {
  root.updateToken('');
  root.updateUserId(null);
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
