/*
 * @Descripttion:
 * @version: v1.0
 * @Author: hezf
 * @Date: 2022-01-11 15:45:07
 */

/**
 * 混合菜单
 * */
export function generatorMenuMix(routerMap, routerName, location) {
  const cloneRouterMap = cloneDeep(routerMap);
  const newRouter = filterRouter(cloneRouterMap);
  if (location === 'header') {
    const firstRouter = [];
    newRouter.forEach(item => {
      const isRoot = isRootRouter(item);
      const info = isRoot ? item.children[0] : item;
      info.children = undefined;
      const currentMenu = {
        ...info,
        ...info.meta,
        label: info.meta?.title,
        key: info.name
      };
      firstRouter.push(currentMenu);
    });
    return firstRouter;
  } else {
    return getChildrenRouter(newRouter.filter(item => item.name === routerName));
  }
}

/**
 * 递归组装子菜单
 * */
export function getChildrenRouter(routerMap) {
  return filterRouter(routerMap).map(item => {
    const isRoot = isRootRouter(item);
    const info = isRoot ? item.children[0] : item;
    const currentMenu = {
      ...info,
      ...info.meta,
      label: info.meta?.title,
      key: info.name
    };
    // 是否有子菜单，并递归处理
    if (info.children && info.children.length > 0) {
      // Recursion
      currentMenu.children = getChildrenRouter(info.children);
    }
    return currentMenu;
  });
}
