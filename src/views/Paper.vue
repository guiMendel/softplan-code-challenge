<script setup lang="ts">
import { usePaperAPI } from '@/modules/usePaperAPI'
import { computed, onBeforeUnmount, ref, watch, watchEffect } from 'vue'
import sanitizeHtml from 'sanitize-html'
import { marked } from 'marked'

// Grab props
const props = defineProps<{ paperId: string }>()

// Consume papers api
const { syncPaper } = usePaperAPI()

// Input reference
const inputReference = ref<HTMLTextAreaElement | null>(null)
watch(inputReference, (element) => element?.focus())

// ===============================
// === PAPER INSTANCE UPDATING
// ===============================

// Grab referenced paper
const paper = syncPaper(props.paperId)

// Whenever id changes
watch(props, ({ paperId }) => syncPaper(paperId, paper))

// How much debounce to apply to user input
const debounce = 1500

// Current debounce counter
let debounceTimer: number | null = null

// Cached content
const cachedContent = ref('')
watchEffect(() => (cachedContent.value = paper.value?.content ?? ''))

// Sets paper content
const setPaperContent = (newContent: string) => {
  if (paper.value == null) return

  paper.value = { ...paper.value, content: newContent }
}

// Handles user input
const handleInput = (event: Event) => {
  // Debounce input
  if (debounceTimer != null) clearTimeout(debounceTimer)

  // Cache content
  cachedContent.value = (event.target as HTMLTextAreaElement).value

  debounceTimer = setTimeout(() => {
    if (paper.value == null) return

    // Actually performs an update to the paper
    setPaperContent(cachedContent.value)

    debounceTimer = null
  }, debounce)
}

// Text to render
const renderContent = computed(() => sanitizeHtml(marked(paper.value?.content ?? '')))

// Ensure to save before unmounting
onBeforeUnmount(() => {
  // Clear any timeouts
  if (debounceTimer != null) clearTimeout(debounceTimer)

  // Save cached content
  if (paper.value != null && paper.value.content != cachedContent.value)
    setPaperContent(cachedContent.value)
})

// ===============================
// === UI EXPERIENCE
// ===============================

// Whether the panel is toggled

const panelToggled = ref(false)
</script>

<template>
  <div v-if="paper != null" id="paper" :class="panelToggled == false && 'panel-hidden'">
    <!-- Input field -->
    <textarea
      ref="inputReference"
      id="input-area"
      :value="paper.content"
      @input="handleInput"
    ></textarea>

    <!-- Draw button -->
    <div id="panel-drawer" @click="panelToggled = !panelToggled">
      <font-awesome-icon :icon="['fas', 'eye']" />
    </div>

    <!-- Drawable panel -->
    <div class="panel-scroller">
      <!-- Output view -->
      <div id="output-area" v-html="renderContent"></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '../style/variables.scss';

#paper {
  width: 100%;
  min-height: 100vh;
  flex-direction: column;

  $drawer-button-size: 2.8rem;
  $drawer-button-margin-left: 0.3rem;
  $drawer-button-margin-top: 3.5rem;

  $panel-shadow: 0.3rem 0.3rem 2px 2px $main-trans;

  @media (min-width: 768px) {
    flex-direction: row;

    align-items: stretch;
  }

  #input-area,
  #output-area {
    font-weight: 500;
  }

  #input-area {
    outline: none;

    flex: 1;
    width: 100%;
    height: 100%;

    background: none;
    resize: none;

    padding: 5rem 2rem 3rem;

    font-family: 'Space Mono', monospace;
    font-size: 1.1rem;
    line-height: 1.8rem;

    box-shadow: inset 0 0 30px 1px $main-trans;

    @media (min-width: 768px) {
      width: unset;

      height: 100vh;
    }
  }

  #panel-drawer {
    position: fixed;
    top: $drawer-button-margin-top;
    left: $drawer-button-margin-left;

    border-radius: $border-radius 0 0 $border-radius;
    background-color: $light;

    font-size: 1.6rem;

    width: $drawer-button-size;
    aspect-ratio: 1/1;

    align-items: center;
    justify-content: center;

    color: $bad;

    box-shadow: $panel-shadow;

    transition: all 400ms ease, filter 100ms;

    cursor: pointer;

    &:hover {
      filter: brightness(0.95);
    }

    @media (min-width: 768px) {
      display: none;
    }
  }

  .panel-scroller {
    position: fixed;
    top: 0;
    right: 0;

    width: calc(100% - $drawer-button-margin-left - $drawer-button-size);
    height: 100vh;

    overflow: auto;
    transition: all 400ms ease;

    #output-area {
      margin-top: $drawer-button-margin-top;
      margin-bottom: 3rem;

      flex: 1;
      min-height: 70vh;
      max-width: 100%;

      word-wrap: break-word;

      overflow: auto;

      flex-direction: column;

      text-align: left;
      font-size: 0.9rem;

      background-color: $light;
      border-radius: 0 0 0 $border-radius;

      padding: 1rem 1.5rem;
      box-shadow: $panel-shadow;

      z-index: 10;
    }

    @media (min-width: 768px) {
      position: relative;

      top: unset;
      right: unset;

      width: unset;

      flex: 1;

      #output-area {
        margin: 0;
        font-size: 1rem;
        min-height: 100vh;
      }
    }
  }

  &.panel-hidden {
    #panel-drawer {
      left: calc(100% - $drawer-button-size);
    }

    .panel-scroller {
      translate: 100% 0;

      @media (min-width: 768px) {
        translate: 0;
      }
    }
  }
}
</style>

<style lang="scss">
@import '../style/variables.scss';

#paper .panel-scroller #output-area {
  * {
    margin-block: 0.5rem;
    width: 100%;
    max-width: 100%;
    word-wrap: break-word;
  }

  h1,
  h2 {
    margin-block: 2rem;

    padding-bottom: 1rem;
    border-bottom: 2px solid $main-trans;
  }

  h3,
  h4 {
    margin-block: 1rem;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-family: 'Patua One', display;

    font-weight: 700;
  }

  h1 {
    font-size: 2.2rem;
  }

  h2 {
    font-size: 1.6rem;
  }

  p {
    line-height: 1.5rem;
  }

  b,
  strong {
    font-weight: 900;
  }

  ul {
    padding-left: 1.5rem;
  }

  blockquote {
    padding-left: 1rem;
    border-left: 5px solid $strong-trans;

    padding-block: 0.1rem;

    color: $strong;

    filter: brightness(0.9);
  }

  a {
    font-weight: 800;
  }
}
</style>
