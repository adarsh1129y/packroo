// Sample destinations data
const destinations = [
    {
        name: "Munnar",
        description: "A beautiful hill station in Kerala known for its tea plantations and misty mountains.",
        activities: ["Tea Plantation Tour", "Hiking", "Wildlife Safari", "Photography"]
    },
    {
        name: "Lonavala",
        description: "A popular hill station in Maharashtra famous for its caves and waterfalls.",
        activities: ["Cave Exploration", "Waterfall Visit", "Trekking", "Camping"]
    },
    {
        name: "Jaisalmer",
        description: "The Golden City of Rajasthan, known for its desert landscape and historic fort.",
        activities: ["Desert Safari", "Camel Ride", "Fort Visit", "Cultural Show"]
    },
    {
        name: "Coorg",
        description: "The Scotland of India, famous for its coffee plantations and scenic beauty.",
        activities: ["Coffee Tour", "Waterfall Visit", "Trekking", "Bird Watching"]
    },
    {
        name: "Rishikesh",
        description: "The Yoga Capital of the World, known for adventure sports and spiritual retreats.",
        activities: ["River Rafting", "Yoga", "Bungee Jumping", "Meditation"]
    }
];

// Preference mapping
const preferenceMap = {
    mountains: ["Munnar", "Lonavala", "Coorg"],
    water: ["Lonavala", "Rishikesh"],
    desert: ["Jaisalmer"],
    adventure: ["Rishikesh", "Lonavala", "Coorg"],
    culture: ["Jaisalmer", "Rishikesh"],
    nature: ["Munnar", "Coorg", "Lonavala"],
    relaxation: ["Munnar", "Coorg"],
    photography: ["Munnar", "Jaisalmer", "Coorg"]
};

export const travelSuggestionService = {
    async getSuggestions(preferences) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Get unique destinations based on preferences
        const suggestedDestinations = new Set();
        preferences.forEach(preference => {
            const destinations = preferenceMap[preference] || [];
            destinations.forEach(dest => suggestedDestinations.add(dest));
        });

        // Convert Set to Array and get full destination details
        return Array.from(suggestedDestinations)
            .map(destName => destinations.find(d => d.name === destName))
            .filter(Boolean)
            .slice(0, 3); // Return top 3 suggestions
    }
}; 