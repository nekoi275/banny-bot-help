<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import Dropdown from "primevue/dropdown";
import Checkbox from "primevue/checkbox";
import Button from "primevue/button";
import InputNumber from "primevue/inputnumber";
import { useAppStore } from "@/stores/appStore";
import { type UserSettings } from "@/utils/types";
import DimensionsControls from "./DimensionsControls.vue";
import AdvancedSettings from "./AdvancedSettings.vue";

const saveStatus = ref<'idle' | 'success' | 'error'>('idle');
const appStore = useAppStore();

const emit = defineEmits(["update:settings"]);
const showAdvancedSettings = ref(false);

const localSettings = ref<UserSettings>({
  width: appStore.user?.settings?.width || 512,
  height: appStore.user?.settings?.height || 512,
  features: appStore.user?.settings?.features || [],
  model: appStore.user?.settings?.model || appStore.modelNames[0] || "",
  seed: appStore.user?.settings?.seed || null,
  steps: appStore.user?.settings?.steps || 20,
  lang: appStore.user?.settings?.lang || appStore.user?.lang || "en",
  negative: appStore.user?.settings?.negative || "",
  text_model: appStore.user?.settings?.text_model || (appStore.textModels.length > 0 ? appStore.textModels[0].id : undefined),
  cfg: appStore.user?.settings.cfg || 7,
  history_len: appStore.user?.settings?.history_len || 2,
  answer_len: appStore.user?.settings?.answer_len || 256
});

onMounted(() => {
  if (appStore.user?.settings) {
    localSettings.value = { ...localSettings.value, ...appStore.user.settings };
  }
});

watch(
  () => appStore.user?.settings,
  (newSettings) => {
    if (newSettings) {
      localSettings.value = { ...localSettings.value, ...newSettings };
    }
  },
  { deep: true }
);

const updateSettings = async (key: keyof UserSettings, value: any) => {
  localSettings.value = { ...localSettings.value, [key]: value };
  emit("update:settings", localSettings.value);
  
  if (key === 'lang') {
    await appStore.updateLanguage(value);
  }
  
  if (key === 'model' || key === 'steps' || key === 'width' || key === 'height') {
    await appStore.calculateImageCost(localSettings.value);
  }
};

const saveSettings = async () => {
  try {
    if (!appStore.userId) { return }
    await appStore.saveSettings(localSettings.value, appStore.userId);
    await appStore.calculateImageCost(localSettings.value);
    saveStatus.value = 'success';
    if (window.Telegram?.WebApp) {
      setTimeout(() => {
        window.Telegram?.WebApp.close()
      }, 3000);
    }
  } catch (error) {
    saveStatus.value = 'error';
  } finally {
    setTimeout(() => {
      saveStatus.value = 'idle';
    }, 3000);
  }
};
</script>

