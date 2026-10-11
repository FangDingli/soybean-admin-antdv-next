<script setup lang="ts">
import { computed } from 'vue';
import type { WatermarkProps } from 'antdv-next';
import { antdvLocales } from './locales/antdv';
import { useAppStore } from './store/modules/app';
import { useThemeStore } from './store/modules/theme';

defineOptions({
  name: 'App'
});

const appStore = useAppStore();
const themeStore = useThemeStore();

const antdvLocale = computed(() => {
  return antdvLocales[appStore.locale];
});

const antdvThemeConfig = computed(() => {
  return themeStore.antdvTheme;
});

const watermarkProps = computed<WatermarkProps>(() => {
  return {
    content: themeStore.watermarkContent,
    font: {
      fontSize: 16,
      fontWeight: 600
    },
    width: 384,
    height: 384,
    gap: [100, 100],
    offset: [12, 60],
    rotate: -15,
    zIndex: 9999
  };
});
</script>

<template>
  <AConfigProvider :theme="antdvThemeConfig" :locale="antdvLocale" class="h-full">
    <AppProvider>
      <RouterView class="bg-layout" />
      <!-- antdv Watermark renders into its parent container; fixed inset-0 makes it viewport-wide (naive fullscreen/cross props have no antdv equivalent, see docs/naive-to-antdv.md) -->
      <AWatermark v-if="themeStore.watermark.visible" class="inset-0 fixed" v-bind="watermarkProps" />
    </AppProvider>
  </AConfigProvider>
</template>

<style scoped></style>
