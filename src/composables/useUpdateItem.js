import { useMessage } from 'naive-ui';
import http from '@/utils/http';

export default function useUpdateItem({ url, params, callback, formDisabled }) {
  const message = useMessage();
  const updateItem = () => {
    formDisabled.value = true;
    http
      .put(url, params)
      .then(() => {
        message.success('更新成功!');
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
    updateItem
  };
}
