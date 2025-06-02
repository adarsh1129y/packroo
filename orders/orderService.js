import { getFirestore, collection, addDoc, getDocs, query, where } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { Order, calculateTotal } from './orderModel.js';

const db = getFirestore();
const auth = getAuth();

// Function to add a new order
async function addOrder(orderData) {
    try {
        Order.validateOrder(orderData);
        const docRef = await addDoc(collection(db, "orders"), orderData);
        console.log("Order written with ID: ", docRef.id);
        return docRef.id;
    } catch (e) {
        console.error("Error adding order: ", e);
        throw e;
    }
}

// Function to get orders for current user
async function getUserOrders() {
    try {
        const user = auth.currentUser;
        if (!user) {
            throw new Error('User must be logged in to view orders');
        }

        const ordersQuery = query(
            collection(db, "orders"),
            where("customerId", "==", user.uid)
        );

        const querySnapshot = await getDocs(ordersQuery);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error fetching user orders:', error);
        throw error;
    }
}

// Function to handle order submission
async function handleOrderSubmit(orderItems) {
    try {
        const user = auth.currentUser;
        if (!user) {
            throw new Error('User must be logged in to place an order');
        }

        const orderData = {
            customerId: user.uid,
            items: orderItems,
            totalAmount: calculateTotal(orderItems),
            orderDate: new Date(),
            status: 'Processing'
        };

        const orderId = await addOrder(orderData);
        return orderId;
    } catch (error) {
        console.error('Error submitting order:', error);
        throw error;
    }
}

// Initialize order button listeners
function initializeOrderButtons() {
    document.querySelectorAll('.rent-button').forEach(button => {
        button.addEventListener('click', async (e) => {
            e.preventDefault();
            try {
                const itemId = e.target.dataset.itemId;
                const itemName = e.target.dataset.itemName;
                const itemPrice = parseFloat(e.target.dataset.itemPrice);

                const orderItems = [{
                    productId: itemId,
                    name: itemName,
                    quantity: 1,
                    price: itemPrice
                }];

                const orderId = await handleOrderSubmit(orderItems);
                alert(`Order placed successfully! Order ID: ${orderId}`);
            } catch (error) {
                alert('Error placing order: ' + error.message);
            }
        });
    });
}

// Export functions
export {
    addOrder,
    getUserOrders,
    handleOrderSubmit,
    initializeOrderButtons
}; 