// ============================================
// Service: Personalized Recommendations
// Status: 🔌 READY FOR INTEGRATION
// ============================================
// Uses user preferences, history, and context
// Future: User profiles, saved preferences, ML-based suggestions
// ============================================

const DB_URL = process.env.RECOMMENDATIONS_DB_URL || null;

const description = 'Personalized Recommendations — Custom itineraries, preferences, and smart suggestions';

// In-memory user preferences (replace with DB in production)
const userPreferences = new Map();

function isEnabled() {
    return true; // Basic recommendations always work from local data
}

async function initialize() {
    return 'ready';
}

/**
 * Save user preference
 * @param {string} sessionId - User session ID
 * @param {object} preference - { category, value } e.g., { category: 'food', value: 'vegetarian' }
 */
function savePreference(sessionId, preference) {
    if (!userPreferences.has(sessionId)) {
        userPreferences.set(sessionId, {
            diet: null,          // 'vegetarian', 'non-vegetarian', 'vegan'
            budget: null,        // 'budget', 'mid-range', 'luxury'
            interests: [],       // ['temples', 'food', 'history', 'nature', 'shopping']
            travelStyle: null,   // 'solo', 'family', 'couple', 'group'
            mobility: null,      // 'full', 'limited' (for elder mode / accessibility)
            language: null,      // preferred language
            visitedPlaces: [],   // track visited places to avoid repeats
        });
    }

    const prefs = userPreferences.get(sessionId);
    if (preference.category in prefs) {
        if (Array.isArray(prefs[preference.category])) {
            prefs[preference.category].push(preference.value);
        } else {
            prefs[preference.category] = preference.value;
        }
    }

    return prefs;
}

/**
 * Get user preferences
 * @param {string} sessionId - User session ID
 */
function getPreferences(sessionId) {
    return userPreferences.get(sessionId) || null;
}

/**
 * Generate personalized recommendations
 * @param {string} sessionId - User session ID
 * @param {string} type - 'itinerary', 'food', 'hotel', 'activity'
 */
async function getRecommendations(sessionId, type = 'itinerary') {
    const prefs = getPreferences(sessionId);

    // Default recommendations if no preferences saved
    if (!prefs) {
        return {
            type,
            source: 'default',
            message: 'No preferences saved yet. Here are our top picks for everyone!',
        };
    }

    // TODO: Implement smart recommendation engine
    // - Filter by diet (veg/non-veg) for food recs
    // - Filter by budget for hotel recs
    // - Consider mobility for elderly-friendly places
    // - Exclude already-visited places
    // - Weight by interests

    return {
        type,
        source: 'preferences',
        preferences: prefs,
        message: 'Personalized recommendations pending full integration.',
    };
}

/**
 * Track a place visit
 * @param {string} sessionId - User session ID
 * @param {string} placeName - Name of the visited place
 */
function trackVisit(sessionId, placeName) {
    savePreference(sessionId, { category: 'visitedPlaces', value: placeName });
}

/**
 * Clear user preferences
 * @param {string} sessionId - User session ID
 */
function clearPreferences(sessionId) {
    userPreferences.delete(sessionId);
}

module.exports = {
    isEnabled, initialize, description,
    savePreference, getPreferences, getRecommendations, trackVisit, clearPreferences,
};
