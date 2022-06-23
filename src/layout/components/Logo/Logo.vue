<template>
  <div class="logo">
    <img class="image" :class="{ small: collapsed }" src="~/assets/logo.svg" />
    <div v-show="!collapsed" class="title">松果认证</div>
  </div>
</template>

<script setup name="Logo">
defineProps({
  collapsed: {
    type: Boolean
  }
});
</script>

<style lang="scss" scoped>
.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 64px;
  line-height: 64px;
  overflow: hidden;
  white-space: nowrap;

  .image {
    width: 50px;
    height: 50px;
    transition: all 0.5s;
  }
  .small {
    transform: scale(0.8);
  }
  .title {
    margin: 0;
    margin-left: 10px;
    font-size: 21px;
    font-weight: 600;
  }
}
</style>
