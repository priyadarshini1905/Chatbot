// ============================================
// Module: Madurai Food Spots
// ============================================

const foodSpots = {
    // Detailed curry dosa shops — always return multiple options
    curryDosaShops: [
        {
            name: "Amma Mess",
            area: "Narimedu",
            landmark: "Near Narimedu Bus Stop",
            specialty: "The OG curry dosa spot. Famous for mutton curry dosa with thick, spicy gravy. Also known for mutton biryani and brain fry.",
            price_range: "₹80 – ₹150",
            crowdLevel: "🟠 Heavy (always busy, expect 10-15 min wait)",
            bestTime: "Breakfast (7 AM – 10 AM) or Dinner (7 PM – 10 PM)",
            timings: "6:30 AM – 11:00 PM",
            mustTry: "Mutton Curry Dosa + Brain Fry combo",
            vegOptions: false,
            rating: "4.3/5"
        },
        {
            name: "Kumar Mess",
            area: "Near Periyar Bus Stand",
            landmark: "Opposite to Periyar Bus Stand entrance",
            specialty: "One of the oldest curry dosa shops. Crispy dosa with chicken or mutton curry. Known for generous portions and authentic taste.",
            price_range: "₹60 – ₹130",
            crowdLevel: "🟡 Moderate to Heavy (peak hours are busy)",
            bestTime: "Early morning (6 AM – 9 AM) for fresh batches",
            timings: "5:30 AM – 11:00 PM",
            mustTry: "Chicken Curry Dosa + Mutton Sukka",
            vegOptions: false,
            rating: "4.0/5"
        },
        {
            name: "Konar Kadai",
            area: "Tallakulam",
            landmark: "Tallakulam Main Road",
            specialty: "Village-style kari dosa with slow-cooked mutton curry. The dosa here is larger and thicker. Authentic countryside flavor.",
            price_range: "₹100 – ₹200",
            crowdLevel: "🟡 Moderate (spacious seating, manageable crowd)",
            bestTime: "Dinner (6 PM – 9 PM) — freshly prepared batches",
            timings: "11:00 AM – 11:00 PM",
            mustTry: "Mutton Kari Dosa + Nattu Kozhi (country chicken) curry",
            vegOptions: false,
            rating: "4.1/5"
        },
        {
            name: "Simmakkal Curry Dosa Stalls",
            area: "Simmakkal",
            landmark: "Simmakkal Junction, multiple stalls along the street",
            specialty: "The most famous curry dosa street in Madurai! Multiple stalls competing for the best dosa. Smoky, street-side experience with crispy dosas and fiery curry.",
            price_range: "₹50 – ₹120",
            crowdLevel: "🔴 Very Heavy (evening/night — massive crowds, standing and eating is common)",
            bestTime: "Night (8 PM – 11 PM) for the full street food atmosphere",
            timings: "6:00 PM – 1:00 AM",
            mustTry: "Egg Curry Dosa + Mutton Curry Dosa from any busy stall",
            vegOptions: false,
            rating: "4.2/5 (collective)"
        },
        {
            name: "Rajan Mess",
            area: "KK Nagar",
            landmark: "Near KK Nagar Bus Stop",
            specialty: "Known for pepper mutton curry dosa — a spicier variation with freshly ground pepper. Slightly less touristy, more of a local favorite.",
            price_range: "₹70 – ₹140",
            crowdLevel: "🟢 Low to Moderate (hidden gem, locals' favorite)",
            bestTime: "Morning (7 AM – 10 AM)",
            timings: "6:00 AM – 10:30 PM",
            mustTry: "Pepper Mutton Curry Dosa",
            vegOptions: false,
            rating: "4.0/5"
        },
        {
            name: "Madurai Idly Shop & Kari Dosa",
            area: "Mattuthavani",
            landmark: "Near Mattuthavani Bus Terminus",
            specialty: "Popular among travelers arriving by bus. Quick service, tasty curry dosa at affordable prices. Also serves excellent idly and dosa varieties.",
            price_range: "₹50 – ₹110",
            crowdLevel: "🟡 Moderate (busy during bus arrival times)",
            bestTime: "Early morning (5 AM – 8 AM) when buses arrive",
            timings: "4:30 AM – 11:00 PM",
            mustTry: "Chicken Curry Dosa + Filter Coffee",
            vegOptions: true,
            rating: "3.9/5"
        }
    ],
    famousDishes: [
        {
            name: "Madurai Curry Dosa",
            description: "The legendary Madurai specialty — a crispy dosa topped with spicy non-veg curry (usually mutton or chicken). A must-try street food unique to Madurai. See the dedicated curry dosa shop list for 6 top options!",
            famous_spots: ["Amma Mess (Narimedu)", "Kumar Mess", "Simmakkal Stalls", "Konar Kadai", "Rajan Mess", "Mattuthavani shops"],
            price_range: "₹50 – ₹200",
            best_time: "Breakfast and dinner"
        },
        {
            name: "Jigarthanda",
            description: "Madurai's iconic cold drink made with milk, almond gum (badam pisin), sarsaparilla syrup, and ice cream. A refreshing treat, especially in summer.",
            famous_spots: ["Famous Jigarthanda (Vilakkuthoon)", "Murugan Jigarthanda", "K.S. Jigarthanda"],
            price_range: "₹50 – ₹120",
            best_time: "Afternoon, especially in summer"
        },
        {
            name: "Kari Dosai (Mutton Dosa)",
            description: "A larger variant of curry dosa where tender mutton pieces are cooked into the dosa itself, packed with spices.",
            famous_spots: ["Simmakkal street stalls", "Konar Kadai (Tallakulam)"],
            price_range: "₹80 – ₹180",
            best_time: "Dinner (most stalls open by 6 PM)"
        },
        {
            name: "Meen Kulambu (Fish Curry)",
            description: "A spicy and tangy fish curry made with tamarind, served with hot rice. A staple in Madurai non-veg restaurants.",
            famous_spots: ["Amma Mess", "Any local 'mess' restaurant"],
            price_range: "₹100 – ₹200 (meal)",
            best_time: "Lunch"
        },
        {
            name: "Paruthi Paal",
            description: "A traditional drink made from cotton seeds, coconut milk, and jaggery. Highly nutritious and unique to the Madurai region.",
            famous_spots: ["Street vendors near Meenakshi Temple", "Madurai Periyar Bus Stand area"],
            price_range: "₹20 – ₹40",
            best_time: "Morning"
        }
    ],
    restaurants: [
        {
            name: "Murugan Idli Shop",
            type: "Vegetarian",
            specialty: "Soft idlis with a variety of chutneys and signature ghee podi",
            location: "West Masi Street & multiple branches",
            price_range: "₹50 – ₹200",
            rating: "4.3/5"
        },
        {
            name: "Amma Mess",
            type: "Non-Vegetarian",
            specialty: "Curry dosa, mutton biryani, and authentic Chettinad-style non-veg meals",
            location: "Narimedu",
            price_range: "₹80 – ₹250",
            rating: "4.2/5"
        },
        {
            name: "Kumar Mess",
            type: "Non-Vegetarian",
            specialty: "Famous for curry dosa and brain fry",
            location: "Near Periyar Bus Stand",
            price_range: "₹60 – ₹200",
            rating: "4.0/5"
        },
        {
            name: "Konar Kadai",
            type: "Non-Vegetarian",
            specialty: "Authentic village-style mutton curry and kari dosa",
            location: "Tallakulam",
            price_range: "₹100 – ₹300",
            rating: "4.1/5"
        },
        {
            name: "Taj Restaurant",
            type: "Multi-cuisine",
            specialty: "Biryani, tandoori items, and North Indian food",
            location: "Town Hall Road",
            price_range: "₹150 – ₹500",
            rating: "4.0/5"
        },
        {
            name: "Temple City Restaurant",
            type: "Multi-cuisine",
            specialty: "Family dining, Chinese and Indian food",
            location: "Bypass Road",
            price_range: "₹100 – ₹400",
            rating: "3.9/5"
        }
    ],
    streetFoodAreas: [
        {
            area: "Simmakkal",
            known_for: "Curry dosa stalls, night food scene",
            best_time: "Evening to late night"
        },
        {
            area: "Vilakkuthoon",
            known_for: "Jigarthanda, chaat, and snacks",
            best_time: "Afternoon to evening"
        },
        {
            area: "West Masi Street",
            known_for: "Famous eateries and bakeries",
            best_time: "All day"
        },
        {
            area: "Periyar Bus Stand Area",
            known_for: "Quick bites, dosa stalls, tea shops",
            best_time: "Early morning to night"
        }
    ]
};

module.exports = foodSpots;
