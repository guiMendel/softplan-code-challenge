<script setup lang="ts">
import { auth } from '@/api/firebase'
import InputField from '@/components/InputField.vue'
import UserProfilePicture from '@/components/UserProfilePicture.vue'
import { useUserField, type Field } from '@/modules/useUserField'
import { useNotificationsStore } from '@/stores/notifications'
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
const { updateCurrentUser, deleteUser } = useUserStore()
const { currentUser: loggedUser } = storeToRefs(useUserStore())

// Whether client has authorization to edit this user's data
const canEdit = computed(() => loggedUser.value != null && loggedUser.value.uid === user.value?.uid)

// User fields
const { name, email, password, passwordConfirmation, about, color } = useUserField()

const { notify } = useNotificationsStore()

// Set the fields for the user
const setFields = (user: User) => {
  console.log('getting from', user)

  name.value.value = user.name
  email.value.value = user.email
  about.value.value = user.about ?? ''
  color.value.value = user.color ?? '#FCA20D'
}

// Fields to edit
const editFields = ref<Field[]>([])

// Start editing fields
const edit = (...fields: Field[]) => {
  if (canEdit.value == false) return

  editFields.value = fields
}

// Commit edits to field
const commitEdit = async () => {
  if (editingIsValid.value == false) return

  // Filter in only the edited fields
  const update: Partial<User> & {
    password?: string
  } = {}

  editFields.value.forEach((field) => {
    if (field.name === 'passwordConfirmation') return

    update[field.name] = field.value as any
  })

  await updateCurrentUser(update).catch(({ code }) => {
    if (code === 'auth/requires-recent-login') {
      notify('error', 'Please login again to enable this operation')
      auth.signOut()
    }
  })

  notify('success', 'User updated')

  // Update local data
  fetchUser()

  stopEdit()
}

// Stop editing (close modal)
const stopEdit = () => {
  editFields.value = []
  confirmDeletion.value = false
}

// Whether is in the process of editing fields
const editing = computed(() => editFields.value.length > 0)

// Update a field given it's index and a new field content
const updateField = (index: number, newField: Field) => {
  editFields.value[index].value = newField.value
  editFields.value[index].valid = newField.valid
}

// Whether the edited fields are valid
const editingIsValid = computed(() =>
  editFields.value.reduce((sum, field) => field.valid && sum, true)
)

// Whether to ask for delete confirmation
const confirmDeletion = ref(false)

const deleteAccount = () => {
  deleteUser().catch(({ code }) => {
    if (code === 'auth/requires-recent-login') {
      notify('error', 'Please login again to enable this operation')
      auth.signOut()
    }
  })
}
</script>

<template>
  <Transition name="fade">
    <div v-if="editing || confirmDeletion" class="overlay" @click.self="stopEdit">
      <!-- Delete account modal -->
      <div v-if="confirmDeletion" class="modal delete-confirm">
        <span>Delete account? This action is <b>irreversible</b>.</span>

        <button class="confirm" @click="deleteAccount">Delete</button>
        <button class="cancel" @click="confirmDeletion = false">Cancel</button>
      </div>

      <!-- Edit fields modal -->
      <form v-if="editing" class="modal" @submit.prevent="commitEdit">
        <font-awesome-icon class="close-modal" @click="stopEdit" :icon="['fas', 'xmark']" />

        <!-- Field indicator -->
        <p>Edit user</p>

        <!-- Input -->
        <InputField
          v-for="(field, fieldIndex) in editFields"
          :key="field.name"
          :model-value="field"
          @update:model-value="updateField(fieldIndex, $event)"
          :multiline="field.name == 'about'"
        />

        <!-- Submit -->
        <button :class="editingIsValid == false && 'disabled'">Submit</button>
      </form>
    </div>
  </Transition>

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

      <!-- Account details -->
      <template v-if="canEdit">
        <div class="email editable" @click="edit(email)">
          <small>email</small>
          <span>{{ user.email }}</span>
        </div>

        <!-- Sign out -->
        <button @click="auth.signOut">
          <font-awesome-icon :icon="['fas', 'right-from-bracket']" /> Sign Out
        </button>

        <!-- Reset password -->
        <button @click="edit(password, passwordConfirmation)">
          <font-awesome-icon :icon="['fas', 'key']" /> Reset Password
        </button>

        <!-- Delete account -->
        <button @click="confirmDeletion = true" class="delete">
          <font-awesome-icon :icon="['fas', 'trash-can']" /> Delete Account
        </button>
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

    &.delete-confirm {
      span {
        font-size: 1.2rem;
      }

      .confirm {
        background-color: $bad;
        box-shadow: 0 0.1rem 1px 1px $strong;
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

  padding-bottom: 3rem;
  overflow-x: hidden;

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
    flex-direction: column;
    min-width: 13rem;
    max-width: min(80%, 30rem);

    gap: 2rem;
    font-size: 1.2rem;

    > * {
      width: 100%;
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
