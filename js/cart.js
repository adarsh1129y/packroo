// Initialize cart
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Add item to cart
function addToCart(item) {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...item, quantity: 1 });
    }
    updateCartUI();
    saveCart();
}

// Remove item from cart
function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    updateCartUI();
    saveCart();
}

// Update item quantity
function updateQuantity(itemId, quantity) {
    const item = cart.find(item => item.id === itemId);
    if (item) {
        item.quantity = quantity > 0 ? quantity : 1;
        updateCartUI();
        saveCart();
    }
}

// Calculate total
function calculateTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Update cart UI
function updateCartUI() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    if (!cartItems || !cartTotal) return;

    cartItems.innerHTML = '';
    cart.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}" />
            <div class="item-details">
                <h3>${item.name}</h3>
                <p>₹${item.price}</p>
            </div>
            <div class="quantity-controls">
                <button onclick="updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
                <span>${item.quantity}</span>
                <button onclick="updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
            </div>
            <button onclick="removeFromCart('${item.id}')" class="remove-btn">Remove</button>
        `;
        cartItems.appendChild(itemElement);
    });

    cartTotal.textContent = `Total: ₹${calculateTotal().toFixed(2)}`;
}

// Place order
async function placeOrder() {
    try {
        const user = firebase.auth().currentUser;
        if (!user) {
            alert('Please login to place an order');
            return;
        }

        const orderData = {
            items: cart.map(item => ({
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity
            })),
            total: calculateTotal(),
            userId: user.uid,
            userEmail: user.email,
            status: 'pending',
            createdAt: new Date().toISOString()
        };

        // Add order to Firebase
        const db = firebase.firestore();
        await db.collection('orders').add(orderData);

        // Clear cart after successful order
        cart = [];
        saveCart();
        updateCartUI();
        
        // Close cart modal
        const cartModal = document.getElementById('cart-modal');
        if (cartModal) {
            cartModal.style.display = 'none';
        }

        alert('Order placed successfully!');
    } catch (error) {
        console.error('Error placing order:', error);
        alert('Error placing order. Please try again.');
    }
}

// Initialize cart UI
document.addEventListener('DOMContentLoaded', () => {
    updateCartUI();
});
