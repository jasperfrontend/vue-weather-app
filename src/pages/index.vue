<template>
  <div class="d-flex justify-center align-center h-100 w-100">
    <div class="weather-app">
      <!-- <v-text-field
        clearable
        autofocus
        focused
        label="Enter your city"
        hint="You can also append your country code like Rotterdam, US"
        
        v-model="weatherCity"
      /> -->

      <VuetifyAlert v-if="errorData" :alertData="errorData" />

      <div v-if="weatherData" class="ma-2">
        <!-- <pre>{{ weatherData }}</pre> -->        
        <WeatherCard 
          :avatar="weatherIcon"
          :title="weatherCity" 
          :subtitle="temperatureString" 
          :text="dailyWeatherSummary"
          :subtext="minMaxTempsString"
          :humidity="currentHumidity"
        />
        <v-btn v-if="weatherData" class="my-2" @click.prevent="fetchWeather2()">Refresh</v-btn>
      </div>
      <div v-else class="ma-2">
        <v-skeleton-loader 
          type="list-item-avatar-two-line, paragraph"
        >
        </v-skeleton-loader>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import axios from 'axios';
import WeatherCard from '@/components/WeatherCard.vue';
import VuetifyAlert from '@/components/VuetifyAlert.vue';

// Reactive state
const weatherData = ref(null);
const weatherCity = ref('');
const errorData = ref(null);
const userLat = ref(null);
const userLong = ref(null);

// Get location from user
// Check if geolocation is supported by the browser
if ("geolocation" in navigator) {
  // Prompt user for permission to access their location
  navigator.geolocation.getCurrentPosition(
    // Success callback function
    (position) => {
      // Get the user's latitude and longitude coordinates
      userLat.value = position.coords.latitude;
      userLong.value = position.coords.longitude;
      fetchWeather2();
    },
    // Error callback function
    (error) => {
      // Handle errors, e.g. user denied location sharing permissions
      console.error("Error getting user location:", error);
    }
  );
} else {
  // Geolocation is not supported by the browser
  // console.error("Geolocation is not supported by this browser.");
  alert('Geolocation is not supported by your browser. Sorry for that!')
}

async function fetchCity(lat, lon, limit = 1) {
  try {
    if (!userLat.value && !userLong.value) return;
    // we only need the API_KEY if the code above evals false
    const API_KEY = import.meta.env.VITE_OPENWEATHERAPI_KEY;
    const response = await axios.get(
      `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=${limit}&appid=${API_KEY}`
    );
    weatherCity.value = `${response.data[0].name}, ${response.data[0].country}`;
    
  } catch(error) {
    // in case of error, fill errorData object which can be passed to component VuetifyAlert
    errorData.value = {
      closeable: true,
      icon: "mdi-alert-circle",
      title: "Error",
      text: "Failed to fetch city data. Please check the lat/long data.",
      type: "error", // https://vuetifyjs.com/en/api/v-alert/#props-type
      variant: "outlined"
    }
  }
}

const fetchWeather2 = async () => {
  try {
    if (!userLat.value && !userLong.value) return;
    // we only need the API_KEY if the code above evals false
    const API_KEY = import.meta.env.VITE_OPENWEATHERAPI_KEY;
    const response = await axios.get(
      `https://api.openweathermap.org/data/3.0/onecall?lat=${userLat.value}&lon=${userLong.value}&exclude=minutely,hourly,alerts&appid=${API_KEY}&units=metric`
    );

    // shove response data into reactie weatherData.value
    weatherData.value = response.data;
    // fetch city name with lat/long data
    await fetchCity(userLat.value, userLong.value, 1);

    // Clear error data if reponse succeeded
    errorData.value = null; 

  } catch (error) {
    // in case of error, fill errorData object which can be passed to component VuetifyAlert
    errorData.value = {
      closeable: true,
      icon: "mdi-alert-circle",
      title: "Error",
      text: "Failed to fetch weather data. Please check the city name.",
      type: "error", // https://vuetifyjs.com/en/api/v-alert/#props-type
      variant: "outlined"
    }
  }
}


// Computed temperate and 'feels like' string
const temperatureString = computed(() => {
  return weatherData.value
    ? `${weatherData.value.current.temp.toFixed(1)}°C (Feels like ${weatherData.value.current.feels_like.toFixed(1)}°C)`
    : '';
});

// Computed min/max temperature string
const minMaxTempsString = computed(() => {
  return weatherData.value ? `Min / max temp: ${weatherData.value.daily[0].temp.min.toFixed(1)} / ${weatherData.value.daily[0].temp.max.toFixed(1)}°C` : '';
})

// Computed icon to represent the weather[0] status
const weatherIcon = computed(() => {
  return weatherData.value ? `https://openweathermap.org/img/wn/${weatherData.value.current.weather[0].icon}@2x.png` : '';
})

// Computed string daily weather summary
const dailyWeatherSummary = computed(() => {
  return weatherData.value
  ? `${weatherData.value.daily[0].summary}.`
  : '';
})

// Computed string current humidity
const currentHumidity = computed(() => {
  return weatherData.value
  ? `${weatherData.value.current.humidity}% humidity`
  : '';
})



</script>

<style scoped>
.weather-app {
  width: 50vw;
}
@media (max-width: 1024px) {
  .weather-app {
    width: 95vh;
  }
}
</style>