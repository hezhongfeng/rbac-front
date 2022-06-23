<template>
  <n-modal
    preset="dialog"
    title="重置密码"
    class="reset-pw"
    positive-text="确认"
    negative-text="取消"
    :mask-closable="false"
    :show="show"
    :disabled="formDisabled"
    @update:show="onChangeModel"
    @positive-click="submitCallback"
  >
    <n-form ref="formRef" :model="model" class="form">
      <n-form-item path="username" label="用户名">
        <n-input v-model:value="model.username" placeholder="请输入用户名" :disabled="true" />
      </n-form-item>
      <n-form-item path="newPassword" label="密码">
        <n-input-group>
          <n-input v-model:value="model.newPassword" :disabled="true" show-password-on="mousedown" />
          <n-button type="primary" @click="onCopyPw">复制</n-button>
        </n-input-group>
      </n-form-item>
    </n-form>
  </n-modal>
</template>

<script setup>
import { ref, toRefs, watch } from 'vue';
import { useMessage } from 'naive-ui';
import http from '@/utils/http';
import urls from '@/common/urls';
import { generalPassword } from '@/utils/utils.js';
import * as clipboard from 'clipboard-polyfill/text';

const props = defineProps({
  itemId: {
    type: Number,
    required: true
  },
  show: Boolean
});

const emit = defineEmits(['model-show-change', 'refresh-list']);

const model = ref({
  username: null,
  newPassword: ''
});

const { show, itemId } = toRefs(props);
const message = useMessage();
const formDisabled = ref(false);

const onChangeModel = () => {
  emit('model-show-change');
};

const resetPW = () => {
  formDisabled.value = true;
  const params = {
    newPassword: model.value.newPassword
  };
  http
    .put(`${urls.user.adminUser}/${itemId.value}/password`, params)
    .then(() => {
      message.success('重置成功!');
      emit('model-show-change');
    })
    .catch(err => {
      message.warning(err.message);
    })
    .finally(() => {
      formDisabled.value = false;
    });
};

const getUser = () => {
  http
    .get(`${urls.user.adminUser}/${itemId.value}`)
    .then(({ data }) => {
      model.value.username = data.username;
    })
    .catch(err => {
      message.warning(err.message);
    });
};

watch(show, val => {
  if (val) {
    model.value.newPassword = generalPassword();
    getUser();
  }
});

const submitCallback = () => {
  resetPW();

  // 禁止默认的关闭 model 行为
  return false;
};

const onCopyPw = () => {
  clipboard.writeText(model.value.newPassword).then(
    () => {
      message.success('复制成功');
    },
    () => {
      console.log('error!');
    }
  );
};
</script>

<style lang="scss">
.reset-pw {
}
</style>
