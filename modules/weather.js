// ============================================
// Module: Madurai Weather Information
// ============================================

const weather = {
    overview: "Madurai has a tropical climate with hot summers, a mild monsoon, and a pleasant winter. The city experiences temperatures between 20°C and 40°C throughout the year.",
    seasons: [
        {
            season: "Summer",
            months: "March – June",
            temperature: "30°C – 40°C (can reach 42°C in May)",
            humidity: "40% – 60%",
            description: "Very hot and dry. Peak heat in April-May. Carry water, sunscreen, and light cotton clothing.",
            tips: [
                "Visit temples early morning or after 4 PM to avoid peak heat",
                "Drink Jigarthanda to cool down!",
                "Stay hydrated — carry water bottles",
                "Light cotton clothes recommended",
                "Chithirai festival falls in this season — expect heat + crowds"
            ]
        },
        {
            season: "Monsoon (Southwest)",
            months: "June – September",
            temperature: "28°C – 35°C",
            humidity: "60% – 80%",
            description: "Moderate rainfall from the southwest monsoon. Weather becomes more pleasant with occasional heavy showers.",
            tips: [
                "Carry an umbrella or rain jacket",
                "Roads may get waterlogged in some areas",
                "Good time to visit — fewer tourists, lovely greenery",
                "Check weather before visiting Megamalai or hill areas"
            ]
        },
        {
            season: "Post-Monsoon (Northeast)",
            months: "October – December",
            temperature: "24°C – 32°C",
            humidity: "65% – 85%",
            description: "The northeast monsoon brings the heaviest rainfall to Madurai. November is typically the wettest month.",
            tips: [
                "Expect heavy rain spells, especially in November",
                "Vaigai River and streams come alive",
                "Indoor attractions like museums are good options on rainy days",
                "Beautiful weather between rain spells"
            ]
        },
        {
            season: "Winter",
            months: "January – February",
            temperature: "20°C – 30°C",
            humidity: "40% – 55%",
            description: "The best time to visit Madurai! Pleasant weather with cool mornings and comfortable daytime temperatures.",
            tips: [
                "Best season for sightseeing — comfortable weather all day",
                "Float Festival falls in this period — don't miss it!",
                "Pongal celebrations in January",
                "Light jacket for early mornings",
                "Book hotels in advance for the festival season"
            ]
        }
    ],
    bestTimeToVisit: "October to March is the ideal time to visit Madurai. The weather is pleasant, and major festivals like Pongal, Float Festival, and the start of the Chithirai season make it culturally vibrant.",
    currentWeatherNote: "Live data is not available right now. This information is based on usual seasonal patterns. Check weather apps for real-time updates."
};

module.exports = weather;
