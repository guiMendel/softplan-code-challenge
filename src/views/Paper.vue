<script setup lang="ts">
import { ref } from 'vue'

// Content input by user
const textContent = ref('')

// Whether the panel is toggled
const panelToggled = ref(false)

// Listen
</script>

<template>
  <div id="paper" :class="panelToggled == false && 'panel-hidden'">
    <!-- Input field -->
    <textarea autofocus id="input-area" v-model="textContent"></textarea>

    <!-- Draw button -->
    <div id="panel-drawer" @click="panelToggled = !panelToggled">
      <font-awesome-icon :icon="['fas', 'eye']" />
    </div>

    <!-- Drawable panel -->
    <div class="panel-scroller">
      <!-- Output view -->
      <div id="output-area" v-html="textContent"></div>
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

  #input-area,
  #output-area {
    font-size: 1.1rem;
    font-weight: 500;
    line-height: 1.8rem;
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

    box-shadow: inset 0 0 30px 1px $main-trans;
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

      text-align: left;

      background-color: $light;
      border-radius: 0 0 0 $border-radius;

      padding: 1rem 1.5rem;
      box-shadow: $panel-shadow;

      z-index: 10;
    }
  }

  &.panel-hidden {
    #panel-drawer {
      left: calc(100% - $drawer-button-size);
    }

    .panel-scroller {
      translate: 100% 0;
    }
  }
}
</style>
