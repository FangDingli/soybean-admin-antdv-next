<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import type { RouteKey } from '@elegant-router/types';
import { SimpleScrollbar } from '@sa/materials';
import { GLOBAL_SIDER_MENU_ID } from '@/constants/app';
import { useAppStore } from '@/store/modules/app';
import { useRouteStore } from '@/store/modules/route';
import { useThemeStore } from '@/store/modules/theme';
import { useRouterPush } from '@/hooks/common/router';
import { getAntdMenuItems } from '../shared';
import { useMenu } from '../context';

defineOptions({
  name: 'VerticalMenu'
});

const route = useRoute();
const appStore = useAppStore();
const themeStore = useThemeStore();
const routeStore = useRouteStore();
const { routerPushByKeyWithMetaQuery } = useRouterPush();
const { selectedKey } = useMenu();

const inverted = computed(() => !themeStore.darkMode && themeStore.sider.inverted);

const menuItems = computed(() => getAntdMenuItems(routeStore.menus));

const menuStyle = computed(() => ({
  width: appStore.siderCollapse ? `${themeStore.sider.collapsedWidth}px` : '100%'
}));

function handleMenuClick(info: { key: string | number }) {
  routerPushByKeyWithMetaQuery(info.key as RouteKey);
}

const expandedKeys = ref<string[]>([]);

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
  <Teleport :to="`#${GLOBAL_SIDER_MENU_ID}`">
    <SimpleScrollbar>
      <AMenu
        v-model:open-keys="expandedKeys"
        mode="inline"
        :selected-keys="[selectedKey]"
        :inline-collapsed="appStore.siderCollapse"
        :items="menuItems"
        :theme="inverted ? 'dark' : 'light'"
        :inline-indent="18"
        :style="menuStyle"
        class="border-r-0"
        @click="handleMenuClick"
      />
    </SimpleScrollbar>
  </Teleport>
</template>

<style scoped></style>
