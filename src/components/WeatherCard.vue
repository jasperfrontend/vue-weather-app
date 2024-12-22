<script setup>
import { Icon } from '@iconify/vue';
const props = defineProps({
  title: String,
  subtitle: String,
  text: String,
  subtext: String,
  avatar: String,
  humidity: String,
  weatherIcon: String
})

</script>

<template>
  
  <v-card
    :title="title"
    :subtitle="subtitle"
    :text="text"
  >
    <template v-slot:prepend>
      <Icon class="mx-3" :icon="weatherIcon" :width="48" :height="48" />
    </template>  
    <v-card-text>
      <v-chip variant="tonal" color="indigo-accent-1" label class="mb-1 mr-3">
        {{ humidity }}
      </v-chip>
      <v-chip variant="tonal" color="indigo-accent-1" label class="mb-1 mr-3">
        {{ subtext }}
      </v-chip>
    </v-card-text>
  </v-card>
</template>