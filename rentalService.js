import {
    getFirestore,
    collection,
    addDoc,
    doc,
    getDoc,
    updateDoc,
    query,
    where,
    getDocs
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";

const db = getFirestore();
const auth = getAuth();

// Create a new rental
async function createRental(rentalData) {
    try {
        const user = auth.currentUser;
        if (!user) {
            throw new Error('User must be logged in to create a rental');
        }

        const rental = {
            ...rentalData,
            userId: user.uid,
            status: 'pending',
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const docRef = await addDoc(collection(db, "rentals"), rental);
        return docRef.id;
    } catch (error) {
        console.error("Error creating rental:", error);
        throw error;
    }
}

// Get rental by ID
async function getRentalById(rentalId) {
    try {
        const rentalRef = doc(db, "rentals", rentalId);
        const rentalDoc = await getDoc(rentalRef);

        if (rentalDoc.exists()) {
            return {
                id: rentalDoc.id,
                ...rentalDoc.data()
            };
        } else {
            throw new Error("Rental not found");
        }
    } catch (error) {
        console.error("Error getting rental:", error);
        throw error;
    }
}

// Get user's rentals
async function getUserRentals() {
    try {
        const user = auth.currentUser;
        if (!user) {
            throw new Error('User must be logged in to view rentals');
        }

        const rentalsRef = collection(db, "rentals");
        const q = query(rentalsRef, where("userId", "==", user.uid));
        const snapshot = await getDocs(q);

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error("Error getting user rentals:", error);
        throw error;
    }
}

// Update rental status
async function updateRentalStatus(rentalId, status) {
    try {
        const rentalRef = doc(db, "rentals", rentalId);
        await updateDoc(rentalRef, {
            status,
            updatedAt: new Date()
        });
    } catch (error) {
        console.error("Error updating rental status:", error);
        throw error;
    }
}

// Calculate rental duration
function calculateRentalDuration(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// Calculate rental cost
function calculateRentalCost(dailyRate, duration) {
    return dailyRate * duration;
}

// Validate rental dates
function validateRentalDates(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const now = new Date();

    if (start < now) {
        throw new Error('Start date cannot be in the past');
    }

    if (end <= start) {
        throw new Error('End date must be after start date');
    }

    const duration = calculateRentalDuration(start, end);
    if (duration > 30) {
        throw new Error('Maximum rental duration is 30 days');
    }

    return duration;
}

// Export functions
export {
    createRental,
    getRentalById,
    getUserRentals,
    updateRentalStatus,
    calculateRentalDuration,
    calculateRentalCost,
    validateRentalDates
}; 