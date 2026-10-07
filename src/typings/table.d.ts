declare namespace App {
  namespace Table {
    /** Column visibility check item (UI-agnostic, from `@sa/hooks`) */
    type ColumnCheck = import('@sa/hooks').TableColumnCheck;

    type ColumnFixed = import('@sa/hooks').TableColumnCheck['fixed'];

    type ColumnType<T = any> = import('antdv-next/dist/table/interface').ColumnType<T>;

    type ColumnGroupType<T = any> = import('antdv-next/dist/table/interface').ColumnGroupType<T>;

    type TableColumn<T = any> = ColumnType<T> | ColumnGroupType<T>;

    type TableColumnWithKey<T = any> = TableColumn<T> & { key: string | number };

    /**
     * the type of table operation
     *
     * - add: add table item
     * - edit: edit table item
     */
    type OperateType = 'add' | 'edit';
  }
}
