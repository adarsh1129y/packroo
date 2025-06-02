// UI functions for order management
export function displayOrderConfirmation(orderId) {
    const confirmationDiv = document.createElement('div');
    confirmationDiv.className = 'order-confirmation';
    confirmationDiv.innerHTML = `
        <h3>Order Placed Successfully!</h3>
        <p>Your order ID is: ${orderId}</p>
        <p>Thank you for your order. We will process it shortly.</p>
    `;
    document.body.appendChild(confirmationDiv);

    // Remove confirmation after 5 seconds
    setTimeout(() => {
        confirmationDiv.remove();
    }, 5000);
}

export function displayOrderHistory(orders) {
    const orderHistoryDiv = document.getElementById('orderHistory');
    if (!orderHistoryDiv) return;

    orderHistoryDiv.innerHTML = orders.map(order => `
        <div class="order-card">
            <h4>Order #${order.id}</h4>
            <p>Date: ${new Date(order.orderDate.toDate()).toLocaleDateString()}</p>
            <p>Status: ${order.status}</p>
            <p>Total: $${order.totalAmount}</p>
            <div class="order-items">
                ${order.items.map(item => `
                    <div class="order-item">
                        <span>${item.name}</span>
                        <span>Quantity: ${item.quantity}</span>
                        <span>Price: $${item.price}</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
}

export function showOrderError(error) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'order-error';
    errorDiv.innerHTML = `
        <p>Error: ${error.message}</p>
    `;
    document.body.appendChild(errorDiv);

    // Remove error message after 5 seconds
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
} 