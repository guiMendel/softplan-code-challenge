<script setup lang="ts">
import UserProfilePicture from '@/components/UserProfilePicture.vue'
import { useUserStore } from '@/stores/user'
import type { User } from '@/types/User.interface'
import { storeToRefs } from 'pinia'
import { computed, ref, watch } from 'vue'

// ==============================
// === USER DATA
// ==============================

const { getUser } = useUserStore()

const props = defineProps<{ userId: User['uid'] }>()

// Get user
const user = ref<User | null>(null)

// Keep the user synced
const fetchUser = async () => {
  user.value = await getUser(props.userId)
}

// Whenever id changes
watch(props, fetchUser)

// And when page loads up
fetchUser()

// ==============================
// === USER DATA
// ==============================

// Current user
const { currentUser: loggedUser } = storeToRefs(useUserStore())

// Whether client has authorization to edit this user's data
const canEdit = computed(() => loggedUser.value != null && loggedUser.value.uid === user.value?.uid)
</script>

<template>
  <main v-if="user != null">
    <header>
      <!-- Picture -->
      <div :class="canEdit && 'editable'" class="picture">
        <UserProfilePicture :user="user" />
      </div>

      <!-- Name -->
      <h1 :class="canEdit && 'editable'">{{ user.name }}</h1>

      <!-- Edit enabled notice -->
      <p v-if="canEdit" class="edit-notice">
        <font-awesome-icon :icon="['fas', 'pencil']" />
        select any field to edit
      </p>
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
    <div v-if="user.about != undefined || canEdit" :class="canEdit && 'editable'" class="about">
      <small>about</small>
      <p v-if="user.about != undefined">user.about</p>
      <em v-else>Empty</em>
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

  .editable {
    cursor: pointer;

    transition: all 100ms;

    &:hover {
      filter: brightness(0.7) hue-rotate(10deg);
    }
  }

  header {
    position: relative;

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

    .edit-notice {
      font-size: 1.1rem;

      position: absolute;

      top: 1rem;
      right: 1rem;

      font-weight: bold;

      align-items: center;
    }
  }

  .join-date {
    font-weight: 600;
    font-size: 1.2rem;
  }

  .about {
    flex-direction: column;
    gap: 0.3rem;
    text-align: left;
    padding-block: 0.5rem;

    min-width: 13rem;
    max-width: min(80%, 30rem);

    overflow-wrap: break-word;

    overflow: auto;
    border-radius: $border-radius;

    &.editable:hover {
      background-color: rgba(191, 208, 2, 0.2);
    }
  }
}
</style>
