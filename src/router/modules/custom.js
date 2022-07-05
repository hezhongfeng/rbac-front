import { WindySnow } from '@vicons/carbon';

import { NIcon } from 'naive-ui';
import { h } from 'vue';

function renderIcon(icon) {
  return () => h(NIcon, null, { default: () => h(icon) });
}

const routes = {
  name: 'Custom',
  meta: {
    title: '自定义',
    icon: renderIcon(WindySnow)
  },
  children: [
    {
      path: 'custom_console',
      name: 'custom_console',
      meta: {
        title: '信息',
        permissions: ['custom']
      },
      component: () => import('@/views/custom/Custom.vue')
    }
  ]
};

export default routes;
