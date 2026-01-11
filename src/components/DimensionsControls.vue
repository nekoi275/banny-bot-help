<script setup lang="ts">
import { computed, ref, watch } from "vue";
import InputNumber from "primevue/inputnumber";
import Dropdown from "primevue/dropdown";
import Button from "primevue/button";

const props = defineProps<{
  width: number;
  height: number;
  resolutions: { value: number[]; label: string }[];
  siteContent: any;
}>();

const emit = defineEmits<{
  (e: "update:width", value: number): void;
  (e: "update:height", value: number): void;
}>();

const selectedResolution = ref<{ value: number[]; label: string } | null>(null);

const gcd = (a: number, b: number): number => {
  return b === 0 ? a : gcd(b, a % b);
};

const calculatedPlaceholder = computed(() => {
  if (props.width && props.height) {
    const divisor = gcd(props.width, props.height);
    return `${props.width / divisor}:${props.height / divisor}`;
  }
  return props.siteContent?.settings_resolution;
});

const currentResolution = computed({
  get: () => {
    const res = props.resolutions.find(
      (res) => res.value[0] === props.width && res.value[1] === props.height
    );
    return res || null;
  },
  set: (val) => {
    selectedResolution.value = val;
  }
});

const validateDimension = (value: number) => {
  if (value < 64) return 64;
  if (value > 1920) return 1920;
  return Math.floor(value / 64) * 64;
};

const updateWidth = (val: number) => {
  emit("update:width", validateDimension(val));
};

const updateHeight = (val: number) => {
  emit("update:height", validateDimension(val));
};

const incrementDimension = (dimension: "width" | "height") => {
  const currentValue = dimension === "width" ? props.width : props.height;
  const newValue = Math.min(currentValue + 64, 1920);
  if (dimension === "width") updateWidth(newValue);
  else updateHeight(newValue);
};

const decrementDimension = (dimension: "width" | "height") => {
  const currentValue = dimension === "width" ? props.width : props.height;
  const newValue = Math.max(currentValue - 64, 64);
  if (dimension === "width") updateWidth(newValue);
  else updateHeight(newValue);
};

const swapDimensions = () => {
  const newWidth = props.height;
  const newHeight = props.width;
  emit("update:width", newWidth);
  emit("update:height", newHeight);
};

const applyResolution = (value: number[]) => {
  if (value && value.length === 2) {
    emit("update:width", value[0]);
    emit("update:height", value[1]);
  }
};
</script>

<template>
  <div class="field">
    <label for="resolution">{{ siteContent?.settings_resolution }}</label>
    <Dropdown
      id="resolution"
      v-model="currentResolution"
      :options="resolutions"
      option-label="label"
      @change="applyResolution($event.value?.value)"
      :placeholder="calculatedPlaceholder"
      class="dropdown-white-bg"
    />
  </div>

  <div class="dimensions-single-line">
    <div class="dimension-group">
      <span>{{ siteContent?.settings_width }}</span>
      <div class="dimension-controls">
        <div class="dimension-buttons">
          <Button
            label="↑"
            @click="incrementDimension('width')"
            class="p-button-text dimension-button"
            :disabled="width >= 1920"
          />
          <Button
            label="↓"
            @click="decrementDimension('width')"
            class="p-button-text dimension-button"
            :disabled="width <= 64"
          />
        </div>
        <InputNumber
          :model-value="width"
          :min="64"
          :max="1920"
          :step="64"
          disabled
          @update:modelValue="(val: number) => updateWidth(val)"
          class="compact-input"
        />
      </div>
    </div>

    <Button
      label="&#x21c6;"
      @click="swapDimensions"
      class="p-button-text"
      aria-label="Swap dimensions"
      :style="{ 'font-size': '2rem' }"
    />

    <div class="dimension-group">
      <span>{{ siteContent?.settings_height }}</span>
      <div class="dimension-controls">
        <InputNumber
          :model-value="height"
          :min="64"
          :max="1920"
          :step="64"
          disabled
          @update:modelValue="(val: number) => updateHeight(val)"
          class="compact-input"
        />
        <div class="dimension-buttons">
          <Button
            label="↑"
            @click="incrementDimension('height')"
            class="p-button-text dimension-button"
            :disabled="height >= 1920"
          />
          <Button
            label="↓"
            @click="decrementDimension('height')"
            class="p-button-text dimension-button"
            :disabled="height <= 64"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
label {
  display: block;
  margin-bottom: 0.5rem;
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
