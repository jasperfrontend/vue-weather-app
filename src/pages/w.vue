<script setup>
import { ref } from 'vue';


</script>

<template>
  <div class="d-flex w-100 h-100">
    Hi, W!
    <v-btn to="/">Go to /</v-btn>
  </div>
</template>

<!-- TODO 
1. make api functions:
  - get weather data from lat/long
  - get lat/long data from city
  - save current location to Pinia State
  - then check if state exists, else do api call
  - make entering a custom city an optional thing, even when location access is allowed
-->
