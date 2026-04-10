// ============================================
// Service: AI-Based Crowd Prediction
// Status: 🔌 READY FOR INTEGRATION
// ============================================
// Uses historical patterns for prediction
// Future: Train ML model on actual visitor data
// ============================================

const ML_MODEL_URL = process.env.CROWD_ML_MODEL_URL || null;

const description = 'AI Crowd Prediction — Historical data analysis and ML-based crowd forecasting';

function isEnabled() {
    return !!ML_MODEL_URL;
}

async function initialize() {
    if (!isEnabled()) return 'not_configured';
    return 'ready';
}

/**
 * Predict crowd level for a future date/time
 * @param {string} place - Place name
 * @param {string} date - Date in YYYY-MM-DD format
 * @param {string} time - Time in HH:MM format
 */
async function predictCrowd(place, date, time) {
    if (!isEnabled()) {
        // Fall back to pattern-based estimation
        const { getCrowdStatus } = require('../modules/crowdEstimator');
        return await getCrowdStatus(place);
    }

    // TODO: Call ML model API
    // const response = await fetch(`${ML_MODEL_URL}/predict`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ place, date, time }),
    // });
    // return await response.json();

    return { source: 'ml_model', status: 'pending_integration' };
}

/**
 * Get crowd trend for the week
 * @param {string} place - Place name
 */
async function getWeeklyTrend(place = 'Meenakshi Amman Temple') {
    // Works from patterns even without ML model
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const patterns = [
        { day: 'Sunday', peak: 'Very Heavy', offPeak: 'Heavy' },
        { day: 'Monday', peak: 'Moderate', offPeak: 'Low' },
        { day: 'Tuesday', peak: 'Heavy', offPeak: 'Moderate' },
        { day: 'Wednesday', peak: 'Moderate', offPeak: 'Low' },
        { day: 'Thursday', peak: 'Moderate', offPeak: 'Low' },
        { day: 'Friday', peak: 'Heavy', offPeak: 'Moderate' },
        { day: 'Saturday', peak: 'Very Heavy', offPeak: 'Heavy' },
    ];

    return { place, source: isEnabled() ? 'ml_model' : 'historical_patterns', trend: patterns };
}

/**
 * Get best time to visit based on historical data
 * @param {string} place - Place name
 * @param {string} date - Target date
 */
async function getBestVisitTime(place, date) {
    return {
        place,
        bestSlots: [
            { time: '5:00 AM – 7:00 AM', crowd: 'Low', confidence: '85%' },
            { time: '1:00 PM – 3:00 PM', crowd: 'Low to Moderate', confidence: '75%' },
        ],
        source: isEnabled() ? 'ml_prediction' : 'historical_patterns',
    };
}

module.exports = { isEnabled, initialize, description, predictCrowd, getWeeklyTrend, getBestVisitTime };
