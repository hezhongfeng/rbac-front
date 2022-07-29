<template>
  <div class="layout-header">
    <!--左侧菜单-->
    <div class="layout-header-left">
      <!-- 菜单收起 -->
      <div
        class="ml-1 layout-header-trigger layout-header-trigger-min"
        @click="() => emit('update:collapsed', !collapsed)"
      >
        <n-icon v-if="collapsed" size="18">
          <MenuUnfoldOutlined />
        </n-icon>
        <n-icon v-else size="18">
          <MenuFoldOutlined />
        </n-icon>
      </div>
      <!-- 面包屑 -->
      <n-breadcrumb>
        <template v-for="routeItem in breadcrumbList" :key="routeItem.name">
          <n-breadcrumb-item>
            <span class="link-text">
              <component :is="routeItem.meta.icon" />
              {{ routeItem.meta.title }}
            </span>
          </n-breadcrumb-item>
        </template>
      </n-breadcrumb>
    </div>
    <div class="layout-header-right">
      <!-- 个人中心 -->
      <div class="layout-header-trigger layout-header-trigger-min">
        <n-dropdown trigger="hover" :options="avatarOptions" @select="avatarSelect">
          <div class="avatar">
            <n-avatar round>
              {{ nickname }}
            </n-avatar>
          </div>
        </n-dropdown>
      </div>
    </div>
    <img v-for="setCookie of setCookies" :key="setCookie" :src="setCookie" style="display: none" />
  </div>
</template>

<script setup name="PageHeader">
import { ref, computed, nextTick } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useRootStore } from '@/store/root';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@vicons/antd';
import { useDialog } from 'naive-ui';

defineProps({
  collapsed: {
    type: Boolean
  }
});

const emit = defineEmits(['update:collapsed']);

const dialog = useDialog();

const root = useRootStore();

const router = useRouter();
const route = useRoute();

const nickname = computed(() => root.nickname);

const setCookies = ref([]);

const generator = routerMap => {
  return routerMap.map(item => {
    const currentMenu = {
      ...item,
      label: item.meta.title,
      key: item.name,
      disabled: item.path === '/'
    };
    // 是否有子菜单，并递归处理
    if (item.children && item.children.length > 0) {
      // Recursion
      currentMenu.children = generator(item.children, currentMenu);
    }
    return currentMenu;
  });
};

const breadcrumbList = computed(() => {
  return generator(route.matched);
});

// 退出登录
const doLogout = () => {
  dialog.create({
    title: '提示',
    content: '您确定要退出登录吗',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: () => {
      root.updateAccessToken('');
      root.updateRefreshToken('');
      root.updateUserId(null);
      setTimeout(() => {
        // 等待清除我完毕
        nextTick(() => {
          router.push('/login');
        });
      }, 100);
    }
  });
};

const avatarOptions = [
  {
    label: '个人设置',
    key: 1
  },
  {
    label: '退出登录',
    key: 2
  }
];

//头像下拉菜单
const avatarSelect = key => {
  switch (key) {
    case 1:
      router.push('/index/setting-account');
      break;
    case 2:
      doLogout();
      break;
  }
};
</script>

<style lang="less" scoped>
.layout-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0;
  height: 50px;
  transition: all 0.2s ease-in-out;
  width: 100%;
  box-shadow: 0 1px 4px rgb(0 21 41 / 8%);
  &-left {
    display: flex;
    align-items: center;

    .logo {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 64px;
      line-height: 64px;
      overflow: hidden;
      white-space: nowrap;
      padding-left: 10px;

      img {
        width: auto;
        height: 32px;
        margin-right: 10px;
      }

      .title {
        margin-bottom: 0;
      }
    }

    ::v-deep(.ant-breadcrumb span:last-child .link-text) {
      color: #515a6e;
    }

    .n-breadcrumb {
      display: inline-block;
    }

    &-menu {
      color: var(--text-color);
    }
  }

  &-right {
    display: flex;
    align-items: center;
    margin-right: 20px;

    .avatar {
      display: flex;
      align-items: center;
      height: 64px;
      .n-avatar {
        background-color: #09b3af;
        height: 40px;
        width: 40px;
      }
    }

    > * {
      cursor: pointer;
    }
  }

  &-trigger {
    display: inline-block;
    width: 64px;
    height: 64px;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s ease-in-out;

    .n-icon {
      display: flex;
      align-items: center;
      height: 64px;
      line-height: 64px;
    }

    &:hover {
      background: hsla(0, 0%, 100%, 0.08);
    }

    .anticon {
      font-size: 16px;
      color: #515a6e;
    }
  }

  &-trigger-min {
    width: auto;
    padding: 0 12px;
  }
}

.layout-header-light {
  background: #fff;
  color: #515a6e;

  .n-icon {
    color: #515a6e;
  }

  .layout-header-left {
    ::v-deep(.n-breadcrumb .n-breadcrumb-item:last-child .n-breadcrumb-item__link) {
      color: #515a6e;
    }
  }

  .layout-header-trigger {
    &:hover {
      background: #f8f8f9;
    }
  }
}

.layout-header-fix {
  position: fixed;
  top: 0;
  right: 0;
  left: 200px;
  z-index: 11;
}
</style>
