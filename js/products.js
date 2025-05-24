// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD-cu7XEcuFY5Oyss63O4C6J1E_5sypSfU",
    authDomain: "packroo.firebaseapp.com",
    projectId: "packroo",
    storageBucket: "packroo.appspot.com",
    messagingSenderId: "981899829718",
    appId: "1:981899829718:web:7f6e2166535e872503b69d"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Get all products
async function getProducts() {
    try {
        const productsRef = db.collection('products');
        const snapshot = await productsRef.get();
        const products = [];
        
        snapshot.forEach(doc => {
            const product = doc.data();
            products.push({
                id: doc.id,
                ...product
            });
        });
        
        return products;
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
}

// Get products by category
async function getProductsByCategory(category) {
    try {
        const productsRef = db.collection('products');
        const snapshot = await productsRef.where('category', '==', category).get();
        const products = [];
        
        snapshot.forEach(doc => {
            const product = doc.data();
            products.push({
                id: doc.id,
                ...product
            });
        });
        
        return products;
    } catch (error) {
        console.error('Error fetching products by category:', error);
        return [];
    }
}

// Add new product
async function addProduct(productData) {
    try {
        const productsRef = db.collection('products');
        await productsRef.add({
            ...productData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });
        return true;
    } catch (error) {
        console.error('Error adding product:', error);
        return false;
    }
}

// Update product
async function updateProduct(productId, updates) {
    try {
        const productRef = db.collection('products').doc(productId);
        await productRef.update({
            ...updates,
            updatedAt: new Date().toISOString()
        });
        return true;
    } catch (error) {
        console.error('Error updating product:', error);
        return false;
    }
}

// Delete product
async function deleteProduct(productId) {
    try {
        const productRef = db.collection('products').doc(productId);
        await productRef.delete();
        return true;
    } catch (error) {
        console.error('Error deleting product:', error);
        return false;
    }
}

// Export functions
export {
    getProducts,
    getProductsByCategory,
    addProduct,
    updateProduct,
    deleteProduct
};
