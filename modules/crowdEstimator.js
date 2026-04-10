// ============================================
// Module: Crowd Estimator
// Estimates crowd levels at temples and places
// based on day, time, and festival patterns
// ============================================

// Known festival dates (month-day format, approximate)
const festivalPeriods = [
    { name: 'Pongal', startMonth: 1, startDay: 14, endMonth: 1, endDay: 17 },
    { name: 'Float Festival', startMonth: 1, startDay: 25, endMonth: 2, endDay: 10 },
    { name: 'Chithirai Thiruvizha', startMonth: 4, startDay: 14, endMonth: 4, endDay: 28 },
    { name: 'Navaratri', startMonth: 10, startDay: 1, endMonth: 10, endDay: 15 },
    { name: 'Deepavali', startMonth: 10, startDay: 25, endMonth: 11, endDay: 5 },
    { name: 'Thai Poosam', startMonth: 1, startDay: 20, endMonth: 1, endDay: 25 },
    { name: 'Panguni Uthiram', startMonth: 3, startDay: 20, endMonth: 3, endDay: 30 },
];

// Special pooja days (recurring weekly/monthly)
const specialPoojaInfo = {
    friday: 'Special pooja day at most temples — expect heavier crowds',
    tuesday: 'Auspicious day for many temples — slightly higher footfall',
    fullMoon: 'Pournami — special poojas at Meenakshi Temple',
};

// Live API placeholder (for future integration)
const LIVE_API_ENABLED = false;
const LIVE_API_URL = process.env.CROWD_API_URL || null;

/**
 * Check if today falls within a festival period
 */
function getActiveFestival(date) {
    const month = date.getMonth() + 1;
    const day = date.getDate();

    for (const festival of festivalPeriods) {
        const inRange =
            (month === festival.startMonth && day >= festival.startDay) ||
            (month === festival.endMonth && day <= festival.endDay) ||
            (month > festival.startMonth && month < festival.endMonth);

        if (inRange) return festival.name;
    }
    return null;
}

/**
 * Determine if it's a special pooja day
 */
function getSpecialDay(date) {
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 5) return specialPoojaInfo.friday;
    if (dayOfWeek === 2) return specialPoojaInfo.tuesday;
    return null;
}

/**
 * Estimate crowd level based on day and time
 */
function estimateCrowd(date) {
    const hour = date.getHours();
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const festival = getActiveFestival(date);
    const specialDay = getSpecialDay(date);

    let level, emoji, color;

    // Festival day — Very Heavy
    if (festival) {
        level = 'Very Heavy';
        emoji = '🔴';
        color = 'red';
        return {
            level, emoji, color,
            reason: `${festival} festival period — maximum crowds expected`,
            bestTime: 'Early morning (5:00 AM – 7:00 AM) for shortest queues',
            warning: 'Book accommodation well in advance. Expect road closures near temples.',
        };
    }

    // Weekend patterns
    if (isWeekend) {
        if (hour >= 5 && hour < 9) {
            level = 'Heavy';
            emoji = '🟠';
            color = 'orange';
        } else if (hour >= 9 && hour < 12) {
            level = 'Very Heavy';
            emoji = '🔴';
            color = 'red';
        } else if (hour >= 12 && hour < 16) {
            level = 'Heavy';
            emoji = '🟠';
            color = 'orange';
        } else if (hour >= 16 && hour < 20) {
            level = 'Very Heavy';
            emoji = '🔴';
            color = 'red';
        } else {
            level = 'Moderate';
            emoji = '🟡';
            color = 'yellow';
        }

        return {
            level, emoji, color,
            reason: 'Weekend — higher tourist and devotee footfall',
            bestTime: 'Early morning (5:00 AM – 7:00 AM) or post-lunch (2:00 PM – 3:30 PM)',
            warning: null,
        };
    }

    // Weekday patterns
    if (hour >= 5 && hour < 8) {
        level = 'Moderate';
        emoji = '🟡';
        color = 'yellow';
    } else if (hour >= 8 && hour < 11) {
        level = 'Moderate to Heavy';
        emoji = '🟡';
        color = 'yellow';
    } else if (hour >= 11 && hour < 13) {
        level = 'Moderate';
        emoji = '🟡';
        color = 'yellow';
    } else if (hour >= 13 && hour < 16) {
        level = 'Low to Moderate';
        emoji = '🟢';
        color = 'green';
    } else if (hour >= 16 && hour < 18) {
        level = 'Moderate';
        emoji = '🟡';
        color = 'yellow';
    } else if (hour >= 18 && hour < 21) {
        level = 'Moderate to Heavy';
        emoji = '🟡';
        color = 'yellow';
    } else {
        level = 'Low';
        emoji = '🟢';
        color = 'green';
    }

    const result = {
        level, emoji, color,
        reason: 'Regular weekday pattern',
        bestTime: 'Early morning (5:00 AM – 7:00 AM) or afternoon (1:00 PM – 3:30 PM)',
        warning: null,
    };

    // Adjust for special pooja days
    if (specialDay) {
        result.reason = specialDay;
        if (result.color === 'green') {
            result.level = 'Moderate';
            result.emoji = '🟡';
            result.color = 'yellow';
        } else if (result.color === 'yellow') {
            result.level = 'Heavy';
            result.emoji = '🟠';
            result.color = 'orange';
        }
    }

    return result;
}

