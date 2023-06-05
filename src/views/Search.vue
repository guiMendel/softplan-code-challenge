<script setup lang="ts">
import type { User } from '@/types/User.interface'
import { useUserStore } from '@/stores/user'
import { ref, watch } from 'vue'

const { getAllUsers } = useUserStore()

// Searchbar content
const query = ref('')

// Which results to show (on mobile)
const showResults = ref<'users' | 'papers'>('users')

// ======================
// === USERS
// ======================

// Grab all users
const users = ref<User[]>([])

// Initialize them
getAllUsers().then((newUsers) => {
  users.value = newUsers
  queriedUsers.value = queryUsers(query.value)
})

// Queried users
const queriedUsers = ref<User[]>([])

// Whether a user passes the given query
const filterUser = (user: User, query: string) => {
  return true
}

const queryUsers = (query: string) => users.value.filter((user) => filterUser(user, query))

// Query users when query changes
watch(query, (newQuery) => (queriedUsers.value = queryUsers(newQuery)))

// ======================
// === PAPERS
// ======================

// Queried papers
const queriedPapers = ref<string[]>(['Paper 1', 'Paper 2'])
</script>

<template>
  <div class="search">
    <!-- Searchbar -->
    <div class="searchbar">
      <!-- Search icon -->
      <font-awesome-icon class="magnifying-glass icon" :icon="['fas', 'magnifying-glass']" />

      <!-- Search input field -->
      <input autofocus v-model="query" type="text" id="searchbar" />

      <!-- Reset query -->
      <label
        for="searchbar"
        class="clear icon"
        :class="query == '' && 'hidden'"
        @click="query = ''"
      >
        <font-awesome-icon :icon="['fas', 'xmark']" />
      </label>
    </div>

    <!-- Result tab toggle -->
    <div class="tabs">
      <!-- See users -->
      <span :class="showResults === 'users' && 'active'" @click="showResults = 'users'"
        ><font-awesome-icon :icon="['fas', 'users']" />Users</span
      >

      <!-- See papers -->
      <span :class="showResults === 'papers' && 'active'" @click="showResults = 'papers'"
        ><font-awesome-icon :icon="['fas', 'file']" />Papers</span
      >
    </div>

    <!-- Query results -->
    <div class="results">
      <!-- User results -->
      <div v-if="showResults === 'users'" class="users">
        <span v-for="user in queriedUsers" :key="user.uid">{{ user.name }}</span>
      </div>

      <!-- Paper results -->
      <div v-if="showResults === 'papers'" class="papers">
        <span v-for="paper in queriedPapers" :key="paper">{{ paper }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '../style/variables.scss';

.search {
  margin-top: 2rem;

  flex-direction: column;
  align-items: center;
  gap: 2.5rem;

  width: 100%;

  .searchbar {
    width: 80%;

    position: relative;
    align-items: center;

    .icon {
      position: absolute;

      &.magnifying-glass {
        left: 1rem;
        pointer-events: none;
      }

      &.clear {
        right: 1rem;
        @include light-button;

        aspect-ratio: 1/1;
        width: 1.2rem;
        border-radius: 50%;

        transition: all 200ms;

        &.hidden {
          pointer-events: none;
          opacity: 0;
        }
      }
    }

    input {
      flex: 1;

      border-radius: $border-radius;

      background-color: $main-trans;

      padding: 0.5rem 2.5rem;

      font-size: 1.1rem;

      cursor: pointer;
    }
  }

  .tabs {
    width: 100%;

    padding-inline: 2rem;
    align-items: center;
    justify-content: center;
    gap: 4rem;

    > span {
      display: flex;

      align-items: center;
      gap: 0.5rem;
      color: $main;
      font-weight: 500;

      border-radius: $border-radius;

      cursor: pointer;

      transition: all 100ms;

      svg {
        font-size: 0.9rem;
      }

      &:hover {
        background-color: $main-trans;
        box-shadow: 0 0 0 0.5rem $main-trans;
      }

      &.active {
        background-color: $strong-trans;
        box-shadow: 0 0 0 0.5rem $strong-trans;

        color: $strong;
      }
    }
  }

  .results {
    .users,
    .papers {
      flex-direction: column;
      align-items: center;

      gap: 1rem;
    }
  }
}
</style>
