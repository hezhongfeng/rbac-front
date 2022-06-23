import { ref, onMounted } from 'vue';
import { useMessage } from 'naive-ui';
import http from 'utils/http';

export default function useQueryList(url, params = {}, pageSize = 20, page = 1) {
  const message = useMessage();
  const loading = ref(true);
  const data = ref({
    list: [],
    count: null
  });

  // 翻页
  const pagination = {
    pageSize,
    itemCount: 0,
    page
  };

  // 列表查询参数变化，重新查询
  const onUpdatePage = page => {
    pagination.page = page;
    queryList();
  };

  // 列表查询参数变化，重新查询
  const onUpdatePageSize = pageSize => {
    pagination.pageSize = pageSize;
    queryList();
  };

  const queryList = () => {
    loading.value = true;

    // 这里考虑到可能有其他参数
    const queryParams = {
      ...params,
      page: pagination.page,
      pageSize: pagination.pageSize
    };
    http
      .get(url, queryParams)
      .then(responce => {
        data.value = responce.data;
        pagination.itemCount = responce.data.count;
      })
      .catch(err => {
        message.warning(err.message);
      })
      .finally(() => {
        setTimeout(() => {
          loading.value = false;
        }, 100);
      });
  };

  onMounted(() => {
    // 初次查询
    queryList();
  });

  return {
    data,
    loading,
    pagination,
    onUpdatePage,
    onUpdatePageSize,
    queryList
  };
}
