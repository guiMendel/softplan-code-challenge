<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div class="papers-index">
    <!-- Current user's papers -->
    <div class="user-section">
      <header>
        <!-- Section title -->
        <div class="text">
          <h2>Your Papers</h2>
          <span class="paper-count">1</span>
        </div>

        <!-- Create paper button -->
        <span class="new-paper"><font-awesome-icon :icon="['fas', 'plus']" /> create </span>
      </header>

      <div class="papers">
        <div class="paper" @click="router.push({ name: 'paper' })">
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
  </div>
</template>

<style lang="scss">
@import '../style/variables.scss';

.papers-index {
  flex-direction: column;

  width: 100%;

  .user-section {
    width: 100%;

    flex-direction: column;
    padding: 2rem 2rem;

    gap: 2rem;

    header {
      width: 100%;
      max-width: 16rem;

      align-items: center;
      justify-content: space-between;

      .text {
        align-items: center;
        gap: 0.5rem;

        h2 {
          font-weight: 600;
        }

        .paper-count {
          background-color: $main-trans;

          aspect-ratio: 1/1;
          width: 1.3rem;
          border-radius: 50%;

          display: flex;
          align-items: center;
          justify-content: center;

          color: $main;
        }
      }

      .new-paper {
        @include light-button;
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

        background-color: $main-trans;

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
          margin-right: -0.3rem;

          @include light-button;

          color: $main;

          width: 1.5rem;
          aspect-ratio: 1/1;
          border-radius: 50%;

          // display: flex;
          // align-items: center;
          // justify-content: center;

          // background-color: $transparent;

          // transition: all 100ms;

          // &:hover {
          //   filter: brightness(0.8);

          //   background-color: $main-trans;
          // }
        }

        &:hover {
          filter: brightness(1.1);
        }
      }
    }
  }
}
</style>
