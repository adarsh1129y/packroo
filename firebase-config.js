// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD-cu7XEcuFY5Oyss63O4C6J1E_5sypSfU",
    authDomain: "packroo.firebaseapp.com",
    projectId: "packroo",
    storageBucket: "packroo.firebasestorage.app",
    messagingSenderId: "126838617541",
    appId: "1:126838617541:web:7caa242b88463a3f9f07ac",
    measurementId: "G-J57J3YT3WQ"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// Export Firebase services
export { auth, db, storage }; 