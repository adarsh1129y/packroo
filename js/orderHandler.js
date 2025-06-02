import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";

const db = getFirestore();
const auth = getAuth();

// Function to validate form data
function validateFormData(formData) {
    const errors = [];

    if (!formData.startDate) errors.push('Start date is required');
    if (!formData.endDate) errors.push('End date is required');
    if (!formData.fullName) errors.push('Full name is required');
    if (!formData.phoneNumber) errors.push('Phone number is required');
    if (!formData.location) errors.push('Delivery location is required');
    if (!formData.paymentMethod) errors.push('Payment method is required');

    // Validate dates
    if (formData.startDate && formData.endDate) {
        const start = new Date(formData.startDate);
        const end = new Date(formData.endDate);
        if (start >= end) {
            errors.push('End date must be after start date');
        }
    }

    // Validate phone number
    if (formData.phoneNumber && !/^\d{10}$/.test(formData.phoneNumber)) {
        errors.push('Phone number must be 10 digits');
    }

    return errors;
}

// Function to handle order submission
export async function handleOrderSubmit(formData) {
    try {
        // Check if user is logged in
        const currentUser = auth.currentUser;
        if (!currentUser) {
            throw new Error('Please login to place an order');
        }

        // Validate form data
        const errors = validateFormData(formData);
        if (errors.length > 0) {
            throw new Error(errors.join('\n'));
        }

        // Prepare order data
        const orderData = {
            ...formData,
            userId: currentUser.uid,
            userEmail: currentUser.email,
            orderDate: new Date().toISOString(),
            status: 'pending'
        };

        // Save order to Firestore
        const ordersRef = collection(db, 'orders');
        const docRef = await addDoc(ordersRef, orderData);

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

// Function to initialize order form
export function initializeOrderForm() {
    const rentalForm = document.getElementById('rentalForm');
    if (!rentalForm) return;

    // Set minimum dates
    const today = new Date().toISOString().split('T')[0];
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');

    if (startDateInput) startDateInput.min = today;
    if (endDateInput) endDateInput.min = today;

    // Add event listeners for date changes
    if (startDateInput && endDateInput) {
        startDateInput.addEventListener('change', function () {
            endDateInput.min = this.value;
            calculateTotal();
        });
        endDateInput.addEventListener('change', calculateTotal);
    }

    // Handle form submission
    rentalForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        try {
            const formData = {
                itemId: document.getElementById('itemId').value,
                itemName: document.getElementById('itemName').value,
                itemPrice: parseFloat(document.getElementById('itemPrice').value),
                startDate: document.getElementById('startDate').value,
                endDate: document.getElementById('endDate').value,
                fullName: document.getElementById('fullName').value,
                phoneNumber: document.getElementById('phoneNumber').value,
                location: document.getElementById('location').value,
                specialInstructions: document.getElementById('specialInstructions').value,
                paymentMethod: document.querySelector('input[name="paymentMethod"]:checked')?.value,
                totalAmount: parseFloat(document.getElementById('totalAmount').textContent)
            };

            const result = await handleOrderSubmit(formData);

            // Show success message
            alert(result.message);

            // Close modal
            const modal = document.getElementById('rentalModal');
            if (modal) {
                modal.classList.remove('flex');
                modal.classList.add('hidden');
            }

            // Reset form
            rentalForm.reset();

        } catch (error) {
            alert(error.message || 'Error placing order. Please try again.');
        }
    });
}

// Function to calculate total amount
function calculateTotal() {
    const startDate = new Date(document.getElementById('startDate').value);
    const endDate = new Date(document.getElementById('endDate').value);
    const itemPrice = parseFloat(document.getElementById('itemPrice').value);

    if (startDate && endDate && !isNaN(startDate) && !isNaN(endDate)) {
        const diffTime = Math.abs(endDate - startDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        document.getElementById('totalDays').textContent = diffDays;
        const totalAmount = diffDays * itemPrice;
        document.getElementById('totalAmount').textContent = totalAmount.toFixed(2);
    }
} 