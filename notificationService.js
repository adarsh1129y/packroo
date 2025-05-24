import {
    getFirestore,
    collection,
    addDoc,
    query,
    where,
    orderBy,
    limit,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";

const db = getFirestore();
const auth = getAuth();

// Create a new notification
async function createNotification(userId, notificationData) {
    try {
        const notification = {
            ...notificationData,
            userId,
            read: false,
            createdAt: new Date()
        };

        const docRef = await addDoc(collection(db, "notifications"), notification);
        return docRef.id;
    } catch (error) {
        console.error("Error creating notification:", error);
        throw error;
    }
}

// Get user's notifications
async function getUserNotifications(limit = 10) {
    try {
        const user = auth.currentUser;
        if (!user) {
            throw new Error('User must be logged in to view notifications');
        }

        const notificationsRef = collection(db, "notifications");
        const q = query(
            notificationsRef,
            where("userId", "==", user.uid),
            orderBy("createdAt", "desc"),
            limit(limit)
        );

        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error("Error getting notifications:", error);
        throw error;
    }
}

// Mark notification as read
async function markNotificationAsRead(notificationId) {
    try {
        const notificationRef = doc(db, "notifications", notificationId);
        await updateDoc(notificationRef, {
            read: true,
            updatedAt: new Date()
        });
    } catch (error) {
        console.error("Error marking notification as read:", error);
        throw error;
    }
}

// Mark all notifications as read
async function markAllNotificationsAsRead() {
    try {
        const user = auth.currentUser;
        if (!user) {
            throw new Error('User must be logged in to mark notifications as read');
        }

        const notificationsRef = collection(db, "notifications");
        const q = query(
            notificationsRef,
            where("userId", "==", user.uid),
            where("read", "==", false)
        );

        const snapshot = await getDocs(q);
        const batch = writeBatch(db);

        snapshot.docs.forEach(doc => {
            batch.update(doc.ref, {
                read: true,
                updatedAt: new Date()
            });
        });

        await batch.commit();
    } catch (error) {
        console.error("Error marking all notifications as read:", error);
        throw error;
    }
}

// Subscribe to notifications
function subscribeToNotifications(callback) {
    try {
        const user = auth.currentUser;
        if (!user) {
            throw new Error('User must be logged in to subscribe to notifications');
        }

        const notificationsRef = collection(db, "notifications");
        const q = query(
            notificationsRef,
            where("userId", "==", user.uid),
            orderBy("createdAt", "desc"),
            limit(10)
        );

        return onSnapshot(q, (snapshot) => {
            const notifications = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            callback(notifications);
        });
    } catch (error) {
        console.error("Error subscribing to notifications:", error);
        throw error;
    }
}

// Render notification
function renderNotification(notification) {
    return `
        <div class="notification ${notification.read ? 'read' : 'unread'}" data-notification-id="${notification.id}">
            <div class="notification-icon">
                <i class="fas ${getNotificationIcon(notification.type)}"></i>
            </div>
            <div class="notification-content">
                <p class="notification-message">${notification.message}</p>
                <span class="notification-time">${formatNotificationTime(notification.createdAt)}</span>
            </div>
            ${!notification.read ? `
                <button class="mark-read-button" onclick="markNotificationAsRead('${notification.id}')">
                    <i class="fas fa-check"></i>
                </button>
            ` : ''}
        </div>
    `;
}

// Helper function to get notification icon
function getNotificationIcon(type) {
    const icons = {
        'rental': 'fa-box',
        'payment': 'fa-credit-card',
        'system': 'fa-bell',
        'promo': 'fa-tag',
        'default': 'fa-info-circle'
    };
    return icons[type] || icons.default;
}

// Helper function to format notification time
function formatNotificationTime(timestamp) {
    const date = timestamp.toDate();
    const now = new Date();
    const diff = now - date;

    if (diff < 60000) { // Less than 1 minute
        return 'Just now';
    } else if (diff < 3600000) { // Less than 1 hour
        const minutes = Math.floor(diff / 60000);
        return `${minutes}m ago`;
    } else if (diff < 86400000) { // Less than 1 day
        const hours = Math.floor(diff / 3600000);
        return `${hours}h ago`;
    } else {
        return date.toLocaleDateString();
    }
}

// Export functions
export {
    createNotification,
    getUserNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    subscribeToNotifications,
    renderNotification
}; 