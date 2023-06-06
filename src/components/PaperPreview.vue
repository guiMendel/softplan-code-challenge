<script setup lang="ts">
import { type Highlightable, highlight } from '@/modules/highlight'
import type { Paper } from '@/types/Paper.interface'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps<{ paper: Paper; highlight?: { title?: Highlightable } }>()

const router = useRouter()

const openPaperPage = () => router.push({ name: 'paper', params: { paperId: props.paper.uid } })

const highlightField = (field: 'title') => {
  if (props.highlight != undefined && props.highlight[field] != undefined)
    return highlight(props.highlight[field]!)
  return highlight({ text: props.paper[field] })
}

// A text that places this paper in time
const timestamp = computed(() => {
  type timeUnit = 'second' | 'minute' | 'hour'

  const actionWord =
    props.paper.modifiedAt.getTime() == props.paper.createdAt.getTime()
      ? 'created'
      : 'last modified'

  const pronounFor = (timeType: timeUnit) => (timeType === 'hour' ? 'an' : 'a')

  const formatAs = (timeType: timeUnit, value: number) => {
    if (value == 0) return `${actionWord} now`

    return `${actionWord} ${value === 1 ? pronounFor(timeType) : value} ${timeType}${
      value === 1 ? '' : 's'
    } ago`
  }

  // Get time difference
  const dateDifference = new Date().getTime() - props.paper.modifiedAt.getTime()

  // If it's less than a minute old
  if (dateDifference <= 60000)
    return `${formatAs('second', Math.round(dateDifference / 10000) * 10)}`

  // If it's less than an hour old
  if (dateDifference <= 3.6e6) return `${formatAs('minute', Math.round(dateDifference / 60000))}`

  // If it's less than a day old
  if (dateDifference <= 8.64e7) return `${formatAs('hour', Math.round(dateDifference / 3.6e6))}`

  // Display as date
  return `${String(props.paper.modifiedAt.getMonth()).padStart(2, '0')}/${String(
    props.paper.modifiedAt.getDate()
  ).padStart(2, '0')}`
})
</script>

<template>
  <div class="paper" @click="openPaperPage">
    <!-- Paper icon -->
    <!-- <span class="icon">🎯</span> -->

    <div class="text">
      <!-- Paper title -->
      <p class="title" v-html="highlightField('title')"></p>

      <!-- Modified time -->
      <small>{{ timestamp }}</small>
    </div>

    <!-- Paper options -->
    <span class="options">
      <font-awesome-icon :icon="['fas', 'ellipsis-vertical']" />
    </span>
  </div>
</template>

<style scoped lang="scss">
@import '../style/variables.scss';

.paper {
  @include preview;

  .icon {
    font-size: 1.3rem;
  }

  .options {
    margin-right: -0.3rem;

    @include light-button;

    color: $main;

    width: 1.5rem;
    aspect-ratio: 1/1;
    border-radius: 50%;
  }

  &:hover {
    filter: brightness(1.1);
  }
}
</style>
