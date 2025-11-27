// Product Data
const products = [
    {
        id: 1,
        name: "Veste en Jean Premium",
        category: "Vêtements Femme",
        categorySlug: "femme",
        price: 89.99,
        originalPrice: 129.99,
        rating: 4.8,
        reviews: 124,
        badge: "sale",
        isNew: false,
        isBestseller: true,
        description: "Une veste en jean de qualité supérieure avec une coupe moderne et des finitions soignées.",
        sizes: ["XS", "S", "M", "L", "XL"],
        colors: ["Bleu", "Noir", "Gris"]
    },
    {
        id: 2,
        name: "Robe Élégante Soirée",
        category: "Vêtements Femme",
        categorySlug: "femme",
        price: 149.99,
        originalPrice: null,
        rating: 4.9,
        reviews: 89,
        badge: "new",
        isNew: true,
        isBestseller: true,
        description: "Une robe élégante parfaite pour vos soirées spéciales.",
        sizes: ["XS", "S", "M", "L"],
        colors: ["Noir", "Rouge", "Bleu Marine"]
    },
    {
        id: 3,
        name: "Sneakers Urban Style",
        category: "Chaussures",
        categorySlug: "chaussures",
        price: 119.99,
        originalPrice: 159.99,
        rating: 4.7,
        reviews: 256,
        badge: "hot",
        isNew: false,
        isBestseller: true,
        description: "Des sneakers au design urbain moderne avec un confort optimal.",
        sizes: ["38", "39", "40", "41", "42", "43", "44", "45"],
        colors: ["Blanc", "Noir", "Gris"]
    },
    {
        id: 4,
        name: "Sac à Main Cuir",
        category: "Accessoires",
        categorySlug: "accessoires",
        price: 199.99,
        originalPrice: null,
        rating: 4.6,
        reviews: 78,
        badge: "new",
        isNew: true,
        isBestseller: false,
        description: "Un sac à main en cuir véritable avec une capacité généreuse.",
        sizes: ["Unique"],
        colors: ["Marron", "Noir", "Beige"]
    },
    {
        id: 5,
        name: "Chemise Oxford Homme",
        category: "Vêtements Homme",
        categorySlug: "homme",
        price: 59.99,
        originalPrice: 79.99,
        rating: 4.5,
        reviews: 312,
        badge: "sale",
        isNew: false,
        isBestseller: true,
        description: "Une chemise Oxford classique pour un style élégant et décontracté.",
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: ["Blanc", "Bleu Ciel", "Rose"]
    },
    {
        id: 6,
        name: "Montre Classique",
        category: "Accessoires",
        categorySlug: "accessoires",
        price: 249.99,
        originalPrice: null,
        rating: 4.9,
        reviews: 45,
        badge: "hot",
        isNew: false,
        isBestseller: true,
        description: "Une montre classique avec un mouvement suisse de précision.",
        sizes: ["Unique"],
        colors: ["Argent", "Or", "Or Rose"]
    },
    {
        id: 7,
        name: "Pull Cachemire",
        category: "Vêtements Femme",
        categorySlug: "femme",
        price: 179.99,
        originalPrice: 229.99,
        rating: 4.8,
        reviews: 67,
        badge: "sale",
        isNew: false,
        isBestseller: false,
        description: "Un pull en cachemire doux et chaleureux pour les journées fraîches.",
        sizes: ["XS", "S", "M", "L", "XL"],
        colors: ["Crème", "Gris", "Bordeaux"]
    },
    {
        id: 8,
        name: "Lunettes de Soleil Designer",
        category: "Accessoires",
        categorySlug: "accessoires",
        price: 159.99,
        originalPrice: null,
        rating: 4.4,
        reviews: 189,
        badge: "new",
        isNew: true,
        isBestseller: false,
        description: "Des lunettes de soleil au design unique avec protection UV.",
        sizes: ["Unique"],
        colors: ["Noir", "Écaille", "Transparent"]
    },
    {
        id: 9,
        name: "Jean Slim Fit Homme",
        category: "Vêtements Homme",
        categorySlug: "homme",
        price: 69.99,
        originalPrice: 89.99,
        rating: 4.6,
        reviews: 423,
        badge: "sale",
        isNew: false,
        isBestseller: true,
        description: "Un jean slim fit confortable avec stretch pour plus de liberté.",
        sizes: ["28", "30", "32", "34", "36", "38"],
        colors: ["Bleu Foncé", "Bleu Clair", "Noir"]
    },
    {
        id: 10,
        name: "Bracelet Cuir Tressé",
        category: "Accessoires",
        categorySlug: "accessoires",
        price: 39.99,
        originalPrice: null,
        rating: 4.3,
        reviews: 156,
        badge: null,
        isNew: false,
        isBestseller: false,
        description: "Un bracelet en cuir tressé artisanal avec fermoir magnétique.",
        sizes: ["S", "M", "L"],
        colors: ["Marron", "Noir"]
    },
    {
        id: 11,
        name: "Blouse Fleurie",
        category: "Vêtements Femme",
        categorySlug: "femme",
        price: 49.99,
        originalPrice: null,
        rating: 4.5,
        reviews: 98,
        badge: "new",
        isNew: true,
        isBestseller: false,
        description: "Une blouse légère avec un imprimé floral élégant.",
        sizes: ["XS", "S", "M", "L"],
        colors: ["Blanc/Floral", "Bleu/Floral"]
    },
    {
        id: 12,
        name: "Ceinture Cuir Premium",
        category: "Accessoires",
        categorySlug: "accessoires",
        price: 79.99,
        originalPrice: 99.99,
        rating: 4.7,
        reviews: 234,
        badge: "sale",
        isNew: false,
        isBestseller: true,
        description: "Une ceinture en cuir pleine fleur avec boucle classique.",
        sizes: ["85", "90", "95", "100", "105"],
        colors: ["Marron", "Noir"]
    }
];

// Cart State
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

// Save to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function saveWishlist() {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
}

// Get product by ID
function getProductById(id) {
    return products.find(p => p.id === parseInt(id));
}

// Filter products
function filterProducts(filters = {}) {
    return products.filter(product => {
        if (filters.category && product.categorySlug !== filters.category) return false;
        if (filters.isNew && !product.isNew) return false;
        if (filters.isBestseller && !product.isBestseller) return false;
        if (filters.promo && !product.originalPrice) return false;
        if (filters.minPrice && product.price < filters.minPrice) return false;
        if (filters.maxPrice && product.price > filters.maxPrice) return false;
        return true;
    });
}

// Search products
function searchProducts(query) {
    const searchTerm = query.toLowerCase();
    return products.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm)
    );
}

// Sort products
function sortProducts(productList, sortBy) {
    const sorted = [...productList];
    switch(sortBy) {
        case 'price-low':
            return sorted.sort((a, b) => a.price - b.price);
        case 'price-high':
            return sorted.sort((a, b) => b.price - a.price);
        case 'rating':
            return sorted.sort((a, b) => b.rating - a.rating);
        case 'newest':
            return sorted.sort((a, b) => b.isNew - a.isNew);
        default:
            return sorted;
    }
}
