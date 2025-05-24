// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD-cu7XEcuFY5Oyss63O4C6J1E_5sypSfU",
    authDomain: "packroo.firebaseapp.com",
    projectId: "packroo",
    storageBucket: "packroo.appspot.com",
    messagingSenderId: "981899829718",
    appId: "1:981899829718:web:7f6e2166535e872503b69d"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Rental service functions

// Place rental
async function placeRental(rentalData) {
    try {
        const user = firebase.auth().currentUser;
        if (!user) {
            throw new Error('User not authenticated');
        }

        // Add rental to Firebase
        const rentalRef = db.collection('rentals');
        const rentalDoc = await rentalRef.add({
            ...rentalData,
            userId: user.uid,
            userEmail: user.email,
            status: 'pending',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });

        return rentalDoc.id;
    } catch (error) {
        console.error('Error placing rental:', error);
        throw error;
    }
}

// Get user rentals
async function getUserRentals(userId) {
    try {
        const rentalRef = db.collection('rentals');
        const snapshot = await rentalRef.where('userId', '==', userId).get();
        const rentals = [];

        snapshot.forEach(doc => {
            const rental = doc.data();
            rentals.push({
                id: doc.id,
                ...rental
            });
        });

        return rentals;
    } catch (error) {
        console.error('Error getting user rentals:', error);
        throw error;
    }
}

// Get rental by ID
async function getRental(rentalId) {
    try {
        const rentalRef = db.collection('rentals').doc(rentalId);
        const doc = await rentalRef.get();

        if (!doc.exists) {
            throw new Error('Rental not found');
        }

        return {
            id: doc.id,
            ...doc.data()
        };
    } catch (error) {
        console.error('Error getting rental:', error);
        throw error;
    }
}

// Update rental status
async function updateRentalStatus(rentalId, newStatus) {
    try {
        const rentalRef = db.collection('rentals').doc(rentalId);
        await rentalRef.update({
            status: newStatus,
            updatedAt: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error updating rental status:', error);
        throw error;
    }
}

// Cancel rental
async function cancelRental(rentalId) {
    try {
        const rentalRef = db.collection('rentals').doc(rentalId);
        await rentalRef.update({
            status: 'cancelled',
            updatedAt: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error cancelling rental:', error);
        throw error;
    }
}

// Export functions
export {
    placeRental,
    getUserRentals,
    getRental,
    updateRentalStatus,
    cancelRental
};
