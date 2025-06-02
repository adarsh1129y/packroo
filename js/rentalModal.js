import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

// Firebase configuration (replace with your actual config)
const firebaseConfig = {
    apiKey: "AIzaSyBZrE8KtbEVBJLdMcDRqw4TtDGSP-TVDPg",
    authDomain: "new-uii.firebaseapp.com",
    projectId: "new-uii",
    storageBucket: "new-uii.firebasestorage.app",
    messagingSenderId: "877078472252",
    appId: "1:877078472252:web:5532d1120f9d16b7104539"
};

// Initialize Firebase (only once)
let app;
let auth;
let db;

try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    console.log('Firebase initialized successfully');
} catch (error) {
    console.error('Firebase initialization error:', error);
}

// Function to calculate total amount based on rental period
export function calculateTotal() {
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    const pricePerDayInput = document.getElementById('itemPrice');
    const totalDaysSpan = document.getElementById('totalDays');
    const totalAmountSpan = document.getElementById('totalAmount');
    const finalAmountSpan = document.getElementById('finalAmount');

    if (!startDateInput || !endDateInput || !pricePerDayInput || !totalDaysSpan || !totalAmountSpan || !finalAmountSpan) {
        console.error("Missing elements for total calculation");
        return;
    }

    const startDate = new Date(startDateInput.value);
    const endDate = new Date(endDateInput.value);
    const pricePerDay = parseFloat(pricePerDayInput.value);

    if (startDate && endDate && !isNaN(startDate) && !isNaN(endDate) && !isNaN(pricePerDay)) {
        const diffTime = Math.abs(endDate - startDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays > 0) {
            const totalAmount = diffDays * pricePerDay;
            totalDaysSpan.textContent = diffDays;
            totalAmountSpan.textContent = totalAmount.toFixed(2);
            finalAmountSpan.textContent = totalAmount.toFixed(2);
        } else {
            totalDaysSpan.textContent = '0';
            totalAmountSpan.textContent = '0';
            finalAmountSpan.textContent = '0';
        }
    } else {
        totalDaysSpan.textContent = '0';
        totalAmountSpan.textContent = '0';
        finalAmountSpan.textContent = '0';
    }
}

// Function to show the rental modal
export function showRentalModal(itemId, itemName, itemPrice) {
    const modal = document.getElementById('rentalModal');
    if (!modal) {
        console.error("Rental modal not found");
        return;
    }

    // Set the form values
    const itemIdInput = document.getElementById('itemId');
    const itemNameInput = document.getElementById('itemName');
    const itemPriceInput = document.getElementById('itemPrice');
    const itemNameDisplay = document.getElementById('itemNameDisplay');
    const itemPriceDisplay = document.getElementById('itemPriceDisplay');
    const modalImage = document.getElementById('itemImage');
    const rentalForm = document.getElementById('rentalForm');

    if (!itemIdInput || !itemNameInput || !itemPriceInput || !itemNameDisplay || !itemPriceDisplay || !modalImage || !rentalForm) {
        console.error("Missing elements in rental modal");
        return;
    }

    itemIdInput.value = itemId;
    itemNameInput.value = itemName;
    itemPriceInput.value = itemPrice;

    // Update display elements
    itemNameDisplay.textContent = itemName;
    itemPriceDisplay.textContent = itemPrice;

    // Get the product image from the clicked button's parent card
    const productCard = document.querySelector(`[data-item-id="${itemId}"]`).closest('.gear-card');
    if (productCard) {
        const productImage = productCard.querySelector('img');
        if (productImage) {
            modalImage.src = productImage.getAttribute('src');
            modalImage.alt = itemName;
        } else {
            console.warn("Product image not found for item:", itemName);
            modalImage.src = ''; // Set a default or leave blank
            modalImage.alt = 'No image available';
        }
    } else {
        console.warn("Product card not found for item id:", itemId);
        modalImage.src = ''; // Set a default or leave blank
        modalImage.alt = 'No image available';
    }

    // Show the modal
    modal.classList.remove('hidden');
    modal.classList.add('flex');

    // Reset the form and total amount display
    rentalForm.reset();
    document.getElementById('totalDays').textContent = '0';
    document.getElementById('totalAmount').textContent = '0';
    document.getElementById('finalAmount').textContent = '0';

    // Initialize date inputs with min date as today
    const today = new Date().toISOString().split('T')[0];
    const startDate = document.getElementById('startDate');
    const endDate = document.getElementById('endDate');
    if (startDate) startDate.min = today;
    if (endDate) endDate.min = today;

    // Update endDate min when startDate changes
    if (startDate && endDate) {
        startDate.addEventListener('change', function () {
            endDate.min = this.value;
            calculateTotal(); // Recalculate total when start date changes
        });
    }
    if (endDate) {
        endDate.addEventListener('change', calculateTotal); // Recalculate total when end date changes
    }

}

