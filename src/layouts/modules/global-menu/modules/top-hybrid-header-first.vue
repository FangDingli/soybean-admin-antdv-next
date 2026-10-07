<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { SimpleScrollbar } from '@sa/materials';
import type { RouteKey } from '@elegant-router/types';
import { GLOBAL_HEADER_MENU_ID, GLOBAL_SIDER_MENU_ID } from '@/constants/app';
import { useAppStore } from '@/store/modules/app';
import { useThemeStore } from '@/store/modules/theme';
import { useRouteStore } from '@/store/modules/route';
import { useRouterPush } from '@/hooks/common/router';
import { useMenu, useMixMenuContext } from '../context';
import { getAntdMenuItems } from '../shared';

defineOptions({
  name: 'TopHybridHeaderFirst'
});

const route = useRoute();
const appStore = useAppStore();
const themeStore = useThemeStore();
const routeStore = useRouteStore();
const { routerPushByKeyWithMetaQuery } = useRouterPush();
const {
  firstLevelMenus,
  secondLevelMenus,
  activeFirstLevelMenuKey,
  handleSelectFirstLevelMenu,
  activeDeepestLevelMenuKey
} = useMixMenuContext('TopHybridHeaderFirst');
const { selectedKey } = useMenu();

const firstLevelMenuItems = computed(() => getAntdMenuItems(firstLevelMenus.value));
const secondLevelMenuItems = computed(() => getAntdMenuItems(secondLevelMenus.value));

const siderMenuStyle = computed(() => ({
  width: appStore.siderCollapse ? `${themeStore.sider.collapsedWidth}px` : '100%'
}));

const expandedKeys = ref<string[]>([]);

/**
 * Handle first level menu select
 * @param key RouteKey
 */
function handleSelectFirstLevelMenuClick(info: { key: string | number }) {
  handleSelectMenu(info.key as RouteKey);
}

function handleSelectMenu(key: RouteKey) {
  handleSelectFirstLevelMenu(key);

  // if there are second level menus, select the deepest one by default
  activeDeepestLevelMenuKey();
}

function handleMenuClick(info: { key: string | number }) {
  routerPushByKeyWithMetaQuery(info.key as RouteKey);
}

function updateExpandedKeys() {
  if (appStore.siderCollapse || !selectedKey.value) {
    expandedKeys.value = [];
    return;
  }
  expandedKeys.value = routeStore.getSelectedMenuKeyPath(selectedKey.value);
}

watch(
  () => route.name,
  () => {
    updateExpandedKeys();
  },
  { immediate: true }
);
</script>

<template>
  <Teleport :to="`#${GLOBAL_HEADER_MENU_ID}`">
    <AMenu
      mode="horizontal"
      :selected-keys="[activeFirstLevelMenuKey]"
      :items="firstLevelMenuItems"
      @click="handleSelectFirstLevelMenuClick"
    />
  </Teleport>
  <Teleport :to="`#${GLOBAL_SIDER_MENU_ID}`">
    <SimpleScrollbar>
      <AMenu
        v-model:open-keys="expandedKeys"
        mode="inline"
        :selected-keys="[selectedKey]"
        :inline-collapsed="appStore.siderCollapse"
        :items="secondLevelMenuItems"
        :inline-indent="18"
        :style="siderMenuStyle"
        class="border-r-0"
        @click="handleMenuClick"
      />
    </SimpleScrollbar>
  </Teleport>
</template>

<style scoped></style>
