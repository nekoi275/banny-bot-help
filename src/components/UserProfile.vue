<script setup lang="ts">
import { useAppStore } from "@/stores/appStore";
import { storeToRefs } from "pinia";
import Card from "primevue/card";
import InputText from "primevue/inputtext";
import Divider from "primevue/divider";

const appStore = useAppStore();
</script>

<template>
  <Card>
    <template #title>{{ appStore.user?.name }}</template>
    <template #content>
      <div class="grid p-fluid">
        <div class="col-12 md:col-6">
          <div class="field">
            <label>User ID</label>
            <InputText :value="appStore.user?.id.toString()" readonly />
          </div>
          <div class="field">
            <label>Language</label>
            <InputText :value="appStore.user?.lang" readonly />
          </div>
          <div class="field">
            <label>Premium Status</label>
            <InputText
              :value="appStore.user?.is_premium ? 'Premium' : 'Standard'"
              readonly
            />
          </div>
        </div>
        <div class="col-12 md:col-6">
          <div class="field">
            <label>Quota</label>
            <InputText :value="appStore.user?.quota.toString()" readonly />
          </div>
          <div class="field">
            <label>Created</label>
            <InputText v-if="appStore.user"
              :value="new Date(appStore.user.created_at * 1000).toLocaleString()"
              readonly
            />
          </div>
          <div class="field">
            <label>Last Updated</label>
            <InputText v-if="appStore.user"
              :value="new Date(appStore.user.updated_at * 1000).toLocaleString()"
              readonly
            />
          </div>
        </div>
      </div>

      <Divider />
      <h3>Settings</h3>
      <div class="grid">
        <div class="col-12 md:col-4">
          <span class="p-text-secondary">Mode:</span> {{ appStore.user?.settings.mode }}
        </div>
        <div class="col-12 md:col-4">
          <span class="p-text-secondary">Resolution:</span>
          {{ appStore.user?.settings.width }}x{{ appStore.user?.settings.height }}
        </div>
        <div class="col-12 md:col-4">
          <span class="p-text-secondary">Steps:</span> {{ appStore.user?.settings.steps }}
        </div>
      </div>
    </template>
  </Card>
</template>

<style scoped>
.field {
  margin-bottom: 1rem;
}
</style>
