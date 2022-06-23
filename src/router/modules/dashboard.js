import { Dashboard } from '@vicons/carbon';

import { NIcon } from 'naive-ui';
import { h } from 'vue';

function renderIcon(icon) {
  return () => h(NIcon, null, { default: () => h(icon) });
}

const routes = {
  name: 'Dashboard',
  meta: {
    title: 'dashboard',
    icon: renderIcon(Dashboard)
  },
  children: [
    {
      path: 'dashboard_console',
      name: 'dashboard_console',
      meta: {
        title: '控制台',
        permissions: []
      },
      component: () => import('@/views/dashboard/console/ConsoleInfo.vue')
    }
  ]
};

export default routes;
