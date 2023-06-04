<script setup lang="ts">
import UserProfilePicture from '@/components/UserProfilePicture.vue'
import { useUserStore } from '@/stores/user'
import type { User } from '@/types/User.interface'
import { ref, watch } from 'vue'

const { getUser } = useUserStore()

const props = defineProps<{ userId: User['uid'] }>()

// Get user
const user = ref<User | null>(null)

// Keep the user synced
const fetchUser = async () => {
  user.value = await getUser(props.userId)
}

watch(props, fetchUser)

fetchUser()
</script>

<template>
  <main v-if="user != null">
    <header>
      <!-- Picture -->
      <UserProfilePicture :user="user" />

      <!-- Name -->
      <span>{{ user.name }}</span>
    </header>

    <!-- About -->
    <p v-if="user.about != undefined">{{ user.about }}</p>
  </main>
</template>
