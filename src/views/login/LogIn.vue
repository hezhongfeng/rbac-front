<template>
  <div class="login">
    <div class="view-top">
      <div class="view-account-top-logo">
        <div class="logo-wrapper">
          <img class="image" src="~/assets/logo.svg" alt="logo" />
        </div>
      </div>
    </div>
    <n-form ref="formRef" :model="model" class="form" :rules="rules">
      <n-form-item path="username" label="用户名">
        <n-input v-model:value="model.username" placeholder="请输入用户名" @keydown.enter.prevent />
      </n-form-item>
      <n-form-item path="password" label="密码">
        <n-input
          v-model:value="model.password"
          placeholder="请输入密码"
          show-password-on="mousedown"
          type="password"
          @keydown.enter.prevent
        />
      </n-form-item>
      <n-form-item>
        <n-button type="primary" size="large" :loading="loading" block @click="handleValidateButtonClick">
          登录
        </n-button>
      </n-form-item>
    </n-form>
  </div>
</template>

<script setup name="LogIn">
import { ref } from 'vue';
import { useMessage } from 'naive-ui';
import http from 'utils/http';
import { useRootStore } from '@/store/root';
import { useRouter } from 'vue-router';

const root = useRootStore();
const router = useRouter();
const formRef = ref(null);
const message = useMessage();

const loading = ref(false);

const model = ref({
  username: null,
  password: null
});

const login = () => {
  loading.value = true;
  http
    .post('/api/v1/login', {
      username: model.value.username,
      password: model.value.password
    })
    .then(async ({ data }) => {
      console.log('登录成功');
      message.success('登录成功!');
      root.updateToken(data.token);
      root.updateUserId(data.user);
      root.getCurrentUser(() => {
        // 跳转到主页
        router.push('/index/dashboard_console');
      });
    })
    .catch(err => {
      message.warning(err.message);
    })
    .finally(() => {
      loading.value = false;
    });
};

const handleValidateButtonClick = function (e) {
  e.preventDefault();
  formRef.value.validate(errors => {
    if (!errors) {
      login();
    } else {
      console.log(errors);
    }
  });
};

const rules = {
  username: { required: true, message: '请输入用户名', trigger: 'blur' },
  password: { required: true, message: '请输入密码', trigger: 'blur' }
};
</script>

<style lang="scss">
.login {
  padding: 8px 0;
  width: 384px;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  .view-top {
    margin-top: 10%;
    margin-bottom: 10%;
    text-align: center;
    width: 100%;
    .view-account-top-logo {
      display: flex;
      font-size: 40px;
      font-weight: 600;
      width: 100%;
      justify-content: center;
      align-items: center;
      .logo-wrapper {
        display: flex;
        align-items: center;
        .image {
          width: 200px;
          height: 200px;
        }
      }
      .logo-text {
        margin-left: 5%;
        color: #2c3e50da;
      }
    }
  }
  .form {
    padding: 20px;
    box-shadow: 0 0 7px #ddd;
  }
}
</style>
