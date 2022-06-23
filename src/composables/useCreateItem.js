import { ref } from 'vue';
import { useMessage } from 'naive-ui';
import http from '@/utils/http';

export default function useCreateItem({ url, params, callback }) {
  const message = useMessage();

  const formDisabled = ref(false);

  const createItem = () => {
    formDisabled.value = true;
    http
      .post(url, params.value)
      .then(() => {
        message.success('创建成功!');
        callback();
      })
      .catch(err => {
        message.warning(err.message);
      })
      .finally(() => {
        formDisabled.value = false;
      });
  };

  return {
    formDisabled,
    createItem
  };
}
