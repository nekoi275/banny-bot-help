<script setup lang="ts">
import { computed } from "vue";
import Galleria from "primevue/galleria";
import type { Model } from "@/utils/types";

const props = defineProps<{
  model: Model;
}>();
console.log(props.model);
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
    <!-- Заголовок с ссылкой -->
    <a
      v-if="modelHomepage"
      :href="modelHomepage"
      target="_blank"
      rel="noopener noreferrer"
    >
      {{ model.name }}
    </a>
    <h2 v-else>{{ model.name }}</h2>

    <!-- Галерея изображений -->
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

    <!-- Описание -->
    <div class="description" v-if="model.description">
      <h3>Description:</h3>
      <p>{{ model.description }}</p>
    </div>

    <!-- Детали модели -->
    <div class="details">
      <p v-if="model.style"><strong>Style:</strong> {{ model.style }}</p>
      <p v-if="model.baseline">
        <strong>Baseline:</strong> {{ model.baseline }}
      </p>
      <p v-if="model.nsfw !== undefined">
        <strong>NSFW:</strong> {{ model.nsfw ? "Yes" : "No" }}
      </p>
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
  font-size: 24pt;
}
.card a:link {
  text-decoration: none;
}
.card a:visited {
  text-decoration: none;
}
.card a:hover {
  text-decoration: none;
}
.card a:active {
  text-decoration: none;
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
