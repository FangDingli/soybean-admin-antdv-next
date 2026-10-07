<script setup lang="ts">
import { computed, h } from 'vue';
import { themeSchemaRecord } from '@/constants/app';
import { useThemeStore } from '@/store/modules/theme';
import { $t } from '@/locales';
import SvgIcon from '@/components/custom/svg-icon.vue';
import SettingItem from '../../../components/setting-item.vue';

defineOptions({
  name: 'ThemeSchema'
});

const themeStore = useThemeStore();

const icons: Record<UnionKey.ThemeScheme, string> = {
  light: 'material-symbols:sunny',
  dark: 'material-symbols:nightlight-rounded',
  auto: 'material-symbols:hdr-auto'
};

// naive used segment-style NTabs; antdv-next has a dedicated Segmented component
const schemaOptions = computed(() =>
  Object.entries(themeSchemaRecord).map(([key]) => ({
    value: key,
    label: () => h(SvgIcon, { icon: icons[key as UnionKey.ThemeScheme], class: 'h-23px text-icon-small' })
  }))
);

function handleSegmentChange(value: string | number) {
  themeStore.setThemeScheme(value as UnionKey.ThemeScheme);
}

function handleGrayscaleChange(value: boolean) {
  themeStore.setGrayscale(value);
}

function handleColourWeaknessChange(value: boolean) {
  themeStore.setColourWeakness(value);
}

const showSiderInverted = computed(() => !themeStore.darkMode && themeStore.layout.mode.includes('vertical'));
</script>

<template>
  <ADivider>{{ $t('theme.appearance.themeSchema.title') }}</ADivider>
  <div class="flex-col-stretch gap-16px">
    <div class="i-flex-center">
      <ASegmented
        :value="themeStore.themeScheme"
        size="small"
        class="relative w-214px"
        :options="schemaOptions"
        @change="handleSegmentChange"
      />
    </div>
    <Transition name="sider-inverted">
      <SettingItem v-if="showSiderInverted" :label="$t('theme.layout.sider.inverted')">
        <ASwitch v-model:checked="themeStore.sider.inverted" />
      </SettingItem>
    </Transition>
    <SettingItem :label="$t('theme.appearance.grayscale')">
      <ASwitch :checked="themeStore.grayscale" @change="handleGrayscaleChange" />
    </SettingItem>
    <SettingItem :label="$t('theme.appearance.colourWeakness')">
      <ASwitch :checked="themeStore.colourWeakness" @change="handleColourWeaknessChange" />
    </SettingItem>
  </div>
</template>

<style scoped>
.sider-inverted-enter-active,
.sider-inverted-leave-active {
  --uno: h-22px transition-all-300;
}

.sider-inverted-enter-from,
.sider-inverted-leave-to {
  --uno: translate-x-20px opacity-0 h-0;
}
</style>
