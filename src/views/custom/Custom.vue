<template>
  <div class="custom">
    <n-card> {{ customData }} </n-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import http from '@/utils/http';
import urls from '@/common/urls';
import { useMessage } from 'naive-ui';

const loading = ref(false);

const message = useMessage();

const customData = ref('');

const getCustom = () => {
  loading.value = true;
  http
    .get(urls.custom.info)
    .then(responce => {
      customData.value = responce.data;
    })
    .catch(err => {
      message.warning(err.message);
    })
    .finally(() => {
      loading.value = false;
    });
};

onMounted(() => {
  getCustom();
});
</script>

<style lang="scss">
.custom {
  margin-top: 10px;
  margin-left: 10px;
  margin-right: 10px;
}
</style>
