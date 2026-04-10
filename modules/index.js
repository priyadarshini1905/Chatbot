// ============================================
// Module Aggregator
// Combines all knowledge modules into a single
// context string for the AI system prompt
// ============================================

const temples = require('./temples');
const touristPlaces = require('./touristPlaces');
const foodSpots = require('./foodSpots');
const hotels = require('./hotels');
const traffic = require('./traffic');
const events = require('./events');
const weather = require('./weather');
const travelTips = require('./travelTips');
const { buildCrowdContext } = require('./crowdEstimator');

function buildKnowledgeContext() {
    const sections = [];

    // Temples
    sections.push('## TEMPLES IN MADURAI');
    temples.forEach(t => {
        sections.push(`### ${t.name}`);
        sections.push(`Location: ${t.location}`);
        sections.push(`Description: ${t.description}`);
        sections.push(`Timings: ${t.timings}`);
        sections.push(`Entry Fee: ${t.entryFee}`);
        sections.push(`Highlights: ${t.highlights.join(', ')}`);
        sections.push(`Tips: ${t.tips}`);
        sections.push('');
    });

    // Tourist Places
    sections.push('## TOURIST PLACES IN MADURAI');
    touristPlaces.forEach(p => {
        sections.push(`### ${p.name}`);
        sections.push(`Location: ${p.location}`);
        sections.push(`Description: ${p.description}`);
        sections.push(`Timings: ${p.timings}`);
        sections.push(`Entry Fee: ${p.entryFee}`);
        sections.push(`Highlights: ${p.highlights.join(', ')}`);
        sections.push('');
    });

    // Food
    sections.push('## FOOD IN MADURAI');

    // Detailed Curry Dosa Shops
    sections.push('### TOP CURRY DOSA SHOPS IN MADURAI (Always list ALL of these when asked about curry dosa)');
    foodSpots.curryDosaShops.forEach((shop, i) => {
        sections.push(`**${i + 1}. ${shop.name}**`);
        sections.push(`Area: ${shop.area} (${shop.landmark})`);
        sections.push(`Specialty: ${shop.specialty}`);
        sections.push(`Price: ${shop.price_range} | Rating: ${shop.rating}`);
        sections.push(`Crowd: ${shop.crowdLevel}`);
        sections.push(`Best Time: ${shop.bestTime} | Timings: ${shop.timings}`);
        sections.push(`Must Try: ${shop.mustTry}`);
        sections.push(`Veg Options: ${shop.vegOptions ? 'Yes' : 'No'}`);
        sections.push('');
    });
    sections.push('NOTE: When user asks about curry dosa, ALWAYS list at least 4-6 shops from above. NEVER give just one option. Include all fields for each shop. If exact location is unclear, add: "Please check Google Maps for exact directions."');
    sections.push('');

    sections.push('### Famous Dishes');
    foodSpots.famousDishes.forEach(d => {
        sections.push(`**${d.name}**: ${d.description}`);
        sections.push(`Famous spots: ${d.famous_spots.join(', ')}`);
        sections.push(`Price: ${d.price_range} | Best time: ${d.best_time}`);
        sections.push('');
    });
    sections.push('### Restaurants');
    foodSpots.restaurants.forEach(r => {
        sections.push(`**${r.name}** (${r.type}): ${r.specialty}`);
        sections.push(`Location: ${r.location} | Price: ${r.price_range} | Rating: ${r.rating}`);
        sections.push('');
    });
    sections.push('### Street Food Areas');
    foodSpots.streetFoodAreas.forEach(a => {
        sections.push(`**${a.area}**: ${a.known_for} (Best time: ${a.best_time})`);
    });
    sections.push('');

    // Hotels
    sections.push('## HOTELS IN MADURAI');
    ['luxury', 'midRange', 'budget'].forEach(category => {
        sections.push(`### ${category.charAt(0).toUpperCase() + category.slice(1)} Hotels`);
        hotels[category].forEach(h => {
            sections.push(`**${h.name}**: ${h.description}`);
            sections.push(`Location: ${h.location} | Price: ${h.price_range} | Rating: ${h.rating} | Distance from temple: ${h.distance_from_temple}`);
            sections.push(`Amenities: ${h.amenities.join(', ')}`);
            sections.push('');
        });
    });
    sections.push(`Hotel Tips: ${hotels.tips.join(' | ')}`);
    sections.push('');

    // Traffic
    sections.push('## TRAFFIC IN MADURAI');
    sections.push(traffic.generalInfo);
    sections.push('### Peak Hours');
    traffic.peakHours.forEach(p => {
        sections.push(`${p.time}: ${p.level} — ${p.reason}`);
    });
    sections.push('### Congested Areas');
    traffic.congestedAreas.forEach(c => {
        sections.push(`${c.area}: ${c.reason}`);
    });
    sections.push('### Transport Options');
    traffic.transportOptions.forEach(t => {
        sections.push(`**${t.mode}**: ${t.details} (Tip: ${t.tips})`);
    });
    sections.push(`Festival Traffic: ${traffic.festivalTraffic}`);
    sections.push(`Tips: ${traffic.tips.join(' | ')}`);
    sections.push('');

    // Events
    sections.push('## EVENTS & FESTIVALS');
    events.majorFestivals.forEach(f => {
        sections.push(`### ${f.name}`);
        sections.push(`When: ${f.month} (${f.duration})`);
        sections.push(`Description: ${f.description}`);
        sections.push(`Highlights: ${f.highlights.join(', ')}`);
        sections.push(`Crowd Level: ${f.crowdLevel}`);
        sections.push(`Tips: ${f.tips}`);
        sections.push('');
    });
    sections.push(events.monthlyTempleEvents);
    sections.push('');

    // Weather
    sections.push('## WEATHER IN MADURAI');
    sections.push(weather.overview);
    weather.seasons.forEach(s => {
        sections.push(`### ${s.season} (${s.months})`);
        sections.push(`Temperature: ${s.temperature} | Humidity: ${s.humidity}`);
        sections.push(`Description: ${s.description}`);
        sections.push(`Tips: ${s.tips.join(' | ')}`);
        sections.push('');
    });
    sections.push(`Best Time to Visit: ${weather.bestTimeToVisit}`);
    sections.push('');

    // Travel Tips
    sections.push('## TRAVEL TIPS');
    sections.push('### Getting to Madurai');
    travelTips.gettingToMadurai.forEach(g => {
        sections.push(`**${g.mode}**: ${g.details} (Tip: ${g.tips})`);
    });
    sections.push('### Temple Etiquette');
    travelTips.templeEtiquette.forEach(e => sections.push(`- ${e}`));
    sections.push('### Safety Tips');
    travelTips.safetyTips.forEach(s => sections.push(`- ${s}`));
    sections.push('### Packing Essentials');
    travelTips.packingEssentials.forEach(p => sections.push(`- ${p}`));
    sections.push('### Language Tips');
    travelTips.languageTips.forEach(l => sections.push(`- ${l}`));
    sections.push('### Suggested Itineraries');
    sections.push('**1-Day Itinerary:**');
    travelTips.suggestedItineraries.oneDay.forEach(i => sections.push(`  ${i}`));
    sections.push('**2-Day Itinerary:**');
    travelTips.suggestedItineraries.twoDays.forEach(i => sections.push(`  ${i}`));
    sections.push('**3-Day Itinerary:**');
    travelTips.suggestedItineraries.threeDays.forEach(i => sections.push(`  ${i}`));
    sections.push('### Emergency Contacts');
    const contacts = travelTips.usefulContacts;
    Object.entries(contacts).forEach(([key, val]) => {
        sections.push(`${key.replace(/_/g, ' ')}: ${val}`);
    });

    // Crowd Estimation
    sections.push('');
    sections.push(buildCrowdContext());

    return sections.join('\n');
}

module.exports = { buildKnowledgeContext };
