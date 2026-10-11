<script setup lang="ts">
import { $t } from '@/locales';
import { useThemeStore } from '@/store/modules/theme';
import SettingItem from '../../../components/setting-item.vue';

defineOptions({
  name: 'ThemeColor'
});

const themeStore = useThemeStore();

const swatches: string[] = [
  '#3b82f6',
  '#6366f1',
  '#8b5cf6',
  '#a855f7',
  '#0ea5e9',
  '#06b6d4',
  '#f43f5e',
  '#ef4444',
  '#ec4899',
  '#d946ef',
  '#f97316',
  '#f59e0b',
  '#eab308',
  '#84cc16',
  '#22c55e',
  '#10b981'
];

// antd ColorPicker presets are grouped by label, naive used a flat swatch list
const colorPresets = [{ label: 'SoybeanAdmin', colors: swatches }];

// antd ColorPicker's change event emits (color, hex); the hex string is what the theme store wants
function handleColorChange(key: App.Theme.ThemeColorKey) {
  return (_color: unknown, hex: string) => {
    themeStore.updateThemeColors(key, hex);
  };
}
</script>

<template>
  <ADivider>{{ $t('theme.appearance.themeColor.title') }}</ADivider>
  <div class="flex-col-stretch gap-12px">
    <SettingItem key="recommend-color" :label="$t('theme.appearance.recommendColor')">
      <template #suffix>
        <IconTooltip>
          <p>
            <span class="pr-12px">{{ $t('theme.appearance.recommendColorDesc') }}</span>
            <br />
            <AButton
              type="link"
              href="https://uicolors.app/create"
              target="_blank"
              rel="noopener noreferrer"
              class="text-gray"
            >
              https://uicolors.app/create
            </AButton>
          </p>
        </IconTooltip>
      </template>
      <ASwitch v-model:checked="themeStore.recommendColor" />
    </SettingItem>

    <SettingItem
      v-for="(_, key) in themeStore.themeColors"
      :key="key"
      :label="$t(`theme.appearance.themeColor.${key}`)"
    >
      <template v-if="key === 'info'" #suffix>
        <ACheckbox v-model:checked="themeStore.isInfoFollowPrimary">
          {{ $t('theme.appearance.themeColor.followPrimary') }}
        </ACheckbox>
      </template>
      <div class="w-90px">
        <!-- valueFormat="hex" makes the change event emit a plain hex string (naive emitted strings) -->
        <AColorPicker
          :value="themeStore.themeColors[key]"
          value-format="hex"
          :disabled="key === 'info' && themeStore.isInfoFollowPrimary"
          :disabled-alpha="true"
          :presets="colorPresets"
          @change="handleColorChange(key)"
        />
      </div>
    </SettingItem>
  </div>
</template>

<style scoped></style>
