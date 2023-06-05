<script setup lang="ts">
import type { User } from '@/types/User.interface'
import UserProfilePicture from './UserProfilePicture.vue'
import { useRouter } from 'vue-router'
import { computed } from 'vue'

const props = defineProps<{ user: User; highlight?: { name?: string; email?: string } }>()

const router = useRouter()

const openUserPage = () => router.push({ name: 'user', params: { userId: props.user.uid } })
</script>

<template>
  <div class="user-preview" @click="openUserPage">
    <!-- Profile picture -->
    <UserProfilePicture :user="user" />

    <div class="text">
      <!-- Name -->
      <p v-if="highlight?.name == undefined" class="name">{{ user.name }}</p>
      <p v-else v-html="highlight.name" class="name"></p>

      <!-- Email -->
      <p v-if="highlight?.email == undefined" class="email">{{ user.email }}</p>
      <p v-else v-html="highlight.email" class="email"></p>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '../style/variables.scss';

.user-preview {
  align-items: center;

  min-width: 10rem;

  padding: 0.6rem 1rem;

  border-radius: $border-radius;
  background-color: $main-trans;
  gap: 1rem;
  cursor: pointer;

  .text {
    flex-direction: column;
    gap: 0.2rem;
    .name {
      font-size: 1.1rem;
    }

    .email {
      color: $main;
    }
  }

  &:hover {
    filter: brightness(1.1);
  }
}
</style>
