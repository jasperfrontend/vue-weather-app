<template>
  <v-app>
    <v-main>
      <router-view />
      <p class="text-center my-3">Powered by 
        <a href="https://vuejs.org" target="_blank">Vue.js</a>, 
        <a href="https://vuetifyjs.com/" target="_blank">Vuetify</a> and the 
        <a href="https://openweathermap.org/" target="_blank">OpenWeatherMap API</a>
      </p>
    </v-main>
  </v-app>
</template>

<style scoped>
p {font-size: 13px;}
</style>
