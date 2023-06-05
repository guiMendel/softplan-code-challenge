<script setup lang="ts">
import type { Field } from '@/modules/useUserField'
import { ref } from 'vue'
import InputField from './InputField.vue'
import { useInputStore } from '@/stores/input'
import { storeToRefs } from 'pinia'

// Get input request data
const { accept, cancel } = useInputStore()
const { fields, title, hasOngoingInput } = storeToRefs(useInputStore())

const stopEdit = () => {}
const updateField = (index: number, field: Field) => {}

const editingIsValid = ref(false)
</script>

<template>
  <Transition name="fade">
    <div v-if="hasOngoingInput" class="overlay" @click.self="stopEdit">
      <!-- Edit fields modal -->
      <form class="modal" @submit.prevent="accept">
        <font-awesome-icon class="close-modal" @click="stopEdit" :icon="['fas', 'xmark']" />

        <!-- Input title -->
        <p>{{ title }}</p>

        <!-- Input -->
        <InputField
          v-for="(field, fieldIndex) in fields"
          :key="field.name"
          :model-value="field"
          @update:model-value="updateField(fieldIndex, $event)"
          :multiline="field.name == 'about'"
        />

        <!-- Accept input -->
        <button id="accept-input" :class="editingIsValid == false && 'disabled'">Submit</button>

        <!-- Cancel input -->
        <button id="cancel-input" @click.prevent="cancel('User cancelled')">Cancel</button>
      </form>
    </div>
  </Transition>
</template>

<style scoped lang="scss">
@import '../style/variables.scss';

.fade-enter-active,
.fade-leave-active {
  transition: opacity 200ms ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.overlay {
  position: fixed;
  width: 100%;
  height: 100vh;

  background-color: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(2px);

  z-index: 100;

  align-items: center;
  justify-content: center;

  .modal {
    position: relative;
    padding: 1rem 1.5rem 1.5rem;

    max-width: 80%;
    background-color: $light;

    flex-direction: column;
    gap: 0.5rem;

    border-radius: $border-radius;

    p {
      font-weight: 600;
      font-size: 1.3rem;
    }

    button {
      margin-top: 0.5rem;
    }

    .close-modal {
      position: absolute;
      top: -0.8rem;
      right: -0.8rem;

      font-size: 2rem;

      border-radius: 50%;
      padding: 0.1rem;

      color: $strong;

      box-shadow: 0 1px 3px 1px rgba(50, 50, 50, 0.2);

      aspect-ratio: 1/1;
      background-color: $bad;

      cursor: pointer;

      transition: all 100ms;

      &:hover {
        translate: 0 -0.1rem;
        filter: brightness(1.2);
      }
    }

    &.delete-confirm {
      span {
        font-size: 1.2rem;
      }

      .confirm {
        background-color: $bad;
        box-shadow: 0 0.1rem 1px 1px $strong;
      }
    }
  }
}
</style>
