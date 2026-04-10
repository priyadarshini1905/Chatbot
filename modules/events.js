// ============================================
// Module: Madurai Events & Festivals
// ============================================

const events = {
    majorFestivals: [
        {
            name: "Chithirai Thiruvizha",
            month: "April – May",
            duration: "14 days",
            description: "The grandest festival of Madurai, celebrating the divine wedding of Goddess Meenakshi and Lord Sundareswarar. The highlight is the Alagar procession (Kallazhagar entering the Vaigai River). Attracts over 1 million visitors.",
            highlights: [
                "Celestial wedding ceremony at Meenakshi Temple",
                "Kallazhagar procession from Alagar Hills to Vaigai River",
                "Grand chariot procession through city streets",
                "Cultural programs and exhibitions"
            ],
            crowdLevel: "Extremely High",
            tips: "Book hotels well in advance. Expect road closures. Arrive early for procession viewing spots."
        },
        {
            name: "Float Festival (Teppam Thiruvizha)",
            month: "January – February (Thai Pournami)",
            duration: "1 day (main event)",
            description: "Deities from Meenakshi Temple are taken on a decorated float across the Vandiyur Mariamman Teppakulam tank. The illuminated procession is breathtaking.",
            highlights: [
                "Illuminated floats on the temple tank",
                "Fireworks and music",
                "Thousands of oil lamps around the tank",
                "Cultural performances"
            ],
            crowdLevel: "Very High",
            tips: "Reach the tank by 4 PM for a good viewing spot. The evening event is the main attraction."
        },
        {
            name: "Pongal / Thai Pongal",
            month: "January 14–17",
            duration: "4 days",
            description: "The harvest festival of Tamil Nadu. Madurai celebrates with traditional cooking of Pongal, kolam competitions, Jallikattu events, and cultural programs.",
            highlights: [
                "Jallikattu (bull-taming sport) in Alanganallur",
                "Community Pongal cooking",
                "Kolam (rangoli) competitions",
                "Traditional games and village fairs"
            ],
            crowdLevel: "High",
            tips: "Alanganallur Jallikattu (20 km from Madurai) draws massive crowds. Go early and stay safe."
        },
        {
            name: "Navaratri / Durga Puja",
            month: "September – October",
            duration: "9 days",
            description: "Nine nights of celebration at Meenakshi Temple with special poojas, processions, and cultural events. Golu (doll display) is a tradition in many homes.",
            highlights: [
                "Special Meenakshi Temple poojas",
                "Vijayadashami procession",
                "Golu displays in homes and temples",
                "Classical music and dance performances"
            ],
            crowdLevel: "Moderate to High",
            tips: "Visit homes displaying Golu for a cultural experience. Temple crowds peak on weekends."
        },
        {
            name: "Jallikattu",
            month: "January (during Pongal)",
            duration: "1–2 days",
            description: "The famous bull-taming sport of Tamil Nadu. Alanganallur near Madurai hosts one of the most famous Jallikattu events in the state.",
            highlights: [
                "Bull-taming competition",
                "Thousands of spectators in a natural amphitheater",
                "Cash prizes for winners",
                "Cultural pride and tradition"
            ],
            crowdLevel: "Extremely High",
            tips: "arrive by 7 AM for viewing spots. Follow safety instructions. Avoid entering the arena unless you are a participant."
        }
    ],
    culturalEvents: [
        {
            name: "Madurai Vizha",
            description: "An annual cultural festival featuring music, dance, drama, and art exhibitions celebrating Madurai's rich cultural heritage.",
            month: "Varies (usually January-February)"
        },
        {
            name: "Meenakshi Thirukalyanam",
            description: "Re-enactment of the divine wedding inside Meenakshi Temple. Special rituals and pujas performed.",
            month: "During Chithirai Thiruvizha"
        }
    ],
    monthlyTempleEvents: "Meenakshi Temple conducts special pujas on every Fridays and full moon (Pournami) days. The Palli Arai ceremony happens every night at 9 PM."
};

module.exports = events;
