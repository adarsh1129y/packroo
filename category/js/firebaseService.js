import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { getFirestore, collection, addDoc, query, where, getDocs, serverTimestamp, doc, setDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

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

// Function to place a rental order
export async function placeCategoryOrder(orderData) {
    try {
        console.log('Starting order placement...'); // Debug log
        const currentUser = auth.currentUser;

        if (!currentUser) {
            console.log('No user logged in'); // Debug log
            throw new Error('Please login to place an order');
        }

        console.log('User authenticated:', currentUser.uid); // Debug log

        // Add user information to order data
        const orderWithUserData = {
            ...orderData,
            userId: currentUser.uid,
            userEmail: currentUser.email,
            orderDate: serverTimestamp(),
            status: 'pending',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        };

        console.log('Order data with user info:', orderWithUserData); // Debug log

        // Create a new document with auto-generated ID
        const ordersRef = collection(db, 'orders');
        const newOrderRef = doc(ordersRef);

        // Use setDoc instead of addDoc for better control
        await setDoc(newOrderRef, orderWithUserData);

        console.log('Order placed successfully with ID:', newOrderRef.id); // Debug log

        return {
            success: true,
            orderId: newOrderRef.id,
            message: 'Order placed successfully!'
        };
    } catch (error) {
        console.error('Error in placeCategoryOrder:', error); // Debug log

        // Handle specific Firebase errors
        if (error.code === 'permission-denied') {
            throw new Error('Permission denied. Please make sure you are logged in and have the necessary permissions.');
        } else if (error.code === 'unauthenticated') {
            throw new Error('Please login to place an order');
        } else {
            throw new Error('Failed to place order. Please try again later.');
        }
    }
}

// Function to get user's orders
export async function getUserOrders() {
    try {
        const currentUser = auth.currentUser;
        if (!currentUser) {
            throw new Error('Please login to view orders');
        }

        const ordersRef = collection(db, 'orders');
        const q = query(ordersRef, where('userId', '==', currentUser.uid));
        const querySnapshot = await getDocs(q);

        const orders = [];
        querySnapshot.forEach((doc) => {
            orders.push({
                id: doc.id,
                ...doc.data()
            });
        });

        return orders;
    } catch (error) {
        console.error('Error fetching orders:', error);

        // Handle specific Firebase errors
        if (error.code === 'permission-denied') {
            throw new Error('Permission denied. Please make sure you are logged in and have the necessary permissions.');
        } else if (error.code === 'unauthenticated') {
            throw new Error('Please login to view orders');
        } else {
            throw new Error('Failed to fetch orders. Please try again later.');
        }
    }
}

// Export Firebase instances
export { auth, db }; 