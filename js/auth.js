// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import {
    getAuth,
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import {
    getFirestore,
    doc,
    setDoc,
    getDoc
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBZrE8KtbEVBJLdMcDRqw4TtDGSP-TVDPg",
    authDomain: "new-uii.firebaseapp.com",
    projectId: "new-uii",
    storageBucket: "new-uii.firebasestorage.app",
    messagingSenderId: "877078472252",
    appId: "1:877078472252:web:5532d1120f9d16b7104539"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Google Sign-In function
export async function loginWithGoogle() {
    try {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({
            prompt: 'select_account'
        });

        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        console.log("Logged in with Google:", user);

        // Store additional user data in Firestore
        await setDoc(doc(db, 'users', user.uid), {
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            lastLogin: new Date()
        }, { merge: true });

        // Update UI
        updateUIForLoggedInUser(user);
        closeLoginModal();
        return user;
    } catch (error) {
        console.error("Google Sign In Error:", error);
        alert(error.message);
        return null;
    }
}

// Email/Password Sign-In function
export async function loginWithEmailPassword() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log("Logged in user:", user);

        updateUIForLoggedInUser(user);
        closeLoginModal();
        return user;
    } catch (error) {
        console.error("Login error:", error);
        alert(error.message);
        return null;
    }
}

// Sign Out function
export async function logout() {
    try {
        await signOut(auth);
        console.log("User signed out");
        window.location.reload();
    } catch (error) {
        console.error("Sign out error:", error);
        alert(error.message);
    }
}

// Update UI for logged in user
export function updateUIForLoggedInUser(user) {
    console.log("Updating UI for user:", user);
    const avatarButton = document.querySelector('button[onclick="showLoginModal()"]');

    if (user.photoURL) {
        avatarButton.innerHTML = `<img src="${user.photoURL}" alt="Profile" class="h-7 w-7 rounded-full">`;
    } else {
        avatarButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>`;
    }

    avatarButton.onclick = () => window.location.href = '../profile.html';

    // Store user data in localStorage
    const userData = {
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        uid: user.uid
    };
    localStorage.setItem('user', JSON.stringify(userData));
    console.log("User data stored in localStorage:", userData);
}

// Auth state observer
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("Auth state changed - User is signed in:", user.uid);
        updateUIForLoggedInUser(user);
    } else {
        console.log("Auth state changed - User is signed out");
        localStorage.removeItem('user');
    }
});

// Make functions available globally
window.loginWithGoogle = loginWithGoogle;
window.loginWithEmailPassword = loginWithEmailPassword;
window.logout = logout; 