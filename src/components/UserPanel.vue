<script setup lang="ts">
import { useCurrentUserStore } from '@/stores/currentUser'
import { storeToRefs } from 'pinia'
import UserProfilePicture from './UserProfilePicture.vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const { currentUser } = storeToRefs(useCurrentUserStore())

const route = useRoute()

const shouldHide = computed(() => route.meta.noUserPanel === true)
</script>

<template>
  <RouterLink
    :to="{ name: 'user', params: { userId: currentUser.uid } }"
    v-if="currentUser != null && shouldHide == false"
    id="user-panel"
  >
    <!-- Show name -->
    <span
      >hi, <span class="name">{{ currentUser.name }}</span></span
    >

    <!-- Show picture -->
    <UserProfilePicture class="picture" :user="currentUser" />
  </RouterLink>
</template>

<style scoped lang="scss">
@import '../style/variables.scss';

#user-panel {
  z-index: 40;

  display: flex;
  color: inherit;

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
    .name {
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
