<script setup lang="ts">
import { App, Modal, message, notification } from 'antdv-next';

defineOptions({
  name: 'AppProvider'
});

const [messageApi, MessageContextHolder] = message.useMessage();
const [notificationApi, NotificationContextHolder] = notification.useNotification();
const [modalApi, ModalContextHolder] = Modal.useModal();

window.$message = messageApi;
window.$notification = notificationApi;
window.$modal = modalApi;
</script>

<template>
  <App class="h-full">
    <component :is="MessageContextHolder" />
    <component :is="NotificationContextHolder" />
    <component :is="ModalContextHolder" />
    <slot></slot>
  </App>
</template>

<style scoped></style>
