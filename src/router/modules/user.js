import { UserMultiple } from '@vicons/carbon';
import { NIcon } from 'naive-ui';
import { h } from 'vue';

function renderIcon(icon) {
  return () => h(NIcon, null, { default: () => h(icon) });
}

const route = {
  name: 'User',
  meta: {
    title: '用户',
    icon: renderIcon(UserMultiple)
  },
  children: [
    {
      path: 'user-mgmt',
      name: 'user-mgmt',
      meta: {
        title: '用户管理',
        permissions: ['admin']
      },
      component: () => import('@/views/user/UserMgmt.vue')
    },
    {
      path: 'role-mgmt',
      name: 'role-mgmt',
      meta: {
        title: '角色管理',
        permissions: ['admin']
      },
      component: () => import('@/views/user/role/RoleMgmt.vue')
    },
    {
      path: 'permission-mgmt',
      name: 'permission-mgmt',
      meta: {
        title: '权限管理',
        permissions: ['admin']
      },
      component: () => import('@/views/user/permission/PermissionMgmt.vue')
    }
  ]
};

export default route;
