<script setup lang="ts">
import { ref, onBeforeMount, computed } from "vue";
import ModelCard from "@/components/ModelCard.vue";
import LoraCard from "@/components/LoraCard.vue";
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import Toast from "primevue/toast";
import Checkbox from "primevue/checkbox";
import MultiSelect from 'primevue/multiselect';
import { ContentKey, getText } from "@/utils/common";
import models from "@/data/models.json";
import loras from "@/data/loras.json";

declare global {
  interface Window {
    Telegram: any;
  }
}
let selected = ref({
  modelSD1: false,
  modelSDXL: false,
  loraSD1: false,
  loraSDXL: false,
  loraNSFW: false,
  loraCategories: []
});
let filters = {} as any;
let filteredLoras = ref();
let filteredModels = ref();

let loraCategories = computed(() => {
  return [...new Set(loras.map(lora => {
    return lora.category
  }))]
})
function filterModelType() {
  if ((!selected.value.modelSD1 && !selected.value.modelSDXL) || (selected.value.modelSD1 && selected.value.modelSDXL)) {
    delete filters.modelType
  } else if (selected.value.modelSD1 && !selected.value.modelSDXL) {
    filters.modelType = (model: any) => model.json["sd version"] === "SD1"
  } else if (!selected.value.modelSD1 && selected.value.modelSDXL){
    filters.modelType = (model: any) => model.json["sd version"] === "SDXL"
  } else {
    delete filters.modelType
  }
  applyModelFilters()
}
function filterLoraType() {
  if ((!selected.value.loraSD1 && !selected.value.loraSDXL) || (selected.value.loraSD1 && selected.value.loraSDXL)) {
    delete filters.loraType
  } else if (selected.value.loraSD1 && !selected.value.loraSDXL) {
    filters.loraType = (lora: any) => lora.json["sd version"] === "SD1"
  } else if (!selected.value.loraSD1 && selected.value.loraSDXL){
    filters.loraType = (lora: any) => lora.json["sd version"] === "SDXL"
  } else {
    delete filters.loraType
  }
  applyLoraFilters()
}
function filterNSFW() {
  if (!selected.value.loraNSFW) {
    filters.nsfw = (lora: any) => lora.isNSFW === false
  } else {
    delete filters.nsfw
  }
  applyLoraFilters()
}
function filterCategories() {
  if (selected.value.loraCategories.length > 0) {
    filters.category = (lora: any) => selected.value.loraCategories.includes(lora.category as never)
  } else {
    delete filters.category
  }
  applyLoraFilters()
}
function applyLoraFilters() {
  let result = loras
  if (filters.nsfw) result = result.filter(filters.nsfw)
  if (filters.loraType) result = result.filter(filters.loraType)
  if (filters.category) result = result.filter(filters.category)
  filteredLoras.value = result
}
function applyModelFilters() {
  let result = models
  if (filters.modelType) result = result.filter(filters.modelType)
  filteredModels.value = result
}
onBeforeMount(() => {
  applyModelFilters()
  filterNSFW()
})
</script>

<template>
  <TabView>
    <TabPanel :header="`${getText(ContentKey.General, ContentKey.Header)}`">
      <div v-html="getText(ContentKey.General, ContentKey.Content)"></div>
    </TabPanel>
    <TabPanel :header="`${getText(ContentKey.Models, ContentKey.Header)}`">
      <Checkbox
        v-model="selected.modelSD1"
        inputId="type1"
        name="type"
        value="SD1"
        :binary="true"
        @change="filterModelType()"
      />
      <label for="type1" class="ml-2"> SD 1.5 </label>
      <Checkbox
        v-model="selected.modelSDXL"
        inputId="type2"
        name="type"
        value="SDXL"
        :binary="true"
        @change="filterModelType()"
      />
      <label for="type2" class="ml-2"> SDXL </label>
      <div v-for="model in filteredModels">
        <ModelCard :model="model" />
      </div>
    </TabPanel>
    <TabPanel :header="`${getText(ContentKey.LORAS, ContentKey.Header)}`">
      <Checkbox
        v-model="selected.loraSD1"
        inputId="type1"
        name="type"
        value="SD1"
        :binary="true"
        @change="filterLoraType()"
      />
      <label for="type1" class="ml-2"> SD 1.5 </label>
      <Checkbox
        v-model="selected.loraSDXL"
        inputId="type2"
        name="type"
        value="SDXL"
        :binary="true"
        @change="filterLoraType()"
      />
      <label for="type2" class="ml-2"> SDXL </label>
      <Checkbox
        v-model="selected.loraNSFW"
        inputId="type3"
        name="type"
        value="NSFW"
        :binary="true"
        @change="filterNSFW()"
      />
      <label for="type3" class="ml-2"> NSFW </label>
      <MultiSelect v-model="selected.loraCategories" @change="filterCategories()" :options="loraCategories" placeholder="Select Categories" filter class="w-full md:w-80" :showToggleAll="false"></MultiSelect>
      <div v-for="lora in filteredLoras">
        <LoraCard :model="lora" />
      </div>
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
p {
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
label {
  margin-right: 10px;
}
.p-multiselect-label {
  padding-right: 10px;
}
.p-multiselect-item span {
  padding-left: 5px;
}
.p-multiselect-panel {
  background-color: white;
}
</style>
