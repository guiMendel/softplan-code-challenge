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
      <div class="picture">
        <UserProfilePicture :user="user" />
      </div>

      <!-- Name -->
      <h1>{{ user.name }}</h1>
    </header>

    <!-- Join date -->
    <div class="join-date">
      <p>
        Joined
        {{
          user.createdAt.toLocaleString('default', {
            year: 'numeric',
            day: 'numeric',
            month: 'long'
          })
        }}
      </p>
    </div>

    <!-- About -->
    <div v-if="user.about != undefined" class="about">
      <small>about</small>
      <p>{{ user.about }}</p>
    </div>
  </main>
</template>

<style scoped lang="scss">
@import '../style/variables.scss';

main {
  width: 100%;
  height: 100vh;

  flex-direction: column;
  align-items: center;

  gap: 2rem;

  header {
    width: 100%;
    padding: 5rem 1rem 2rem;

    background-color: $light;

    gap: 1rem;
    align-items: flex-end;
    justify-content: center;

    h1 {
      font-size: 2rem;
      overflow-wrap: break-word;

      line-height: 2.8rem;
    }

    .picture {
      font-size: 2.5rem;
    }
  }

  .join-date {
    font-weight: 600;
    font-size: 1.2rem;
  }
}
</style>
