// API Configuration
const OPENWEATHER_API_KEY = '30b9143227dd2694177c5a60c519b936';
const OPENWEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather';

// DOM Elements
const themeToggle = document.getElementById('themeToggle');
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const cityName = document.getElementById('cityName');
const currentDate = document.getElementById('currentDate');
const weatherIcon = document.getElementById('weatherIcon');
const temperature = document.getElementById('temperature');
const weatherCondition = document.getElementById('weatherCondition');
const windSpeed = document.getElementById('windSpeed');
const humidity = document.getElementById('humidity');
const pressure = document.getElementById('pressure');
const sunMoon = document.getElementById('sunMoon');
const rainEffect = document.getElementById('rainEffect');
const snowEffect = document.getElementById('snowEffect');
const windEffect = document.getElementById('windEffect');
const fogEffect = document.getElementById('fogEffect');
const errorMessage = document.getElementById('errorMessage');
const body = document.body;
const placeButtons = document.querySelectorAll('.place-btn');

// Current weather data
let currentWeatherData = null;

// Theme toggle functionality
themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark');
    body.classList.toggle('light');
    updateWeatherAnimations();
});

// Search functionality
searchBtn.addEventListener('click', searchWeather);
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchWeather();
});

// Add event listeners to place buttons
placeButtons.forEach(button => {
    button.addEventListener('click', () => {
        const city = button.getAttribute('data-city');
        cityInput.value = city;
        fetchWeatherData(city);
    });
});

// Initialize with default snowy place
fetchWeatherData('Gulmarg');

async function fetchWeatherData(city) {
    try {
        searchBtn.classList.add('loading');
        errorMessage.style.display = 'none';
        
        const response = await fetch(
            `${OPENWEATHER_API_URL}?q=${city},IN&appid=${OPENWEATHER_API_KEY}&units=metric`
        );
        
        if (!response.ok) throw new Error('Location not found');
        
        const data = await response.json();
        currentWeatherData = data;
        displayWeather(data);
    } catch (error) {
        console.error('Error:', error);
        errorMessage.style.display = 'block';
    } finally {
        searchBtn.classList.remove('loading');
    }
}

function searchWeather() {
    const city = cityInput.value.trim();
    if (city) fetchWeatherData(city);
}

function displayWeather(data) {
    cityName.textContent = data.name;
    temperature.textContent = Math.round(data.main.temp);
    weatherCondition.textContent = data.weather[0].main;
    windSpeed.textContent = `${data.wind.speed} km/h`;
    humidity.textContent = `${data.main.humidity}%`;
    pressure.textContent = `${data.main.pressure} hPa`;
    
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    currentDate.textContent = now.toLocaleDateString('en-US', options);
    
    updateWeatherIcon(data.weather[0].id);
    updateWeatherAnimations();
}

function updateWeatherIcon(conditionCode) {
    let iconClass;
    
    if (conditionCode >= 200 && conditionCode < 300) {
        iconClass = 'fas fa-bolt';
    } else if (conditionCode >= 300 && conditionCode < 400) {
        iconClass = 'fas fa-cloud-rain';
    } else if (conditionCode >= 500 && conditionCode < 600) {
        iconClass = 'fas fa-cloud-showers-heavy';
    } else if (conditionCode >= 600 && conditionCode < 700) {
        iconClass = 'fas fa-snowflake';
    } else if (conditionCode >= 700 && conditionCode < 800) {
        iconClass = 'fas fa-smog';
    } else if (conditionCode === 800) {
        iconClass = 'fas fa-sun';
    } else {
        iconClass = 'fas fa-cloud';
    }
    
    weatherIcon.innerHTML = `<i class="${iconClass}"></i>`;
}

function updateWeatherAnimations() {
    if (!currentWeatherData) return;
    
    // Reset animations
    rainEffect.style.display = 'none';
    snowEffect.style.display = 'none';
    windEffect.style.display = 'none';
    fogEffect.style.display = 'none';
    windEffect.innerHTML = '';
    rainEffect.innerHTML = '';
    snowEffect.innerHTML = '';
    fogEffect.innerHTML = '';
    
    // Day/night animation
    const isDarkMode = body.classList.contains('dark');
    sunMoon.className = 'sun-moon';
    sunMoon.classList.add(isDarkMode ? 'moon' : 'sun');
    
    // Weather-based animations
    const conditionCode = currentWeatherData.weather[0].id;
    const windSpeedValue = currentWeatherData.wind.speed;
    
    // Snow animation (priority)
    if (conditionCode >= 600 && conditionCode < 700) {
        snowEffect.style.display = 'block';
        createSnowflakes();
    } 
    // Rain animation
    else if (conditionCode >= 300 && conditionCode < 600) {
        rainEffect.style.display = 'block';
        createRaindrops();
    }
    
    // Wind animation
    if (windSpeedValue >5) {
        windEffect.style.display = 'block';
        createLeaves();
    }
    
    // Fog animation
    if (conditionCode >= 10 && conditionCode < 800) {
        fogEffect.style.display = 'block';
        createFog();
    }
}

function createSnowflakes() {
    const flakeCount = 100; // More snowflakes for snowy places
    
    for (let i = 0; i < flakeCount; i++) {
        const flake = document.createElement('div');
        flake.className = 'flake';
        flake.innerHTML = '<i class="fas fa-snowflake"></i>';
        
        flake.style.left = `${Math.random() * 100}%`;
        flake.style.animationDuration = `${3 + Math.random() * 8}s`;
        flake.style.animationDelay = `${Math.random() * 5}s`;
        flake.style.opacity = `${0.3 + Math.random() * 0.7}`;
        flake.style.fontSize = `${0.5 + Math.random() * 1.5}rem`;
        
        snowEffect.appendChild(flake);
    }
}

function createRaindrops() {
    const dropCount = 60;
    
    for (let i = 0; i < dropCount; i++) {
        const drop = document.createElement('div');
        drop.className = 'drop';
        
        drop.style.left = `${Math.random() * 100}%`;
        drop.style.animationDuration = `${0.5 + Math.random() * 1}s`;
        drop.style.animationDelay = `${Math.random() * 2}s`;
        drop.style.opacity = `${0.3 + Math.random() * 0.7}`;
        
        rainEffect.appendChild(drop);
    }
}

function createLeaves() {
    const leafCount = 12;
    
    for (let i = 0; i < leafCount; i++) {
        const leaf = document.createElement('div');
        leaf.className = 'leaf';
        leaf.innerHTML = '<i class="fas fa-leaf"></i>';
        
        leaf.style.top = `${20 + Math.random() * 60}%`;
        leaf.style.animationDuration = `${5 + Math.random() * 15}s`;
        leaf.style.animationDelay = `${Math.random() * 5}s`;
        leaf.style.fontSize = `${1 + Math.random() * 1.5}rem`;
        
        windEffect.appendChild(leaf);
    }
}

function createFog() {
    for (let i = 0; i < 4; i++) {
        const fogLayer = document.createElement('div');
        fogLayer.className = 'fog-layer';
        
        fogLayer.style.height = `${20 + Math.random() * 40}%`;
        fogLayer.style.top = `${Math.random() * 60}%`;
        fogLayer.style.opacity = `${0.1 + Math.random() * 0.3}`;
        fogLayer.style.animationDuration = `${40 + Math.random() * 40}s`;
        fogLayer.style.animationDelay = `${Math.random() * 15}s`;
        
        fogEffect.appendChild(fogLayer);
    }
}

// Initialize weather animations
updateWeatherAnimations();