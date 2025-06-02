import { handleOrderSubmit } from './orderService.js';
import { displayOrderConfirmation, showOrderError } from './orderUI.js';

// Initialize the order modal
export function initializeOrderModal() {
    const rentButtons = document.querySelectorAll('.rent-button');
    rentButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const itemId = button.dataset.itemId;
            const itemName = button.dataset.itemName;
            const itemPrice = parseFloat(button.dataset.itemPrice);

            // Show the rental modal
            const modal = document.getElementById('rentalModal');
            if (!modal) {
                console.error('Rental modal not found');
                return;
            }

            // Set the item details in the modal
            document.getElementById('itemId').value = itemId;
            document.getElementById('itemName').value = itemName;
            document.getElementById('itemPrice').value = itemPrice;
            document.getElementById('itemNameDisplay').textContent = itemName;
            document.getElementById('itemPriceDisplay').textContent = itemPrice;

            // Show the modal
            modal.classList.remove('hidden');
            modal.classList.add('flex');
        });
    });

    // Handle form submission
    const rentalForm = document.getElementById('rentalForm');
    if (rentalForm) {
        rentalForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            try {
                const orderItems = [{
                    productId: document.getElementById('itemId').value,
                    name: document.getElementById('itemName').value,
                    quantity: 1,
                    price: parseFloat(document.getElementById('itemPrice').value)
                }];

                const orderId = await handleOrderSubmit(orderItems);
                displayOrderConfirmation(orderId);
                closeRentalModal();
            } catch (error) {
                showOrderError(error);
            }
        });
    }
}

// Close the rental modal
export function closeRentalModal() {
    const modal = document.getElementById('rentalModal');
    if (modal) {
        modal.classList.remove('flex');
        modal.classList.add('hidden');
    }
}

// Calculate total amount based on rental period
export function calculateTotal() {
    const startDate = new Date(document.getElementById('startDate').value);
    const endDate = new Date(document.getElementById('endDate').value);
    const pricePerDay = parseFloat(document.getElementById('itemPrice').value);

    if (startDate && endDate && !isNaN(startDate) && !isNaN(endDate)) {
        const diffTime = Math.abs(endDate - startDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays > 0) {
            const totalAmount = diffDays * pricePerDay;
            document.getElementById('totalDays').textContent = diffDays;
            document.getElementById('totalAmount').textContent = totalAmount.toFixed(2);
            document.getElementById('finalAmount').textContent = totalAmount.toFixed(2);
        }
    }
} 