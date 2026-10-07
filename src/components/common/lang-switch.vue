<script setup lang="ts">
import { computed } from 'vue';
import { $t } from '@/locales';

defineOptions({
  name: 'LangSwitch'
});

interface Props {
  /** Current language */
  lang: App.I18n.LangType;
  /** Language options */
  langOptions: App.I18n.LangOption[];
  /** Show tooltip */
  showTooltip?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showTooltip: true
});

type Emits = {
  (e: 'changeLang', lang: App.I18n.LangType): void;
};

const emit = defineEmits<Emits>();

const tooltipContent = computed(() => {
  if (!props.showTooltip) return '';

  return $t('icon.lang');
});

const menuProps = computed(() => ({
  items: props.langOptions,
  selectable: true,
  selectedKeys: [props.lang]
}));

function changeLang(lang: App.I18n.LangType) {
  emit('changeLang', lang);
}

function handleMenuClick(info: { key: string }) {
  changeLang(info.key as App.I18n.LangType);
}
</script>

<template>
  <ADropdown :menu="menuProps" @menu-click="handleMenuClick">
    <div>
      <ButtonIcon :tooltip-content="tooltipContent" tooltip-placement="left">
        <SvgIcon icon="heroicons:language" />
      </ButtonIcon>
    </div>
  </ADropdown>
</template>

<style scoped></style>
