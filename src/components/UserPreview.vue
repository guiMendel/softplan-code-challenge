<script setup lang="ts">
import type { User } from '@/types/User.interface'
import UserProfilePicture from './UserProfilePicture.vue'
import { useRouter } from 'vue-router'
import { type Highlightable, highlight } from '@/modules/highlight'

const props = defineProps<{
  user: User
  highlight?: { name?: Highlightable; email?: Highlightable }
}>()

const router = useRouter()

const openUserPage = () => router.push({ name: 'user', params: { userId: props.user.uid } })

const highlightField = (field: 'name' | 'email') => {
  if (props.highlight != undefined && props.highlight[field] != undefined)
    return highlight(props.highlight[field]!)
  return highlight({ text: props.user[field] })
}
</script>

<template>
  <div class="user-preview" @click="openUserPage">
    <!-- Profile picture -->
    <UserProfilePicture :user="user" />

    <div class="text">
      <!-- Name -->
      <p v-html="highlightField('name')" class="name"></p>

      <!-- Email -->
      <small v-html="highlightField('email')" class="email"></small>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '../style/variables.scss';

.user-preview {
  @include preview;
}
</style>
