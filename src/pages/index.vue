<template>
  <div class="d-flex justify-center align-center h-100 w-100">
    <div class="weather-app">
      <!-- City Input Field -->
      <v-text-field
        v-if="errorGeo"
        clearable
        autofocus
        label="Enter a city"
        v-model="manualWeatherCity"
      />

      <!-- Alert for errors -->
      <VuetifyAlert v-if="errorData" :alertData="errorData" />

      <!-- Weather Data Display -->
      <div v-if="weatherData || manualWeatherCity && !errorGeo">
        <WeatherCard 
          :avatar="weatherIcon"
          :title="weatherCity" 
          :subtitle="temperatureString" 
          :text="dailyWeatherSummary"
          :subtext="minMaxTempsString"
          :humidity="currentHumidity"
        />
        <v-btn class="my-2" @click.prevent="fetchWeather2(userLat, userLong)">Refresh</v-btn>
      </div>

      <!-- Loading Skeleton -->
      <!-- <div v-else>
        <v-skeleton-loader type="list-item-avatar-two-line, paragraph" />
      </div> -->

    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import debounce from 'lodash.debounce';
import axios from 'axios';
import WeatherCard from '@/components/WeatherCard.vue';
import VuetifyAlert from '@/components/VuetifyAlert.vue';

// Reactive state
const weatherData = ref(null);
const weatherCity = ref('');
const manualWeatherCity = ref('');
const errorData = ref(null);
const userLat = ref(null);
const userLong = ref(null);
const errorGeo = ref(false);

// Geolocation handling
if ("geolocation" in navigator) {
  errorGeo.value = false;
  navigator.geolocation.getCurrentPosition(
    (position) => {
      userLat.value = position.coords.latitude;
      userLong.value = position.coords.longitude;
      fetchWeather2(userLat.value, userLong.value);
    },
    (error) => {
      // console.error("Geolocation error:", error.message);
      errorGeo.value = true; // Show text input for city
      errorData.value = {
        closeable: true,
        icon: "mdi-alert-circle",
        title: "Manual input required",
        text: `${error.message}`,
        type: "info", // https://vuetifyjs.com/en/api/v-alert/#props-type
        variant: "outlined"
      }
    }
  );
} else {
  console.error("Geolocation not supported.");
  errorGeo.value = true; // Show text input for city
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

// API calls
const fetchLatLon = async (city) => {
  try {
    if (!city) return;
    const API_KEY = import.meta.env.VITE_OPENWEATHERAPI_KEY;
    const response = await axios.get(
      `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`
    );
    const location = response.data[0];
    if(location) {
      userLat.value = location.lat;
      userLong.value = location.lon;
      weatherCity.value = `${location.name}, ${location.country}`;
      
      await fetchWeather2(userLat.value, userLong.value);
    } else {
      errorData.value = {
        closeable: true,
        icon: "mdi-alert-circle",
        title: "Error",
        text: "Failed to fetch location data. Please check the city name.",
        type: "error",
        variant: "outlined"
      };
    }
  } catch (error) {
    console.error("Error fetching lat/lon:", error);
    errorData.value = {
      closeable: true,
      icon: "mdi-alert-circle",
      title: "Error",
      text: "Failed to fetch location data. Please check the city name.",
      type: "error",
      variant: "outlined"
    };
  }
};

const fetchWeather2 = async (lat, lon) => {
  try {
    if (!lat && !lon) return;
    const API_KEY = import.meta.env.VITE_OPENWEATHERAPI_KEY;
    const response = await axios.get(
      `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&appid=${API_KEY}&units=metric`
    );

    weatherData.value = response.data;

    // fetch city name with lat/long data
    await fetchCity(userLat.value, userLong.value, 1);

    errorData.value = null; // Clear errors if successful
  } catch (error) {
    console.error("Error fetching weather data:", error);
    errorData.value = {
      closeable: true,
      icon: "mdi-alert-circle",
      title: "Error",
      text: `Failed to fetch weather data: ${error}`,
      type: "error",
      variant: "outlined"
    };
  }
};

// Debounced fetchWeather2 when manual city changes
const debouncedFetchLatLon = debounce(() => {
  if (manualWeatherCity.value) {
    fetchLatLon(manualWeatherCity.value);
  }
}, 500);

// Watcher for manual city input
watch(manualWeatherCity, () => {
  debouncedFetchLatLon();
});

// Computed properties
const temperatureString = computed(() => {
  return weatherData.value
    ? `${weatherData.value.current.temp.toFixed(1)}°C (Feels like ${weatherData.value.current.feels_like.toFixed(1)}°C)`
    : '';
});

const minMaxTempsString = computed(() => {
  return weatherData.value
    ? `Min / max temp: ${weatherData.value.daily[0].temp.min.toFixed(1)} / ${weatherData.value.daily[0].temp.max.toFixed(1)}°C`
    : '';
});

const weatherIcon = computed(() => {
  return weatherData.value
    ? `https://openweathermap.org/img/wn/${weatherData.value.current.weather[0].icon}@2x.png`
    : '';
});

const dailyWeatherSummary = computed(() => {
  return weatherData.value
    ? `${weatherData.value.daily[0].summary || ''}`
    : '';
});

const currentHumidity = computed(() => {
  return weatherData.value
    ? `${weatherData.value.current.humidity}% humidity`
    : '';
});
</script>

<style scoped>
.weather-app {
  width: 50vw;
}
@media (max-width: 1024px) {
  .weather-app {
    width: 95vw;
  }
}
</style>
