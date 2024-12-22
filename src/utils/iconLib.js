import { ref } from "vue";
const returnIcon = ref(null);

const iconLib = (iconCode) => {
  if (!iconCode) return;
  const expr = iconCode;
  switch (expr) {
    case '01d': // clear sky (day)
      returnIcon.value = 'hugeicons:sun-03';
      break;
    case '02d': // few clouds (day)
      returnIcon.value = 'hugeicons:sun-cloud-01';
      break;
    case '03d': // scattered clouds (day)
      returnIcon.value = 'hugeicons:cloud';
      break;
    case '04d': // broken clouds (day)
      returnIcon.value = 'hugeicons:cloud';
      break;
    case '09d': // shower rain (day)
      returnIcon.value = 'hugeicons:cloud-little-rain';
      break;
    case '10d': // rain (day)
      returnIcon.value = 'hugeicons:cloud-angled-rain';
      break;
    case '11d': // thunderstorm (day)
      returnIcon.value = 'hugeicons:cloud-angled-rain-zap';
      break;
    case '13d': // snow (day)
      returnIcon.value = 'hugeicons:cloud-mid-snow';
      break;
    case '50d': // mist (day)
      returnIcon.value = 'hugeicons:slow-winds';
      break;
    case '01n': // clear sky (night)
      returnIcon.value = 'hugeicons:moon-02';
      break;
    case '02n': // few clouds  (night)
      returnIcon.value = 'hugeicons:moon-cloud';
      break;
    case '03n': // scattered clouds  (night)
      returnIcon.value = 'hugeicons:moon-cloud';
      break;
    case '04n': // broken clouds  (night)
      returnIcon.value = 'hugeicons:moon-cloud';
      break;
    case '09n': // shower rain  (night)
      returnIcon.value = 'hugeicons:moon-cloud-little-rain';
      break;
    case '10n': // rain (night)
      returnIcon.value = 'hugeicons:moon-cloud-angled-rain';
      break;
    case '11n': // thunderstorm (night)
      returnIcon.value = 'hugeicons:moon-angled-rain-zap';
      break;
    case '13n': // snow (night)
      returnIcon.value = 'hugeicons:moon-cloud-mid-snow';
      break;
    case '50n': // mist (night)
      returnIcon.value = 'hugeicons:moon-slow-wind';
      break;
    default:
      console.log(`Sorry, no icon found for "${expr}".`);
  }
  return returnIcon.value;
}


export default iconLib