# rbac-front

spring-boot rbac 的前端项目，动态菜单，可以用做模板项目，包含了 cz commitlint 和 eslint 自检

[在线文档](https://rbac-docs.vercel.app/)

[在线体验](https://rbac-front.vercel.app)

| 用户     | 帐户   | 密码     |
| -------- | ------ | -------- |
| 管理员   | admin  | password |
| 普通用户 | normal | password |

## Composition API

封装了最常用的逻辑，轻松的实现列表的查询、添加、修改、删除等操作

### 列表查询

列表查询一般需要实现的逻辑：

1. 页面 Mounted 后进行一次查询
2. 查询的时候需要维护 table 的 loading 状态，查询完毕就解除
3. 翻页查询
4. 主动查询
5. 查询失败需要显示 error 信息

封装完毕后使用：

```js
const { data, loading, pagination, onUpdatePage, onUpdatePageSize, queryList } = useQueryList(
  urls.user.adminPermission
);
```

| 变量             | 解释                                           |
| ---------------- | ---------------------------------------------- |
| data             | 列表的查询结果，可以利用 computed 进行自由组织 |
| loading          | 查询状态                                       |
| pagination       | 翻页相关，用来显示数据                         |
| onUpdatePage     | 翻页事件                                       |
| onUpdatePageSize | 改变每页大小事件                               |
| queryList        | 主动查询方法                                   |

### 删除

列表删除一般需要实现的逻辑：

1. 监听选择事件，收集被选中的行 checkedRowKeys，没有被选中时候不可点击删除按钮
2. 点击删除按钮，需要确认是否删除
3. 删除成功后，需要提示信息，并且要刷新列表

封装完毕后使用：

```js
const { checkedRowKeys, onCheckedRow, deleteList } = useDeleteList({
  content: '确定删除选中的权限？',
  url: urls.user.adminPermission,
  callback: () => {
    queryList();
  }
});
```

| 变量           | 解释                                         |
| -------------- | -------------------------------------------- |
| checkedRowKeys | 收集被选中的行，用来判断是否删除按钮是否可用 |
| onCheckedRow   | 选择事件                                     |
| deleteList     | 删除事件，需要绑定删除按钮                   |

## pinia

使用了 Composition API 之后 现在很讨厌使用 this，所以 根据 pinia 提供的如下 demo:

```js
export const useCounterStore = defineStore('counter', () => {
  const count = ref(0);
  function increment() {
    count.value++;
  }

  return { count, increment };
});
```

封装的 store，使用的时候：

```js
import { useRootStore } from '@/store/root';
const root = useRootStore();

const nickname = computed(() => root.nickname);
```
