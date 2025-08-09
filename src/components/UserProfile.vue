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
            <span class="p-text-secondary"><strong>Quota:</strong></span>
            {{ appStore.user?.quota }}
          </div>
          <div class="field">
            <span class="p-text-secondary"><strong>Created:</strong></span>
            {{ appStore.user ? new Date(appStore.user.created_at * 1000).toLocaleString() : '' }}
          </div>
          <div class="field">
            <span class="p-text-secondary"><strong>Last Updated:</strong></span>
            {{ appStore.user ? new Date(appStore.user.updated_at * 1000).toLocaleString() : '' }}
          </div>
        </div>
      </div>

      <Divider />
      <h3>Settings</h3>
      <div class="grid p-fluid">
        <div class="col-12 md:col-4">
          <div class="field">
            <span class="p-text-secondary"><strong>Language:</strong></span>
            {{ appStore.user?.settings.lang }}
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
            {{ appStore.user?.settings.width }}x{{ appStore.user?.settings.height }}
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