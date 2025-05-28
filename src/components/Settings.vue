<script setup lang="ts">
import { ref, watch } from "vue";
import type { UserSettings } from "@/utils/types";
import InputNumber from 'primevue/inputnumber';
import Dropdown from 'primevue/dropdown';
import Button from 'primevue/button';
import { useToast } from 'primevue/usetoast';

const toast = useToast();

const props = defineProps<{
  settings?: UserSettings;
  models: string[];
}>();

const emit = defineEmits(['update:settings']);

const modes = [
  { label: 'Roleplay', value: 'RP' },
  { label: 'Roleplay and art', value: 'RP_ART' },
  { label: 'Art', value: 'ART' }
];

const resolutions = [
  { label: '2:1', value: [1536, 768] },
  { label: '1:2', value: [768, 1536] },
  { label: '16:9', value: [1472, 832] },
  { label: '9:16', value: [832, 1472] },
  { label: '3:2', value: [1344, 896] },
  { label: '2:3', value: [896, 1344] },
  { label: '4:3', value: [1280, 960] },
  { label: '3:4', value: [960, 1280] },
  { label: '1:1', value: [1024, 1024] }
];

const localSettings = ref<UserSettings>({
  width: 512,
  height: 512,
  mode: modes[0].value,
  model: props.models[0] || '',
  seed: null,
  steps: 20,
  lang: 'en',
  is_premium: false,
  quota: 0,
  ...props.settings
});

const isLoading = ref(false);

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
  isLoading.value = true;
  try {
    const response = await fetch('', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(localSettings.value)
    });

    if (!response.ok) throw new Error('Failed to save settings');

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
    console.error('Error saving settings:', error);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="settings-container p-fluid">
    <div class="field">
      <label for="mode">Mode</label>
      <Dropdown
        id="mode"
        v-model="localSettings.mode"
        :options="modes"
        option-label="label"
        option-value="value"
        @change="updateSettings('mode', $event.value)"
        placeholder="Select mode"
        class="dropdown-white-bg"
      />
    </div>

    <div class="field">
      <label for="model">Model</label>
      <Dropdown
        id="model"
        v-model="localSettings.model"
        :options="models"
        @change="updateSettings('model', $event.value)"
        placeholder="Select model"
        class="dropdown-white-bg"
      />
    </div>

    <div class="field">
      <label for="resolution">Resolution Presets</label>
      <Dropdown
        id="resolution"
        :options="resolutions"
        option-label="label"
        option-value="value"
        @change="applyResolution($event.value)"
        placeholder="Select resolution"
        class="dropdown-white-bg"
      />
    </div>

    <div class="dimensions-vertical">
      <div class="dimension-group">
        <label>Height</label>
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
        <label>Width</label>
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
      label="Save"
      @click="saveSettings"
      :loading="isLoading"
      class="save-button"
    />
  </div>
</template>

<style scoped>
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