<script setup lang="ts">
  import { computed } from 'vue';
  import Galleria from 'primevue/galleria';

  const props = defineProps<{
    model: any
  }>()
  const civitaiUrl = computed(() => {
    return`https://civitai.com/models/${props.model.civitaiInfo.modelId}`
  });
</script>

<template>
  <div class="card">
    <a :href="civitaiUrl" target="_blank" rel="noopener noreferrer">{{ model.civitaiInfo.model.name }}</a>
    <Galleria :value="model.civitaiInfo.images" :circular="true" :showThumbnails="false"
    :showItemNavigators="false" :showItemNavigatorsOnHover="false" :showIndicators="true">
      <template #item="{ item }">
        <img :src="item.url" :alt="item.metadata.hash"/>
      </template>
      <template #thumbnail="{ item }">
        <img :src="item.url" :alt="item.metadata.hash" />
      </template>
    </Galleria>
    <span v-for="tag in model.civitaiInfo.model.tags" :key="tag">{{ `#${tag} ` }} </span>
    <p>Type: {{ model.civitaiInfo.baseModel }} {{ model.civitaiInfo.baseModelType }}</p>
  </div>
</template>

<style scoped>
  
  .card {
    padding: 1rem;
    border: 1px solid #ccc;
    border-radius: 8px;
    margin: 1rem;
  }
  .card a{
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
  }
  .p-galleria img {
    height: 400px;
    width: auto;
    max-width: 400px;
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
  