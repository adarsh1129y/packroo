import {
    getFirestore,
    doc,
    getDoc,
    updateDoc,
    collection,
    query,
    where,
    getDocs
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { getAuth, updateProfile } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";

const db = getFirestore();
const auth = getAuth();

// Get user profile
async function getUserProfile() {
    try {
        const user = auth.currentUser;
        if (!user) {
            throw new Error('User must be logged in to view profile');
        }

        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
            return {
                id: userDoc.id,
                ...userDoc.data()
            };
        } else {
            throw new Error("User profile not found");
        }
    } catch (error) {
        console.error("Error getting user profile:", error);
        throw error;
    }
}

// Update user profile
async function updateUserProfile(profileData) {
    try {
        const user = auth.currentUser;
        if (!user) {
            throw new Error('User must be logged in to update profile');
        }

        // Update auth profile
        if (profileData.displayName || profileData.photoURL) {
            await updateProfile(user, {
                displayName: profileData.displayName,
                photoURL: profileData.photoURL
            });
        }

        // Update Firestore profile
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, {
            ...profileData,
            updatedAt: new Date()
        });

        return {
            id: user.uid,
            ...profileData
        };
    } catch (error) {
        console.error("Error updating user profile:", error);
        throw error;
    }
}

// Get user's rental history
async function getUserRentalHistory() {
    try {
        const user = auth.currentUser;
        if (!user) {
            throw new Error('User must be logged in to view rental history');
        }

        const rentalsRef = collection(db, "rentals");
        const q = query(rentalsRef, where("userId", "==", user.uid));
        const snapshot = await getDocs(q);

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error("Error getting user rental history:", error);
        throw error;
    }
}

// Get user's favorite products
async function getUserFavorites() {
    try {
        const user = auth.currentUser;
        if (!user) {
            throw new Error('User must be logged in to view favorites');
        }

        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            return userData.favorites || [];
        }
        return [];
    } catch (error) {
        console.error("Error getting user favorites:", error);
        throw error;
    }
}

// Add product to favorites
async function addToFavorites(productId) {
    try {
        const user = auth.currentUser;
        if (!user) {
            throw new Error('User must be logged in to add favorites');
        }

        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
            const userData = userDoc.data();
            const favorites = userData.favorites || [];

            if (!favorites.includes(productId)) {
                favorites.push(productId);
                await updateDoc(userRef, {
                    favorites,
                    updatedAt: new Date()
                });
            }
        }
    } catch (error) {
        console.error("Error adding to favorites:", error);
        throw error;
    }
}

// Remove product from favorites
async function removeFromFavorites(productId) {
    try {
        const user = auth.currentUser;
        if (!user) {
            throw new Error('User must be logged in to remove favorites');
        }

        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
            const userData = userDoc.data();
            const favorites = userData.favorites || [];

            const updatedFavorites = favorites.filter(id => id !== productId);
            await updateDoc(userRef, {
                favorites: updatedFavorites,
                updatedAt: new Date()
            });
        }
    } catch (error) {
        console.error("Error removing from favorites:", error);
        throw error;
    }
}

// Export functions
export {
    getUserProfile,
    updateUserProfile,
    getUserRentalHistory,
    getUserFavorites,
    addToFavorites,
    removeFromFavorites
}; 