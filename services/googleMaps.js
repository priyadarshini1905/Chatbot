// ============================================
// Service: Google Maps Integration
// Status: 🔌 READY FOR INTEGRATION
// ============================================
// To enable: Add GOOGLE_MAPS_API_KEY to .env
// Docs: https://developers.google.com/maps/documentation
// ============================================

const API_KEY = process.env.GOOGLE_MAPS_API_KEY || null;

const description = 'Google Maps — Directions, distances, nearby places, and map embeds';

function isEnabled() {
    return !!API_KEY;
}

async function initialize() {
    if (!API_KEY) return 'not_configured';
    // TODO: Validate API key with a test request
    return 'ready';
}

/**
 * Get directions between two locations
 * @param {string} origin - Starting location
 * @param {string} destination - Destination location
 * @param {string} mode - Travel mode: driving, walking, transit
 */
async function getDirections(origin, destination, mode = 'driving') {
    if (!isEnabled()) return { error: 'Google Maps API not configured' };

    // TODO: Implement when API key is available
    // const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&mode=${mode}&key=${API_KEY}`;
    // const response = await fetch(url);
    // return await response.json();

    return { message: 'Google Maps integration pending. Please check Google Maps for directions.' };
}

/**
 * Search for nearby places
 * @param {string} query - Search query (e.g., "restaurants near Meenakshi Temple")
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {number} radius - Search radius in meters
 */
async function nearbySearch(query, lat = 9.9195, lng = 78.1193, radius = 2000) {
    if (!isEnabled()) return { error: 'Google Maps API not configured' };

    // TODO: Implement Places API
    // const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&keyword=${query}&key=${API_KEY}`;

    return { message: 'Nearby search pending Google Maps integration.' };
}

/**
 * Get distance and duration between two points
 */
async function getDistance(origin, destination) {
    if (!isEnabled()) return { error: 'Google Maps API not configured' };

    // TODO: Implement Distance Matrix API
    return { message: 'Distance calculation pending Google Maps integration.' };
}

module.exports = { isEnabled, initialize, description, getDirections, nearbySearch, getDistance };
