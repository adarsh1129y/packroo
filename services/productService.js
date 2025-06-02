import {
    getFirestore,
    collection,
    getDocs,
    doc,
    getDoc,
    query,
    where,
    orderBy,
    limit
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

const db = getFirestore();

// Get all products
async function getAllProducts() {
    try {
        const productsRef = collection(db, "products");
        const snapshot = await getDocs(productsRef);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error("Error getting products:", error);
        throw error;
    }
}

// Get product by ID
async function getProductById(productId) {
    try {
        const productRef = doc(db, "products", productId);
        const productDoc = await getDoc(productRef);

        if (productDoc.exists()) {
            return {
                id: productDoc.id,
                ...productDoc.data()
            };
        } else {
            throw new Error("Product not found");
        }
    } catch (error) {
        console.error("Error getting product:", error);
        throw error;
    }
}

// Get trending products
async function getTrendingProducts(limit = 4) {
    try {
        const productsRef = collection(db, "products");
        const q = query(
            productsRef,
            where("isTrending", "==", true),
            orderBy("popularity", "desc"),
            limit(limit)
        );

        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error("Error getting trending products:", error);
        throw error;
    }
}

// Get products by category
async function getProductsByCategory(category) {
    try {
        const productsRef = collection(db, "products");
        const q = query(
            productsRef,
            where("category", "==", category)
        );

        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error("Error getting products by category:", error);
        throw error;
    }
}

// Search products
async function searchProducts(searchTerm) {
    try {
        const productsRef = collection(db, "products");
        const snapshot = await getDocs(productsRef);

        return snapshot.docs
            .map(doc => ({
                id: doc.id,
                ...doc.data()
            }))
            .filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
    } catch (error) {
        console.error("Error searching products:", error);
        throw error;
    }
}

// Render product card
function renderProductCard(product) {
    return `
        <div class="product-card" data-product-id="${product.id}">
            <div class="product-image">
                <img src="${product.imageUrl}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="product-price">
                    <span class="price">$${product.price}</span>
                    <span class="per-day">/day</span>
                </div>
                <button class="rent-button" 
                    data-item-id="${product.id}"
                    data-item-name="${product.name}"
                    data-item-price="${product.price}">
                    Rent Now
                </button>
            </div>
        </div>
    `;
}

// Export functions
export {
    getAllProducts,
    getProductById,
    getTrendingProducts,
    getProductsByCategory,
    searchProducts,
    renderProductCard
}; 