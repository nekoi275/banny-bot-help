<script setup lang="ts">
import ModelCard from "@/components/ModelCard.vue";
import Settings from "@/components/Settings.vue";
import UserProfile from "@/components/UserProfile.vue";
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import Toast from "primevue/toast";
import { useMiniApp } from "vue-tg";
import { useAppStore } from '@/stores/appStore';
import { onMounted } from 'vue';

const miniApp = useMiniApp();
const appStore = useAppStore();

// только для телеграмма
/*
const initData = miniApp.initDataUnsafe;
if (initData.user?.id) {
  appStore.userId = initData.user.id;
}
if (initData.user?.language_code) {
  appStore.userLang = initData.user.language_code;
}
*/

onMounted(async () => {
  await appStore.fetchInitialData();
});
</script>

<template>
  <TabView>
    <TabPanel header="Profile">
      <UserProfile/>
    </TabPanel>
    <TabPanel :header="appStore.tabHeaders[0]">
      <div v-html="appStore.siteContent?.content_main"></div>
    </TabPanel>
    <TabPanel :header="appStore.tabHeaders[1]">
      <ModelCard 
        v-for="model in appStore.models" 
        :key="model.name" 
        :model="model"
        :style="{
          backgroundColor: model.name === appStore.selectedModel ? '#9bc597' : ''
        }"
      />
    </TabPanel>
    <TabPanel :header="appStore.tabHeaders[2]">
      <Settings></Settings>
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