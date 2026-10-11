import { computed, effectScope, onScopeDispose, reactive, shallowRef, watch } from 'vue';
import type { Ref } from 'vue';
import type { FlatResponseData } from '@sa/axios';
import { useBoolean, useTable } from '@sa/hooks';
import type { PaginationData, TableColumnCheck, UseTableOptions } from '@sa/hooks';
import { jsonClone } from '@sa/utils';
import type { TablePaginationConfig } from 'antdv-next';
import { $t } from '@/locales';
import { useAppStore } from '@/store/modules/app';

export type UseAntdvTableOptions<ResponseData, ApiData, Pagination extends boolean> = Omit<
  UseTableOptions<ResponseData, ApiData, App.Table.TableColumn<ApiData>, Pagination>,
  'pagination' | 'getColumnChecks' | 'getColumns'
> & {
  /**
   * get column visible
   *
   * @param column
   *
   * @default true
   *
   * @returns true if the column is visible, false otherwise
   */
  getColumnVisible?: (column: App.Table.TableColumn<ApiData>) => boolean;
};

export function useAntdvTable<ResponseData, ApiData>(options: UseAntdvTableOptions<ResponseData, ApiData, false>) {
  const scope = effectScope();
  const appStore = useAppStore();

  const result = useTable<ResponseData, ApiData, App.Table.TableColumn<ApiData>, false>({
    ...options,
    getColumnChecks: cols => getColumnChecks(cols, options.getColumnVisible),
    getColumns
  });

  // calculate the total width of the table this is used for horizontal scrolling
  const scrollX = computed(() => {
    return result.columns.value.reduce((acc, column) => {
      return acc + Number(column.width ?? 120);
    }, 0);
  });

  scope.run(() => {
    watch(
      () => appStore.locale,
      () => {
        result.reloadColumns();
      }
    );
  });

  onScopeDispose(() => {
    scope.stop();
  });

  return {
    ...result,
    scrollX
  };
}

type PaginationParams = Pick<TablePaginationConfig, 'current' | 'pageSize'>;

type UseAntdvPaginatedTableOptions<ResponseData, ApiData> = UseAntdvTableOptions<ResponseData, ApiData, true> & {
  paginationProps?: Omit<TablePaginationConfig, 'current' | 'pageSize' | 'total'>;
  /**
   * whether to show the total count of the table
   *
   * @default true
   */
  showTotal?: boolean;
  onPaginationParamsChange?: (params: PaginationParams) => void | Promise<void>;
};

export function useAntdvPaginatedTable<ResponseData, ApiData>(
  options: UseAntdvPaginatedTableOptions<ResponseData, ApiData>
) {
  const scope = effectScope();
  const appStore = useAppStore();

  const isMobile = computed(() => appStore.isMobile);

  const showTotal = computed(() => options.showTotal ?? true);

  const pagination = reactive({
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
    pageSizeOptions: [10, 15, 20, 25, 30],
    showTotal: showTotal.value ? total => $t('datatable.itemCount', { total }) : undefined,
    onChange(current: number, pageSize: number) {
      if (pageSize !== pagination.pageSize) {
        pagination.pageSize = pageSize;
        pagination.current = 1;
      } else {
        pagination.current = current;
      }
    },
    ...options.paginationProps
  }) as TablePaginationConfig;

  // this is for mobile, if the system does not support mobile, you can use `pagination` directly
  const mobilePagination = computed(() => {
    const p: TablePaginationConfig = {
      ...pagination,
      simple: isMobile.value,
      showTotal: !isMobile.value && showTotal.value ? pagination.showTotal : undefined
    };

    return p;
  });

  const paginationParams = computed(() => {
    const { current, pageSize } = pagination;

    return {
      current,
      pageSize
    };
  });

  const result = useTable<ResponseData, ApiData, App.Table.TableColumn<ApiData>, true>({
    ...options,
    pagination: true,
    getColumnChecks: cols => getColumnChecks(cols, options.getColumnVisible),
    getColumns,
    onFetched: data => {
      pagination.total = data.total;
      pagination.pageSize = data.pageSize;
    }
  });

  async function getDataByPage(page: number = 1) {
    if (page !== pagination.current) {
      pagination.current = page;

      return;
    }

    await result.getData();
  }

  scope.run(() => {
    watch(
      () => appStore.locale,
      () => {
        result.reloadColumns();
      }
    );

    watch(paginationParams, async newVal => {
      await options.onPaginationParamsChange?.(newVal);

      await result.getData();
    });
  });

  onScopeDispose(() => {
    scope.stop();
  });

  return {
    ...result,
    getDataByPage,
    pagination,
    mobilePagination
  };
}

