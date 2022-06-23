<template>
  <div class="logo">
    <svg
      t="1629335372672"
      class="image"
      viewBox="0 0 1024 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      p-id="3061"
      width="400"
      height="400"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      :class="{ small: collapsed }"
    >
      <path
        d="M501.093587 349.205672V1024L40.634921 135.417228z m21.812826 0.08127V1024L983.365079 135.520169zM51.400466 120.133079L512 0v330.584042z m921.199068 0L512 0v330.584042z"
        fill="#09b3af"
        p-id="3062"
      />
    </svg>
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
    width: 32px;
    height: 32px;
    transition: all 0.5s;
  }
  .small {
    transform: scale(0.7);
  }
  .title {
    margin: 0;
    margin-left: 10px;
    font-size: 21px;
    font-weight: 600;
  }
}
</style>