// Function to close the rental modal
export function closeRentalModal() {
    const modal = document.getElementById('rentalModal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        document.getElementById('rentalForm').reset(); // Reset form on close
    }
}

// Handle form submission
async function handleRentalFormSubmit(e) {
    e.preventDefault();

    const rentalForm = e.target;

    // Check if user is logged in
    const currentUser = auth.currentUser;
    if (!currentUser) {
        alert('Please login to place an order');
        // Assuming showLoginModal is globally available or imported elsewhere
        if (typeof showLoginModal === 'function') {
            showLoginModal();
        } else {
            console.error("showLoginModal function not available");
        }
        return;
    }

    // Get the selected payment method
    const paymentMethodInput = rentalForm.querySelector('input[name="paymentMethod"]:checked');
    if (!paymentMethodInput) {
        alert('Please select a payment method');
        return;
    }

    // Validate required fields
    const requiredFields = ['startDate', 'endDate', 'fullName', 'phoneNumber', 'location'];
    for (const fieldId of requiredFields) {
        const input = document.getElementById(fieldId);
        if (!input || !input.value) {
            alert(`Please fill in ${input ? input.labels[0].textContent.trim() : fieldId}`); // Use label text if available
            return;
        }
    }

    // Validate dates
    const startDate = new Date(document.getElementById('startDate').value);
    const endDate = new Date(document.getElementById('endDate').value);
    if (startDate >= endDate) {
        alert('End date must be after start date');
        return;
    }

    const orderData = {
        itemId: document.getElementById('itemId').value,
        itemName: document.getElementById('itemName').value,
        itemPrice: parseFloat(document.getElementById('itemPrice').value),
        startDate: document.getElementById('startDate').value,
        endDate: document.getElementById('endDate').value,
        fullName: document.getElementById('fullName').value,
        phoneNumber: document.getElementById('phoneNumber').value,
        location: document.getElementById('location').value,
        specialInstructions: document.getElementById('specialInstructions').value,
        paymentMethod: paymentMethodInput.value,
        userId: currentUser.uid,
        userEmail: currentUser.email,
        orderDate: new Date().toISOString(),
        status: 'pending',
        totalAmount: parseFloat(document.getElementById('finalAmount').textContent)
    };

    console.log('Submitting order:', orderData);

    try {
        const ordersRef = collection(db, 'orders');
        const docRef = await addDoc(ordersRef, orderData);
        console.log('Order placed successfully with ID:', docRef.id);

        alert('Order placed successfully!');
        closeRentalModal();

    } catch (error) {
        console.error('Error placing order:', error);
        alert('Error placing order: ' + error.message);
    }
}

// Initialize rental modal functionality on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    // Add event listeners to all "Rent Now" buttons
    const rentButtons = document.querySelectorAll('.rent-button');
    rentButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault(); // Prevent default button action
            const itemId = this.getAttribute('data-item-id');
            const itemName = this.getAttribute('data-item-name');
            const itemPrice = this.getAttribute('data-item-price');
            showRentalModal(itemId, itemName, itemPrice);
        });
    });

    // Add event listener for the rental form submission
    const rentalForm = document.getElementById('rentalForm');
    if (rentalForm) {
        rentalForm.addEventListener('submit', handleRentalFormSubmit);
    }

    // Close rental modal when clicking outside
    const rentalModal = document.getElementById('rentalModal');
    if (rentalModal) {
        rentalModal.addEventListener('click', function (e) {
            if (e.target === this) {
                closeRentalModal();
            }
        });
        // Prevent rental modal from closing when clicking inside
        const modalContent = rentalModal.querySelector(':scope > div'); // Select direct child div
        if (modalContent) {
            modalContent.addEventListener('click', function (e) {
                e.stopPropagation();
            });
        }
    }
});

// Expose functions to the global scope if needed by inline scripts (less ideal, but for compatibility)
// window.showRentalModal = showRentalModal;
// window.closeRentalModal = closeRentalModal;
// window.calculateTotal = calculateTotal;

// Note: It's better to handle all interactions within this module after DOMContentLoaded 