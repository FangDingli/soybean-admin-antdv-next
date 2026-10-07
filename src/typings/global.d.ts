export {};

declare global {
  export interface Window {
    /** NProgress instance */
    NProgress?: import('nprogress').NProgress;
    /** Modal hook api (from `Modal.useModal()`) */
    $modal?: import('antdv-next/dist/modal/useModal/types').HookAPI;
    /** Message instance (from `message.useMessage()`) */
    $message?: import('antdv-next/dist/message/interface').MessageInstance;
    /** Notification instance (from `notification.useNotification()`) */
    $notification?: import('antdv-next/dist/notification/interface').NotificationInstance;
  }

  /** Build time of the project */
  export const BUILD_TIME: string;
}
