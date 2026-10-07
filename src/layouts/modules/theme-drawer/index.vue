<script setup lang="ts">
import { computed, ref } from 'vue';
import { useAppStore } from '@/store/modules/app';
import { $t } from '@/locales';
import AppearanceSettings from './modules/appearance/index.vue';
import LayoutSettings from './modules/layout/index.vue';
import GeneralSettings from './modules/general/index.vue';
import ConfigOperation from './modules/config-operation.vue';
import PresetSettings from './modules/preset/index.vue';

defineOptions({
  name: 'ThemeDrawer'
});

const appStore = useAppStore();
const activeTab = ref('appearance');

const tabOptions = [
  { label: $t('theme.tabs.appearance'), value: 'appearance' },
  { label: $t('theme.tabs.layout'), value: 'layout' },
  { label: $t('theme.tabs.general'), value: 'general' },
  { label: $t('theme.tabs.preset'), value: 'preset' }
];

const drawerWidth = computed(() => {
  const width = 400;

  // On mobile devices, use 90% of viewport width with a maximum of 400px
  if (appStore.isMobile) {
    return `min(90vw, ${width}px)`;
  }

  return width;
});
</script>

<template>
  <ADrawer
    v-model:open="appStore.themeDrawerVisible"
    :width="drawerWidth"
    closable
    :title="$t('theme.themeDrawerTitle')"
  >
    <ASegmented v-model:value="activeTab" block class="mb-16px" :options="tabOptions" />

    <div class="min-h-400px">
      <KeepAlive>
        <AppearanceSettings v-if="activeTab === 'appearance'" />
        <LayoutSettings v-else-if="activeTab === 'layout'" />
        <GeneralSettings v-else-if="activeTab === 'general'" />
        <PresetSettings v-else-if="activeTab === 'preset'" />
      </KeepAlive>
    </div>

    <template #footer>
      <ConfigOperation />
    </template>
  </ADrawer>
</template>

<style scoped></style>
