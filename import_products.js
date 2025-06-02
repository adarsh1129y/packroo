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

// Sample product data structure
const products = [
    {
        name: "Sample Product 1",
        category: "electronics",
        price: 1999,
        description: "This is a sample product description",
        image: "path/to/product1.jpg",
        stock: 10,
        rating: 4.5
    },
    // Add more products here
];

async function importProducts() {
    try {
        console.log("Starting product import...");
        
        // Create products collection if it doesn't exist
        const productsRef = db.collection('products');
        
        // Add each product to Firestore
        for (const product of products) {
            await productsRef.add({
                ...product,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });
            console.log(`Added product: ${product.name}`);
        }
        
        console.log("Product import completed successfully!");
    } catch (error) {
        console.error("Error importing products:", error);
    }
}

// Run the import function
importProducts();
