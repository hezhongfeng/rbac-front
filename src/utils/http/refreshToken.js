import axios from 'axios';
import http from './index';
import { useRootStore } from '@/store/root';

// 临时的请求函数列表
const tempRequestList = [];

// 发起刷新token的标志位，防止重复刷新请求
let isRefreshing = false;

// 一段时间内刷新过token标志位
// 为了防止并发的时候，刷新请求完毕，tempRequestList也已经清空，之后仍有请求返回403，造成重复刷新
let refreshTokenInPeriodTime = false;

const refreshTokenRequest = () => {
  if (isRefreshing) {
    return;
  }
  if (refreshTokenInPeriodTime) {
    for (const request of tempRequestList) {
      request();
    }
    clearTempRequestList();
    return;
  }
  isRefreshing = true;
  refreshTokenInPeriodTime = true;
  const root = useRootStore();
  // 使用刷新token请求新的accesstoken和刷新token
  const params = {
    refreshToken: root.refreshToken
  };
  http
    .post('/api/v1/refresh-token', params)
    .then(({ data }) => {
      root.updateAccessToken(data.token);
      root.updateRefreshToken(data.refreshToken);
      root.updateUserId(data.userId);
      for (const request of tempRequestList) {
        request();
      }
      // 10s 后清除标志位
      setTimeout(() => {
        refreshTokenInPeriodTime = false;
      }, 10000);
      isRefreshing = false;
    })
    .catch(() => {
      refreshTokenInPeriodTime = false;
    })
    .finally(() => {
      isRefreshing = false;
      clearTempRequestList();
    });
};

const addRequestList = request => {
  tempRequestList.push(request);
};

const clearTempRequestList = () => {
  tempRequestList.length = 0;
};

const createRequest = config => {
  // 这里必须更新 header 中的 AccessToken
  const root = useRootStore();
  config.headers['Authorization'] = 'Bearer ' + root.accessToken;
  return axios(config);
};

export { refreshTokenRequest, createRequest, addRequestList };
