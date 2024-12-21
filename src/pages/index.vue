<template>
  <div class="d-flex justify-center align-center h-100 w-100">
    <div class="w-50">
      <v-text-field
        clearable
        focused
        label="Enter your city"
        v-model="weatherCity"
      />

      <VuetifyAlert v-if="errorData" :alertData="errorData" />
      <div v-if="weatherData">
        <WeatherCard 
          :avatar="weatherIcon"
          :title="weatherData.name" 
          :subtitle="temperatureString" 
          :text="weatherDescriptionString"
          :subtext="minMaxTempsString"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import axios from 'axios';
import debounce from 'lodash.debounce'; 
import WeatherCard from '@/components/WeatherCard.vue';
import VuetifyAlert from '@/components/VuetifyAlert.vue';

// Reactive state
const weatherData = ref(null);
const weatherCity = ref('');
const errorData = ref(null);
const weatherDescriptionString = ref(null);


// Function to fetch weather data
const fetchWeather = async () => {
  try {
    if (!weatherCity.value) return;
    // we only need the API_KEY if the code above evals false
    const API_KEY = import.meta.env.VITE_OPENWEATHERAPI_KEY;
    // call openweathermap api with entered city and api key
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${weatherCity.value}&appid=${API_KEY}&units=metric`
    );
    // shove response data into reactie weatherData.value
    weatherData.value = response.data;
    // Clear error data if reponse succeeded
    errorData.value = null; 
    // Generate sentence from weather data
    weatherDescriptionString.value = capitalizeFirstLetter(generateweatherDescriptionString(response.data.weather));

  } catch (error) {

    // in case of error, fill errorData object which can be passed to component VuetifyAlert
    errorData.value = {
      closeable: true,
      icon: "mdi-alert-circle",
      title: "Error",
      text: "Failed to fetch weather data. Please check the city name.",
      type: "error", // https://vuetifyjs.com/en/api/v-alert/#props-type
      variant: "outlined"
    };

    // Clear weather data if an error occurs
    weatherData.value = null; 
    
  }
};

// Computed temperate and 'feels like' string
const temperatureString = computed(() => {
  return weatherData.value
    ? `${weatherData.value.main.temp.toFixed(1)}°C (Feels ${weatherData.value.main.feels_like.toFixed(1)}°C man)`
    : '';
});

// Computed min/max temperature string
const minMaxTempsString = computed(() => {
  return weatherData.value ? `Min / max temp: ${weatherData.value.main.temp_min.toFixed(1)} / ${weatherData.value.main.temp_max.toFixed(1)}°C` : '';
})

// Computed icon to represent the weather[0] status
const weatherIcon = computed(() => {
  return weatherData.value ? `https://openweathermap.org/img/wn/${weatherData.value.weather[0].icon}@2x.png` : '';
})

// Generate a nice string of text from the weather statuses
const generateweatherDescriptionString = (weatherArray) => {
  if (!weatherArray || weatherArray.length === 0) return '';

  // Combine `main` and `description` for each weather item
  const descriptions = weatherArray.map((weather) => {
    return `${weather.description.toLowerCase()}`;
  });

  // Join descriptions with "with"
  return descriptions.length === 1
    ? descriptions[0] // Single weather condition
    : descriptions.join(' with '); // Multiple conditions
};

// Function to capitalise the first letter of a string
const capitalizeFirstLetter = (sentence) => {
  return sentence.charAt(0).toUpperCase() + sentence.slice(1);
};

// Debounce the input for 800ms to reduce API calls to the openweather api
const debouncedFetchWeather = debounce(fetchWeather, 800);

watch(
  weatherCity,
  () => {
    debouncedFetchWeather();
  }
);

</script>
