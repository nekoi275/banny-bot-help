<script setup lang="ts">
import { ref, watch, onMounted, computed } from "vue";
import InputNumber from "primevue/inputnumber";
import Dropdown from "primevue/dropdown";
import Checkbox from "primevue/checkbox";
import Button from "primevue/button";
import Textarea from "primevue/textarea";
import { useAppStore } from "@/stores/appStore";
import { type UserSettings } from "@/utils/types";

const saveStatus = ref<'idle' | 'success' | 'error'>('idle');
const appStore = useAppStore();

const emit = defineEmits(["update:settings"]);
const showAdvancedSettings = ref(false);
const selectedResolution = ref<{value: number[], label: string} | null>(null);

const localSettings = ref<UserSettings>({
  width: appStore.user?.settings?.width || 512,
  height: appStore.user?.settings?.height || 512,
  features: appStore.user?.settings?.features || [],
  model: appStore.user?.settings?.model || appStore.modelNames[0] || "",
  seed: appStore.user?.settings?.seed || null,
  steps: appStore.user?.settings?.steps || 20,
  lang: appStore.user?.settings?.lang || appStore.user?.lang || "en",
  negative: appStore.user?.settings?.negative || "",
  cfg: appStore.user?.settings.cfg || 7
});

const currentResolution = computed(() => {
  const res = appStore.resolutions.find(
    (res) =>
      res.value[0] === localSettings.value.width &&
      res.value[1] === localSettings.value.height
  );
  selectedResolution.value = res || null;
  return res;
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
  
  if (key === 'model' || key === 'steps') {
    await appStore.calculateImageCost(localSettings.value);
  }
};

const swapDimensions = () => {
  const newWidth = localSettings.value.height;
  const newHeight = localSettings.value.width;
  updateSettings("width", newWidth);
  updateSettings("height", newHeight);
};

const validateDimension = (value: number) => {
  if (value < 64) return 64;
  if (value > 1920) return 1920;
  return Math.floor(value / 64) * 64;
};

const incrementDimension = async (dimension: "width" | "height") => {
  const newValue = Math.min(localSettings.value[dimension] + 64, 1920);
  updateSettings(dimension, newValue);
  await appStore.calculateImageCost(localSettings.value);
};

const decrementDimension = async (dimension: "width" | "height") => {
  const newValue = Math.max(localSettings.value[dimension] - 64, 64);
  updateSettings(dimension, newValue);
  await appStore.calculateImageCost(localSettings.value);
};

const applyResolution = async (value: number[]) => {
  if (value && value.length === 2) {
    updateSettings("width", value[0]);
    updateSettings("height", value[1]);
    selectedResolution.value = appStore.resolutions.find(r => 
      r.value[0] === value[0] && r.value[1] === value[1]
    ) || null;
    await appStore.calculateImageCost(localSettings.value);
  }
};
const saveSettings = async () => {
  try {
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

const generateRandomSeed = () => {
  return Math.floor(Math.random() * 2147483647)
};

const incrementCfg = () => {
  updateSettings('cfg', Math.min(localSettings.value.cfg + 1, 14));
};

const decrementCfg = () => {
  updateSettings('cfg', Math.max(localSettings.value.cfg - 1, 1));
};
</script>

<template>
  <div class="settings-container p-fluid">
    <div class="field">
      <span class="p-text-secondary"
      ><strong>{{ appStore.siteContent?.image_cost }}:</strong></span>
          {{ appStore.imageCost }} 🥕
    </div>
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
            :disabled="feature.disabled"
            @change="updateSettings('features', localSettings.features)"
          />
          <label 
            :for="feature.value" 
            class="feature-label"
            :class="{ 'disabled-label': feature.disabled }"
          >
            {{ feature.label }}
          </label>
        </div>
      </div>
    </div>
    <div class="field">
      <label for="model">{{ appStore.siteContent?.settings_model }}</label>
      <Dropdown
        id="model"
        v-model="localSettings.model"
        :options="appStore.modelNames"
        @change="updateSettings('model', $event.value)"
        :placeholder="appStore.siteContent?.settings_model"
        class="dropdown-white-bg"
      />
    </div>
    <div class="field">
      <label for="resolution">{{
        appStore.siteContent?.settings_resolution
      }}</label>
      <Dropdown
        id="resolution"
        v-model="currentResolution"
        :options="appStore.resolutions"
        option-label="label"
        option-value="value"
        @change="applyResolution($event.value)"
        :placeholder="appStore.siteContent?.settings_resolution"
        class="dropdown-white-bg"
      />
    </div>

    <div class="dimensions-single-line">
  <div class="dimension-group">
    <span>{{ appStore.siteContent?.settings_width }}</span>
    <div class="dimension-controls">
            <div class="dimension-buttons">
        <Button
          label="↑"
          @click="incrementDimension('width')"
          class="p-button-text dimension-button"
          :disabled="localSettings.width >= 1920"
        />
        <Button
          label="↓"
          @click="decrementDimension('width')"
          class="p-button-text dimension-button"
          :disabled="localSettings.width <= 64"
        />
      </div>
      <InputNumber
        v-model="localSettings.width"
        :min="64"
        :max="1920"
        :step="64"
        disabled
        @update:modelValue="
          (val: number) => updateSettings('width', validateDimension(val))
        "
        class="compact-input"
      />
    </div>
  </div>

  <Button
    label="&#x21c6;"
    @click="swapDimensions"
    class="p-button-text"
    aria-label="Swap dimensions"
    :style="{'font-size': '2rem'}"
  />

  <div class="dimension-group">
    <span>{{ appStore.siteContent?.settings_height }}</span>
    <div class="dimension-controls">
      <InputNumber
        v-model="localSettings.height"
        :min="64"
        :max="1920"
        :step="64"
        disabled
        @update:modelValue="
          (val: number) => updateSettings('height', validateDimension(val))
        "
        class="compact-input"
      />
      <div class="dimension-buttons">
        <Button
          label="↑"
          @click="incrementDimension('height')"
          class="p-button-text dimension-button"
          :disabled="localSettings.height >= 1920"
        />
        <Button
          label="↓"
          @click="decrementDimension('height')"
          class="p-button-text dimension-button"
          :disabled="localSettings.height <= 64"
        />
      </div>
    </div>
  </div>
    </div>

    <Button 
      v-if="!showAdvancedSettings"
      label="▼"
      @click="showAdvancedSettings = true"
      class="p-button-text"
      icon="pi pi-angle-down"
    />

    <div v-if="showAdvancedSettings">
      <Button 
        label="▲"
        @click="showAdvancedSettings = false"
        class="p-button-text"
        icon="pi pi-angle-up"
      />

      <!-- Seed Field -->
      <div class="field">
  <label>{{ appStore.siteContent?.settings_seed }}</label>
  <div class="seed-container">
    <InputNumber
      v-model="localSettings.seed"
      mode="decimal"
      :min="1"
      :max="Number.MAX_SAFE_INTEGER"
      :step="1"
      :useGrouping="false"
      @update:modelValue="(val: number | null) => updateSettings('seed', val)"
      class="w-full"
    />
    <div class="seed-buttons">
      <Button
        label="&#127922"
        @click="updateSettings('seed', generateRandomSeed())"
        class="p-button-text dimension-button"
      />
      <Button
        label="❌"
        @click="updateSettings('seed', null)"
        class="p-button-text dimension-button"
      />
    </div>
  </div>
</div>

      <div class="settings-line">
      <!-- Steps Field -->
      <div class="field">
        <span>{{ appStore.siteContent?.settings_steps }}</span>
        <div class="dimension-controls">
          <InputNumber
            v-model="localSettings.steps"
            :min="1"
            :max="50"
            :step="1"
            @update:modelValue="(val: number) => updateSettings('steps', val)"
            class="dimension-input"
          />
          <div class="dimension-buttons">
            <Button
              label="↑"
              @click="updateSettings('steps', Math.min(localSettings.steps + 1, 50))"
              class="p-button-text dimension-button"
              :disabled="localSettings.steps >= 50"
            />
            <Button
              label="↓"
              @click="updateSettings('steps', Math.max(localSettings.steps - 1, 1))"
              class="p-button-text dimension-button"
              :disabled="localSettings.steps <= 1"
            />
          </div>
        </div>
      </div>

      <!-- CFG Field -->
      <div class="field">
        <span>{{ appStore.siteContent?.settings_cfg || 'CFG Scale' }}</span>
        <div class="dimension-controls">
          <InputNumber
            v-model="localSettings.cfg"
            :min="1"
            :max="14"
            :step="1"
            @update:modelValue="(val: number) => updateSettings('cfg', val)"
            class="dimension-input"
          />
          <div class="dimension-buttons">
            <Button
              label="↑"
              @click="incrementCfg"
              class="p-button-text dimension-button"
              :disabled="localSettings.cfg >= 14"
            />
            <Button
              label="↓"
              @click="decrementCfg"
              class="p-button-text dimension-button"
              :disabled="localSettings.cfg <= 1"
            />
          </div>
        </div>
      </div>
    </div>

      <!-- Negative Prompt Field -->
      <div class="field">
        <label>{{ appStore.siteContent?.settings_negative }}</label>
        <Textarea
          v-model="localSettings.negative"
          :placeholder="appStore.siteContent?.settings_negative"
          rows="3"
          autoResize
          class="negative-prompt-textarea"
        />
      </div>
    </div>

    <!-- Save Button -->
    <div class="buttons-container">
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
  </div>
</template>

<style scoped>
label {
  display: block;
  margin-bottom: 0.5rem;
}
.w-full {
  width: 100%;
}
.settings-container {
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  max-width: 400px;
}
.dimensions-single-line {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 1rem 0;
  margin-bottom: 0;
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

.swap-button {
  margin: 0 0.5rem;
  font-size: 1.25rem;
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

.buttons-container {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 1rem;
}
.slider-container {
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
}

.slider-cfg {
  width: 100%;
  max-width: 400px;
}

.slider-cfg ::v-deep(.p-slider-handle) {
  background: #3b82f6;
  border: 2px solid white;
  width: 1.2rem;
  height: 1.2rem;
}

.negative-prompt-textarea {
  width: 100%;
  max-height: 200px;
  overflow-y: auto;
  resize: none;
}

.settings-line {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin: 1rem 0;
}

.dimension-input {
  width: 80px;
}
.seed-container {
  position: relative;
}

.seed-buttons {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  gap: 0.25rem;
}

.features {
  display: flex;
  flex-direction: row;
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
}

.disabled-label {
  color: #999;
  cursor: not-allowed;
}
</style>
