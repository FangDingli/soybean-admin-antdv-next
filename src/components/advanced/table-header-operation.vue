<script setup lang="ts">
import { $t } from '@/locales';

defineOptions({
  name: 'TableHeaderOperation'
});

type SpaceAlign = import('antdv-next').SpaceProps['align'];

interface Props {
  itemAlign?: SpaceAlign;
  disabledDelete?: boolean;
  loading?: boolean;
}

defineProps<Props>();

interface Emits {
  (e: 'add'): void;
  (e: 'delete'): void;
  (e: 'refresh'): void;
}

const emit = defineEmits<Emits>();

const columns = defineModel<App.Table.ColumnCheck[]>('columns', {
  default: () => []
});

function add() {
  emit('add');
}

function batchDelete() {
  emit('delete');
}

function refresh() {
  emit('refresh');
}
</script>

<template>
  <ASpace :align="itemAlign" wrap justify="end" class="lt-sm:w-200px">
    <slot name="prefix"></slot>
    <slot name="default">
      <AButton size="small" ghost type="primary" @click="add">
        <template #icon>
          <icon-ic-round-plus class="text-icon" />
        </template>
        {{ $t('common.add') }}
      </AButton>
      <APopconfirm :title="$t('common.confirmDelete')" @confirm="batchDelete">
        <AButton size="small" danger ghost type="primary" :disabled="disabledDelete">
          <template #icon>
            <icon-ic-round-delete class="text-icon" />
          </template>
          {{ $t('common.batchDelete') }}
        </AButton>
      </APopconfirm>
    </slot>
    <AButton size="small" @click="refresh">
      <template #icon>
        <icon-mdi-refresh class="text-icon" :class="{ 'animate-spin': loading }" />
      </template>
      {{ $t('common.refresh') }}
    </AButton>
    <TableColumnSetting v-model:columns="columns" />
    <slot name="suffix"></slot>
  </ASpace>
</template>

<style scoped></style>
