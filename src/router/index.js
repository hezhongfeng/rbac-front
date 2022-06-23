import { createRouter, createWebHistory } from 'vue-router';
import { useRootStore } from '@/store/root';
import Login from 'views/login/Login.vue';
import Logout from 'views/login/Logout.vue';
import axios from 'axios';

export const Layout = () => import('@/layout/index.vue');

const routes = [
  {
    path: '/',
    name: 'Root',
    redirect: '/index/dashboard_console'
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/logout',
    name: 'logout',
    component: Logout
  },
  {
    path: '/index',
    name: 'index',
    component: Layout
  }
];

const beforeEach = async (to, from, next) => {
  const root = useRootStore();
  // 当前用户信息
  const userId = root.userId;
  let hasUserId = !!userId;
  const accessToken = localStorage.getItem('access_token');

  // 白名单，只允许不登录时候访问
  let whiteRouteList = ['/login'];
  if (whiteRouteList.indexOf(to.path) !== -1) {
    if (accessToken) {
      next({ path: '/index/dashboard_console' });
      return true;
    } else {
      next();
      return true;
    }
  }
  // 正常已登录
  if (accessToken && hasUserId) {
    // 导航有效
    next();
    return true;
  }

  // 没登录
  if (!accessToken) {
    // 定位到登录页
    next('/login');
    return true;
  }

  // const hasAdd = store.state.asyncroute.hasAdd;
  // // 已添加动态路由后，可以直接进行跳转
  // if (hasAdd) {
  //   next();
  //   return true;
  // }

  // 已登录，在刷新页面
  axios.defaults.headers.common['Authorization'] = 'Bearer ' + accessToken;
  // 注意这里不能使用回调的方式，必须await
  await root.getCurrentUser();
  next({ ...to, replace: true });
};

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach(beforeEach);

export default router;
