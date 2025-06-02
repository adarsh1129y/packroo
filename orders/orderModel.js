// Order data model and validation
export class Order {
    constructor(customerId, items, totalAmount, orderDate, status = 'Processing') {
        this.customerId = customerId;
        this.items = items;
        this.totalAmount = totalAmount;
        this.orderDate = orderDate;
        this.status = status;
    }

    static validateOrder(orderData) {
        if (!orderData.customerId) {
            throw new Error('Customer ID is required');
        }
        if (!orderData.items || !Array.isArray(orderData.items) || orderData.items.length === 0) {
            throw new Error('Order must contain at least one item');
        }
        if (typeof orderData.totalAmount !== 'number' || orderData.totalAmount <= 0) {
            throw new Error('Invalid total amount');
        }
        return true;
    }
}

export function calculateTotal(items) {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
} 