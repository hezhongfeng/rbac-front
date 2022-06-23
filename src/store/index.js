import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axios from 'axios';
import urls from '@/common/urls';
import http from '@/utils/http';

export const useIndexStore = defineStore('counter', () => {
  const accseeToken = ref('');
  const userId = ref(null);
  const username = ref('');
  const nickname = ref('');
  const description = ref('');

  const userInfo = computed(() => {
    return {
      userId,
      username,
      nickname,
      description
    };
  });

  const updateToken = token => {
    accseeToken.value = token;
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
    localStorage.setItem('access_token', token);
  };

  const updateUserId = id => {
    userId.value = id;
  };

  const updateUserInfo = payload => {
    userId.value = payload.userId;
    username.value = payload.username;
    nickname.value = payload.nickname;
    description.value = payload.description;
  };

  const getCurrentUser = callback => {
    const current = urls.login.current;
    return new Promise((resolve, reject) => {
      http
        .get(current)
        .then(({ data }) => {
          updateUserInfo(data);
          if (callback) {
            callback();
          }
          resolve();
        })
        .catch(err => {
          console.log('ERR_GET_CURRENT: ', err);
          reject();
        });
    });
  };

  return { userId, username, userInfo, updateUserId, updateToken, getCurrentUser };
});
