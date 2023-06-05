<script setup lang="ts">
import type { Field } from '@/modules/useUserField'
import { computed, ref } from 'vue'

const props = defineProps<{
  modelValue: Field
  multiline?: boolean
}>()

const emit = defineEmits(['update:modelValue'])

const handleInput = (event: Event) => {
  const newValue = (event.target as HTMLInputElement).value

  const newValid =
    props.modelValue.validate != undefined ? props.modelValue.validate(newValue) === true : true

  emit('update:modelValue', {
    ...props.modelValue,
    value: newValue,
    valid: newValid
  })
}

// Whether to show errors
const showErrors = ref(false)

const validationResult = computed(() =>
  props.modelValue.validate != undefined ? props.modelValue.validate(props.modelValue.value) : true
)

// Shows any error messages
const errorMessage = computed(() =>
  validationResult.value !== true && showErrors.value ? validationResult.value : ''
)

// Initialize valid field
if (props.modelValue.valid != validationResult.value)
  emit('update:modelValue', {
    ...props.modelValue,
    valid: validationResult.value === true
  })

// Splits camelCase text
const splitCamelCase = (text: string) => text.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase()

// Infer type from name
const inferredType = computed(() => {
  if (props.modelValue.name.toLowerCase().includes('password')) return 'password'
  if (props.modelValue.name.toLowerCase().includes('color')) return 'color'
  return 'text'
})
</script>

<template>
  <div class="input-field" :class="errorMessage != '' && 'error'" @focusout="showErrors = true">
    <label
      :class="(modelValue.value != '' || inferredType == 'color') && 'raised'"
      :for="modelValue.name"
      >{{ splitCamelCase(modelValue.name) }}</label
    >
    <textarea
      v-if="multiline && inferredType != 'color'"
      :type="inferredType"
      :id="modelValue.name"
      v-bind="$attrs"
      :value="modelValue.value"
      @input="handleInput"
    ></textarea>

    <input
      v-else
      :type="inferredType"
      :id="modelValue.name"
      v-bind="$attrs"
      :value="modelValue.value"
      @input="handleInput"
      :style="inferredType == 'color' && 'display: none'"
    />

    <label
      v-if="inferredType == 'color'"
      :for="modelValue.name"
      :style="{ backgroundColor: modelValue.value }"
      class="color-display"
    >
      <font-awesome-icon :icon="['fas', 'palette']" />
    </label>

    <small class="error">{{ validationResult }}</small>
  </div>
</template>

<style scoped lang="scss">
@import '../style/variables.scss';

.input-field {
  flex-direction: column;
  width: min-content;

  $border: 2px solid $text;

  label {
    transition: all 200ms;

    transform: translateY(1.4rem);

    color: $main;
    font-weight: 600;

    height: 1.3rem;
  }

  &:focus-within label,
  label.raised {
    transform: translateY(0);
    font-size: 0.8rem;
  }

  input,
  textarea,
  .color-display {
    border-bottom: $border;
    background: none;
    font-weight: 600;
    cursor: pointer;

    width: 12rem;

    padding-block: 0.3rem;

    transition: all 200ms;

    &::placeholder {
      opacity: 0.4;
    }

    @media (min-width: 768px) {
      width: 30rem;
    }
  }

  textarea {
    height: 7rem;
    resize: vertical;

    padding-inline: 0.5rem;

    border-right: $border;
    border-left: $border;
    border-radius: $border-radius;
  }

  .color-display {
    margin-top: -1.5rem;
    margin-bottom: 1.5rem;

    padding: 0 0.5rem;
    height: 2rem;

    display: flex;
    align-items: center;
    justify-content: flex-start;

    border-radius: $border-radius;

    box-shadow: 0 0 3px 2px rgba(68, 68, 68, 0.1);

    > * {
      color: $text;
    }
  }

  small {
    margin-top: 0.2rem;

    color: $bad;
    font-weight: 500;
    opacity: 0;
  }

  &.error {
    label {
      color: $bad;
    }

    input {
      border-color: $bad;
    }

    small {
      opacity: 1;
    }
  }
}
</style>
