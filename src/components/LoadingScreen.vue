<script setup lang="ts">
import { computed } from "vue";

defineProps<{
  loading: boolean;
}>();

const carrots = Array.from({ length: 12 }); // 12 carrots for the circle
</script>

<template>
  <div v-if="loading" class="loading-overlay">
    <div class="spinner-container">
      <div
        v-for="(_, index) in carrots"
        :key="index"
        class="carrot"
        :style="{
          transform: `rotate(${index * 30}deg) translate(0, -40px)`,
          animationDelay: `${index * 0.1}s`,
        }"
      >
        🥕
      </div>
    </div>
  </div>
</template>

<style scoped>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: var(--tg-theme-bg-color, #ffffff);
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
}

.spinner-container {
  position: relative;
  width: 100px;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.carrot {
  position: absolute;
  font-size: 24px;
  opacity: 0;
  animation: fade-in-out 1.2s linear infinite;
}

@keyframes fade-in-out {
  0%,
  100% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
}
</style>
