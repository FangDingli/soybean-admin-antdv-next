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

### WP3 通用组件

- **Placement 命名差异（重要）**：naive 用 `bottom-start` 这类 CSS-logical 命名，antdv 用 `bottomLeft`。
  antdv 的 `TooltipPlacement` 类型不收 `*-start`，相关字面量已随迁移改名
  （menu-toggler / pin-toggler 的 `bottom-start` → `bottomLeft`）。
  统一类型别名：`PopoverPlacement`（naive）→ `TooltipPlacement`（antdv-next 主入口导出）。
- **Tooltip**：naive 的 `#trigger` 插槽 → antdv 默认插槽；naive 默认插槽（内容）→ antdv `#title` 插槽；
  naive 的 `:disabled` 无对应——antdv 的 Tooltip 在 `title` 为空时自动不显示，直接删 prop。
- **Dropdown**：走 `menu` prop（MenuProps + onClick）而非 options；`trigger` 是数组类型且默认就是
  `['hover']`，`trigger="hover"` 字符串写法类型报错；选中用 `menu.selectable + menu.selectedKeys`；
  点选事件用组件的 `menu-click` 事件。naive 逐项 `props.class`（mb-1 间距 hack）antdv 菜单项不支持，删除。
- **Button**：naive `quaternary` → antdv `type="text"`（或 `variant="text"`）；naive `size="tiny"` → `size="small"`。

### WP4 表格

- **类型命名空间**：`typings/naive-ui.d.ts` 的 `NaiveUI.*` → `typings/table.d.ts` 的 `App.Table.*`
  （ColumnCheck/ColumnFixed/ColumnType/ColumnGroupType/TableColumn/OperateType），
  列类型来自 `antdv-next/dist/table/interface` 的 `ColumnType` / `ColumnGroupType`。
- **hook 改名**：`useNaiveTable` → `useAntdvTable`，`useNaivePaginatedTable` → `useAntdvPaginatedTable`
  （模板内无外部消费方，改名零成本）。
- **分页模型**：naive `PaginationProps` → antd `TablePaginationConfig`：
  `page→current`、`itemCount→total`、`showSizePicker→showSizeChanger`、`pageSizes→pageSizeOptions`、
  `prefix(itemCount)=>showTotal(total)`、`onUpdatePage/onUpdatePageSize→onChange(current,pageSize)`、
  移动端 `pageSlot:3→simple:true`。
- **selection/expand 列分支删除**：naive 把选择列/展开列当作 columns 的一员（`type:'selection'|'expand'`），
  antd 走独立的 `rowSelection` / `expandable` props，不在 columns 里——列设置只处理真实列，
  `SELECTION_KEY`/`EXPAND_KEY` 分支移除。
- **`fixed` 归一**：antd 的 `fixed` 类型是 `'left'|'right'|boolean`（含 `false`），
  列设置模型是 `'left'|'right'|'unFixed'`，双向转换处各做一次显式归一。
- **advanced 组件**：`NPopover` → `APopover`（内容进 `#content` 插槽，placement `bottom-end`→`bottomRight`）；
  `NPopconfirm @positive-click` → `APopconfirm :title + @confirm`（确认文本从默认插槽改为 `title`）；
  naive `type="error" ghost` 按钮 → `AButton type="primary" ghost danger`；
  `NCheckbox` 的 `v-model:checked`/`indeterminate` antdv 原生支持，直接换标签。

### WP5 菜单

- **适配器**：新增 `src/layouts/modules/global-menu/shared.ts` 的 `getAntdMenuItems(menus)`，
  把 soybean 自有的 `App.Global.Menu[]` 转 antdv `ItemType[]`（icon 从 `() => VNode` 渲染函数直接求值为 VNode）。
  上游 naive 版不需要这层（MenuOption 形状恰好兼容），是本次迁移新增的唯一非平凡逻辑。
