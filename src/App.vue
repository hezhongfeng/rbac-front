<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <n-dialog-provider>
      <n-message-provider>
        <router-view />
      </n-message-provider>
    </n-dialog-provider>
  </n-config-provider>
</template>

<script setup name="App">

const themeOverrides = {
  common: {
    primaryColor: '#09b3af',
    primaryColorHover: '#09b3afbf',
    primaryColorPressed: '#089b97',
    primaryColorFocus: '##089b97'
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
