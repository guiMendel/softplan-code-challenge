<script setup lang="ts">
import type { User } from '@/types/User.interface'
import UserProfilePicture from './UserProfilePicture.vue'
import { useRouter } from 'vue-router'

const props = defineProps<{ user: User }>()

const router = useRouter()

const openUserPage = () => router.push({ name: 'user', params: { userId: props.user.uid } })
</script>

<template>
  <div class="user-preview" @click="openUserPage">
    <!-- Profile picture -->
    <UserProfilePicture :user="user" />

    <!-- Name -->
    <p class="name">{{ user.name }}</p>
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

  .name {
    font-size: 1.1rem;
  }

  &:hover {
    filter: brightness(1.1);
  }
}
</style>
