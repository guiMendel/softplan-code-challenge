<script setup lang="ts">
import type { User } from '@/types/User.interface'
import { computed, ref, watch } from 'vue'
import UserPreview from '@/components/UserPreview.vue'
import { useUserAPI } from '@/modules/useUserAPI'
import type { Highlightable } from '@/modules/highlight'
import type { Paper } from '@/types/Paper.interface'
import { usePaperAPI } from '@/modules/usePaperAPI'
import PaperPreview from '@/components/PaperPreview.vue'

const { syncListUsers } = useUserAPI()
const { syncListPapers } = usePaperAPI()

// Searchbar content
const query = ref('')

// Which results to show (on mobile)
const showResults = ref<'users' | 'papers'>('users')

// Focus on input
const inputElement = ref<HTMLInputElement | null>(null)
watch(inputElement, (element) => element?.focus())

interface ResourceResult<Resource> {
  resource: Resource
  highlight?: { name?: Highlightable; email?: Highlightable; title?: Highlightable }
}

// Whether a resource passes the given query
// Returns ResourceResult if passes, false otherwise
const filterResource = <Resource>(
  resource: Resource,
  query: string,
  fields: Array<keyof Resource>
): ResourceResult<Resource> | false => {
  if (query == '') return { resource }

  // Match on each field
  for (const field of fields) {
    let match = (resource[field] as string).toLowerCase().indexOf(query.toLowerCase())

    // Return highlighted field
    if (match !== -1)
      return {
        resource,
        highlight: { [field]: { text: resource[field], startIndex: match, length: query.length } }
      }
  }

  return false
}

// ======================
// === USERS
// ======================

// Grab all users
const users = syncListUsers()

// Queried users
const queriedUsers = computed(() => {
  const filterQuery = query.value.trim().toLowerCase()

  return users.value
    .map((user) => filterResource(user, filterQuery, ['name', 'email']))
    .filter((result) => result !== false) as ResourceResult<User>[]
})

// ======================
// === PAPERS
// ======================

// Grab all papers
const papers = syncListPapers()

// Queried papers
const queriedPapers = computed(() => {
  const filterQuery = query.value.trim().toLowerCase()

  return papers.value
    .map((paper) => filterResource(paper, filterQuery, ['title']))
    .filter((result) => result !== false) as ResourceResult<Paper>[]
})
</script>

<template>
  <div class="search">
    <!-- Searchbar -->
    <div class="searchbar">
      <!-- Search icon -->
      <font-awesome-icon class="magnifying-glass icon" :icon="['fas', 'magnifying-glass']" />

      <!-- Search input field -->
      <input
        ref="inputElement"
        autofocus
        v-model="query"
        type="text"
        id="searchbar"
        placeholder="What to look for?"
      />

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
        ><font-awesome-icon :icon="['fas', 'users']" />Users<span class="count">{{
          queriedUsers.length
        }}</span></span
      >

      <!-- See papers -->
      <span :class="showResults === 'papers' && 'active'" @click="showResults = 'papers'"
        ><font-awesome-icon :icon="['fas', 'file']" />Papers<span class="count">{{
          queriedPapers.length
        }}</span></span
      >
    </div>

    <!-- Query results -->
    <div class="results">
      <!-- User results -->
      <div :class="showResults !== 'users' && 'mobile-hide'" class="users">
        <UserPreview
          v-for="queryResult in queriedUsers"
          :key="queryResult.resource.uid"
          :user="queryResult.resource"
          :highlight="queryResult.highlight"
        />
      </div>

      <!-- Paper results -->
      <div :class="showResults !== 'papers' && 'mobile-hide'" class="papers">
        <PaperPreview
          v-for="queryResult in queriedPapers"
          :key="queryResult.resource.uid"
          :paper="queryResult.resource"
          :highlight="queryResult.highlight"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '../style/variables.scss';

.search {
  margin-block: 2rem;

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

      &::placeholder {
        color: $main;
      }
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

      .count {
        background-color: $main-trans;

        aspect-ratio: 1/1;
        width: 1.3rem;
        border-radius: 50%;

        display: flex;
        align-items: center;
        justify-content: center;
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

    @media (min-width: 768px) {
      justify-content: space-around;

      > span {
        background: none;
        cursor: default;

        &:hover {
          background: none;
          box-shadow: none;
        }

        &.active {
          background: none;
          box-shadow: none;

          color: $main;
        }
      }
    }
  }

  .results {
    width: 100%;
    justify-content: space-around;

    gap: 4rem;

    padding-inline: 2rem;

    .users,
    .papers {
      // background-color: red;
      
      flex: 1;  
      max-width: 30rem;

      flex-direction: column;
      align-items: center;

      gap: 1rem;

      > * {
        width: 100%;
      }

      @media (max-width: 768px) {
        &.mobile-hide {
          display: none;
        }
      }
    }
  }
}
</style>
