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
import { useRootStore } from '@/store/root';
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
  ]
};
const formRef = ref(null);
const message = useMessage();

const root = useRootStore();

const userInfo = root.userInfo;

// 使用当前的值初始化
const formValue = ref({
  username: userInfo.username,
  nickname: userInfo.nickname,
  description: userInfo.description
});

const save = () => {
  http
    .put(`/api/v1/users/${userInfo.userId.value}`, {
      id: userInfo.userId.value,
      nickname: formValue.value.nickname,
      description: formValue.value.description
    })
    .then(() => {
      message.success('保存成功');
      root.getCurrentUser();
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
