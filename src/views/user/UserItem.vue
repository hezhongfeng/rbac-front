<template>
  <n-modal
    :mask-closable="false"
    :show="show"
    :disabled="formDisabled"
    preset="dialog"
    :title="title"
    class="user-item"
    positive-text="确认"
    negative-text="取消"
    @update:show="onChangeModel"
    @positive-click="submitCallback"
  >
    <n-form ref="formRef" :model="model" class="form" :rules="rules">
      <n-form-item label="用户名" path="username">
        <n-input v-model:value="model.username" placeholder="请输入用户名" :disabled="!!itemId" />
      </n-form-item>
      <n-form-item v-if="!itemId" path="password" label="密码">
        <n-input-group>
          <n-input v-model:value="model.password" :disabled="true" show-password-on="mousedown" />
          <n-button type="primary" @click="onCopyPw">复制</n-button>
        </n-input-group>
      </n-form-item>
      <n-form-item path="nickname" label="昵称">
        <n-input v-model:value="model.nickname" placeholder="请输入昵称" />
      </n-form-item>
      <n-form-item path="roleIds" label="角色">
        <n-checkbox-group v-model:value="model.roleIds">
          <n-space item-style="display: flex;">
            <n-checkbox
              v-for="role of roleOptions"
              :key="role.value"
              :value="role.value"
              :label="role.label"
              :disabled="role.label == '超级管理'"
            />
          </n-space>
        </n-checkbox-group>
      </n-form-item>
      <n-form-item path="description" label="简介">
        <n-input v-model:value="model.description" placeholder="请输入简介" type="textarea" />
      </n-form-item>
    </n-form>
  </n-modal>
</template>

<script setup name="user-item">
import { ref, toRefs, watch, computed } from 'vue';
import { generalPassword } from '@/utils/utils.js';
import http from '@/utils/http';
import urls from '@/common/urls';
import { useMessage } from 'naive-ui';
import * as clipboard from 'clipboard-polyfill/text';

const props = defineProps({
  itemId: {
    type: Number,
    required: true
  },
  show: Boolean,
  roles: {
    type: Array,
    required: true
  }
});

const { itemId, show, roles } = toRefs(props);

const emit = defineEmits(['model-show-change', 'refresh-list']);

const model = ref({
  roleIds: [],
  username: null,
  password: '',
  nickname: null,
  description: null
});
const formRef = ref(null);

const message = useMessage();

const onChangeModel = () => {
  emit('model-show-change');
};

const title = computed(() => {
  return itemId.value ? '编辑用户' : '新增用户';
});

const roleOptions = computed(() => {
  return roles.value.map(role => {
    return {
      label: role.name,
      value: role.id
    };
  });
});

const formDisabled = ref(false);

const createUser = () => {
  formDisabled.value = true;
  const params = {
    username: model.value.username,
    password: model.value.password,
    nickname: model.value.nickname,
    description: model.value.description,
    roleIds: model.value.roleIds
  };
  http
    .post(`${urls.user.adminUser}`, params)
    .then(() => {
      message.success('创建成功!');
      emit('model-show-change');
      emit('refresh-list');
    })
    .catch(err => {
      message.warning(err.message);
    })
    .finally(() => {
      formDisabled.value = false;
    });
};

watch(show, val => {
  if (val) {
    if (itemId.value) {
      getUser();
    } else {
      reSetDate();
    }
  }
});

// reset 数据
const reSetDate = () => {
  model.value.username = null;
  model.value.password = generalPassword();
  model.value.nickname = null;
  model.value.description = null;
  model.value.roleIds = [];
};

const getUser = () => {
  http
    .get(`${urls.user.adminUser}/${itemId.value}`)
    .then(({ data }) => {
      model.value.username = data.username;
      model.value.nickname = data.nickname;
      model.value.description = data.description;
      model.value.roleIds = data.roles.map(role => role.id);
    })
    .catch(err => {
      message.warning(err.message);
    });
};

const updateUser = () => {
  formDisabled.value = true;
  const params = {
    nickname: model.value.nickname,
    description: model.value.description,
    roleIds: model.value.roleIds
  };
  http
    .put(`${urls.user.adminUser}/${itemId.value}`, params)
    .then(() => {
      message.success('更新成功!');
      emit('model-show-change');
      emit('refresh-list');
    })
    .catch(err => {
      message.warning(err.message);
    })
    .finally(() => {
      formDisabled.value = false;
    });
};

const submitCallback = () => {
  formRef.value.validate(errors => {
    if (!errors) {
      if (itemId.value) {
        updateUser();
      } else {
        createUser();
      }
    } else {
      console.log(errors);
    }
  });

  // 禁止默认的关闭 model 行为
  return false;
};

const rules = {
  username: { required: true, message: '请输入用户名', trigger: 'blur' },
  password: { required: true, message: '请输入密码', trigger: 'blur' },
  nickname: { required: true, message: '请输入昵称', trigger: 'blur' }
};

const onCopyPw = () => {
  clipboard.writeText(model.value.password).then(
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
.user-item {
  .form {
    margin-top: 20px;
  }
}
</style>
