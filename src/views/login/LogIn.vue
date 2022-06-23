<template>
  <div class="login">
    <div class="view-top">
      <div class="view-account-top-logo">
        <div class="logo-wrapper">
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
          >
            <path
              d="M501.093587 349.205672V1024L40.634921 135.417228z m21.812826 0.08127V1024L983.365079 135.520169zM51.400466 120.133079L512 0v330.584042z m921.199068 0L512 0v330.584042z"
              fill="#09b3af"
              p-id="3062"
            />
          </svg>
        </div>

        <div class="logo-text">松果认证</div>
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
import { useIndexStore } from '@/store/index';
import { useRouter } from 'vue-router';

const indexStore = useIndexStore();
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
      indexStore.updateToken(data.token);
      indexStore.updateUserId(data.user);
      indexStore.getCurrentUser(() => {
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
    margin-top: 30%;
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
          width: 80px;
          height: 80px;
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
