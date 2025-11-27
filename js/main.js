// ===============================================
// SINJ3 E-Commerce Main JavaScript
// ===============================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initCart();
    initProducts();
    initCountdown();
    initNewArrivals();
    initBackToTop();
    initNewsletterForm();
    updateCartCount();
    updateWishlistCount();
});

// ===============================================
// Navigation
// ===============================================
function initNavigation() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileMenuBtn.querySelector('i').classList.toggle('fa-bars');
            mobileMenuBtn.querySelector('i').classList.toggle('fa-times');
        });
    }

    // Sticky header
    const header = document.querySelector('.header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });

    // Search functionality
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const query = searchInput.value.trim();
                if (query) {
                    window.location.href = `products.html?search=${encodeURIComponent(query)}`;
                }
            }
        });
    }
}

// ===============================================
// Cart Functionality
// ===============================================
function initCart() {
    const cartBtn = document.getElementById('cart-btn');
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartClose = document.getElementById('cart-close');
    const cartOverlay = document.getElementById('cart-overlay');

    if (cartBtn && cartSidebar) {
        cartBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openCart();
        });
    }

    if (cartClose) {
        cartClose.addEventListener('click', closeCart);
    }

    if (cartOverlay) {
        cartOverlay.addEventListener('click', closeCart);
    }

    renderCartItems();
}

function openCart() {
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartOverlay = document.getElementById('cart-overlay');
    
    if (cartSidebar) cartSidebar.classList.add('active');
    if (cartOverlay) cartOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCart() {
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartOverlay = document.getElementById('cart-overlay');
    
    if (cartSidebar) cartSidebar.classList.remove('active');
    if (cartOverlay) cartOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

function addToCart(productId, quantity = 1) {
    const product = getProductById(productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: quantity
        });
    }

    saveCart();
    updateCartCount();
    renderCartItems();
    showNotification('Produit ajouté au panier !');
    openCart();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartCount();
    renderCartItems();
}

function updateCartQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCart();
            renderCartItems();
        }
    }
}

function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

function renderCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    if (!cartItemsContainer) return;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="cart-empty">
                <i class="fas fa-shopping-cart"></i>
                <p>Votre panier est vide</p>
                <a href="products.html" class="btn btn-primary">Continuer vos achats</a>
            </div>
        `;
        if (cartTotal) cartTotal.textContent = '0.00 €';
        return;
    }

    let html = '';
    let total = 0;

    cart.forEach(item => {
        total += item.price * item.quantity;
        html += `
            <div class="cart-item">
                <div class="cart-item-image">
                    <i class="fas fa-box"></i>
                </div>
                <div class="cart-item-details">
                    <h4 class="cart-item-name">${item.name}</h4>
                    <p class="cart-item-price">${item.price.toFixed(2)} €</p>
                    <div class="cart-item-quantity">
                        <button class="qty-btn" onclick="updateCartQuantity(${item.id}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button class="qty-btn" onclick="updateCartQuantity(${item.id}, 1)">+</button>
                    </div>
                </div>
                <button class="cart-item-remove" onclick="removeFromCart(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    });

    cartItemsContainer.innerHTML = html;
    if (cartTotal) cartTotal.textContent = `${total.toFixed(2)} €`;
}

// ===============================================
// Wishlist Functionality
// ===============================================
function toggleWishlist(productId) {
    const index = wishlist.indexOf(productId);
    
    if (index > -1) {
        wishlist.splice(index, 1);
        showNotification('Retiré des favoris');
    } else {
        wishlist.push(productId);
        showNotification('Ajouté aux favoris !');
    }

    saveWishlist();
    updateWishlistCount();
}

function updateWishlistCount() {
    const badges = document.querySelectorAll('#wishlist-btn .badge');
    badges.forEach(badge => {
        badge.textContent = wishlist.length;
    });
}

// ===============================================
// Products Display
// ===============================================
function initProducts() {
    const featuredContainer = document.getElementById('featured-products');
    if (featuredContainer) {
        renderFeaturedProducts(featuredContainer);
        initProductTabs();
    }
}

function renderFeaturedProducts(container, filter = 'all') {
    let filteredProducts;
    
    switch(filter) {
        case 'nouveautes':
            filteredProducts = products.filter(p => p.isNew);
            break;
        case 'promos':
            filteredProducts = products.filter(p => p.originalPrice);
            break;
        case 'bestsellers':
            filteredProducts = products.filter(p => p.isBestseller);
            break;
        default:
            filteredProducts = products.slice(0, 8);
    }

    container.innerHTML = filteredProducts.map(product => createProductCard(product)).join('');
}

function createProductCard(product) {
    const isInWishlist = wishlist.includes(product.id);
    const badgeClass = product.badge ? `badge-${product.badge}` : '';
    const badgeText = product.badge === 'new' ? 'Nouveau' : 
                      product.badge === 'sale' ? 'Promo' : 
                      product.badge === 'hot' ? 'Tendance' : '';

    return `
        <div class="product-card" data-id="${product.id}">
            <div class="product-image">
                <div class="product-placeholder">
                    <i class="fas fa-tshirt"></i>
                </div>
                ${product.badge ? `<span class="product-badge ${badgeClass}">${badgeText}</span>` : ''}
                <div class="product-actions">
                    <button class="product-action-btn" onclick="toggleWishlist(${product.id})" title="Ajouter aux favoris">
                        <i class="${isInWishlist ? 'fas' : 'far'} fa-heart"></i>
                    </button>
                    <button class="product-action-btn" onclick="quickView(${product.id})" title="Aperçu rapide">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </div>
            <div class="product-info">
                <span class="product-category">${product.category}</span>
                <h3 class="product-name">
                    <a href="product-detail.html?id=${product.id}">${product.name}</a>
                </h3>
                <div class="product-rating">
                    ${generateStars(product.rating)}
                    <span>(${product.reviews})</span>
                </div>
                <div class="product-price">
                    <span class="current-price">${product.price.toFixed(2)} €</span>
                    ${product.originalPrice ? `<span class="original-price">${product.originalPrice.toFixed(2)} €</span>` : ''}
                </div>
                <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                    <i class="fas fa-shopping-cart"></i> Ajouter au panier
                </button>
            </div>
        </div>
    `;
}

