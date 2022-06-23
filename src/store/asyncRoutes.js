import { defineStore, acceptHMRUpdate } from 'pinia';
import { ref } from 'vue';
// 路由模块
import dashboard from '@/router/modules/dashboard.js';
import setting from '@/router/modules/setting.js';
import user from '@/router/modules/user.js';
import test from '@/router/modules/test.js';
import router from '@/router';

export const useAsyncRoutes = defineStore('asyncRoutes', () => {
  const hasAdd = ref(false);
  const menus = ref([]);

  // 根据当前用户的权限和路由配置，生成可以访问的路由和菜单
  const generateRoutes = ({ permissions, cb }) => {
    const temporaryMenus = [];
    const routes = [];
    for (const item of [dashboard, user, test, setting]) {
      const accessedRouters = [];
      const node = {
        icon: item.meta.icon,
        name: item.name,
        children: [],
        meta: {
          title: item.meta.title
        }
      };
      for (const routeItem of item.children) {
        let haspermission = false;
        if (!routeItem.meta.permissions || routeItem.meta.permissions.length === 0) {
          haspermission = true;
        } else {
          for (const numeNeedPermission of routeItem.meta.permissions) {
            if (permissions.includes(numeNeedPermission)) {
              haspermission = true;
              break;
            }
          }
        }

        if (haspermission && !node.children.includes(routeItem)) {
          node.children.push(routeItem);
          routes.push({
            path: routeItem.path,
            name: routeItem.name,
            component: routeItem.component,
            meta: {
              title: routeItem.meta.title
            }
          });
        }
      }

      if (node.children.length != 0) {
        accessedRouters.push(node);
      }

      for (const accessedRouter of accessedRouters) {
        const children = [];
        for (const iterator of accessedRouter.children) {
          children.push({
            label: iterator.meta.title,
            key: iterator.name
          });
        }
        temporaryMenus.push({
          label: accessedRouter.meta.title,
          key: accessedRouter.name,
          icon: accessedRouter.icon,
          children
        });
      }
    }
    console.log(temporaryMenus);
    // 生成左侧菜单和添加路由
    menus.value = temporaryMenus.filter(item => item.key !== 'test');
    for (const route of routes) {
      if (!router.hasRoute(route.name)) {
        router.addRoute('index', route);
      }
    }
    if (cb) {
      cb();
    }
  };

  return { menus, generateRoutes };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAsyncRoutes, import.meta.hot));
}
