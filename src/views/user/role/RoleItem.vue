<template>
  <n-modal
    :mask-closable="false"
    :show="show"
    :disabled="formDisabled"
    class="role-item"
    positive-text="确认"
    negative-text="取消"
    preset="dialog"
    :title="title"
    @update:show="onChangeModel"
    @positive-click="submitCallback"
  >
    <n-form ref="formRef" :model="model" class="form" :rules="rules">
      <n-form-item path="name" label="名称">
        <n-input v-model:value="model.name" placeholder="请输入角色名称" />
      </n-form-item>
      <n-form-item path="permissionIds" label="权限">
        <n-checkbox-group v-model:value="model.permissionIds">
          <n-space item-style="display: flex;">
            <n-checkbox
              v-for="permission of permissionOptions"
              :key="permission.value"
              :value="permission.value"
              :label="permission.label"
              :disabled="permission.keyName == 'admin'"
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

<script setup name="role-item">
import { ref, toRefs, watch, computed } from 'vue';
import http from '@/utils/http';
import urls from '@/common/urls';
import { useMessage } from 'naive-ui';

const props = defineProps({
  itemId: {
    type: Number,
    required: true
  },
  show: Boolean,
  permissions: {
    type: Array,
    required: true
  }
});

const { itemId, show, permissions } = toRefs(props);

const emit = defineEmits(['model-show-change', 'refresh-list']);

const model = ref({
  permissionIds: [],
  name: null,
  description: null
});
const formRef = ref(null);

const message = useMessage();

const onChangeModel = () => {
  emit('model-show-change');
};

const title = computed(() => {
  return itemId.value ? '编辑角色' : '新增角色';
});

const permissionOptions = computed(() => {
  return permissions.value.map(permission => {
    return {
      label: permission.name,
      value: permission.id,
      keyName: permission.keyName
    };
  });
});

const formDisabled = ref(false);

const createRole = () => {
  formDisabled.value = true;
  const params = {
    name: model.value.name,
    description: model.value.description,
    permissionIds: model.value.permissionIds
  };
  http
    .post(`${urls.user.adminRole}`, params)
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
      getRole();
    } else {
      reSetDate();
    }
  }
});

// reset 数据
const reSetDate = () => {
  model.value.name = null;
  model.value.description = null;
  model.value.permissionIds = [];
};

const getRole = () => {
  http
    .get(`${urls.user.adminRole}/${itemId.value}`)
    .then(({ data }) => {
      model.value.name = data.name;
      model.value.description = data.description;
      model.value.permissionIds = data.permissions.map(permission => permission.id);
    })
    .catch(err => {
      message.warning(err.message);
    });
};

const updateRole = () => {
  formDisabled.value = true;
  const params = {
    name: model.value.name,
    description: model.value.description,
    permissionIds: model.value.permissionIds
  };
  http
    .put(`${urls.user.adminRole}/${itemId.value}`, params)
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
        updateRole();
      } else {
        createRole();
      }
    } else {
      console.log(errors);
    }
  });

  // 禁止默认的关闭 model 行为
  return false;
};

const rules = {
  name: { required: true, message: '请输入角色名称', trigger: 'blur' }
};
</script>

<style lang="scss">
.role-item {
  .form {
    margin-top: 20px;
  }
}
</style>
