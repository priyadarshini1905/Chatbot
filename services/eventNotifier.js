// ============================================
// Service: Event Notification System
// Status: 🔌 READY FOR INTEGRATION
// ============================================
// To enable: Add NOTIFICATION_SERVICE_URL to .env
// Supports: Push notifications, email alerts, WhatsApp (via Twilio)
// ============================================

const SERVICE_URL = process.env.NOTIFICATION_SERVICE_URL || null;
const TWILIO_SID = process.env.TWILIO_ACCOUNT_SID || null;
const TWILIO_TOKEN = process.env.TWILIO_AUTH_TOKEN || null;

const description = 'Event Notifications — Festival alerts, temple events, and custom reminders';

function isEnabled() {
    return !!SERVICE_URL || !!(TWILIO_SID && TWILIO_TOKEN);
}

async function initialize() {
    if (!isEnabled()) return 'not_configured';
    return 'ready';
}

/**
 * Get upcoming events for a date range
 * @param {number} days - Number of days to look ahead (default: 30)
 */
async function getUpcomingEvents(days = 30) {
    // This can work from local data even without live API
    const events = require('../modules/events');
    return {
        source: 'knowledge_base',
        events: events.majorFestivals,
        monthlyEvents: events.monthlyTempleEvents,
    };
}

/**
 * Subscribe user to event notifications
 * @param {object} subscription - { channel: 'push|email|whatsapp', contact, events[] }
 */
async function subscribe(subscription) {
    if (!isEnabled()) return { error: 'Notification service not configured' };

    // TODO: Implement notification subscription
    // Could use: Firebase FCM, Twilio, SendGrid, etc.
    return { message: 'Event notification subscription pending integration.' };
}

/**
 * Send a notification
 * @param {object} notification - { to, channel, title, body }
 */
async function sendNotification(notification) {
    if (!isEnabled()) return { error: 'Notification service not configured' };

    // TODO: Implement notification sending
    return { message: 'Notification sending pending integration.' };
}

/**
 * Get festival reminders for today
 */
async function getTodayReminders() {
    const events = require('../modules/events');
    const today = new Date();
    const month = today.getMonth() + 1;
    const day = today.getDate();

    const activeEvents = events.majorFestivals.filter(f => {
        // Simple month-based check
        const monthNames = {
            'January': 1, 'February': 2, 'March': 3, 'April': 4,
            'May': 5, 'June': 6, 'July': 7, 'August': 8,
            'September': 9, 'October': 10, 'November': 11, 'December': 12,
        };
        for (const [name, num] of Object.entries(monthNames)) {
            if (f.month.includes(name) && num === month) return true;
        }
        return false;
    });

    return { today: today.toISOString().split('T')[0], events: activeEvents };
}

module.exports = { isEnabled, initialize, description, getUpcomingEvents, subscribe, sendNotification, getTodayReminders };
