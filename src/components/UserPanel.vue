<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import UserProfilePicture from './UserProfilePicture.vue'

const { user } = storeToRefs(useUserStore())
</script>

<template>
  <div v-if="user != null" id="user-panel">
    <!-- Show nickname -->
    <span
      >hi, <span class="nickname">{{ user.nickname }}</span></span
    >

    <!-- Show picture -->
    <UserProfilePicture class="picture" :user="user" />
  </div>
</template>

<style lang="scss">
@import '../style/variables.scss';

#user-panel {
  position: fixed;

  top: -1rem;
  right: 0;

  height: 3rem;

  padding: 1.4rem 0 0.4rem;
  padding-left: 1rem;

  border-radius: 0 0 0 $border-radius;

  background-color: $light;

  filter: drop-shadow(0 1px 3px rgb(33, 33, 33, 0.1));

  gap: 0.2rem;
  align-items: center;

  cursor: pointer;

  transition: all 200ms;

  filter: brightness(1);

  > span {
    .nickname {
      font-weight: 700;
    }
  }

  .picture {
    margin: 1rem 0.3rem 0;

    box-sizing: content-box;
    border: 6px solid $light;
  }

  &:hover {
    top: -0.5rem;

    filter: brightness(0.95);
  }

  @media (min-width: 768px) {
    top: 2rem;
    right: 2rem;

    height: 2rem;
    padding-block: 0.4rem;

    .picture {
      margin-block: 0;
      margin-right: -1rem;

      box-sizing: content-box;
      border: 6px solid $light;
    }

    &:hover {
      top: 2rem;
    }
  }
}
</style>
