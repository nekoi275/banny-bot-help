<script setup lang="ts">
import { useAppStore } from "@/stores/appStore";
import Button from "primevue/button";
import { useToast } from "primevue/usetoast";
import Dialog from "primevue/dialog";
import { ref } from "vue";

const appStore = useAppStore();
const toast = useToast();
const showTopUpDialog = ref(false);
const tg = window.Telegram?.WebApp;

const topUpOptions = [
  { label: "1⭐=200🥕", value: 1 },
  { label: "2⭐=420🥕", value: 2 },
  { label: "5⭐=1100🥕", value: 5 },
  { label: "10⭐=2300🥕", value: 10 },
  { label: "20⭐=4800🥕", value: 20 },
  { label: "50⭐=12500🥕", value: 50 },
];

const reset = async () => {
  try {
    await appStore.reset(appStore.userId);
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.close()
    }
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

const handleTopUp = async (stars: number) => {
  try {
    const invoiceData = await appStore.fetchInvoice(appStore.userId, stars);
    tg?.openInvoice(invoiceData.invoice);
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.close()
    }
  } catch (error) {
    console.error("Top-up error:", error);
  } finally {
    showTopUpDialog.value = false;
  }
};
</script>

<template>
  <h3>
    {{ appStore.user?.name }} <span v-if="appStore.user?.is_premium">⭐</span>
  </h3>
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
      <div class="field">
        <span class="p-text-secondary"
          ><strong>{{ appStore.siteContent?.settings_lang }}:</strong></span
        >
        {{
          appStore.languageObjects.find((l) => l.value === appStore.user?.lang)
            ?.label
        }}
      </div>
      <div class="field">
        <span class="p-text-secondary"
          ><strong>{{ appStore.siteContent?.settings_mode }}:</strong></span
        >
        {{ appStore.user?.settings.mode }}
      </div>
      <div class="field">
        <span class="p-text-secondary"
          ><strong
            >{{ appStore.siteContent?.settings_resolution }}:</strong
          ></span
        >
        {{ appStore.user?.settings.width }}x{{ appStore.user?.settings.height }}
      </div>
      <div class="field">
        <span class="p-text-secondary"
          ><strong>{{ appStore.siteContent?.settings_steps }}:</strong></span
        >
        {{ appStore.user?.settings.steps }}
      </div>
      <div class="field">
        <span class="p-text-secondary"
          ><strong>{{ appStore.siteContent?.settings_model }}:</strong></span
        >
        {{ appStore.user?.settings.model }}
      </div>
      <div class="field">
        <span class="p-text-secondary"
          ><strong>{{ appStore.siteContent?.settings_seed }}:</strong></span
        >
        {{ appStore.user?.settings.seed || "random" }}
      </div>
      <div class="field">
        <span class="p-text-secondary"
          ><strong>{{ appStore.siteContent?.image_cost }}:</strong></span
        >
        {{ appStore.imageCost }} 🥕
      </div>
    </div>
  </div>
  <div class="buttons-container">
    <Button
      :label="appStore.siteContent?.settings_reset"
      @click="reset"
      class="p-button-outlined reset-button"
    />
    <Button
      :label="appStore.siteContent?.top_up"
      @click="showTopUpDialog = true"
      class="p-button-outlined"
    />
    <Dialog
      v-model:visible="showTopUpDialog"
      modal
      :style="{ width: '15rem', padding: '1rem' }"
      :dismissableMask="true"
      :header="appStore.siteContent?.top_up"
    >
      <div class="dialog-container">
        <Button
          v-for="(option, index) in topUpOptions"
          :key="index"
          @click="handleTopUp(option.value)"
          class="flex-1 min-w-[8rem]"
          :label="option.label"
        />
      </div>
    </Dialog>
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
  gap: 0.5rem;
  margin-top: 1rem;
}
.dialog-container {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  padding-top: 1rem;
}
</style>
