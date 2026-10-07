# Naive UI → Antdv-Next 转换台账

> 本文档记录 soybean-admin-antdv-next 相对上游 [soybean-admin](https://github.com/soybeanjs/soybean-admin)
> （基线 `v2.2.0-13-g379772fc`）的全部 UI 层差异，既是转换过程的决策记录，也是开源用户了解本项目改动的第一手资料。
>
> 参考文档：antdv-next 1.6.0（`ConfigProvider` / `Watermark` / `Menu` 等以组件官方文档为准）。

## 约定

1. **只换 UI 层**：路由（elegant-router）、状态管理（pinia）、i18n、构建体系、`packages/*` 工作区包一律不动。
2. antdv-next 无对应物的 naive 组件，按「替代方案」处理，逐条记录在本文。
3. 转换按工作包（WP0–WP8）推进，每个 WP 一个 commit，见 `git log`。

## 组件映射总表

| Naive UI                                                                         | Antdv-Next                                                                                  | 备注                                                                                        |
| -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| NConfigProvider                                                                  | AConfigProvider                                                                             | theme token + `theme.darkAlgorithm`（详见 WP2）                                             |
| NWatermark                                                                       | AWatermark                                                                                  | naive 有 `fullscreen`，antdv 无 → 外层 fixed 容器实现（WP2）                                |
| NButton                                                                          | AButton                                                                                     |                                                                                             |
| NSwitch                                                                          | ASwitch                                                                                     |                                                                                             |
| NInput / NInputGroup                                                             | AInput / ASpace.Compact                                                                     |                                                                                             |
| NInputNumber                                                                     | AInputNumber                                                                                |                                                                                             |
| NForm / NFormItem                                                                | AForm / AFormItem                                                                           | rules 类型 naive `FormItemRule` → antd `Rule`                                               |
| NSelect                                                                          | ASelect                                                                                     |                                                                                             |
| NCheckbox                                                                        | ACheckbox                                                                                   |                                                                                             |
| NMenu                                                                            | AMenu                                                                                       | items 适配器见 WP5                                                                          |
| NDropdown                                                                        | ADropdown                                                                                   |                                                                                             |
| NDivider                                                                         | ADivider                                                                                    |                                                                                             |
| NSpace                                                                           | ASpace                                                                                      |                                                                                             |
| NTabs / NTab                                                                     | ATabs / ATabPane（或 items）                                                                |                                                                                             |
| NTooltip                                                                         | ATooltip                                                                                    |                                                                                             |
| NPopover                                                                         | APopover                                                                                    |                                                                                             |
| NPopconfirm                                                                      | APopconfirm                                                                                 |                                                                                             |
| NModal                                                                           | AModal                                                                                      |                                                                                             |
| NDrawer / NDrawerContent                                                         | ADrawer                                                                                     | antd 单组件，content 用插槽                                                                 |
| NCard                                                                            | ACard                                                                                       |                                                                                             |
| NGrid / NGi                                                                      | ARow / ACol                                                                                 |                                                                                             |
| NList / NListItem                                                                | AList                                                                                       |                                                                                             |
| NEmpty                                                                           | AEmpty                                                                                      |                                                                                             |
| NAlert                                                                           | AAlert                                                                                      |                                                                                             |
| NBadge                                                                           | ABadge                                                                                      |                                                                                             |
| NBreadcrumb / NBreadcrumbItem                                                    | ABreadcrumb / ABreadcrumbItem（或 items）                                                   |                                                                                             |
| NStatistic                                                                       | AStatistic                                                                                  |                                                                                             |
| NColorPicker                                                                     | 待核对（WP6）                                                                               |                                                                                             |
| NThing                                                                           | 无对应 → Typography + Flex 重写                                                             |                                                                                             |
| NScrollbar                                                                       | @sa/materials `SimpleScrollbar` / CSS overflow                                              |                                                                                             |
| NDialogProvider / NMessageProvider / NNotificationProvider / NLoadingBarProvider | `App` 组件 + `message.useMessage()` / `notification.useNotification()` / `Modal.useModal()` | `window.$dialog` → `window.$modal`（HookAPI）；`$loadingBar` 删除（路由进度已有 nprogress） |
| useDialog/useMessage/useNotification（naive）                                    | message / Modal / notification 的 `useXxx()` hooks                                          | `window.$message` 等实例类型随之更换                                                        |

## 决策记录

### WP0 基线（2026-10-07）

- 不做 GitHub fork：本地源码起全新 git 仓库，pristine baseline 单独 commit，便于与上游 diff。
- MIT 协议保留原作者版权行，README 注明 based on soybean-admin。
- 包管理器保持上游的 pnpm。

### WP1 依赖与构建

- `package.json`：新增 `antdv-next ^1.6.0`、`@antdv-next/icons ^1.1.2`（dependencies）、
  `@antdv-next/auto-import-resolver ^1.2.0`（devDependencies）。
- **`naive-ui` 暂不删除**：45 个文件的模板仍引用 `<N*>` 组件，保留依赖 + 双 resolver 并存，
  保证每个工作包完成后 dev server 均可启动、增量可验证。WP8 全部清零后统一移除。
- `build/plugins/unplugin.ts`：`resolvers` 加入 `AntdvNextResolver()`（与 `NaiveUiResolver()` 并存，WP8 删后者）。
- uno / `@sa/uno-preset`：经核实与 naive-ui 零耦合（色板由 `@sa/color` 生成），**不改**。

### WP2 全局壳与类型

- **主题映射**：新增 `src/theme/adapter.ts` 的 `createAntdvThemeConfig(colors, themeRadius, darkMode)`，
  只映射 seed token（colorPrimary/Info/Success/Warning/Error + borderRadius）+ `theme.darkAlgorithm`。
  naive 版的 Hover/Pressed/Active 手工调色板**不再需要**——antdv 的 algorithm 会从 seed 色自动推导色板。
  位置刻意独立成模块，对齐 soybean-admin v3 文档 §7.2 的 antd 适配器规范（token → ConfigProvider theme），
  便于将来 v3 对接。
- **Watermark**：naive 的 `fullscreen: true` → `<AWatermark class="inset-0 fixed">`（antdv 水印渲染进父容器）；
  `cross`（交叉平铺）无对应，放弃；naive 的 `fontSize/lineHeight` → `font: { fontSize, fontWeight }`；
  `xOffset/yOffset` → `offset: [x, y]`。
- **notification API 差异（重要）**：antdv-next 的 notification 字段是 `title` / `description` / `actions`，
  **不是** antd v5 的 `message` / `content` / `btn`（官方文档 demo 仍写 message，以 .d.ts `ArgsProps` 为准）。
  `create()` → `open({ key })`，实例关闭靠 `destroy(key)`。
- **message**：naive `message.error(text, { onLeave })` → antdv `message.error(text, onClose)`（第二参即关闭回调）；
  naive 的 `duration` 单位毫秒，antdv 为秒（4500 → 4.5）。
- **Modal（window.$modal）**：naive `Dialog` 的 `positiveText/negativeText/onPositiveClick/closeOnEsc`
  → antdv `okText/cancelText/onOk/keyboard`。
- **locale**：`antdv-next/dist/locale/zh_CN|en_US`（package.json exports 支持 `./dist/*` 深导入）。
- **全局实例类型**（`typings/global.d.ts`）：`$modal` ← `modal/useModal/types` 的 `HookAPI`、
  `$message` ← `message/interface` 的 `MessageInstance`、`$notification` ← `notification/interface` 的 `NotificationInstance`。
- **预设 JSON**：`src/theme/preset/azir.json` 删除 `naiveui` 字段（naive 组件级覆盖无对应机制；
  如需组件级定制走 ConfigProvider `theme.components`）。
- **暂时保留**：`typings/naive-ui.d.ts`（NaiveUI 表格类型命名空间）与 `app.d.ts` 的 `FormRule`（naive FormItemRule）
  留到 WP4 / WP7 与其消费方一起改，避免中间状态 typecheck 变红。
