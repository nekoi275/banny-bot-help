<script setup lang="ts">
import { useAppStore } from "@/stores/appStore";
import Card from "primevue/card";
import Divider from "primevue/divider";

const appStore = useAppStore();
</script>

<template>
  <Card>
    <template #title>
      {{ appStore.user?.name }}
      <span v-if="appStore.user?.is_premium">⭐</span>
    </template>
    <template #content>
      <div class="grid p-fluid">
        <div class="col-12 md:col-6">
          <div class="field">
            <span class="p-text-secondary"><strong>Balance:</strong></span>
            {{ appStore.user?.balance }}
          </div>
          <div class="field">
            <span class="p-text-secondary"><strong>User for:</strong></span>
            {{ appStore.user?.days }} days
          </div>
          <div class="col-12 md:col-4">
            <div class="field">
              <span class="p-text-secondary"><strong>Language:</strong></span>
              {{ appStore.user?.lang }}
            </div>
          </div>
          <div class="col-12 md:col-4">
            <div class="field">
              <span class="p-text-secondary"><strong>Mode:</strong></span>
              {{ appStore.user?.settings.mode }}
            </div>
          </div>
          <div class="col-12 md:col-4">
            <div class="field">
              <span class="p-text-secondary"><strong>Resolution:</strong></span>
              {{ appStore.user?.settings.width }}x{{
                appStore.user?.settings.height
              }}
            </div>
          </div>
          <div class="col-12 md:col-4">
            <div class="field">
              <span class="p-text-secondary"><strong>Steps:</strong></span>
              {{ appStore.user?.settings.steps }}
            </div>
          </div>
          <div class="col-12 md:col-4">
            <div class="field">
              <span class="p-text-secondary"><strong>Model:</strong></span>
              {{ appStore.user?.settings.model }}
            </div>
          </div>
          <div class="col-12 md:col-4">
            <div class="field">
              <span class="p-text-secondary"><strong>Seed:</strong></span>
              {{ appStore.user?.settings.seed || 'random' }}
            </div>
          </div>
        </div>
      </div>
    </template>
  </Card>
</template>

<style scoped>
.field {
  margin-bottom: 1rem;
}
h3 {
  margin-top: 0;
  margin-bottom: 1rem;
}
</style>
