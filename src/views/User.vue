<script setup lang="ts">
import { auth } from '@/api/firebase'
import InputField from '@/components/InputField.vue'
import UserProfilePicture from '@/components/UserProfilePicture.vue'
import { useUserField, type Field } from '@/modules/useUserField'
import { useInputStore } from '@/stores/input'
import { useNotificationsStore } from '@/stores/notifications'
import { useUserStore } from '@/stores/currentUser'
import type { User } from '@/types/User.interface'
import { storeToRefs } from 'pinia'
import { computed, ref, watch, watchEffect } from 'vue'
import { useUserAPI } from '@/modules/useUserAPI'

// Get input methods
const { getInput, getConfirmation } = useInputStore()

// ==============================
// === USER DATA
// ==============================

const { login } = useUserStore()
const { syncUser } = useUserAPI()

const props = defineProps<{ userId: User['uid'] }>()

// Get user
const user = syncUser(props.userId)

// Whenever id changes
watch(props, ({ userId }) => syncUser(userId, user))

// ==============================
// === CONFIRMING LOGIN
// ==============================

const { getErrorForCode } = useUserField()

// Requests user to provide password
const confirmLogin = async () => {
  // Request password
  return getInput('Please re-enter your password for added security', password.value).then(
    ([{ value: inputPassword }]) => {
      // Reset password field
      password.value.value = ''
      password.value.valid = false

      if (user.value == undefined) return

      // Perform login again
      return login(user.value.email, inputPassword).catch(({ code }) => {
        notify('error', getErrorForCode(code))
        throw new Error('Login failed')
      })
    }
  )
}

// ==============================
// === UPDATING DATA
// ==============================

// Current user
const { updateCurrentUser, deleteUser } = useUserStore()
const { currentUser: loggedUser } = storeToRefs(useUserStore())

// Whether client has authorization to edit this user's data
const canEdit = computed(() => loggedUser.value != null && loggedUser.value.uid === user.value?.uid)

// User fields
const { name, email, password, passwordConfirmation, about, color } = useUserField()

const { notify } = useNotificationsStore()

// Set the fields for the user
watchEffect(() => {
  if (user.value == null) return

  name.value.value = user.value.name
  email.value.value = user.value.email
  about.value.value = user.value.about ?? ''
  color.value.value = user.value.color ?? '#FCA20D'
})

// Start editing fields
const edit = (...fields: Field[]) => {
  if (canEdit.value == false) return

  // Start editing
  getInput('Edit profile', ...fields)
    .then(async (newFields) => {
      // Filter in only the edited fields
      const update: Partial<User> & {
        password?: string
      } = {}

      for (const field of newFields) {
        if (field.name === 'passwordConfirmation') continue

        update[field.name] = field.value as any
      }

      console.log('updating with', update)

      // Update the user in firebase
      await updateCurrentUser(update).catch(({ code }) => {
        if (code === 'auth/requires-recent-login') {
          notify('error', 'Please login again to enable this operation')
          auth.signOut()
        }
      })

      // Notify client
      notify('success', 'User updated')
    })

    // If canceled, ignore
    .catch(() => {})
}

const resetPassword = () =>
  confirmLogin().then(() => edit(password.value, passwordConfirmation.value))

// ==============================
// === DELETING USER
// ==============================

const requestDelete = () =>
  confirmLogin().then(() =>
    getConfirmation('Delete account? This action is irreversible.', 'Delete').then(
      (confirmDelete) => {
        if (confirmDelete) deleteUser()
      }
    )
  )
</script>

<template>
  <main v-if="user != null">
    <header>
      <!-- Background color -->
      <div
        v-if="user.color != undefined"
        class="background"
        :style="{ backgroundColor: user.color }"
      ></div>

      <!-- Picture -->
      <div :class="canEdit && 'editable'" class="picture" @click="edit(color)">
        <UserProfilePicture :user="user" />
      </div>

      <!-- Name -->
      <h1 :class="canEdit && 'editable'" class="name" @click="edit(name)">{{ user.name }}</h1>

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
      <div
        v-if="user.about != undefined || canEdit"
        :class="canEdit && 'editable'"
        class="about"
        @click="edit(about)"
      >
        <small>about</small>
        <p v-if="user.about != undefined">{{ user.about }}</p>
        <em v-else>Empty</em>
      </div>

      <!-- Email -->
      <div class="email" :class="canEdit && 'editable'" @click="edit(email)">
        <small>email</small>
        <span>{{ user.email }}</span>
      </div>

      <!-- Account details -->
      <div class="account" v-if="canEdit">
        <!-- Sign out -->
        <button @click="auth.signOut">
          <font-awesome-icon :icon="['fas', 'right-from-bracket']" /> Sign Out
        </button>

        <!-- Reset password -->
        <button @click="resetPassword">
          <font-awesome-icon :icon="['fas', 'key']" /> Reset Password
        </button>

        <!-- Delete account -->
        <button @click="requestDelete" class="delete">
          <font-awesome-icon :icon="['fas', 'trash-can']" /> Delete Account
        </button>
      </div>
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

  padding-bottom: 3rem;
  overflow-x: hidden;

  small {
    color: $main;
  }

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

    > *:not(.background) {
      z-index: 1;
    }

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

    .background {
      top: 0;
      left: 0;

      position: absolute;
      width: 100%;
      height: 100%;

      filter: $make-light;
    }
  }

  .details {
    flex-wrap: wrap;
    justify-content: center;

    width: 90%;

    gap: 2rem;
    font-size: 1.2rem;

    > * {
      // width: 100%;
      min-width: 10rem;
    }

    .join-date {
      font-weight: 600;
    }

    .about {
      flex-direction: column;
      gap: 0.3rem;
      text-align: left;

      overflow-wrap: break-word;

      border-radius: $border-radius;

      line-height: 1.5rem;
    }

    .email {
      flex-direction: column;

      border-radius: $border-radius;
    }

    .delete {
      background-color: $bad;
      box-shadow: 0 0.1rem 1px 1px $strong;
    }

    .account {
      flex-direction: column;
      gap: inherit;
    }

    @media (max-width: 768px) {
      min-width: 13rem;
      max-width: 85%;

      > * {
        width: 100%;
        min-width: unset;
      }
    }
  }

  .about.editable:hover,
  .name.editable:hover,
  .email.editable:hover {
    $highlight: rgba(191, 208, 2, 0.2);

    background-color: $highlight;

    box-shadow: 0 0 0 0.8rem $highlight;
  }
}
</style>