/**
 * Get crowd status — tries live API first, falls back to estimation
 */
async function getCrowdStatus(placeName = 'Meenakshi Amman Temple') {
    const now = new Date();

    // Step 1: Try live API
    if (LIVE_API_ENABLED && LIVE_API_URL) {
        try {
            const response = await fetch(`${LIVE_API_URL}?place=${encodeURIComponent(placeName)}`);
            if (response.ok) {
                const data = await response.json();
                return {
                    source: 'live',
                    place: placeName,
                    ...data,
                    dataNote: '📡 This is live crowd data updated in real-time.',
                    timestamp: now.toISOString(),
                };
            }
        } catch (err) {
            console.log('Live crowd API unavailable, using estimation.');
        }
    }

    // Step 2: Fall back to estimation
    const estimate = estimateCrowd(now);
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = dayNames[now.getDay()];
    const isWeekend = now.getDay() === 0 || now.getDay() === 6;

    return {
        source: 'estimated',
        place: placeName,
        crowdLevel: `${estimate.emoji} ${estimate.level}`,
        reason: estimate.reason,
        bestVisitingTime: estimate.bestTime,
        warning: estimate.warning,
        currentDay: dayName,
        currentTime: now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }),
        isWeekend,
        dataNote: '📊 Live data is not available right now. This estimate is based on usual crowd patterns for this day and time.',
        timestamp: now.toISOString(),
    };
}

/**
 * Build crowd knowledge context for the system prompt
 */
function buildCrowdContext() {
    const sections = [];
    sections.push('## CROWD ESTIMATION PATTERNS');
    sections.push('When asked about crowd or rush or busy level at any temple or place, use these patterns:');
    sections.push('');
    sections.push('### Weekday Patterns');
    sections.push('- 5 AM – 8 AM: Moderate');
    sections.push('- 8 AM – 11 AM: Moderate to Heavy');
    sections.push('- 11 AM – 1 PM: Moderate (temple may close 12:30 PM)');
    sections.push('- 1 PM – 4 PM: Low to Moderate (best time to visit!)');
    sections.push('- 4 PM – 6 PM: Moderate');
    sections.push('- 6 PM – 9 PM: Moderate to Heavy (evening pooja)');
    sections.push('- 9 PM onwards: Low');
    sections.push('');
    sections.push('### Weekend Patterns');
    sections.push('- 5 AM – 9 AM: Heavy');
    sections.push('- 9 AM – 12 PM: Very Heavy');
    sections.push('- 12 PM – 4 PM: Heavy');
    sections.push('- 4 PM – 8 PM: Very Heavy');
    sections.push('- After 8 PM: Moderate');
    sections.push('');
    sections.push('### Special Days');
    sections.push('- Fridays: Heavy (special pooja day)');
    sections.push('- Tuesdays: Slightly Heavy (auspicious day)');
    sections.push('- Full Moon (Pournami): Heavy (special poojas)');
    sections.push('- Festival periods: Very Heavy to Extreme');
    sections.push('');
    sections.push('### Festival Periods (Very Heavy)');
    sections.push('- Pongal: January 14-17');
    sections.push('- Float Festival: Late January to early February');
    sections.push('- Chithirai Thiruvizha: April 14-28');
    sections.push('- Navaratri: October 1-15');
    sections.push('- Deepavali: Late October to early November');
    sections.push('');
    sections.push('### Response Format for Crowd Queries');
    sections.push('When answering crowd questions, ALWAYS include:');
    sections.push('1. **Crowd Status**: Use emoji + level (🟢 Low / 🟡 Moderate / 🟠 Heavy / 🔴 Very Heavy)');
    sections.push('2. **Best Visiting Time**: Suggest the best time slot');
    sections.push('3. **Data Source Note**: Always say "📊 Live data is not available right now. This estimate is based on usual crowd patterns for this day and time."');
    sections.push('4. **Practical Tips**: Queue duration estimate, which entrance to use, etc.');

    return sections.join('\n');
}

module.exports = { getCrowdStatus, buildCrowdContext };
