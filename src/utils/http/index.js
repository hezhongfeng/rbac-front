import axios from 'axios';
import { useRootStore } from '@/store/root';
import router from '@/router';

axios.defaults.baseURL = window.location.origin;

// vite HMR会导致模块重复加载，重复设置拦截器，这里手动给清除下
axios.interceptors.response.handlers.length = 0;

const tempRequest = [];

let isRefreshing = false;

const refreshTokenRequst = () => {
  console.log('refreshTokenRequst');
  const root = useRootStore();
  // 使用刷新token请求新的accesstoken和刷新token
  const params = {
    refreshToken: root.refreshToken
  };
  http.post('/api/v1/refresh-token', params).then(({ data }) => {
    console.log('refreshTokenRequst res', data);
    root.updateToken(data.token);
    root.updateRefreshToken(data.refreshToken);
    root.updateUserId(data.user);
    root.getCurrentUser(() => {
      // 跳转到主页
      router.push('/index/dashboard_console');
    });
    setTimeout(() => {
      for (const request of tempRequest) {
        request();
      }
      tempRequest.length = 0;
      isRefreshing = false;
    }, 5000);
  });
};

const handleExpired = request => {
  tempRequest.push(request);
  if (!isRefreshing) {
    isRefreshing = true;
  }
};

const createRequest = config => {
  console.log('createRequest');
  // 这里可以修改header中的AccessToken
  config.headers['Authorization'] = 'Bearer ' + localStorage.getItem('access_token');
  return axios(config);
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
    const root = useRootStore();
    // 这里是返回 http 状态码不为 200和304 时候的错误处理
    if (err && err.response) {
      switch (err.response.status) {
        case 400:
          err.message = '请求错误';
          break;

        case 401:
          // 登录页登录，不需要处理
          if (router.currentRoute.path === '/login') {
            break;
          }
          // 判断是否有refershToken
          if (!root.refreshToken) {
            root.updateUserId(null);
            // 清除无效 token
            root.updateToken('');
            root.updateRefreshToken('');

            err.message = '未授权，请登录';
            setTimeout(() => {
              router.replace('/login');
            }, 10);
          }
          // 进入刷新 token 流程
          const config = err?.config;
          refreshTokenRequst();
          return new Promise(resolve => {
            handleExpired(() => {
              // 注意这里的createRequest函数执行的时候是在resolve开始执行的时候次奥跟着执行
              resolve(createRequest(config));
            });
          });
          break;

        case 403:
          root.updateUserId(null);
          // 清除 token
          root.updateToken('');
          root.updateRefreshToken('');

          err.message = '未授权，请登录';
          setTimeout(() => {
            router.replace('/login');
          }, 10);
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
    console.log(137);
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
