import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";

const db = getFirestore();
const auth = getAuth();

// Function to place an order
export async function placeOrder(orderData) {
    try {
        const currentUser = auth.currentUser;
        if (!currentUser) {
            throw new Error('Please login to place an order');
        }

        // Add user information to order data
        const orderWithUserData = {
            ...orderData,
            userId: currentUser.uid,
            userEmail: currentUser.email,
            orderDate: new Date().toISOString(),
            status: 'pending'
        };

        // Save order to Firestore
        const ordersRef = collection(db, 'orders');
        const docRef = await addDoc(ordersRef, orderWithUserData);

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

// Function to calculate total amount
export function calculateTotalAmount(startDate, endDate, pricePerDay) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays * pricePerDay;
} 