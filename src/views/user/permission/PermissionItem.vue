<template>
  <n-modal
    :mask-closable="false"
    :show="show"
    :disabled="formDisabled"
    preset="dialog"
    :title="title"
    class="permission-item"
    positive-text="确认"
    negative-text="取消"
    @update:show="onChangeModel"
    @positive-click="submitCallback"
  >
    <n-form ref="formRef" :model="model" class="form" :rules="rules">
      <n-form-item path="name" label="名称">
        <n-input v-model:value="model.name" placeholder="请输入权限名称" />
      </n-form-item>
      <n-form-item path="name" label="key">
        <n-input v-model:value="model.keyName" placeholder="请输入key" :disabled="!!itemId" />
      </n-form-item>
      <n-form-item path="description" label="简介">
        <n-input v-model:value="model.description" placeholder="请输入简介" type="textarea" />
      </n-form-item>
    </n-form>
  </n-modal>
</template>

<script setup name="permission-item">
import { ref, toRefs, watch, computed } from 'vue';
import http from '@/utils/http';
import urls from '@/common/urls';
import { useMessage } from 'naive-ui';

const props = defineProps({
  itemId: {
    type: Number,
    required: true
  },
  show: Boolean
});

const { itemId, show } = toRefs(props);

const emit = defineEmits(['model-show-change', 'refresh-list']);

const model = ref({
  name: null,
  keyName: null,
  description: null
});
const formRef = ref(null);

const title = computed(() => {
  return itemId.value ? '编辑权限' : '新增权限';
});

const message = useMessage();

const onChangeModel = () => {
  emit('model-show-change');
};

const formDisabled = ref(false);

const createPermission = () => {
  formDisabled.value = true;
  const params = {
    name: model.value.name,
    keyName: model.value.keyName,
    description: model.value.description
  };
  http
    .post(`${urls.user.adminPermission}`, params)
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
      getPermission();
    } else {
      reSetDate();
    }
  }
});

// reset 数据
const reSetDate = () => {
  model.value.name = null;
  model.value.keyName = null;
  model.value.description = null;
};

const getPermission = () => {
  http
    .get(`${urls.user.adminPermission}/${itemId.value}`)
    .then(({ data }) => {
      model.value.name = data.name;
      model.value.keyName = data.keyName;
      model.value.description = data.description;
    })
    .catch(err => {
      message.warning(err.message);
    });
};

const updatePermission = () => {
  formDisabled.value = true;
  const params = {
    name: model.value.name,
    description: model.value.description
  };
  http
    .put(`${urls.user.adminPermission}/${itemId.value}`, params)
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
        updatePermission();
      } else {
        createPermission();
      }
    } else {
      console.log(errors);
    }
  });

  // 禁止默认的关闭 model 行为
  return false;
};

const rules = {
  name: { required: true, message: '请输入权限名称', trigger: 'blur' },
  keyName: { required: true, message: '请输入key', trigger: 'blur' }
};
</script>

<style lang="scss">
.permission-item {
  .form {
    margin-top: 20px;
  }
}
</style>
