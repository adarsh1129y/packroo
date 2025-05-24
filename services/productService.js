import { db, storage } from '../firebase-config';

class ProductService {
    // Add a new product
    async addProduct(productData, imageFile) {
        try {
            // Upload image to Firebase Storage
            const imageRef = storage.ref(`products/${Date.now()}_${imageFile.name}`);
            const snapshot = await imageRef.put(imageFile);
            const imageUrl = await snapshot.ref.getDownloadURL();

            // Add product to Firestore
            const productRef = await db.collection('products').add({
                ...productData,
                imageUrl,
                createdAt: new Date(),
                status: 'available'
            });

            return productRef.id;
        } catch (error) {
            throw error;
        }
    }

    // Get all products
    async getAllProducts() {
        try {
            const snapshot = await db.collection('products').get();
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            throw error;
        }
    }

    // Get product by ID
    async getProductById(productId) {
        try {
            const doc = await db.collection('products').doc(productId).get();
            return doc.exists ? { id: doc.id, ...doc.data() } : null;
        } catch (error) {
            throw error;
        }
    }

    // Update product
    async updateProduct(productId, productData, imageFile = null) {
        try {
            const updateData = { ...productData };

            if (imageFile) {
                // Upload new image
                const imageRef = storage.ref(`products/${Date.now()}_${imageFile.name}`);
                const snapshot = await imageRef.put(imageFile);
                updateData.imageUrl = await snapshot.ref.getDownloadURL();
            }

            await db.collection('products').doc(productId).update(updateData);
        } catch (error) {
            throw error;
        }
    }

    // Delete product
    async deleteProduct(productId) {
        try {
            await db.collection('products').doc(productId).delete();
        } catch (error) {
            throw error;
        }
    }

    // Get trending products
    async getTrendingProducts(limit = 6) {
        try {
            const snapshot = await db.collection('products')
                .orderBy('rentalCount', 'desc')
                .limit(limit)
                .get();

            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            throw error;
        }
    }

    // Search products
    async searchProducts(query) {
        try {
            const snapshot = await db.collection('products')
                .where('name', '>=', query)
                .where('name', '<=', query + '\uf8ff')
                .get();

            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            throw error;
        }
    }
}

export const productService = new ProductService(); 