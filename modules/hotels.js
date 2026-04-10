// ============================================
// Module: Madurai Hotels & Accommodation
// ============================================

const hotels = {
    luxury: [
        {
            name: "Heritage Madurai",
            location: "Melakkal Main Road",
            description: "A luxury heritage resort set in 23 acres of lush gardens. Colonial-era bungalow style with modern amenities.",
            price_range: "₹6,000 – ₹15,000 per night",
            amenities: ["Swimming pool", "Spa", "Multi-cuisine restaurant", "Yoga sessions", "Heritage walks"],
            rating: "4.5/5",
            distance_from_temple: "8 km"
        },
        {
            name: "Fortune Pandiyan Hotel",
            location: "Race Course Road",
            description: "A well-known 4-star hotel with excellent service and comfortable rooms, close to the city center.",
            price_range: "₹4,000 – ₹8,000 per night",
            amenities: ["Restaurant", "Bar", "Conference hall", "Room service", "Travel desk"],
            rating: "4.2/5",
            distance_from_temple: "3 km"
        },
        {
            name: "GRT Regency",
            location: "Madurai Bypass Road",
            description: "Modern 4-star hotel offering premium rooms and excellent dining options.",
            price_range: "₹3,500 – ₹7,000 per night",
            amenities: ["Restaurant", "Banquet hall", "Fitness center", "Free WiFi", "Parking"],
            rating: "4.1/5",
            distance_from_temple: "5 km"
        }
    ],
    midRange: [
        {
            name: "Hotel Supreme",
            location: "West Perumal Maistry Street",
            description: "A popular mid-range hotel right in the heart of the city, walking distance to Meenakshi Temple.",
            price_range: "₹1,500 – ₹3,500 per night",
            amenities: ["Restaurant", "Room service", "Free WiFi", "Travel desk"],
            rating: "4.0/5",
            distance_from_temple: "500 m"
        },
        {
            name: "Hotel Germanus",
            location: "West Perumal Maistry Street",
            description: "Comfortable mid-range option near the temple with clean rooms and good food.",
            price_range: "₹1,200 – ₹3,000 per night",
            amenities: ["Restaurant", "Free WiFi", "Room service", "Parking"],
            rating: "3.9/5",
            distance_from_temple: "600 m"
        },
        {
            name: "Simap Residency",
            location: "West Masi Street",
            description: "Modern hotel with well-furnished rooms close to the main temple and shopping areas.",
            price_range: "₹1,800 – ₹3,500 per night",
            amenities: ["Restaurant", "Free WiFi", "AC rooms", "Room service"],
            rating: "4.0/5",
            distance_from_temple: "400 m"
        }
    ],
    budget: [
        {
            name: "Hotel Park Plaza",
            location: "West Perumal Maistry Street",
            description: "A budget-friendly hotel near Meenakshi Temple. Basic but clean rooms with essential amenities.",
            price_range: "₹600 – ₹1,500 per night",
            amenities: ["Free WiFi", "Room service", "AC/Non-AC rooms"],
            rating: "3.7/5",
            distance_from_temple: "300 m"
        },
        {
            name: "New College House",
            location: "Town Hall Road",
            description: "Popular budget option for students and backpackers. Simple rooms at affordable prices.",
            price_range: "₹400 – ₹1,000 per night",
            amenities: ["Basic rooms", "Fan/AC options", "Near bus stand"],
            rating: "3.5/5",
            distance_from_temple: "1 km"
        },
        {
            name: "TTDC Hotel Tamil Nadu",
            location: "West Veli Street",
            description: "Government-run hotel offering clean and affordable rooms. Good for solo travelers and families on a budget.",
            price_range: "₹500 – ₹1,500 per night",
            amenities: ["Restaurant", "Clean rooms", "AC/Non-AC options", "Parking"],
            rating: "3.6/5",
            distance_from_temple: "800 m"
        }
    ],
    tips: [
        "Book in advance during Chithirai Festival (April-May) and Pongal (January) — rooms sell out fast.",
        "Hotels near West Perumal Maistry Street are closest to Meenakshi Temple.",
        "For budget stays, check OYO and FabHotels apps for deals.",
        "Heritage Madurai is the best luxury option but is located away from the city center — taxi required.",
        "Most hotels offer temple visit packages with guided tours."
    ]
};

module.exports = hotels;
