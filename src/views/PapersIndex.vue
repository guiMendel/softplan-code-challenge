<script setup lang="ts">
import PaperPreview from '@/components/PaperPreview.vue'
import { usePaperAPI } from '@/modules/usePaperAPI'
import type { Field } from '@/modules/useUserField'
import { useInputStore } from '@/stores/input'
import { ref } from 'vue'

const { syncListPapers, createPaper } = usePaperAPI()
const { getInput } = useInputStore()

const papers = syncListPapers()

const newPaperTitleField = ref<Field>({
  name: 'name',
  value: '',
  valid: false,
  validate: (newValue) => {
    if (newValue.length < 3) return 'Title needs at least 3 characters'
    if (newValue.length > 20) return 'Too many characters'

    return true
  }
})

const newPaper = () =>
  getInput('New Paper', newPaperTitleField.value).then(([{ value }]) => createPaper(value))
</script>

<template>
  <div class="papers-index">
    <!-- Current user's papers -->
    <div class="user-section">
      <header>
        <!-- Section title -->
        <div class="text">
          <h2 @click="createPaper('test', 'testing boy')">Your Papers</h2>
          <span class="paper-count">{{ papers.length }}</span>
        </div>

        <!-- Create paper button -->
        <span class="new-paper" @click="newPaper"
          ><font-awesome-icon :icon="['fas', 'plus']" /> create
        </span>
      </header>

      <!-- Index papers -->
      <div class="papers">
        <PaperPreview v-for="paper in papers" :key="paper.uid" :paper="paper" />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import '../style/variables.scss';

.papers-index {
  flex-direction: column;

  width: 100%;

  .user-section {
    width: 100%;

    flex-direction: column;
    padding: 2rem 2rem;

    gap: 2rem;

    header {
      width: 100%;
      max-width: 16rem;

      align-items: center;
      justify-content: space-between;

      .text {
        align-items: center;
        gap: 0.5rem;

        h2 {
          font-weight: 600;
        }

        .paper-count {
          background-color: $main-trans;

          aspect-ratio: 1/1;
          width: 1.3rem;
          border-radius: 50%;

          display: flex;
          align-items: center;
          justify-content: center;

          color: $main;
        }
      }

      .new-paper {
        @include light-button;
      }
    }

    .papers {
      width: 100%;
      flex-direction: column;
      gap: 1rem;

      > * {
        width: 100%;
        max-width: 25rem;
      }
    }
  }
}
</style>
