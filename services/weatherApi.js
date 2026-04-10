// ============================================
// Service: Weather API Integration
// Status: 🔌 READY FOR INTEGRATION
// ============================================
// To enable: Add WEATHER_API_KEY to .env
// Supports: OpenWeatherMap, WeatherAPI.com, AccuWeather
// Free tier: OpenWeatherMap (1000 calls/day free)
// ============================================

const API_KEY = process.env.WEATHER_API_KEY || null;
const BASE_URL = process.env.WEATHER_API_URL || 'https://api.openweathermap.org/data/2.5';

const description = 'Weather API — Live temperature, humidity, forecast, and weather alerts';

// Madurai coordinates
const MADURAI_LAT = 9.9252;
const MADURAI_LON = 78.1198;

function isEnabled() {
    return !!API_KEY;
}

async function initialize() {
    if (!isEnabled()) return 'not_configured';
    return 'ready';
}

/**
 * Get current weather for Madurai
 */
async function getCurrentWeather() {
    if (!isEnabled()) {
        return {
            source: 'estimated',
            message: '📡 Live weather data is not available. Showing seasonal patterns.',
        };
    }

    // TODO: Implement when API key is available
    // const url = `${BASE_URL}/weather?lat=${MADURAI_LAT}&lon=${MADURAI_LON}&units=metric&appid=${API_KEY}`;
    // const response = await fetch(url);
    // const data = await response.json();
    // return {
    //   source: 'live',
    //   temperature: data.main.temp,
    //   feelsLike: data.main.feels_like,
    //   humidity: data.main.humidity,
    //   description: data.weather[0].description,
    //   windSpeed: data.wind.speed,
    // };

    return { source: 'live', status: 'pending_integration' };
}

/**
 * Get 5-day weather forecast
 */
async function getForecast() {
    if (!isEnabled()) return { error: 'Weather API not configured' };

    // TODO: Implement forecast API
    // const url = `${BASE_URL}/forecast?lat=${MADURAI_LAT}&lon=${MADURAI_LON}&units=metric&appid=${API_KEY}`;

    return { message: 'Weather forecast pending integration.' };
}

/**
 * Get weather-based visit recommendation
 */
async function getVisitRecommendation() {
    if (!isEnabled()) return { message: 'Weather-based recommendations use seasonal patterns.' };

    // TODO: Use live weather to suggest indoor/outdoor activities
    return { message: 'Weather-based recommendations pending integration.' };
}

module.exports = { isEnabled, initialize, description, getCurrentWeather, getForecast, getVisitRecommendation };
