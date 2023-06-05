<template>
  <main>
    <!-- Current user's papers -->
    <div class="user-section">
      <header>
        <!-- Section title -->
        <h2>Your Papers</h2>

        <span class="paper-count">1</span>

        <!-- Create paper button -->
        <span class="new-paper"><font-awesome-icon :icon="['fas', 'plus']" /> create </span>
      </header>

      <div class="papers">
        <div class="paper">
          <!-- Paper icon -->
          <span class="icon">🎯</span>

          <div class="text">
            <!-- Paper title -->
            <span class="title">Getting started</span>

            <!-- Modified time -->
            <small>last modified 2 hours ago</small>
          </div>

          <!-- Paper options -->
          <span class="options">
            <font-awesome-icon :icon="['fas', 'ellipsis-vertical']" />
          </span>
        </div>
      </div>
    </div>
  </main>
</template>

<style lang="scss">
@import '../style/variables.scss';

main {
  flex-direction: column;

  width: 100%;
  min-height: 100vh;

  .user-section {
    width: 100%;

    flex-direction: column;
    padding: 2rem 2rem;

    gap: 2rem;

    &:first-child {
      padding-top: 4rem;
    }

    header {
      width: 100%;

      align-items: center;

      h2 {
        font-weight: 600;
      }

      .paper-count {
        color: $main;
        font-weight: 600;

        margin-inline: 0.5rem 2rem;
      }

      .new-paper {
        display: flex;
        align-items: center;

        color: $strong;

        gap: 0.3rem;
        font-weight: 600;

        cursor: pointer;

        filter: brightness(0.9);

        &::before {
          content: '';

          @include fill;

          background-color: $main;

          z-index: -1;
          border-radius: $border-radius;

          opacity: 0;

          transition: all 100ms;
        }

        &:hover::before {
          opacity: 0.2;
          box-shadow: 0 0 0 0.5rem $main;
        }
      }
    }

    .papers {
      width: 100%;
      flex-direction: column;
      gap: 1rem;

      .paper {
        position: relative;

        padding: 0.5rem 1rem;
        width: 100%;
        max-width: 25rem;

        align-items: center;
        gap: 0.3rem;

        border-radius: $border-radius;

        cursor: pointer;

        transition: all 100ms;

        .icon {
          font-size: 1.3rem;
        }

        .text {
          flex: 1;
          text-align: left;

          flex-direction: column;
          gap: 0.2rem;

          .title {
            font-weight: 600;
          }

          small {
            color: $main;
            filter: brightness(0.8);
          }
        }

        .options {
          margin-right: -0.5rem;

          color: $main;
          position: relative;

          width: 2rem;
          aspect-ratio: 1/1;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 50%;

          &::before {
            content: '';

            @include fill;

            background-color: $main;

            z-index: -1;
            border-radius: 50%;

            opacity: 0;

            transition: all 100ms;
          }

          &:hover {
            filter: brightness(0.8);

            &::before {
              opacity: 0.2;
            }
          }
        }

        &::before {
          content: '';

          @include fill;

          background-color: $main;

          z-index: -1;
          border-radius: $border-radius;

          opacity: 0.2;
        }

        &:hover {
          filter: brightness(1.1);
        }
      }
    }
  }
}
</style>
