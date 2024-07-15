document.getElementById('fetch-weather').addEventListener('click', () => {
    const location = document.getElementById('location-input').value;
    if (location) {
        fetchWeatherByLocation(location);
    } else {
        fetchWeatherByGeolocation();
    }
});

function fetchWeatherByLocation(location) {
    fetch(`https://api.weatherapi.com/v1/current.json?key=c6fefb313a7147969f745146241507&q=${location}`)
        .then(response => response.json())
        .then(data => {
            fetchWeatherDetails(data.location.lat, data.location.lon);
        })
        .catch(error => {
            console.error('Error fetching location data:', error);
        });
}

function fetchWeatherByGeolocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            fetchWeatherDetails(latitude, longitude);
        }, (error) => {
            console.error('Geolocation error:', error);
            alert('Unable to retrieve your location');
        });
    } else {
        alert('Geolocation is not supported by your browser');
    }
}

function fetchWeatherDetails(lat, lon) {
    const weatherUrl = `https://api.weatherapi.com/v1/forecast.json?key=c6fefb313a7147969f745146241507&q=${lat},${lon}&days=7&aqi=no&alerts=no`;

    fetch(weatherUrl)
        .then(response => response.json())
        .then(data => {
            displayCurrentWeather(data);
            displayHourlyForecast(data.forecast.forecastday[0].hour);
            displayDailyForecast(data.forecast.forecastday);
        })
        .catch(error => {
            console.error('Error fetching weather details:', error);
        });
}

function displayCurrentWeather(data) {
    const weatherInfo = document.getElementById('weather-info');
    const current = data.current;
    const location = data.location;

    weatherInfo.innerHTML = `
        <h2>Weather in ${location.name}, ${location.country}</h2>
        <img src="${current.condition.icon}" alt="${current.condition.text}">
        <p>Temperature: ${current.temp_c}°C</p>
        <p>Condition: ${current.condition.text}</p>
        <p>Wind Speed: ${current.wind_kph} kph</p>
        <p>Cloud Cover: ${current.cloud}%</p>
        <p>Sunrise: ${data.forecast.forecastday[0].astro.sunrise}</p>
        <p>Sunset: ${data.forecast.forecastday[0].astro.sunset}</p>
    `;

    weatherInfo.style.animation = 'fadeIn 1s ease-in-out, slideIn 1s ease-out';
}

function displayHourlyForecast(hourlyData) {
    const hourlyForecast = document.getElementById('hourly-forecast');
    const forecastGrid = hourlyForecast.querySelector('.forecast-grid');
    forecastGrid.innerHTML = '';

    for (let i = 0; i < 12; i++) {
        const hour = hourlyData[i];
        forecastGrid.innerHTML += `
            <div>
                <p>${hour.time.split(' ')[1]}</p>
                <img src="${hour.condition.icon}" alt="${hour.condition.text}">
                <p>${hour.temp_c}°C</p>
                <p>${hour.condition.text}</p>
                <p>Wind: ${hour.wind_kph} kph</p>
            </div>
        `;
    }

    hourlyForecast.style.animation = 'fadeIn 1s ease-in-out, slideIn 1s ease-out';
}

function displayDailyForecast(dailyData) {
    const dailyForecast = document.getElementById('daily-forecast');
    const forecastGrid = dailyForecast.querySelector('.forecast-grid');
    forecastGrid.innerHTML = '';

    for (let i = 0; i < dailyData.length; i++) {
        const day = dailyData[i];
        forecastGrid.innerHTML += `
            <div>
                <p>${new Date(day.date).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                <img src="${day.day.condition.icon}" alt="${day.day.condition.text}">
                <p>Max: ${day.day.maxtemp_c}°C</p>
                <p>Min: ${day.day.mintemp_c}°C</p>
                <p>${day.day.condition.text}</p>
                <p>Wind: ${day.day.maxwind_kph} kph</p>
            </div>
        `;
    }

    dailyForecast.style.animation = 'fadeIn 1s ease-in-out, slideIn 1s ease-out';
}
