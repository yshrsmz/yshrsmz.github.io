<script setup lang="ts">
import type { KindleDetail } from '../types';
import VPKindleDetail from './VPKindleDetail.vue';
import VPKindleDetailList from './VPKindleDetailList.vue';

defineProps<{
  details: KindleDetail[]
}>()
</script>

<template>
  <VPKindleDetail v-if="details.length === 1" :detail="details[0]" class="VPKindleDetails VPKindleDetails_single" />
  <VPKindleDetailList v-else :details="details" class="VPKindleDetails VPKindleDetails_multi"/>
</template>
