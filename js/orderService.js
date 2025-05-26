import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";

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
const db = getFirestore(app);
const auth = getAuth(app);

export async function placeOrder(orderData) {
    try {
        console.log('Starting order placement...');

        // Check if user is authenticated
        const currentUser = auth.currentUser;
        if (!currentUser) {
            console.log('No authenticated user found');
            throw new Error('Please login to place an order');
        }
        console.log('User authenticated:', currentUser.uid);

        // Add user information to order data
        const completeOrderData = {
            ...orderData,
            userId: currentUser.uid,
            userEmail: currentUser.email,
            orderDate: new Date().toISOString(),
            status: 'pending'
        };

        console.log('Prepared order data:', completeOrderData);

        // Save order to Firestore
        const ordersRef = collection(db, 'orders');
        const docRef = await addDoc(ordersRef, completeOrderData);
        console.log('Order saved with ID:', docRef.id);

        return {
            success: true,
            orderId: docRef.id,
            message: 'Order placed successfully!'
        };
    } catch (error) {
        console.error('Error placing order:', error);
        throw error;
    }
}

export function calculateTotalAmount(startDate, endDate, pricePerDay) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start && end && !isNaN(start) && !isNaN(end)) {
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays > 0) {
            return {
                days: diffDays,
                total: (diffDays * pricePerDay).toFixed(2)
            };
        }
    }

    return {
        days: 0,
        total: '0.00'
    };
} 