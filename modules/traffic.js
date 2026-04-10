// ============================================
// Module: Madurai Traffic Information
// ============================================

const traffic = {
    generalInfo: "Madurai is a bustling city with moderate to heavy traffic, especially in the city center near Meenakshi Temple and major markets. Auto-rickshaws, buses, and two-wheelers dominate the roads.",
    peakHours: [
        { time: "8:00 AM – 10:00 AM", level: "Heavy", reason: "Office and school rush" },
        { time: "12:30 PM – 2:00 PM", level: "Moderate", reason: "Lunch break traffic" },
        { time: "5:00 PM – 8:00 PM", level: "Heavy", reason: "Evening rush hour, market areas especially congested" },
        { time: "10:00 PM – 6:00 AM", level: "Light", reason: "Nighttime, roads are relatively clear" }
    ],
    congestedAreas: [
        { area: "Meenakshi Temple Zone", reason: "Tourist vehicles, devotees, narrow streets" },
        { area: "Periyar Bus Stand Area", reason: "High bus and auto-rickshaw concentration" },
        { area: "Mattuthavani Bus Terminus", reason: "Inter-city buses and local traffic merge" },
        { area: "Goripalayam Junction", reason: "Major intersection, always busy" },
        { area: "East & West Masi Streets", reason: "Shopping zones with pedestrian overflow" },
        { area: "Arapalayam Circle", reason: "Multiple roads converge" }
    ],
    transportOptions: [
        { mode: "Auto-Rickshaw", details: "Most common for short trips. Always negotiate fare or insist on meter. Typical rate: ₹30 minimum, ₹15/km after", tips: "Use Ola/Uber auto for fair pricing" },
        { mode: "City Bus", details: "TNSTC operates frequent city buses. Very affordable (₹5–₹20). Main hubs: Periyar Bus Stand, Mattuthavani", tips: "Carry small change. Buses can be crowded during peak hours" },
        { mode: "Ola/Uber", details: "Available in Madurai for cabs and autos. Good for tourists who want hassle-free rides", tips: "May have surge pricing during peak hours" },
        { mode: "Rental Bikes/Cars", details: "Available via Royal Brothers, Bounce, or local rental shops. Good for day trips", tips: "Carry valid license. Fuel stations available across city" },
        { mode: "Walking", details: "City center (temple area) is compact and walkable. Many attractions are within 1-2 km radius", tips: "Best way to explore the temple area. Carry water in summer" }
    ],
    festivalTraffic: "During Chithirai Thiruvizha (April-May), Pongal (January), and other major festivals, expect severe traffic congestion throughout the city. Road closures near Meenakshi Temple are common during processions.",
    tips: [
        "Avoid driving near Meenakshi Temple area — park elsewhere and walk",
        "Use Google Maps for real-time traffic updates",
        "Early morning (before 8 AM) is the best time to travel across the city",
        "During festivals, use public transport or walk — roads may be closed",
        "From airport/railway station, pre-book Ola/Uber for best rates"
    ]
};

module.exports = traffic;
