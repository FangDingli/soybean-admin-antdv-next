<script setup lang="ts">
import { computed } from 'vue';
import type { VNode } from 'vue';
import { $t } from '@/locales';
import { useTabStore } from '@/store/modules/tab';
import { useSvgIcon } from '@/hooks/common/icon';

defineOptions({
  name: 'ContextMenu'
});

interface Props {
  /** ClientX */
  x: number;
  /** ClientY */
  y: number;
  tabId: string;
  excludeKeys?: App.Global.DropdownKey[];
  disabledKeys?: App.Global.DropdownKey[];
}

const props = withDefaults(defineProps<Props>(), {
  excludeKeys: () => [],
  disabledKeys: () => []
});

const visible = defineModel<boolean>('visible');

const { removeTab, clearTabs, clearLeftTabs, clearRightTabs, fixTab, unfixTab, isTabRetain, homeTab } = useTabStore();
const { SvgIconVNode } = useSvgIcon();

type DropdownOption = {
  key: App.Global.DropdownKey;
  label: string;
  icon?: () => VNode;
  disabled?: boolean;
};

const options = computed(() => {
  const opts: DropdownOption[] = [
    {
      key: 'closeCurrent',
      label: $t('dropdown.closeCurrent'),
      icon: SvgIconVNode({ icon: 'ant-design:close-outlined', fontSize: 18 })
    },
    {
      key: 'closeOther',
      label: $t('dropdown.closeOther'),
      icon: SvgIconVNode({ icon: 'ant-design:column-width-outlined', fontSize: 18 })
    },
    {
      key: 'closeLeft',
      label: $t('dropdown.closeLeft'),
      icon: SvgIconVNode({ icon: 'mdi:format-horizontal-align-left', fontSize: 18 })
    },
    {
      key: 'closeRight',
      label: $t('dropdown.closeRight'),
      icon: SvgIconVNode({ icon: 'mdi:format-horizontal-align-right', fontSize: 18 })
    },
    {
      key: 'closeAll',
      label: $t('dropdown.closeAll'),
      icon: SvgIconVNode({ icon: 'ant-design:line-outlined', fontSize: 18 })
    }
  ];

  if (props.tabId !== homeTab?.id) {
    if (isTabRetain(props.tabId)) {
      opts.push({
        key: 'unpin',
        label: $t('dropdown.unpin'),
        icon: SvgIconVNode({ icon: 'mdi:pin-off-outline', fontSize: 18 })
      });
    } else {
      opts.push({
        key: 'pin',
        label: $t('dropdown.pin'),
        icon: SvgIconVNode({ icon: 'mdi:pin-outline', fontSize: 18 })
      });
    }
  }

  const { excludeKeys, disabledKeys } = props;

  const result = opts.filter(opt => !excludeKeys.includes(opt.key));

  disabledKeys.forEach(key => {
    const opt = result.find(item => item.key === key);

    if (opt) {
      opt.disabled = true;
    }
  });

  // antd Dropdown takes `menu.items` (icon is a VNode, not a render function)
  return result.map(opt => ({
    key: opt.key,
    label: opt.label,
    disabled: opt.disabled,
    icon: opt.icon?.()
  }));
});

function hideDropdown() {
  visible.value = false;
}

const dropdownAction: Record<App.Global.DropdownKey, () => void> = {
  closeCurrent() {
    removeTab(props.tabId);
  },
  closeOther() {
    clearTabs([props.tabId]);
  },
  closeLeft() {
    clearLeftTabs(props.tabId);
  },
  closeRight() {
    clearRightTabs(props.tabId);
  },
  closeAll() {
    clearTabs();
  },
  pin() {
    fixTab(props.tabId);
  },
  unpin() {
    unfixTab(props.tabId);
  }
};

function handleDropdown(optionKey: App.Global.DropdownKey) {
  dropdownAction[optionKey]?.();
  hideDropdown();
}

function handleMenuClick(info: { key: string | number }) {
  handleDropdown(info.key as App.Global.DropdownKey);
}

function handleOpenChange(open: boolean) {
  if (!open) {
    hideDropdown();
  }
}
</script>

<template>
  <!--
 naive NDropdown supports absolute x/y positioning; antd Dropdown anchors to its default slot,
       so we plant a zero-size anchor at the right-click point 
-->
  <ADropdown
    :open="visible"
    placement="bottomLeft"
    :trigger="['contextmenu']"
    :menu="{ items: options }"
    @open-change="handleOpenChange"
    @menu-click="handleMenuClick"
  >
    <div class="fixed size-0" :style="{ left: `${x}px`, top: `${y}px` }"></div>
  </ADropdown>
</template>

<style scoped></style>
