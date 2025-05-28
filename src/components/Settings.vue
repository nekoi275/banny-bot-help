<script setup lang="ts">
import type { UserSettings } from "@/utils/types";
import MultiSelect from 'primevue/multiselect';

const props = defineProps<{
  settings?: UserSettings;
  models: string[];
}>();

const modes = ["ROLEPLAY", "ROLEPLAY_ART", "ART"];
</script>

<template>

</template>

<style scoped></style>
