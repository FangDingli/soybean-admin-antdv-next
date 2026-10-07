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

| Naive UI                                                                         | Antdv-Next                                                 | 备注                                                         |
| -------------------------------------------------------------------------------- | ---------------------------------------------------------- | ------------------------------------------------------------ |
| NConfigProvider                                                                  | AConfigProvider                                            | theme token + `theme.darkAlgorithm`（详见 WP2）              |
| NWatermark                                                                       | AWatermark                                                 | naive 有 `fullscreen`，antdv 无 → 外层 fixed 容器实现（WP2） |
| NButton                                                                          | AButton                                                    |                                                              |
| NSwitch                                                                          | ASwitch                                                    |                                                              |
| NInput / NInputGroup                                                             | AInput / ASpace.Compact                                    |                                                              |
| NInputNumber                                                                     | AInputNumber                                               |                                                              |
| NForm / NFormItem                                                                | AForm / AFormItem                                          | rules 类型 naive `FormItemRule` → antd `Rule`                |
| NSelect                                                                          | ASelect                                                    |                                                              |
| NCheckbox                                                                        | ACheckbox                                                  |                                                              |
| NMenu                                                                            | AMenu                                                      | items 适配器见 WP5                                           |
| NDropdown                                                                        | ADropdown                                                  |                                                              |
| NDivider                                                                         | ADivider                                                   |                                                              |
| NSpace                                                                           | ASpace                                                     |                                                              |
| NTabs / NTab                                                                     | ATabs / ATabPane（或 items）                               |                                                              |
| NTooltip                                                                         | ATooltip                                                   |                                                              |
| NPopover                                                                         | APopover                                                   |                                                              |
| NPopconfirm                                                                      | APopconfirm                                                |                                                              |
| NModal                                                                           | AModal                                                     |                                                              |
| NDrawer / NDrawerContent                                                         | ADrawer                                                    | antd 单组件，content 用插槽                                  |
| NCard                                                                            | ACard                                                      |                                                              |
| NGrid / NGi                                                                      | ARow / ACol                                                |                                                              |
| NList / NListItem                                                                | AList                                                      |                                                              |
| NEmpty                                                                           | AEmpty                                                     |                                                              |
| NAlert                                                                           | AAlert                                                     |                                                              |
| NBadge                                                                           | ABadge                                                     |                                                              |
| NBreadcrumb / NBreadcrumbItem                                                    | ABreadcrumb / ABreadcrumbItem（或 items）                  |                                                              |
| NStatistic                                                                       | AStatistic                                                 |                                                              |
| NColorPicker                                                                     | 待核对（WP6）                                              |                                                              |
| NThing                                                                           | 无对应 → Typography + Flex 重写                            |                                                              |
| NScrollbar                                                                       | @sa/materials `SimpleScrollbar` / CSS overflow             |                                                              |
| NDialogProvider / NMessageProvider / NNotificationProvider / NLoadingBarProvider | `App` 组件 + `useMessage` / `useModal` / `useNotification` | loadingBar → 删除（路由进度已有 nprogress），见 WP2          |
| useDialog/useMessage/useNotification（naive）                                    | message / Modal / notification 的 `useXxx()` hooks         | `window.$message` 等实例类型随之更换                         |

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
