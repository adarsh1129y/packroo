// Initialize Firebase
const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

// Real-time listeners
let ordersListener = null;
let productsListener = null;
let usersListener = null;

// DOM Elements
const statsGrid = document.querySelector('.stats-grid');
const ordersTable = document.querySelector('.orders-table tbody');
const searchBar = document.querySelector('.search-bar');
const dashboardContent = document.getElementById('dashboardContent');

// Stats counters
let totalOrders = 0;
let totalRevenue = 0;
let totalUsers = 0;
let totalProducts = 0;

// Check if user is admin
async function isUserAdmin(user) {
    if (!user) return false;

    try {
        const userDoc = await db.collection('users').doc(user.uid).get();
        return userDoc.exists && userDoc.data().role === 'admin';
    } catch (error) {
        console.error('Error checking admin status:', error);
        return false;
    }
}

// Initialize counters
async function initializeCounters() {
    try {
        // Get total orders and revenue
        const ordersSnapshot = await db.collection('orders').get();
        totalOrders = ordersSnapshot.size;
        totalRevenue = ordersSnapshot.docs.reduce((sum, doc) => {
            const order = doc.data();
            return sum + (order.totalAmount || 0);
        }, 0);

        // Get total users
        const usersSnapshot = await db.collection('users').get();
        totalUsers = usersSnapshot.size;

        // Get total products
        const productsSnapshot = await db.collection('products').get();
        totalProducts = productsSnapshot.size;

        // Update the display
        updateStatsDisplay();
    } catch (error) {
        console.error('Error initializing counters:', error);
    }
}

// Initialize real-time listeners
function initializeRealTimeListeners() {
    // Orders listener
    ordersListener = db.collection('orders')
        .orderBy('timestamp', 'desc')
        .onSnapshot(snapshot => {
            let ordersTotal = 0;
            let revenueTotal = 0;

            snapshot.forEach(doc => {
                const order = doc.data();
                ordersTotal++;
                revenueTotal += order.totalAmount || 0;

                // Update or add order to table
                const existingRow = document.getElementById(`order-${doc.id}`);
                if (existingRow) {
                    updateOrderInTable(order, doc.id);
                } else {
                    addOrderToTable(order, doc.id);
                }
            });

            totalOrders = ordersTotal;
            totalRevenue = revenueTotal;
            updateStatsDisplay();
        }, error => {
            console.error('Error fetching orders:', error);
        });

    // Products listener
    productsListener = db.collection('products')
        .onSnapshot(snapshot => {
            totalProducts = snapshot.size;
            updateStatsDisplay();
        }, error => {
            console.error('Error fetching products:', error);
        });

    // Users listener
    usersListener = db.collection('users')
        .onSnapshot(snapshot => {
            totalUsers = snapshot.size;
            updateStatsDisplay();
        }, error => {
            console.error('Error fetching users:', error);
        });
}

// Update order in table
function updateOrderInTable(order, orderId) {
    const row = document.getElementById(`order-${orderId}`);
    if (row) {
        row.innerHTML = `
            <td>${orderId}</td>
            <td>${order.customerName || 'N/A'}</td>
            <td>${order.items ? order.items.length + ' items' : 'N/A'}</td>
            <td>₹${order.totalAmount || 0}</td>
            <td><span class="status-badge ${(order.status || 'pending').toLowerCase()}">${order.status || 'Pending'}</span></td>
            <td>${order.timestamp ? new Date(order.timestamp.toDate()).toLocaleString() : 'N/A'}</td>
            <td>
                <button onclick="updateOrderStatus('${orderId}', '${order.status || 'pending'}')" class="action-btn">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="viewOrderDetails('${orderId}')" class="action-btn">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        `;
    }
}

// Add order to table
function addOrderToTable(order, orderId) {
    const row = document.createElement('tr');
    row.id = `order-${orderId}`;
    row.innerHTML = `
        <td>${orderId}</td>
        <td>${order.customerName || 'N/A'}</td>
        <td>${order.items ? order.items.length + ' items' : 'N/A'}</td>
        <td>₹${order.totalAmount || 0}</td>
        <td><span class="status-badge ${(order.status || 'pending').toLowerCase()}">${order.status || 'Pending'}</span></td>
        <td>${order.timestamp ? new Date(order.timestamp.toDate()).toLocaleString() : 'N/A'}</td>
        <td>
            <button onclick="updateOrderStatus('${orderId}', '${order.status || 'pending'}')" class="action-btn">
                <i class="fas fa-edit"></i>
            </button>
            <button onclick="viewOrderDetails('${orderId}')" class="action-btn">
                <i class="fas fa-eye"></i>
            </button>
        </td>
    `;
    if (ordersTable) {
        ordersTable.insertBefore(row, ordersTable.firstChild);
    }
}

