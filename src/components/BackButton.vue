<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <font-awesome-icon id="back-button" :icon="['fas', 'backward']" @click="router.back()" />
</template>
