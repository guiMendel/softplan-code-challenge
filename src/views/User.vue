<script setup lang="ts">
import InputField from '@/components/InputField.vue'
import UserProfilePicture from '@/components/UserProfilePicture.vue'
import { useUserField } from '@/modules/useUserField'
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

  if (user.value != null) setFields(user.value)
}

// Whenever id changes
watch(props, fetchUser)

// And when page loads up
fetchUser()

// ==============================
// === UPDATING DATA
// ==============================

// Current user
const { updateCurrentUser } = useUserStore()
const { currentUser: loggedUser } = storeToRefs(useUserStore())

// Whether client has authorization to edit this user's data
const canEdit = computed(() => loggedUser.value != null && loggedUser.value.uid === user.value?.uid)

// User fields
const { name, email, password, passwordConfirmation } = useUserField()

// Set the fields for the user
const setFields = (user: User) => {
  name.value.value = user.name
  email.value.value = user.email
}

// Start editing a field
const edit = () => {
  if (canEdit.value == false) return

  editing.value = true
}

// Commit edits to field
const commitEdit = async () => {
  await updateCurrentUser({ name: name.value.value })

  // Update local data
  fetchUser()

  editing.value = false
}

const editing = ref(false)
</script>

<template>
  <Transition name="fade">
    <div v-if="editing" class="overlay" @click.self="editing = false">
      <!-- Edit name modal -->
      <form class="modal" @submit.prevent="commitEdit">
        <font-awesome-icon class="close-modal" @click="editing = false" :icon="['fas', 'xmark']" />

        <!-- Field indicator -->
        <p>Edit name</p>

        <!-- Input -->
        <InputField name="name" v-model="name" />

        <!-- Submit -->
        <button>Submit</button>
      </form>
    </div>
  </Transition>

  <main v-if="user != null">
    <header>
      <!-- Picture -->
      <div :class="canEdit && 'editable'" class="picture">
        <UserProfilePicture :user="user" />
      </div>

      <!-- Name -->
      <h1 :class="canEdit && 'editable'" class="name" @click="edit">{{ user.name }}</h1>

      <!-- Edit enabled notice -->
      <p v-if="canEdit" class="edit-notice">
        <font-awesome-icon :icon="['fas', 'pencil']" />
        select any field to edit
      </p>
    </header>

    <div class="details">
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

      <!-- Account details -->
      <template v-if="canEdit">
        <div class="email editable">
          <small>email</small>
          <span>{{ user.email }}</span>
        </div>

        <button>Reset Password</button>
      </template>
    </div>
  </main>
</template>

<style scoped lang="scss">
@import '../style/variables.scss';

.fade-enter-active,
.fade-leave-active {
  transition: opacity 200ms ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.overlay {
  position: fixed;
  width: 100%;
  height: 100vh;

  background-color: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(2px);

  z-index: 100;

  align-items: center;
  justify-content: center;

  .modal {
    position: relative;
    padding: 1rem 1.5rem 1.5rem;

    max-width: 80%;
    background-color: $light;

    flex-direction: column;
    gap: 0.5rem;

    border-radius: $border-radius;

    p {
      font-weight: 600;
      font-size: 1.3rem;
    }

    button {
      margin-top: 0.5rem;
    }

    .close-modal {
      position: absolute;
      top: -0.8rem;
      right: -0.8rem;

      font-size: 2rem;

      border-radius: 50%;
      padding: 0.1rem;

      color: $strong;

      box-shadow: 0 1px 3px 1px rgba(50, 50, 50, 0.2);

      aspect-ratio: 1/1;
      background-color: $bad;

      cursor: pointer;

      transition: all 100ms;

      &:hover {
        translate: 0 -0.1rem;
        filter: brightness(1.2);
      }
    }
  }
}

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

    .name {
      font-size: 2rem;
      overflow-wrap: break-word;

      border-radius: $border-radius;

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

  .details {
    flex-direction: column;
    min-width: 13rem;

    gap: 2rem;
    font-size: 1.2rem;

    .join-date {
      font-weight: 600;
    }

    .about {
      flex-direction: column;
      gap: 0.3rem;
      text-align: left;

      max-width: min(80%, 30rem);

      overflow-wrap: break-word;

      border-radius: $border-radius;
    }

    .email {
      flex-direction: column;

      border-radius: $border-radius;
    }
  }

  .about.editable:hover,
  .name.editable:hover,
  .email:hover {
    $highlight: rgba(191, 208, 2, 0.2);

    background-color: $highlight;

    box-shadow: 0 0 0 0.8rem $highlight;
  }
}
</style>
