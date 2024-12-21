<script setup>
const props = defineProps({
  title: String,
  subtitle: String,
  text: String,
  subtext: String,
  avatar: String
})

</script>

<template>
  <v-card
    :prepend-avatar="avatar"
    :title="title"
    :subtitle="subtitle"
  >
    <v-card-text>
      <v-chip variant="tonal" color="indigo-accent-1" label class="mr-3">
        {{ text }}
      </v-chip>
      <v-chip variant="tonal" color="indigo-accent-1" label class="mr-3">
        {{ subtext }}
      </v-chip>
    </v-card-text>
  </v-card>
</template>