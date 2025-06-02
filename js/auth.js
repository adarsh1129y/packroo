import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

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
const googleProvider = new GoogleAuthProvider();

// Make functions available globally
window.loginWithGoogle = async function () {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;

        // Create or update user document in Firestore
        await setDoc(doc(db, "users", user.uid), {
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            lastLogin: new Date().toISOString()
        }, { merge: true });

        // Close login modal and redirect to home page
        closeLoginModal();
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Google sign-in error:', error);
        alert('Error signing in with Google: ' + error.message);
    }
};

window.loginWithEmailPassword = async function () {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        await signInWithEmailAndPassword(auth, email, password);
        closeLoginModal();
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Email/password sign-in error:', error);
        alert('Error signing in: ' + error.message);
    }
};

window.showSignUp = function () {
    // TODO: Implement sign up functionality
    alert('Sign up functionality coming soon!');
};

// Check authentication state
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log('User is signed in:', user.uid);
        // Update UI for logged-in state
        const loginButton = document.querySelector('button[onclick="showLoginModal()"]');
        if (loginButton) {
            loginButton.style.display = 'none';
        }

        // Show profile logo in header
        const profileLogo = document.querySelector('.action-buttons');
        if (profileLogo) {
            profileLogo.innerHTML = `
                <button class="text-white hover:text-blue-200 transition-colors relative" onclick="window.location.href='notifications.html'">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    <span class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">3</span>
                </button>
                <a href="profile.html" class="text-white hover:text-blue-200 transition-colors">
                    <img src="${user.photoURL || '—Pngtree—avatar icon profile icon member_5247852.png'}" alt="Profile" class="h-7 w-7 rounded-full object-cover">
                </a>
            `;
        }
    } else {
        console.log('No user is signed in');
        // Update UI for logged-out state
        const loginButton = document.querySelector('button[onclick="showLoginModal()"]');
        if (loginButton) {
            loginButton.style.display = 'block';
        }

        // Show default profile button
        const profileLogo = document.querySelector('.action-buttons');
        if (profileLogo) {
            profileLogo.innerHTML = `
                <button class="text-white hover:text-blue-200 transition-colors relative" onclick="window.location.href='notifications.html'">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    <span class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">3</span>
                </button>
                <button class="text-white hover:text-blue-200 transition-colors" onclick="showLoginModal()">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                </button>
            `;
        }
    }
});

// Export auth instance for use in other modules
export { auth }; 