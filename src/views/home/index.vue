<script setup lang="ts">
import { computed } from 'vue';
import { useAppStore } from '@/store/modules/app';
import CardData from './modules/card-data.vue';
import CreativityBanner from './modules/creativity-banner.vue';
import HeaderBanner from './modules/header-banner.vue';
import LineChart from './modules/line-chart.vue';
import PieChart from './modules/pie-chart.vue';
import ProjectNews from './modules/project-news.vue';

const appStore = useAppStore();

const gap = computed(() => (appStore.isMobile ? 0 : 16));
</script>

<template>
  <ASpace direction="vertical" :size="16" class="w-full">
    <AAlert type="warning" show-icon>
      <template #message>{{ $t('common.tip') }}</template>
      <template #description>{{ $t('page.home.branchDesc') }}</template>
    </AAlert>
    <HeaderBanner />
    <CardData />
    <!-- naive responsive spans (span="24 s:24 m:14") map to antd breakpoint props -->
    <ARow :gutter="[gap, 16]">
      <ACol :xs="24" :md="14">
        <ACard :bordered="false" class="card-wrapper">
          <LineChart />
        </ACard>
      </ACol>
      <ACol :xs="24" :md="10">
        <ACard :bordered="false" class="card-wrapper">
          <PieChart />
        </ACard>
      </ACol>
    </ARow>
    <ARow :gutter="[gap, 16]">
      <ACol :xs="24" :md="14">
        <ProjectNews />
      </ACol>
      <ACol :xs="24" :md="10">
        <CreativityBanner />
      </ACol>
    </ARow>
  </ASpace>
</template>

<style scoped></style>
