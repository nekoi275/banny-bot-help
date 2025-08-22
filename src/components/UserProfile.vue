<script setup lang="ts">
import { useAppStore } from "@/stores/appStore";
import Button from "primevue/button";
import { useToast } from "primevue/usetoast";

const appStore = useAppStore();
const toast = useToast();

const reset = async () => {
  try {
    await appStore.reset(appStore.userId);
    toast.add({
      severity: "success",
      summary: appStore.siteContent?.settings_success,
      life: 3000,
    });
  } catch (error) {
    toast.add({
      severity: "error",
      summary: appStore.siteContent?.settings_fail,
      life: 3000,
    });
  }
};
</script>

<template>
  <h3>{{ appStore.user?.name }} <span v-if="appStore.user?.is_premium">⭐</span></h3>
  <div class="grid p-fluid">
    <div class="col-12 md:col-6">
      <div class="field">
        <span class="p-text-secondary"
          ><strong>{{ appStore.siteContent?.profile_balance }}:</strong></span
        >
        {{ appStore.user?.balance }} 🥕
      </div>
      <div class="field">
        <span class="p-text-secondary"
          ><strong>{{ appStore.siteContent?.profile_user_days }}:</strong></span
        >
        {{ appStore.user?.days }}
      </div>
      <div class="col-12 md:col-4">
        <div class="field">
          <span class="p-text-secondary"
            ><strong>{{ appStore.siteContent?.settings_lang }}:</strong></span
          >
          {{ appStore.user?.lang }}
        </div>
      </div>
      <div class="col-12 md:col-4">
        <div class="field">
          <span class="p-text-secondary"
            ><strong>{{ appStore.siteContent?.settings_mode }}:</strong></span
          >
          {{ appStore.user?.settings.mode }}
        </div>
      </div>
      <div class="col-12 md:col-4">
        <div class="field">
          <span class="p-text-secondary"
            ><strong
              >{{ appStore.siteContent?.settings_resolution }}:</strong
            ></span
          >
          {{ appStore.user?.settings.width }}x{{
            appStore.user?.settings.height
          }}
        </div>
      </div>
      <div class="col-12 md:col-4">
        <div class="field">
          <span class="p-text-secondary"
            ><strong>{{ appStore.siteContent?.settings_steps }}:</strong></span
          >
          {{ appStore.user?.settings.steps }}
        </div>
      </div>
      <div class="col-12 md:col-4">
        <div class="field">
          <span class="p-text-secondary"
            ><strong>{{ appStore.siteContent?.settings_model }}:</strong></span
          >
          {{ appStore.user?.settings.model }}
        </div>
      </div>
      <div class="col-12 md:col-4">
        <div class="field">
          <span class="p-text-secondary"
            ><strong>{{ appStore.siteContent?.settings_seed }}:</strong></span
          >
          {{ appStore.user?.settings.seed || "random" }}
        </div>
      </div>
      <div class="col-12 md:col-4">
        <div class="field">
          <span class="p-text-secondary"
            ><strong>{{ appStore.siteContent?.settings_seed }}:</strong></span
          >
          {{ appStore.user?.settings.seed || "random" }}
        </div>
      </div>
      <div class="col-12 md:col-4">
        <div class="field">
          <span class="p-text-secondary"
            ><strong>{{ appStore.siteContent?.image_cost }}:</strong></span
          >
          {{ appStore.imageCost }}
        </div>
      </div>
    </div>
  </div>

  <div class="buttons-container">
    <Button
      :label="appStore.siteContent?.settings_reset"
      @click="reset"
      class="p-button-outlined reset-button"
    />
  </div>
</template>

<style scoped>
.field {
  margin-bottom: 1rem;
}
h3 {
  margin-bottom: 2rem;
}
.buttons-container {
  display: flex;
  justify-content: flex-start;
  margin-top: 1rem;
}
.reset-button {
  margin-right: auto;
}
</style>
