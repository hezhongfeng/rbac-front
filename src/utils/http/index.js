import axios from 'axios';
import router from '@/router';
import { useRootStore } from '@/store/root';
import { refreshTokenRequest, createRequest, addRequestList } from './refreshToken';

axios.defaults.baseURL = window.location.origin;

// vite HMR会导致模块重复加载，重复设置拦截器，这里手动给清除下
axios.interceptors.response.handlers.length = 0;

// 清空本地所有登录信息并跳转到登录页面
const logout = () => {
  const root = useRootStore();
  root.updateUserId(null);
  // 清除 token
  root.updateAccessToken('');
  root.updateRefreshToken('');

  router.replace('/login');
};

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
    // 这里是返回 http 状态码不为 200和304 时候的错误处理
    if (err && err.response) {
      switch (err.response.status) {
        case 400:
          err.message = '请求错误';
          break;

        case 401:
          // accesstoken 错误
          if (router.currentRoute.path === '/login') {
            break;
          }
          // 判断是否有 refreshToken
          const root = useRootStore();
          if (!root.refreshToken) {
            logout();
            break;
          }
          // 进入刷新 token 流程
          // 本次请求的所有配置信息，包含了 url、method、data、header 等信息
          const config = err?.config;
          refreshTokenRequest();
          // 这里很重要，因为本次请求 401 了，要返回给调用接口的方法返回一个新的请求
          return new Promise(resolve => {
            addRequestList(() => {
              // 注意这里的createRequest函数执行的时候是在resolve开始执行的时候，并且返回一个新的Promise，这个新的Promise会代替接口调用的那个
              resolve(createRequest(config));
            });
          });
          break;

        case 403:
          // 403 这里说明刷新token失败，登录已经到期，需要重新登录
          logout();
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

const http = {
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

export default http;
