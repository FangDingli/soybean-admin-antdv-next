import type { ItemType } from 'antdv-next/dist/menu/interface';

/**
 * Convert soybean global menus to antdv-next menu items
 *
 * soybean's `App.Global.Menu` matches the naive-ui `MenuOption` shape out of the box;
 * antdv-next menus take an `items` array instead, so this adapter maps the fields
 * (icon changes from a render function to a VNode).
 *
 * @param menus Global menus
 */
export function getAntdMenuItems(menus: App.Global.Menu[]): ItemType[] {
  return menus.map(menu => {
    const item: ItemType = {
      key: menu.key,
      label: menu.label,
      icon: menu.icon?.()
    };

    if (menu.children?.length) {
      item.children = getAntdMenuItems(menu.children);
    }

    return item;
  });
}
