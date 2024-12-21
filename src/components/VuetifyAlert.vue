<script setup>
const props = defineProps({
  alertData: Object 
});
</script>

<template>
  <v-alert v-bind="alertData"></v-alert>
</template>