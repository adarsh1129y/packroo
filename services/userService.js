import { auth, db } from '../firebase-config';

// User service class
class UserService {
    // Sign up with email and password
    async signUp(email, password, fullName) {
        try {
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            const user = userCredential.user;

            // Create user profile in Firestore
            await db.collection('users').doc(user.uid).set({
                fullName,
                email,
                createdAt: new Date(),
                role: 'user'
            });

            return user;
        } catch (error) {
            throw error;
        }
    }

    // Sign in with email and password
    async signIn(email, password) {
        try {
            const userCredential = await auth.signInWithEmailAndPassword(email, password);
            return userCredential.user;
        } catch (error) {
            throw error;
        }
    }

    // Sign in with Google
    async signInWithGoogle() {
        try {
            const provider = new firebase.auth.GoogleAuthProvider();
            const result = await auth.signInWithPopup(provider);

            // Check if user exists in Firestore
            const userDoc = await db.collection('users').doc(result.user.uid).get();

            if (!userDoc.exists) {
                // Create user profile if it doesn't exist
                await db.collection('users').doc(result.user.uid).set({
                    fullName: result.user.displayName,
                    email: result.user.email,
                    createdAt: new Date(),
                    role: 'user'
                });
            }

            return result.user;
        } catch (error) {
            throw error;
        }
    }

    // Sign out
    async signOut() {
        try {
            await auth.signOut();
        } catch (error) {
            throw error;
        }
    }

    // Reset password
    async resetPassword(email) {
        try {
            await auth.sendPasswordResetEmail(email);
        } catch (error) {
            throw error;
        }
    }

    // Get current user
    getCurrentUser() {
        return auth.currentUser;
    }

    // Get user profile
    async getUserProfile(userId) {
        try {
            const doc = await db.collection('users').doc(userId).get();
            return doc.exists ? doc.data() : null;
        } catch (error) {
            throw error;
        }
    }

    // Update user profile
    async updateUserProfile(userId, data) {
        try {
            await db.collection('users').doc(userId).update(data);
        } catch (error) {
            throw error;
        }
    }
}

export const userService = new UserService(); 