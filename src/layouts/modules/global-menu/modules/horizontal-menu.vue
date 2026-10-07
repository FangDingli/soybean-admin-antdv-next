<script setup lang="ts">
import { computed } from 'vue';
import type { RouteKey } from '@elegant-router/types';
import { GLOBAL_HEADER_MENU_ID } from '@/constants/app';
import { useRouteStore } from '@/store/modules/route';
import { useRouterPush } from '@/hooks/common/router';
import { useMenu } from '../context';
import { getAntdMenuItems } from '../shared';

defineOptions({
  name: 'HorizontalMenu'
});

const routeStore = useRouteStore();
const { routerPushByKeyWithMetaQuery } = useRouterPush();
const { selectedKey } = useMenu();

const menuItems = computed(() => getAntdMenuItems(routeStore.menus));

function handleMenuClick(info: { key: string | number }) {
  routerPushByKeyWithMetaQuery(info.key as RouteKey);
}
</script>

<template>
  <Teleport :to="`#${GLOBAL_HEADER_MENU_ID}`">
    <!-- antd horizontal menu overflows into "..." automatically (naive's `responsive`) -->
    <AMenu mode="horizontal" :selected-keys="[selectedKey]" :items="menuItems" @click="handleMenuClick" />
  </Teleport>
</template>

<style scoped></style>
