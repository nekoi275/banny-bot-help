<script setup lang="ts">
import { computed } from "vue";
import Galleria from "primevue/galleria";
import type { Model } from "@/utils/types";

const props = defineProps<{
  model: Model;
}>();
const modelHomepage = computed(() => {
  return props.model?.homepage;
});

const modelImages = computed(() => {
  if (!props.model?.showcases || !Array.isArray(props.model.showcases)) {
    return [];
  }
  return props.model.showcases.map((url) => ({
    url,
    alt: props.model?.name || "Model image",
  }));
});

const hasImages = computed(() => {
  return modelImages.value.length > 0;
});
</script>

<template>
  <div class="card" v-if="model">
    <a
      v-if="modelHomepage"
      :href="modelHomepage"
      target="_blank"
      rel="noopener noreferrer"
    >
      {{ model.name }}
    </a>
    <h2 v-else>{{ model.name }}</h2>
    <p v-if="model.nsfw !== undefined">
      {{ model.nsfw ? "&#128286" : "" }}
    </p>
    <p v-if="model.style">{{ model.style }}</p>
    <p v-if="model.baseline">{{ model.baseline === "stable_diffusion_xl" ? "SDXL" : "SD" }}</p>

    <Galleria
      v-if="hasImages"
      :value="modelImages"
      :circular="true"
      :showThumbnails="false"
      :showItemNavigators="false"
      :showItemNavigatorsOnHover="false"
      :showIndicators="true"
    >
      <template #item="{ item }">
        <img
          :src="item.url"
          :alt="item.alt"
          style="max-height: 400px; object-fit: contain"
        />
      </template>
    </Galleria>

    <div class="description" v-if="model.description">
      <p>{{ model.description }}</p>
    </div>
  </div>
</template>

<style scoped>
.card {
  padding: 1rem;
  border: 1px solid #2e4392;
  border-radius: 8px;
  margin: 1rem;
}
.card a {
  font-size: 18pt;
}
.card p {
  display: inline;
  margin-left: 3px;
}
.p-galleria {
  margin: auto;
  width: 400px;
  margin-top: 20px;
}
.p-galleria img {
  height: 400px;
  width: auto;
  max-width: 400px;
}
.description {
  margin-bottom: 20px;
  margin-top: 20px;
}
@media (max-width: 800px) {
  .p-galleria {
    width: 250px;
  }
  .p-galleria img {
    height: 250px;
    max-width: 250px;
  }
}
</style>
