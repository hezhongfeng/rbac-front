<template>
  <n-grid cols="2 s:2 m:2 l:3 xl:3 2xl:3" responsive="screen">
    <n-grid-item>
      <n-form ref="formRef" :label-width="80" :model="formValue" :rules="rules">
        <n-form-item label="用户名" path="username">
          <n-input v-model:value="formValue.username" disabled />
        </n-form-item>

        <n-form-item label="昵称" path="nickname">
          <n-input v-model:value="formValue.nickname" placeholder="请输入昵称" />
        </n-form-item>

        <n-form-item label="联系电话" path="tel">
          <n-input v-model:value="formValue.tel" placeholder="请输入联系电话" />
        </n-form-item>

        <n-form-item label="邮箱" path="email">
          <n-input v-model:value="formValue.email" placeholder="请输入邮箱" />
        </n-form-item>

        <n-form-item label="简介" path="description">
          <n-input v-model:value="formValue.description" type="textarea" placeholder="请输入简介" />
        </n-form-item>

        <div>
          <n-space>
            <n-button type="primary" @click="onSave">保存</n-button>
          </n-space>
        </div>
      </n-form>
    </n-grid-item>
  </n-grid>
</template>

<script setup>
import { ref } from 'vue';
import { useMessage } from 'naive-ui';
import { useIndexStore } from '@/store/index';
import http from 'utils/http';

const rules = {
  nickname: [
    {
      required: true,
      message: '请输入昵称',
      trigger: 'blur'
    },
    {
      min: 2,
      max: 20,
      message: '昵称长度为 2-20 个字符',
      trigger: 'blur'
    }
  ],
  tel: {
    required: true,
    message: '请输入联系电话',
    trigger: 'blur'
  }
};
const formRef = ref(null);
const message = useMessage();

const indexStore = useIndexStore();

const userInfo = indexStore.userInfo;

// 使用当前的值初始化
const formValue = ref({
  username: userInfo.username,
  nickname: userInfo.nickname,
  tel: userInfo.tel,
  email: userInfo.email,
  description: userInfo.description
});

const save = () => {
  http
    .put(`/api/v1/users/${userInfo.userId}`, {
      id: userInfo.userId,
      nickname: formValue.value.nickname,
      tel: formValue.value.tel,
      email: formValue.value.email,
      description: formValue.value.description
    })
    .then(() => {
      message.success('保存成功');
      indexStore.getCurrentUser();
    })
    .catch(err => {
      message.error(err.message);
    });
};

function onSave() {
  formRef.value.validate(errors => {
    if (!errors) {
      save();
    } else {
      message.error('验证失败，请填写完整信息');
    }
  });
}
</script>
