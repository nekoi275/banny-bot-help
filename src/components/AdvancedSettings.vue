<script setup lang="ts">
import InputNumber from "primevue/inputnumber";
import Button from "primevue/button";
import Textarea from "primevue/textarea";

defineProps<{
  seed: number | null;
  steps: number;
  cfg: number;
  negative: string;
  siteContent: any;
}>();

const emit = defineEmits<{
  (e: "update:seed", value: number | null): void;
  (e: "update:steps", value: number): void;
  (e: "update:cfg", value: number): void;
  (e: "update:negative", value: string): void;
}>();

const generateRandomSeed = () => {
  return Math.floor(Math.random() * 2147483647);
};

const incrementCfg = (currentCfg: number) => {
  emit("update:cfg", Math.min(currentCfg + 1, 14));
};

const decrementCfg = (currentCfg: number) => {
  emit("update:cfg", Math.max(currentCfg - 1, 1));
};

const updateSteps = (val: number) => {
  emit("update:steps", val);
};

const updateCfg = (val: number) => {
  emit("update:cfg", val);
};

const updateSeed = (val: number | null) => {
  emit("update:seed", val);
};

const updateNegative = (val: string) => {
  emit("update:negative", val);
};
</script>

<template>
  <div class="advanced-settings">
    <div>
      <label>{{ siteContent?.settings_seed }}</label>
      <div class="seed-container">
        <InputNumber
          :model-value="seed"
          mode="decimal"
          :min="1"
          :max="Number.MAX_SAFE_INTEGER"
          :step="1"
          :useGrouping="false"
          @update:modelValue="updateSeed"
          class="w-full"
        />
        <div class="seed-buttons">
          <Button
            label="&#127922"
            @click="emit('update:seed', generateRandomSeed())"
            class="p-button-text dimension-button"
          />
          <Button
            label="❌"
            @click="emit('update:seed', null)"
            class="p-button-text dimension-button"
          />
        </div>
      </div>
    </div>

    <div class="settings-line">
      <!-- Steps Field -->
      <div>
        <span>{{ siteContent?.settings_steps }}</span>
        <div class="dimension-controls">
          <InputNumber
            :model-value="steps"
            :min="1"
            :max="50"
            :step="1"
            @update:modelValue="updateSteps"
            class="dimension-input"
          />
          <div class="dimension-buttons">
            <Button
              label="↑"
              @click="emit('update:steps', Math.min(steps + 1, 50))"
              class="p-button-text dimension-button"
              :disabled="steps >= 50"
            />
            <Button
              label="↓"
              @click="emit('update:steps', Math.max(steps - 1, 1))"
              class="p-button-text dimension-button"
              :disabled="steps <= 1"
            />
          </div>
        </div>
      </div>

      <div>
        <span>{{ siteContent?.settings_cfg || 'CFG Scale' }}</span>
        <div class="dimension-controls">
          <InputNumber
            :model-value="cfg"
            :min="1"
            :max="14"
            :step="1"
            @update:modelValue="updateCfg"
            class="dimension-input"
          />
          <div class="dimension-buttons">
            <Button
              label="↑"
              @click="incrementCfg(cfg)"
              class="p-button-text dimension-button"
              :disabled="cfg >= 14"
            />
            <Button
              label="↓"
              @click="decrementCfg(cfg)"
              class="p-button-text dimension-button"
              :disabled="cfg <= 1"
            />
          </div>
        </div>
      </div>
    </div>

    <div>
      <label>{{ siteContent?.settings_negative }}</label>
      <Textarea
        :model-value="negative"
        @update:modelValue="updateNegative"
        :placeholder="siteContent?.settings_negative"
        rows="3"
        autoResize
        class="negative-prompt-textarea"
      />
    </div>
  </div>
</template>

<style scoped>
label {
  display: block;
  margin-bottom: 0.5rem;
}
.advanced-settings{
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}
.w-full {
  width: 100%;
}
.settings-line {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}
.dimension-controls {
  display: flex;
  gap: 0.25rem;
  align-items: center;
}
.dimension-input {
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
.negative-prompt-textarea {
  width: 100%;
  max-height: 200px;
  overflow-y: auto;
  resize: none;
}
</style>
