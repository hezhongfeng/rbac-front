import axios from 'axios';
import http from './index';
import { useRootStore } from '@/store/root';

// 临时的请求函数列表
const tempRequestList = [];

// 发起刷新token的标志位，防止重复请求
let isRefreshing = false;

const refreshTokenRequest = () => {
  if (isRefreshing) {
    return;
  }
  isRefreshing = true;
  const root = useRootStore();
  // 使用刷新token请求新的accesstoken和刷新token
  const params = {
    refreshToken: root.refreshToken
  };
  http.post('/api/v1/refresh-token', params).then(({ data }) => {
    root.updateToken(data.token);
    root.updateRefreshToken(data.refreshToken);
    root.updateUserId(data.user);
    for (const request of tempRequestList) {
      request();
    }
    tempRequestList.length = 0;
    isRefreshing = false;
  });
};

const addRequestList = request => {
  tempRequestList.push(request);
};

const createRequest = config => {
  // 这里可以修改header中的AccessToken
  const accessToken = localStorage.getItem('access_token');
  config.headers['Authorization'] = 'Bearer ' + accessToken;
  return axios(config);
};

export { refreshTokenRequest, createRequest, addRequestList };
