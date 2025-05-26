import { db } from '../config/firebaseConfig.js';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';

export const createOrder = async (orderData) => {
    try {
        const orderRef = collection(db, 'orders');
        const docRef = await addDoc(orderRef, {
            ...orderData,
            status: 'pending',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });
        return docRef.id;
    } catch (error) {
        console.error('Error creating order:', error);
        throw error;
    }
};

export const getOrders = async (userId) => {
    try {
        const ordersRef = collection(db, 'orders');
        const q = query(ordersRef, where('userId', '==', userId));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error fetching orders:', error);
        throw error;
    }
};

export const updateOrderStatus = async (orderId, status) => {
    try {
        const orderRef = doc(db, 'orders', orderId);
        await updateDoc(orderRef, {
            status,
            updatedAt: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error updating order status:', error);
        throw error;
    }
};