function generateStars(rating) {
    let stars = '';
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

function initProductTabs() {
    const tabs = document.querySelectorAll('.tab-btn');
    const container = document.getElementById('featured-products');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const filter = tab.dataset.tab;
            renderFeaturedProducts(container, filter);
        });
    });
}

// ===============================================
// Quick View Modal
// ===============================================
function quickView(productId) {
    const product = getProductById(productId);
    if (!product) return;

    const modal = document.getElementById('quick-view-modal');
    const modalBody = document.getElementById('modal-body');
    
    if (!modal || !modalBody) return;

    modalBody.innerHTML = `
        <div class="modal-image">
            <div class="product-placeholder" style="width: 200px; height: 200px;">
                <i class="fas fa-tshirt" style="font-size: 5rem;"></i>
            </div>
        </div>
        <div class="modal-info">
            <span class="product-category">${product.category}</span>
            <h2 style="margin: 0.5rem 0 1rem; font-size: 1.5rem;">${product.name}</h2>
            <div class="product-rating" style="margin-bottom: 1rem;">
                ${generateStars(product.rating)}
                <span>(${product.reviews} avis)</span>
            </div>
            <div class="product-price" style="margin-bottom: 1rem;">
                <span class="current-price" style="font-size: 1.5rem;">${product.price.toFixed(2)} €</span>
                ${product.originalPrice ? `<span class="original-price">${product.originalPrice.toFixed(2)} €</span>` : ''}
            </div>
            <p style="color: var(--text-secondary); margin-bottom: 1.5rem; line-height: 1.8;">${product.description}</p>
            <div style="margin-bottom: 1rem;">
                <strong>Tailles disponibles:</strong>
                <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem; flex-wrap: wrap;">
                    ${product.sizes.map(size => `<span style="padding: 0.5rem 1rem; border: 1px solid var(--border-color); border-radius: 0.25rem; cursor: pointer;">${size}</span>`).join('')}
                </div>
            </div>
            <div style="margin-bottom: 1.5rem;">
                <strong>Couleurs:</strong>
                <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem;">
                    ${product.colors.map(color => `<span style="padding: 0.5rem 1rem; border: 1px solid var(--border-color); border-radius: 0.25rem; cursor: pointer;">${color}</span>`).join('')}
                </div>
            </div>
            <div style="display: flex; gap: 1rem;">
                <button class="btn btn-primary" onclick="addToCart(${product.id}); closeModal();">
                    <i class="fas fa-shopping-cart"></i> Ajouter au panier
                </button>
                <a href="product-detail.html?id=${product.id}" class="btn btn-outline">Voir détails</a>
            </div>
        </div>
    `;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Close modal events
    const closeBtn = document.getElementById('modal-close');
    if (closeBtn) {
        closeBtn.onclick = closeModal;
    }
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
}

function closeModal() {
    const modal = document.getElementById('quick-view-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// ===============================================
// Countdown Timer
// ===============================================
function initCountdown() {
    const countdownEl = document.getElementById('countdown');
    if (!countdownEl) return;

    // Set end date (7 days from now)
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);

    function updateCountdown() {
        const now = new Date();
        const diff = endDate - now;

        if (diff <= 0) {
            countdownEl.innerHTML = '<p>Offre expirée</p>';
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        document.getElementById('days').textContent = String(days).padStart(2, '0');
        document.getElementById('hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// ===============================================
// New Arrivals Slider
// ===============================================
function initNewArrivals() {
    const track = document.getElementById('arrivals-track');
    const prevBtn = document.getElementById('arrivals-prev');
    const nextBtn = document.getElementById('arrivals-next');

    if (!track) return;

    // Load new arrivals
    const newProducts = products.filter(p => p.isNew);
    track.innerHTML = newProducts.map(product => createProductCard(product)).join('');

    let currentIndex = 0;
    const cardWidth = 296; // card width + gap

    function updateSlider() {
        track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateSlider();
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const maxIndex = Math.max(0, newProducts.length - 4);
            if (currentIndex < maxIndex) {
                currentIndex++;
                updateSlider();
            }
        });
    }
}

// ===============================================
// Back to Top
// ===============================================
function initBackToTop() {
    const backToTop = document.getElementById('back-to-top');
    if (!backToTop) return;

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTop.classList.add('active');
        } else {
            backToTop.classList.remove('active');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===============================================
// Newsletter Form
// ===============================================
function initNewsletterForm() {
    const form = document.getElementById('newsletter-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = form.querySelector('input[type="email"]').value;
        if (email) {
            showNotification('Merci pour votre inscription !');
            form.reset();
        }
    });
}

// ===============================================
// Notifications
// ===============================================
function showNotification(message, type = 'success') {
    // Remove existing notifications
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 9999;
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);

    // Auto remove
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    /* Mobile menu styles */
    @media (max-width: 768px) {
        .nav-links.active {
            display: flex !important;
            flex-direction: column;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            padding: 1rem;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }
    }
`;
document.head.appendChild(style);
