<script setup lang="ts">
import { computed } from 'vue';
import type { VNode } from 'vue';
import { $t } from '@/locales';
import { useAuthStore } from '@/store/modules/auth';
import { useSvgIcon } from '@/hooks/common/icon';
import { useRouterPush } from '@/hooks/common/router';

defineOptions({
  name: 'UserAvatar'
});

const authStore = useAuthStore();
const { routerPushByKey, toLogin } = useRouterPush();
const { SvgIconVNode } = useSvgIcon();

function loginOrRegister() {
  toLogin();
}

type DropdownKey = 'logout';

type DropdownOption = {
  key: DropdownKey;
  label: string;
  icon?: () => VNode;
};

const options = computed(() => {
  const opts: DropdownOption[] = [
    {
      label: $t('common.logout'),
      key: 'logout',
      icon: SvgIconVNode({ icon: 'ph:sign-out', fontSize: 18 })
    }
  ];

  // antd Dropdown takes `menu.items` (icon is a VNode, not a render function)
  return opts.map(opt => ({
    key: opt.key,
    label: opt.label,
    icon: opt.icon?.()
  }));
});

function handleMenuClick(info: { key: string | number }) {
  handleDropdown(info.key as DropdownKey);
}

function logout() {
  window.$modal?.info({
    title: $t('common.tip'),
    content: $t('common.logoutConfirm'),
    okText: $t('common.confirm'),
    cancelText: $t('common.cancel'),
    onOk: () => {
      authStore.resetStore();
    }
  });
}

function handleDropdown(key: DropdownKey) {
  if (key === 'logout') {
    logout();
  } else {
    // If your other options are jumps from other routes, they will be directly supported here
    routerPushByKey(key);
  }
}
</script>

<template>
  <AButton v-if="!authStore.isLogin" type="text" @click="loginOrRegister">
    {{ $t('page.login.common.loginOrRegister') }}
  </AButton>
  <ADropdown v-else placement="bottom" :trigger="['click']" :menu="{ items: options }" @menu-click="handleMenuClick">
    <div>
      <ButtonIcon>
        <SvgIcon icon="ph:user-circle" class="text-icon-large" />
        <span class="text-16px font-medium">{{ authStore.userInfo.userName }}</span>
      </ButtonIcon>
    </div>
  </ADropdown>
</template>

<style scoped></style>
