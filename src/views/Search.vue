<template>
  <div class="search">
    <!-- Searchbar -->
    <div class="searchbar">
      <!-- Search icon -->
      <font-awesome-icon class="magnifying-glass icon" :icon="['fas', 'magnifying-glass']" />

      <!-- Search input field -->
      <input autofocus type="text" />

      <!-- Reset query -->
      <div class="clear icon">
        <font-awesome-icon :icon="['fas', 'xmark']" />
      </div>
    </div>

    <!-- Result tab toggle -->
    <div class="tabs">
      <!-- See users -->
      <span class="active"><font-awesome-icon :icon="['fas', 'users']" />Users</span>

      <!-- See papers -->
      <span><font-awesome-icon :icon="['fas', 'file']" />Papers</span>
    </div>

    <!-- Query results -->
    <div class="results">
      <span>User 1</span>
      <span>User 2</span>
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
    flex-direction: column;
    align-items: center;

    gap: 1rem;
  }
}
</style>
