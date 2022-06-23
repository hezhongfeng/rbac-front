import { ref } from 'vue';
import { useDialog, useMessage } from 'naive-ui';
import http from 'utils/http';

export default function useDeleteList({
  url,
  callback = () => {},
  title = '确定删除？',
  content = '删除选中的项',
  positiveText = '删除',
  negativeText = '取消'
}) {
  const dialog = useDialog();
  const message = useMessage();

  const checkedRowKeys = ref([]);

  const onCheckedRow = keys => {
    checkedRowKeys.value = keys;
  };

  const deleteList = () => {
    dialog.create({
      title,
      content,
      positiveText,
      negativeText,
      onPositiveClick: () => {
        const params = {
          ids: checkedRowKeys.value
        };
        http
          .delete(url, params)
          .then(() => {
            message.success('删除成功!');
            callback();
          })
          .catch(err => {
            message.warning(err.message);
          })
          .finally(() => {
            checkedRowKeys.value = [];
          });
      }
    });
  };

  return {
    checkedRowKeys,
    onCheckedRow,
    deleteList
  };
}
