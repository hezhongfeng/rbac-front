<template>
  <n-layout :position="fixedMenu" has-sider>
    <!-- 左侧边栏 -->
    <n-layout-sider
      :position="fixedMenu"
      :collapsed="collapsed"
      collapse-mode="width"
      :collapsed-width="64"
      :width="leftMenuWidth"
      :native-scrollbar="false"
      class="layout-sider"
      @expand="collapsed = false"
      @collapse="collapsed = true"
    >
      <Logo :collapsed="collapsed" />
      <AsideMenu v-model:collapsed="collapsed" v-model:location="getMenuLocation" />
    </n-layout-sider>

    <!-- 中间内容 -->
    <n-layout>
      <n-layout-header>
        <PageHeader v-model:collapsed="collapsed" />
      </n-layout-header>
      <n-layout-content>
        <MainView />
      </n-layout-content>
    </n-layout>
  </n-layout>
</template>

<script setup name="layout">
import { ref, unref, computed } from 'vue';
import Logo from './components/Logo/Logo.vue';
import MainView from './components/Main/Main.vue';
import AsideMenu from './components/Menu/Menu.vue';
import PageHeader from './components/Header/Header.vue';

const getMenuSetting = {
  //最小宽度
  minMenuWidth: 64,
  //菜单宽度
  menuWidth: 200,
  //固定菜单
  fixed: true,
  //分割菜单
  mixMenu: false
};

const collapsed = ref(false);

const fixedMenu = 'absolute';

const leftMenuWidth = computed(() => {
  const { minMenuWidth, menuWidth } = unref(getMenuSetting);
  return collapsed.value ? minMenuWidth : menuWidth;
});

const getMenuLocation = computed(() => {
  return 'left';
});
</script>

<style lang="scss">
.n-layout {
  background-color: transparent;
  .layout-sider {
    min-height: 100vh;
    box-shadow: 2px 0 8px 0 rgb(29 35 41 / 5%);
    position: relative;
    z-index: 13;
    transition: all 0.2s ease-in-out;
  }

  .layout-sider-fix {
    position: fixed;
    top: 0;
    left: 0;
  }

  // 中间区域
  .n-layout {
    > .n-layout-scroll-container {
      display: flex;
      flex-direction: column;
      height: 100vh;
      .n-layout-content {
        height: calc(100vh - 55px);
        .n-layout-scroll-container {
          height: 100%;
        }
      }
    }
  }
}
</style>