export function useTableOperate<TableData>(
  data: Ref<TableData[]>,
  idKey: keyof TableData,
  getData: () => Promise<void>
) {
  const { bool: drawerVisible, setTrue: openDrawer, setFalse: closeDrawer } = useBoolean();

  const operateType = shallowRef<App.Table.OperateType>('add');

  function handleAdd() {
    operateType.value = 'add';
    openDrawer();
  }

  /** the editing row data */
  const editingData = shallowRef<TableData | null>(null);

  function handleEdit(id: TableData[keyof TableData]) {
    operateType.value = 'edit';
    const findItem = data.value.find(item => item[idKey] === id) || null;
    editingData.value = jsonClone(findItem);

    openDrawer();
  }

  /** the checked row keys of table */
  const checkedRowKeys = shallowRef<string[]>([]);

  /** the hook after the batch delete operation is completed */
  async function onBatchDeleted() {
    window.$message?.success($t('common.deleteSuccess'));

    checkedRowKeys.value = [];

    await getData();
  }

  /** the hook after the delete operation is completed */
  async function onDeleted() {
    window.$message?.success($t('common.deleteSuccess'));

    await getData();
  }

  return {
    drawerVisible,
    openDrawer,
    closeDrawer,
    operateType,
    handleAdd,
    editingData,
    handleEdit,
    checkedRowKeys,
    onBatchDeleted,
    onDeleted
  };
}

export function defaultTransform<ApiData>(
  response: FlatResponseData<any, Api.Common.PaginatingQueryRecord<ApiData>>
): PaginationData<ApiData> {
  const { data, error } = response;

  if (!error) {
    const { records, current, size, total } = data;

    return {
      data: records,
      pageNum: current,
      pageSize: size,
      total
    };
  }

  return {
    data: [],
    pageNum: 1,
    pageSize: 10,
    total: 0
  };
}

function getColumnChecks<Column extends App.Table.TableColumn<any>>(
  cols: Column[],
  getColumnVisible?: (column: Column) => boolean
) {
  const checks: TableColumnCheck[] = [];

  cols.forEach(column => {
    if (isTableColumnHasKey(column)) {
      // antd's `fixed` type is `'left' | 'right' | boolean`, normalize it to the check model
      const fixed = column.fixed === 'left' || column.fixed === 'right' ? column.fixed : 'unFixed';
      checks.push({
        key: column.key as string,
        title: column.title!,
        checked: true,
        fixed,
        visible: getColumnVisible?.(column) ?? true
      });
    }
  });

  return checks;
}

function getColumns<Column extends App.Table.TableColumn<any>>(cols: Column[], checks: TableColumnCheck[]) {
  const columnMap = new Map<string, Column>();

  cols.forEach(column => {
    if (isTableColumnHasKey(column)) {
      columnMap.set(column.key as string, column);
    }
  });

  const filteredColumns = checks
    .filter(item => item.checked)
    .map(check => {
      return {
        ...columnMap.get(check.key),
        fixed: check.fixed === 'unFixed' ? undefined : check.fixed
      } as Column;
    });

  return filteredColumns;
}

export function isTableColumnHasKey<T>(column: App.Table.TableColumn<T>): column is App.Table.TableColumnWithKey<T> {
  return Boolean((column as App.Table.TableColumnWithKey<T>).key);
}
