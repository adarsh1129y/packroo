import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    signOut
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import {
    getFirestore,
    doc,
    setDoc,
    getDoc
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

const auth = getAuth();
const db = getFirestore();
const googleProvider = new GoogleAuthProvider();

// Email/Password Sign In
async function signInWithEmail(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        console.error("Error signing in with email:", error);
        throw error;
    }
}

// Email/Password Sign Up
async function signUpWithEmail(email, password, userData) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Store additional user data in Firestore
        await setDoc(doc(db, "users", user.uid), {
            ...userData,
            email: user.email,
            createdAt: new Date()
        });

        return user;
    } catch (error) {
        console.error("Error signing up with email:", error);
        throw error;
    }
}

// Google Sign In
async function signInWithGoogle() {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;

        // Check if user document exists
        const userDoc = await getDoc(doc(db, "users", user.uid));

        if (!userDoc.exists()) {
            // Create new user document if it doesn't exist
            await setDoc(doc(db, "users", user.uid), {
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
                createdAt: new Date()
            });
        }

        return user;
    } catch (error) {
        console.error("Error signing in with Google:", error);
        throw error;
    }
}

// Sign Out
async function signOutUser() {
    try {
        await signOut(auth);
    } catch (error) {
        console.error("Error signing out:", error);
        throw error;
    }
}

// Get Current User
function getCurrentUser() {
    return auth.currentUser;
}

// Check Authentication State
function onAuthStateChanged(callback) {
    return auth.onAuthStateChanged(callback);
}

// Export functions
export {
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    signOutUser,
    getCurrentUser,
    onAuthStateChanged
}; 