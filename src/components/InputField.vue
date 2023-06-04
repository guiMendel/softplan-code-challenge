<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const props = defineProps<{
  name: string
  modelValue: { value: string; valid: boolean; validate?: (newValue: string) => true | string }
}>()

const emit = defineEmits(['update:modelValue'])

const handleInput = (event: Event) => {
  const newValue = (event.target as HTMLInputElement).value

  const newValid =
    props.modelValue.validate != undefined
      ? props.modelValue.validate(props.modelValue.value) === true
      : true

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
</script>

<template>
  <div class="input-field" :class="errorMessage != '' && 'error'" @focusout="showErrors = true">
    <label v-if="name != ''" :class="modelValue.value != '' && 'raised'" :for="name">{{
      name
    }}</label>
    <input :id="name" v-bind="$attrs" :value="modelValue.value" @input="handleInput" />
    <small class="error">{{ validationResult }}</small>
  </div>
</template>

<style scoped lang="scss">
@import '../style/variables.scss';

.input-field {
  flex-direction: column;
  width: min-content;

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

  input {
    border-bottom: 2px solid $text;
    background: none;
    font-weight: 600;
    cursor: pointer;

    width: 15rem;

    padding: 0.3rem 0;

    transition: all 200ms;

    &::placeholder {
      opacity: 0.4;
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
