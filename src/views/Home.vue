<template>
  <main>
    <!-- Start search -->
    <div class="start-search">
      <font-awesome-icon :icon="['fas', 'magnifying-glass']" />
      <span>start search</span>
    </div>
    <!-- Show page content -->
    <RouterView />
  </main>
</template>

<style scoped lang="scss">
@import '../style/variables.scss';

main {
  width: 100%;
  min-height: 100vh;

  padding-top: 3rem;

  position: relative;

  flex-direction: column;

  .start-search {
    margin-left: 2rem;

    @include light-button;
  }
}
</style>