<template>
  <div class="settings-container p-fluid">

    <div class="field">
      <label for="language">{{ appStore.siteContent?.settings_lang }}</label>
      <Dropdown
        id="language"
        v-model="localSettings.lang"
        :options="appStore.languageObjects"
        optionLabel="label"
        optionValue="value"
        @change="updateSettings('lang', $event.value)"
        :placeholder="
          appStore.user?.lang || appStore.siteContent?.settings_lang
        "
        filter
        class="dropdown-white-bg"
      />
    </div>
    <div class="field">
      <label>{{ appStore.siteContent?.settings_mode || 'Features' }}</label>
      <div class="features">
        <div v-for="feature in appStore.availableFeatures" :key="feature.value" class="feature-item">
          <Checkbox
            :id="feature.value"
            v-model="localSettings.features"
            :value="feature.value"
            :disabled="feature.disabled || (localSettings.features.length === 1 && localSettings.features.includes(feature.value))"
            @change="updateSettings('features', localSettings.features)"
          />
          <label 
            :for="feature.value" 
            class="feature-label"
            :class="{ 'disabled-label': feature.disabled || (localSettings.features.length === 1 && localSettings.features.includes(feature.value)) }"
          >
            {{ feature.label }}
          </label>
        </div>
      </div>
    </div>
    <div class="field">
      <div class="field-header"> 
        <label for="text_model">{{ appStore.siteContent?.settings_text_model }}</label>
        <span class="cost-display" v-if="localSettings.text_model">
           <strong>{{ appStore.siteContent?.message_cost }}:</strong> 
           {{ appStore.textModels.find(m => m.id === localSettings.text_model)?.carrots.min }} - 
           {{ appStore.textModels.find(m => m.id === localSettings.text_model)?.carrots.max }} 🥕
        </span>
      </div>
      <Dropdown
        id="text_model"
        v-model="localSettings.text_model"
        :options="appStore.textModels"
        optionLabel="name"
        optionValue="id"
        @change="updateSettings('text_model', $event.value)"
        :placeholder="appStore.siteContent?.settings_text_model"
        class="dropdown-white-bg"
      />
    </div>

    <div v-if="localSettings.features.includes('text')" class="dimensions-single-line">
      <div class="dimension-group">
        <span>{{ appStore.siteContent?.settings_history_length }}</span>
        <div class="dimension-controls">
          <div class="dimension-buttons">
            <Button
              label="↑"
              @click="localSettings.history_len = Math.min((localSettings.history_len || 0) + 1, 10); updateSettings('history_len', localSettings.history_len)"
              class="p-button-text dimension-button"
              :disabled="(localSettings.history_len || 0) >= 10"
            />
            <Button
              label="↓"
              @click="localSettings.history_len = Math.max((localSettings.history_len || 0) - 1, 0); updateSettings('history_len', localSettings.history_len)"
              class="p-button-text dimension-button"
              :disabled="(localSettings.history_len || 0) <= 0"
            />
          </div>
          <InputNumber
            v-model="localSettings.history_len"
            :min="0"
            :max="10"
            :step="1"
            disabled
            @input="updateSettings('history_len', $event.value)"
            class="compact-input"
          />
        </div>
      </div>
      
      <div class="dimension-group">
        <span>{{ appStore.siteContent?.settings_answer_length }}</span>
        <div class="dimension-controls">
          <InputNumber
            v-model="localSettings.answer_len"
            :min="64"
            :max="512"
            :step="64"
            disabled
            @input="updateSettings('answer_len', $event.value)"
            class="compact-input"
          />
          <div class="dimension-buttons">
            <Button
              label="↑"
              @click="localSettings.answer_len = Math.min((localSettings.answer_len || 256) + 64, 512); updateSettings('answer_len', localSettings.answer_len)"
              class="p-button-text dimension-button"
              :disabled="(localSettings.answer_len || 256) >= 512"
            />
            <Button
              label="↓"
              @click="localSettings.answer_len = Math.max((localSettings.answer_len || 256) - 64, 64); updateSettings('answer_len', localSettings.answer_len)"
              class="p-button-text dimension-button"
              :disabled="(localSettings.answer_len || 256) <= 64"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="field" v-if="localSettings.features.includes('image')">
      <div class="field-header">
        <label for="model">{{ appStore.siteContent?.settings_model }}</label>
        <span class="cost-display">
          <strong>{{ appStore.siteContent?.image_cost }}:</strong> {{ appStore.imageCost }} 🥕
        </span>
      </div>
      <Dropdown
        id="model"
        v-model="localSettings.model"
        :options="appStore.modelNames"
        @change="updateSettings('model', $event.value)"
        :placeholder="appStore.siteContent?.settings_model"
        class="dropdown-white-bg"
      />
    </div>

    <DimensionsControls
      v-if="localSettings.features.includes('image')"
      :width="localSettings.width"
      :height="localSettings.height"
      :resolutions="appStore.resolutions"
      :site-content="appStore.siteContent"
      @update:width="(val) => updateSettings('width', val)"
      @update:height="(val) => updateSettings('height', val)"
    />

    <Button 
      v-if="!showAdvancedSettings && localSettings.features.includes('image')"
      label="▼"
      @click="showAdvancedSettings = true"
      class="p-button-text"
      icon="pi pi-angle-down"
    />

    <div v-if="showAdvancedSettings && localSettings.features.includes('image')">
      <Button 
        label="▲"
        @click="showAdvancedSettings = false"
        class="p-button-text"
        icon="pi pi-angle-up"
      />

      <AdvancedSettings
        :seed="localSettings.seed"
        :steps="localSettings.steps"
        :cfg="localSettings.cfg"
        :negative="localSettings.negative"
        :site-content="appStore.siteContent"
        @update:seed="(val) => updateSettings('seed', val)"
        @update:steps="(val) => updateSettings('steps', val)"
        @update:cfg="(val) => updateSettings('cfg', val)"
        @update:negative="(val) => updateSettings('negative', val)"
      />
    </div>

    <Button
        :label="saveStatus === 'success' ? '✔️' : saveStatus === 'error' ? '❌' : appStore.siteContent?.settings_save"
        @click="saveSettings"
        class="save-button"
        :style="{ 
          backgroundColor: saveStatus === 'success' ? 'lightgreen' : saveStatus === 'error' ? 'lightcoral' : '',
          color: saveStatus === 'idle' ? '' : 'black',
          borderColor: saveStatus === 'success' ? 'lightgreen' : saveStatus === 'error' ? 'lightcoral' : ''
        }"
      />
  </div>
</template>

<style scoped>
label {
  display: block;
  margin-bottom: 0.5rem;
}
.settings-container {
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  max-width: 400px;
}
.dropdown-white-bg .p-dropdown-panel {
  background: white;
}
.dropdown-white-bg .p-dropdown-items .p-dropdown-item {
  background: white;
}
.dropdown-white-bg .p-dropdown-items .p-dropdown-item:hover {
  background: #f5f5f5;
}
.features {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 1rem;
}
.feature-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.feature-label {
  cursor: pointer;
  user-select: none;
  margin: 0;
}
.disabled-label {
  color: #999;
  cursor: not-allowed;
}
.field-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 0.5rem;
}
.field-header label {
  margin-bottom: 0;
}
.cost-display {
  font-size: 0.9em;
  color: var(--text-color-secondary);
}

.dimensions-single-line {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.dimension-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.dimension-controls {
  display: flex;
  gap: 0.25rem;
  align-items: center;
}
.compact-input {
  width: 80px;
}
.dimension-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}
.dimension-button {
  width: 2rem;
  height: 1.5rem;
  padding: 0;
  min-width: auto;
}
</style>
