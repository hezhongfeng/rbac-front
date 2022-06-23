<template>
  <n-grid cols="1" responsive="screen">
    <n-grid-item class="safety-setting">
      <n-list>
        <n-list-item>
          <template #suffix>
            <n-button type="primary" text @click="onUpdatePassword">修改</n-button>
          </template>
          <n-thing title="账户密码">
            <template #description><span style="color: rgba(156, 163, 175)">定期更新密码，账号更安全</span></template>
          </n-thing>
        </n-list-item>
      </n-list>
    </n-grid-item>
  </n-grid>

  <n-modal
    v-model:show="showModal"
    preset="dialog"
    title="修改密码"
    positive-text="确定"
    negative-text="取消"
    @positive-click="submitCallback"
  >
    <n-form ref="formRef" :model="model" class="form" :rules="rules">
      <n-form-item path="password" label="原密码">
        <n-input
          v-model:value="model.password"
          placeholder="请输入原密码"
          show-password-on="mousedown"
          type="password"
          @keydown.enter.prevent
        />
      </n-form-item>
      <n-form-item path="newPassword" label="新密码">
        <n-input
          v-model:value="model.newPassword"
          placeholder="请输入新密码"
          show-password-on="mousedown"
          type="password"
          @keydown.enter.prevent
        />
      </n-form-item>
      <n-form-item path="reNewPassword" label="确认新密码">
        <n-input
          v-model:value="model.reNewPassword"
          placeholder="请输入确认新密码"
          show-password-on="mousedown"
          type="password"
          @keydown.enter.prevent
        />
      </n-form-item>
    </n-form>
  </n-modal>
</template>

<script setup>
import { ref, nextTick, watch } from 'vue';
import { useMessage } from 'naive-ui';
import http from 'utils/http';
import urls from '@/common/urls';
import { useRouter } from 'vue-router';
import { useIndexStore } from '@/store/index';

const message = useMessage();

const showModal = ref(false);
const formRef = ref(null);

const router = useRouter();
const indexStore = useIndexStore();

const userInfo = indexStore.userInfo;


const model = ref({
  password: '',
  newPassword: '',
  reNewPassword: ''
});

const onUpdatePassword = () => {
  showModal.value = true;
};

const submitCallback = () => {
  formRef.value.validate(errors => {
    if (!errors) {
      updatePassword();
    }
  });

  // 禁止默认的关闭 model 行为
  return false;
};

const updatePassword = () => {
  http
    .put(`${urls.user.user}/${userInfo.userId}/password`, {
      password: model.value.password,
      newPassword: model.value.newPassword
    })
    .then(() => {
      showModal.value = false;
      message.success('修改成功，请重新登录');
      store.commit('updateToken', '');
      store.commit('updateUserId', null);
      // 等待清除我完毕
      nextTick(() => {
        router.push('/login');
      });
    })
    .catch(err => {
      message.error(err.message);
    });
};

function validateRePasswordSame(rule, value) {
  return value === model.value.newPassword;
}
const validatePassword = (rule, value, callback) => {
  // 最少6-20位，包括至少1个大写字母，1个小写字母，1个数字，1个特殊字符
  const regex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!@#$%^&*?_]).{6,20}$/;
  if (!regex.test(value)) {
    return false;
  }
  return true;
};

watch(showModal, () => {
  if (showModal.value) {
    model.value.password = '';
    model.value.newPassword = '';
    model.value.reNewPassword = '';
  }
});

const rules = {
  password: {
    required: true,
    message: '请输入原密码',
    trigger: 'blur'
  },
  newPassword: [
    {
      required: true,
      message: '请输入新密码',
      trigger: 'blur'
    },
    {
      validator: validatePassword,
      trigger: ['input', 'blur'],
      message: '密码长度在 6 到 20 个字符，包括至少1个大写字母，1个小写字母，1个数字，1个特殊字符'
    }
  ],
  reNewPassword: [
    {
      required: true,
      message: '请输入确认新密码',
      trigger: 'blur'
    },
    {
      validator: validateRePasswordSame,
      message: '两次密码输入不一致',
      trigger: ['blur']
    }
  ]
};
</script>

<style lang="scss">
.safety-setting {
  width: 380px;
}
</style>
