<script setup lang="ts">
import { ref, onMounted } from "vue";
import ModelCard from "@/components/ModelCard.vue";
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import Toast from "primevue/toast";
import { ContentKey, getText } from "@/utils/common";
import type { Model } from "@/utils/types";

declare global {
  interface Window {
    Telegram: any;
  }
}

const models = ref<Model[]>([]);

onMounted(async () => {
  try {
    const response = await fetch(
      "https://a3eqyxqi6gfrg3nhw4v3rl6q4m0gtpqi.lambda-url.eu-west-1.on.aws/models"
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    models.value = await response.json();
  } catch (error) {
    console.error("Error fetching models:", error);
  }
});
</script>

<template>
  <TabView>
    <TabPanel :header="`${getText(ContentKey.General, ContentKey.Header)}`">
      <div v-html="getText(ContentKey.General, ContentKey.Content)"></div>
    </TabPanel>
    <TabPanel :header="`${getText(ContentKey.Models, ContentKey.Header)}`">
      <ModelCard v-for="model in models" :key="model.name" :model="model" />
    </TabPanel>
  </TabView>
  <Toast />
</template>

<style>
* {
  background-color: var(--tg-theme-bg-color);
  color: var(--tg-theme-text-color);
}
html,
body,
div,
p,
h3 {
  margin: 0px;
  padding: 0px;
}
.p-component {
  margin: 0px;
}
.p-tabview-panel {
  padding: 25px;
}
.p-highlight {
  color: var(--tg-theme-accent-text-color);
}
.p-tabview .p-tabview-nav li.p-highlight .p-tabview-nav-link {
  border-color: var(--tg-theme-accent-text-color);
}
.p-tabview {
  width: 100vw;
  height: 100vh;
  overflow-y: scroll;
}
.p-toast,
.p-toast-message-content,
.p-toast-message {
  width: 100px;
}
</style>
