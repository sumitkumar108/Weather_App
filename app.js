// OpenWeatherMap API key
const API_KEY = '8a7ae88979e65d8d967c4973ef905c79'; 
// Function to fetch weather on page load (if there is a stored city)

// Function to fetch weather by city name
function fetchWeather() {
  const city = document.getElementById('city-input').value;
  if (!city) return alert('Please enter a city name');
   
  localStorage.setItem('lastSearchedCity', city);
    console.log("City saved to localStorage:", city);
  
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
  
  fetch(url)
    .then(response => response.json())
    .then(data => displayCurrentWeather(data))
    .catch(err => console.error(err));
}

// Function to fetch weather by current location
function fetchWeatherByLocation() {
  navigator.geolocation.getCurrentPosition(position => {
    const { latitude, longitude } = position.coords;
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`;
    
    fetch(url)
      .then(response => response.json())
      .then(data => displayCurrentWeather(data))
      .catch(err => console.error(err));
  });
}


// Function to display current weather
function displayCurrentWeather(data) {
  document.getElementById('city-name').textContent = `${data.name} (${new Date().toLocaleDateString()})`;
  document.getElementById('temperature').textContent = `Temperature: ${data.main.temp}°C`;
  document.getElementById('wind').textContent = `Wind: ${data.wind.speed} m/s`;
  document.getElementById('humidity').textContent = `Humidity: ${data.main.humidity}%`;
  document.getElementById('description').textContent = `${data.weather[0].description}`;

  document.getElementById('current-weather').classList.remove('hidden');
  fetchFiveDayForecast(data.coord.lat, data.coord.lon);
}

// Function to fetch 5-day weather forecast
function fetchFiveDayForecast(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
  
  fetch(url)
    .then(response => response.json())
    .then(data => displayFiveDayForecast(data))
    .catch(err => console.error(err));
}

// Function to display 5-day weather forecast
function displayFiveDayForecast(data) {
  const forecastDiv = document.getElementById('forecast');
  forecastDiv.innerHTML = '';  // Clear previous forecast data

  const forecasts = data.list.filter(forecast => forecast.dt_txt.includes('12:00:00'));  // Midday forecasts

  forecasts.forEach(forecast => {
    const forecastElement = document.createElement('div');
    forecastElement.classList.add('bg-gray-100', 'p-4', 'rounded-md', 'text-center');

    const date = new Date(forecast.dt_txt).toLocaleDateString();
    forecastElement.innerHTML = `
      <h4 class="text-lg font-bold">${date}</h4>
      <p>Temp: ${forecast.main.temp}°C</p>
      <p>Wind: ${forecast.wind.speed} m/s</p>
      <p>Humidity: ${forecast.main.humidity}%</p>
      <p>${forecast.weather[0].description}</p>
    `;

    forecastDiv.appendChild(forecastElement);
  });
}

document.getElementById('use-location-btn').addEventListener('click', function() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
  } else {
    alert("Geolocation is not supported by this browser.");
  }
});

function successCallback(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;

  console.log("Latitude:", lat, "Longitude:", lon);

  // Call the weather API with latitude and longitude
  fetchWeatherByLocation(lat, lon);
}

function errorCallback(error) {
  switch(error.code) {
    case error.PERMISSION_DENIED:
      alert("User denied the request for Geolocation. Please allow access to use this feature.");
      break;
    case error.POSITION_UNAVAILABLE:
      alert("Location information is unavailable.");
      break;
    case error.TIMEOUT:
      alert("The request to get user location timed out.");
      break;
    case error.UNKNOWN_ERROR:
      alert("An unknown error occurred.");
      break;
  }
}






