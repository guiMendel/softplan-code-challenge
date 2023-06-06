<script setup lang="ts">
import { ref } from 'vue'

const textContent = ref('')
</script>

<template>
  <div id="paper">
    <!-- Input field -->
    <textarea id="input-area" v-model="textContent"></textarea>

    <!-- Output view -->
    <div id="output-area" v-html="textContent"></div>
  </div>
</template>
