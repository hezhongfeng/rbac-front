import { UserOutlined } from '@vicons/antd';
import { NIcon } from 'naive-ui';
import { h } from 'vue';

function renderIcon(icon) {
  return () => h(NIcon, null, { default: () => h(icon) });
}

const route = {
  name: 'test',
  meta: {
    title: '测试',
    icon: renderIcon(UserOutlined)
  },
  children: []
};

export default route;