- **模式映射**：naive 的 `mode="vertical"`（侧边栏可展开子菜单）→ antdv 的 `mode="inline"`；
  水平菜单同为 `horizontal`，antdv 自带溢出收进 "..."（对应 naive 的 `responsive`）。
- **属性映射**：`v-model:expanded-keys` → `v-model:openKeys`；`:value` → `:selected-keys`（数组）；
  `:collapsed` → `:inline-collapsed`；`:indent` → `:inline-indent`；`@update:value` → `@click`（参数从 key 变为 `MenuInfo`）。
- **`:collapsed-width` 无对应**：antdv 收起宽度由组件自定（约 80px），且 `inlineCollapsed` 单用不改变根宽度——
  侧边菜单显式绑定根节点 `style.width`（收起时取 `themeStore.sider.collapsedWidth`，展开 100%）。
- **`:inverted` 无对应**：用 `theme="dark"` 近似（浅色模式下的深色侧栏）；暗黑模式下沿用 light 主题
  跟随暗色 token。菜单自带的右边框用 `border-r-0` 去掉（naive 无边框）。视觉微调留到 WP8 浏览器冒烟。
- **类型导出差异**：`ItemType` 需从 `antdv-next/dist/menu/interface` 深导入（主入口不导出）。
- `first-level-menu.vue`（混合布局的一级菜单）是纯手写组件，无需改动。

### WP6 布局其余（19 个文件）

- **机械映射**（settings 9 件批量处理）：`NDivider→ADivider`、`NInputNumber→AInputNumber`（v-model:value 通用）、
  `NSelect→ASelect`（{label,value} options 直接兼容）、`NInput→AInput`（`clearable→allowClear`，
  文本输入无 autosize 概念直接删）、`NSwitch v-model:value→ASwitch v-model:checked`、
  `NSwitch :value+@update:value→ASwitch :checked+@change`。
- **NDrawer**：`v-model:show→v-model:open`；naive 的 NDrawerContent（title/closable/footer 插槽）合并进 ADrawer 本体；
  `display-directive="show"` 无对应（antd 默认关闭后保留挂载）；`:native-scrollbar` 删除。
- **NTabs type="segment" → ASegmented**：naive 用 segment 形态的 Tabs 做切换器，antdv 有专门的 Segmented
  组件（block 属性对应满宽）；选项里的图标用 h(SvgIcon) 构造。
- **NColorPicker → AColorPicker**：`show-alpha={false}→disabled-alpha`；`swatches`（扁平色板）→
  `presets`（按 label 分组）；**`valueFormat="hex"` 让 change 事件吐 hex 字符串**（否则是 Color 对象），
  change 回调取第二个参数 hex 即可保持原字符串协议。
- **NBadge**：`type="info"` → `color="blue"`；`:value` → `:count`。
- **NButton `text tag="a"`** → `AButton type="link"`（href/target 直通）。
- **NModal preset="card" → AModal**：位置用 `:style="{top}"` + wrap-class-name 控制；
  `@after-leave→@after-close`；`NInputGroup→ASpaceCompact block`；footer 用 #footer 插槽。
- **NScrollbar 无对应**：全局搜索结果列表改 CSS `overflow-y-auto`；theme-drawer 内 SimpleScrollbar
  （@sa/materials，基于 better-scroll）不受影响。
- **NDropdown 定位差异（重要）**：naive 支持 `:x/:y` 绝对定位 + `trigger="manual"`（标签右键菜单场景）；
  antd Dropdown 只能锚定默认插槽元素——移植方案是在右键坐标处放一个 `fixed size-0` 的零尺寸锚点元素，
  `:open` 受控 + `@open-change` 关闭 + `@menu-click` 处理。
- **Dropdown 的 `trigger` 必须用 `:` 绑定数组**（`trigger="['click']"` 字符串会类型报错）。
- **面包屑**：`NBreadcrumb/NBreadcrumbItem→ABreadcrumb/ABreadcrumbItem`；下拉用 WP5 的
  `getAntdMenuItems` 适配器复用。
