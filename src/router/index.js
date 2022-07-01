import { createRouter, createWebHistory } from 'vue-router';
import { useRootStore } from '@/store/root';
import Login from 'views/login/LogIn.vue';
import Layout from '@/layout/index.vue';
import Logout from 'views/login/LogOut.vue';
import axios from 'axios';

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
      // 已登录的时候，不允许访问登录页面，直接跳转到主页
      next({ path: '/index/dashboard_console' });
      return true;
    } else {
      // 未登录时候访问白名单，直接跳转
      next();
      return true;
    }
  }

  // 没有 token，相当于没登录
  if (!accessToken) {
    // 定位到登录页
    next('/login');
    return true;
  }

  // 有 token 并且有当前用户信息，相当于已登录
  if (accessToken && hasUserId) {
    // 导航有效
    next();
    return true;
  }

  // 有 token，但是没有当前用户信息，需要获取用户信息
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
