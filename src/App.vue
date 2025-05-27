<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import ModelCard from "@/components/ModelCard.vue";
import Settings from "@/components/Settings.vue";
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import Toast from "primevue/toast";
import type { Model, User } from "@/utils/types";
import { useMiniApp } from "vue-tg";

const miniApp = useMiniApp();
const userId = miniApp.initDataUnsafe.user?.id;
//const userId = 432200327;
const models = ref<Model[]>([]);
const user = ref<User | null>(null);
const selectedModel = ref<string>("");
const tabHeaders = ["Description", "Models", "Settings"];

const modelNames = computed(() => {
  return models.value.map(model => model.name)
});

onMounted(async () => {
  try {
    const [modelsResponse, userResponse] = await Promise.all([
      fetch("https://a3eqyxqi6gfrg3nhw4v3rl6q4m0gtpqi.lambda-url.eu-west-1.on.aws/models"),
      fetch(`https://a3eqyxqi6gfrg3nhw4v3rl6q4m0gtpqi.lambda-url.eu-west-1.on.aws/user?id=${userId}`)
    ]);

    if (!modelsResponse.ok) throw new Error("Network response was not ok");
    if (!userResponse.ok) throw new Error(`HTTP error! status: ${userResponse.status}`);

    models.value = await modelsResponse.json();
    const userData: User = await userResponse.json();
    user.value = userData;
    selectedModel.value = userData.settings.model;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
});
</script>

<template>
  <TabView>
    <TabPanel :header="tabHeaders[0]">
      <div>Some text</div>
    </TabPanel>
    <TabPanel :header="tabHeaders[1]">
      <ModelCard 
        v-for="model in models" 
        :key="model.name" 
        :model="model"
        :style="{
          backgroundColor: model.name === selectedModel ? '#9bc597' : ''
        }"
      />
    </TabPanel>
    <TabPanel :header="tabHeaders[2]">
      <Settings :settings="user?.settings" :models="modelNames"></Settings>
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