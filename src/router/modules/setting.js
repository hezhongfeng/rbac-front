import { SettingsAdjust } from '@vicons/carbon';
import { NIcon } from 'naive-ui';
import { h } from 'vue';

function renderIcon(icon) {
  return () => h(NIcon, null, { default: () => h(icon) });
}

const route = {
  name: 'Setting',
  meta: {
    title: '设置',
    icon: renderIcon(SettingsAdjust)
  },
  children: [
    {
      path: 'setting-account',
      name: 'setting-account',
      meta: {
        title: '个人设置'
      },
      component: () => import('@/views/setting/account/AccountInfo.vue')
    }
  ]
};

export default route;
