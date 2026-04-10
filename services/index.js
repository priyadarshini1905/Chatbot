// ============================================
// Services: Integration Manager
// Central hub for all external API integrations
// ============================================

const googleMaps = require('./googleMaps');
const liveTraffic = require('./liveTraffic');
const weatherApi = require('./weatherApi');
const templeBooking = require('./templeBooking');
const eventNotifier = require('./eventNotifier');
const crowdPrediction = require('./crowdPrediction');
const recommendations = require('./recommendations');

// Registry of all services
const services = {
    googleMaps,
    liveTraffic,
    weatherApi,
    templeBooking,
    eventNotifier,
    crowdPrediction,
    recommendations,
};

/**
 * Initialize all enabled services
 */
async function initializeAll() {
    const results = {};
    for (const [name, service] of Object.entries(services)) {
        try {
            const status = await service.initialize();
            results[name] = { enabled: service.isEnabled(), status };
            if (service.isEnabled()) {
                console.log(`   ✅ ${name} — connected`);
            } else {
                console.log(`   ⬜ ${name} — not configured (optional)`);
            }
        } catch (err) {
            results[name] = { enabled: false, status: 'error', error: err.message };
            console.log(`   ❌ ${name} — error: ${err.message}`);
        }
    }
    return results;
}

/**
 * Get status of all services
 */
function getStatus() {
    const status = {};
    for (const [name, service] of Object.entries(services)) {
        status[name] = {
            enabled: service.isEnabled(),
            description: service.description,
        };
    }
    return status;
}

/**
 * Get a specific service
 */
function getService(name) {
    return services[name] || null;
}

module.exports = { initializeAll, getStatus, getService, services };
