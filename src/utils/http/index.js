import axios from 'axios';
import { useIndexStore } from '@/store/index';
import router from '@/router';

axios.defaults.baseURL = window.location.origin;

// vite HMR会导致模块重复加载，重复设置拦截器，这里手动给清除下
axios.interceptors.response.handlers.length = 0;

// 响应拦截器
axios.interceptors.response.use(
  response => {
    const data = response.data;
    // 没有code但是http状态为200表示外部请求成功
    if (!data.code && response.status === 200) return data;
    // 根据返回的code值来做不同的处理（和后端的私有约定）
    switch (data.code) {
      case 200:
        return data;
      default:
    }
    // 若不是正确的返回code，且已经登录，就抛出错误
    throw data;
  },
  err => {
    console.log(err);
    console.log('ERR_RESPONSE: ', JSON.parse(JSON.stringify(err)));
    // 这里是返回 http 状态码不为 200和304 时候的错误处理
    if (err && err.response) {
      switch (err.response.status) {
        case 400:
          err.message = '请求错误';
          break;

        case 401:
          // 登录页登录，不需要清除
          if (router.currentRoute.path === '/login') {
            break;
          }

          const indexStore = useIndexStore();
          indexStore.updateUserId(null);
          // 清除无效 token
          indexStore.updateToken('');

          err.message = '未授权，请登录';
          setTimeout(() => {
            router.replace('/login');
          }, 10);
          break;

        case 403:
          err.message = '拒绝访问';
          break;

        case 404:
          err.message = `请求地址出错: ${err.response.config.url}`;
          break;

        case 408:
          err.message = '请求超时';
          break;

        case 500:
          err.message = '服务器内部错误';
          break;

        case 501:
          err.message = '服务未实现';
          break;

        case 502:
          err.message = '网关错误';
          break;

        case 503:
          err.message = '服务不可用';
          break;

        case 504:
          err.message = '网关超时';
          break;

        case 505:
          err.message = 'HTTP版本不受支持';
          break;

        default:
      }
    }
    return Promise.reject(err);
  }
);

export default {
  async get(url, params = {}, options = {}) {
    return axios.get(url, Object.assign({}, { params }, options));
  },
  async post(url, params = {}, options = {}) {
    return axios.post(url, params, options);
  },
  async put(url, params = {}) {
    return axios.put(url, params);
  },
  async delete(url, params = {}) {
    // 0.20.0 版本重大bug
    return axios.request({ method: 'delete', url, data: params });
  }
};
