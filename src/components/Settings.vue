<script setup lang="ts">
import { ref, watch } from "vue";
import InputNumber from 'primevue/inputnumber';
import Dropdown from 'primevue/dropdown';
import Button from 'primevue/button';
import { useToast } from 'primevue/usetoast';
import { useAppStore } from '@/stores/appStore';
import { type UserSettings } from "@/utils/types";

const toast = useToast();
const appStore = useAppStore();

const props = defineProps<{
  settings?: UserSettings;
}>();

const emit = defineEmits(['update:settings']);

const localSettings = ref<UserSettings>({
  width: 512,
  height: 512,
  mode: appStore.modes[0]?.value || 'RP',
  model: appStore.modelNames[0] || '',
  seed: props.settings?.seed || null,
  steps: 20 // если есть в модели, ставить макс и мин как в модели, или по дефолту 10-50
});

watch(() => props.settings, (newSettings) => {
  if (newSettings) {
    localSettings.value = { ...localSettings.value, ...newSettings };
  }
}, { deep: true });

const updateSettings = (key: keyof UserSettings, value: any) => {
  localSettings.value = { ...localSettings.value, [key]: value };
  emit('update:settings', localSettings.value);
};

const swapDimensions = () => {
  const newWidth = localSettings.value.height;
  const newHeight = localSettings.value.width;
  updateSettings('width', newWidth);
  updateSettings('height', newHeight);
};

const validateDimension = (value: number) => {
  if (value < 64) return 64;
  if (value > 1920) return 1920;
  return Math.floor(value / 64) * 64;
};

const incrementDimension = (dimension: 'width' | 'height') => {
  const newValue = Math.min(localSettings.value[dimension] + 64, 1920);
  updateSettings(dimension, newValue);
};

const decrementDimension = (dimension: 'width' | 'height') => {
  const newValue = Math.max(localSettings.value[dimension] - 64, 64);
  updateSettings(dimension, newValue);
};

const applyResolution = (value: number[]) => {
  if (value && value.length === 2) {
    updateSettings('width', value[0]);
    updateSettings('height', value[1]);
  }
};

const saveSettings = async () => {
  try {
    await appStore.saveSettings(localSettings.value);
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Settings saved successfully',
      life: 3000
    });
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to save settings',
      life: 3000
    });
  }
};
</script>

<template>
  <div class="settings-container p-fluid">
    <div class="field">
      <label for="mode">{{ appStore.siteContent?.settings_mode || 'Mode' }}</label>
      <Dropdown
        id="mode"
        v-model="localSettings.mode"
        :options="appStore.modes"
        option-label="label"
        option-value="value"
        @change="updateSettings('mode', $event.value)"
        :placeholder="appStore.siteContent?.settings_mode || 'Select mode'"
        class="dropdown-white-bg"
      />
    </div>

    <div class="field">
      <label for="model">{{ appStore.siteContent?.settings_model || 'Model' }}</label>
      <Dropdown
        id="model"
        v-model="localSettings.model"
        :options="appStore.modelNames"
        @change="updateSettings('model', $event.value)"
        :placeholder="appStore.siteContent?.settings_model || 'Select model'"
        class="dropdown-white-bg"
      />
    </div>

    <div class="field">
      <label for="resolution">{{ appStore.siteContent?.settings_resolution || 'Resolution Presets' }}</label>
      <Dropdown
        id="resolution"
        :options="appStore.resolutions"
        option-label="label"
        option-value="value"
        @change="applyResolution($event.value)"
        :placeholder="appStore.siteContent?.settings_resolution || 'Select resolution'"
        class="dropdown-white-bg"
      />
    </div>

    <div class="dimensions-vertical">
      <div class="dimension-group">
        <label>{{ appStore.siteContent?.settings_height || 'Height' }}</label>
        <div class="dimension-controls">
          <InputNumber
            v-model="localSettings.height"
            :min="64"
            :max="1920"
            :step="64"
            @update:modelValue="(val: number) => updateSettings('height', validateDimension(val))"
            class="dimension-input"
          />
          <div class="dimension-buttons">
            <Button
              label="+"
              @click="incrementDimension('height')"
              class="p-button-text dimension-button"
              :disabled="localSettings.height >= 1920"
            />
            <Button
              label="-"
              @click="decrementDimension('height')"
              class="p-button-text dimension-button"
              :disabled="localSettings.height <= 64"
            />
          </div>
        </div>
      </div>

      <Button
        label="⇅"
        @click="swapDimensions"
        class="swap-button p-button-text"
        aria-label="Swap dimensions"
      />

      <div class="dimension-group">
        <label>{{ appStore.siteContent?.settings_width || 'Width' }}</label>
        <div class="dimension-controls">
          <InputNumber
            v-model="localSettings.width"
            :min="64"
            :max="1920"
            :step="64"
            @update:modelValue="(val: number) => updateSettings('width', validateDimension(val))"
            class="dimension-input"
          />
          <div class="dimension-buttons">
            <Button
              label="+"
              @click="incrementDimension('width')"
              class="p-button-text dimension-button"
              :disabled="localSettings.width >= 1920"
            />
            <Button
              label="-"
              @click="decrementDimension('width')"
              class="p-button-text dimension-button"
              :disabled="localSettings.width <= 64"
            />
          </div>
        </div>
      </div>
    </div>

    <Button
      :label="appStore.siteContent?.settings_save || 'Save'"
      @click="saveSettings"
      class="save-button"
    />
  </div>
</template>

<style scoped>
/* Стили остаются без изменений */
.settings-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 400px;
}

.dimensions-vertical {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.dimension-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.dimension-controls {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.dimension-input {
  flex: 1;
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

.swap-button {
  margin: 0.25rem 0;
  font-size: 1.25rem;
  align-self: center;
  padding: 0.25rem 1rem;
}

.save-button {
  margin-top: 1rem;
  align-self: flex-end;
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
</style>