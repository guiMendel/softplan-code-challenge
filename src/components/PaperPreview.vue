<script setup lang="ts">
import type { Paper } from '@/types/Paper.interface'
import { useRouter } from 'vue-router'

const props = defineProps<{ paper: Paper; highlight?: { title?: string } }>()

const router = useRouter()

const openPaperPage = () => router.push({ name: 'paper', params: { paperId: props.paper.uid } })
</script>

<template>
  <div class="paper" @click="router.push({ name: 'paper' })">
    <!-- Paper icon -->
    <span class="icon">🎯</span>

    <div class="text">
      <!-- Paper title -->
      <span class="title">Getting started</span>

      <!-- Modified time -->
      <small>last modified 2 hours ago</small>
    </div>

    <!-- Paper options -->
    <span class="options">
      <font-awesome-icon :icon="['fas', 'ellipsis-vertical']" />
    </span>
  </div>
</template>
