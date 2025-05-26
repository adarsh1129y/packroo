import { db } from '../firebase-config';

class RentalService {
    // Create a new rental
    async createRental(rentalData) {
        try {
            const rentalRef = await db.collection('rentals').add({
                ...rentalData,
                status: 'pending',
                createdAt: new Date()
            });

            // Update product rental count
            await db.collection('products').doc(rentalData.productId).update({
                rentalCount: firebase.firestore.FieldValue.increment(1)
            });

            return rentalRef.id;
        } catch (error) {
            throw error;
        }
    }

    // Get user's rentals
    async getUserRentals(userId) {
        try {
            const snapshot = await db.collection('rentals')
                .where('userId', '==', userId)
                .orderBy('createdAt', 'desc')
                .get();

            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            throw error;
        }
    }

    // Get rental by ID
    async getRentalById(rentalId) {
        try {
            const doc = await db.collection('rentals').doc(rentalId).get();
            return doc.exists ? { id: doc.id, ...doc.data() } : null;
        } catch (error) {
            throw error;
        }
    }

    // Update rental status
    async updateRentalStatus(rentalId, status) {
        try {
            await db.collection('rentals').doc(rentalId).update({
                status,
                updatedAt: new Date()
            });
        } catch (error) {
            throw error;
        }
    }

    // Cancel rental
    async cancelRental(rentalId) {
        try {
            await db.collection('rentals').doc(rentalId).update({
                status: 'cancelled',
                cancelledAt: new Date()
            });
        } catch (error) {
            throw error;
        }
    }

    // Get active rentals
    async getActiveRentals() {
        try {
            const snapshot = await db.collection('rentals')
                .where('status', 'in', ['pending', 'active'])
                .orderBy('createdAt', 'desc')
                .get();

            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            throw error;
        }
    }

    // Get rental history
    async getRentalHistory(userId) {
        try {
            const snapshot = await db.collection('rentals')
                .where('userId', '==', userId)
                .where('status', 'in', ['completed', 'cancelled'])
                .orderBy('createdAt', 'desc')
                .get();

            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            throw error;
        }
    }
}

export const rentalService = new RentalService(); 