// Update stats display
function updateStatsDisplay() {
    if (statsGrid) {
        statsGrid.innerHTML = `
            <div class="stat-card">
                <h3>Total Orders</h3>
                <div class="number">${totalOrders.toLocaleString()}</div>
            </div>
            <div class="stat-card">
                <h3>Total Revenue</h3>
                <div class="number">₹${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            </div>
            <div class="stat-card">
                <h3>Total Users</h3>
                <div class="number">${totalUsers.toLocaleString()}</div>
            </div>
            <div class="stat-card">
                <h3>Total Products</h3>
                <div class="number">${totalProducts.toLocaleString()}</div>
            </div>
        `;
    }
}

// Update order status
async function updateOrderStatus(orderId, currentStatus) {
    const statuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    const currentIndex = statuses.indexOf(currentStatus);
    const nextStatus = statuses[(currentIndex + 1) % statuses.length];

    try {
        await db.collection('orders').doc(orderId).update({
            status: nextStatus,
            lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
        });
    } catch (error) {
        console.error('Error updating order status:', error);
        alert('Failed to update order status');
    }
}

// View order details
function viewOrderDetails(orderId) {
    db.collection('orders').doc(orderId).get()
        .then(doc => {
            if (doc.exists) {
                const order = doc.data();
                // Create and show modal with order details
                const modal = document.createElement('div');
                modal.className = 'modal';
                modal.innerHTML = `
                    <div class="modal-content">
                        <h2>Order Details</h2>
                        <p><strong>Order ID:</strong> ${orderId}</p>
                        <p><strong>Customer:</strong> ${order.customerName || 'N/A'}</p>
                        <p><strong>Items:</strong> ${order.items ? order.items.length + ' items' : 'N/A'}</p>
                        <p><strong>Total Amount:</strong> ₹${order.totalAmount || 0}</p>
                        <p><strong>Status:</strong> ${order.status || 'Pending'}</p>
                        <p><strong>Date:</strong> ${order.timestamp ? new Date(order.timestamp.toDate()).toLocaleString() : 'N/A'}</p>
                        <button onclick="this.parentElement.parentElement.remove()">Close</button>
                    </div>
                `;
                document.body.appendChild(modal);
            }
        })
        .catch(error => {
            console.error('Error fetching order details:', error);
            alert('Error fetching order details');
        });
}

// Search functionality
if (searchBar) {
    searchBar.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const rows = ordersTable.getElementsByTagName('tr');

        Array.from(rows).forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(searchTerm) ? '' : 'none';
        });
    });
}

// Test Firebase Connection
async function testFirebaseConnection() {
    try {
        // Test Firestore connection
        const testDoc = await db.collection('test').doc('connection').get();
        console.log('Firestore connection successful');

        // Test current user
        const user = auth.currentUser;
        if (user) {
            console.log('User is logged in:', user.email);
            // Test admin status
            const isAdmin = await isUserAdmin(user);
            console.log('Is admin:', isAdmin);
        } else {
            console.log('No user logged in');
        }

        // Test collections
        const ordersSnapshot = await db.collection('orders').get();
        console.log('Orders count:', ordersSnapshot.size);

        const usersSnapshot = await db.collection('users').get();
        console.log('Users count:', usersSnapshot.size);

        const productsSnapshot = await db.collection('products').get();
        console.log('Products count:', productsSnapshot.size);

        return true;
    } catch (error) {
        console.error('Firebase connection test failed:', error);
        return false;
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', async () => {
    // Test Firebase connection first
    const connectionTest = await testFirebaseConnection();
    if (!connectionTest) {
        alert('Failed to connect to Firebase. Please check your connection and try again.');
        return;
    }

    // Check authentication
    auth.onAuthStateChanged(async user => {
        if (user) {
            const isAdmin = await isUserAdmin(user);
            if (isAdmin) {
                // Show dashboard content
                if (dashboardContent) {
                    dashboardContent.style.display = 'block';
                }
                // Initialize counters first
                await initializeCounters();
                // Then initialize real-time listeners
                initializeRealTimeListeners();
            } else {
                // Not an admin, redirect to home page
                alert('Access denied. Admin privileges required.');
                window.location.href = 'index.html';
            }
        } else {
            // Not logged in, redirect to login page
            window.location.href = 'login.html';
        }
    });
});

// Cleanup listeners on page unload
window.addEventListener('beforeunload', () => {
    if (ordersListener) ordersListener();
    if (productsListener) productsListener();
    if (usersListener) usersListener();
}); 