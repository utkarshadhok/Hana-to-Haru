document.addEventListener('DOMContentLoaded', function() {
    loadHeader();
    loadFooter();
    initShop();
});
function loadHeader() {
    fetch('header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header').innerHTML = data;
            initMobileMenu();
        });
}
function loadFooter() {
    fetch('footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer').innerHTML = data;
        });
}
function initShop() {
    initFilters();
    initSort();
    initAddToCart();
    initAddToWishlist();

    // Handle URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    const occasion = urlParams.get('occasion');
    const service = urlParams.get('service');

    if (category) {
        applyFilter(category);
    } else if (occasion) {
        applyFilter(occasion);
    } else if (service) {
        applyFilter(service);
    }
}
function initMobileMenu() {
    const menuButton = document.querySelector('.mobile-menu-button');
    const menu = document.querySelector('.mobile-menu');
    menuButton.addEventListener('click', () => {
        menu.classList.toggle('active');
    });
}
function initFilters() {
    const filterButtons = document.querySelectorAll('.filter-button');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;
            applyFilter(filter);
        });
    });
}
function applyFilter(filter) {
    const products = document.querySelectorAll('.product-card');
    const filterLower = filter.toLowerCase();
    products.forEach(product => {
        const category = product.dataset.category?.toLowerCase();
        const occasion = product.dataset.occasion?.toLowerCase();
        const service = product.dataset.service?.toLowerCase();

        product.style.display =
            filterLower === 'all' ||
                category === filterLower ||
                occasion === filterLower ||
                service === filterLower ? 'block' : 'none';
    });

    // Update active state of filter buttons
    const filterButtons = document.querySelectorAll('.filter-button');
    filterButtons.forEach(button => {
        button.classList.toggle('active', button.dataset.filter.toLowerCase() === filterLower);
    });
}
function initSort() {
    const sortSelect = document.querySelector('.sort-select');
    if (!sortSelect) return;
    sortSelect.addEventListener('change', (e) => {
        const sortBy = e.target.value;
        const products = Array.from(document.querySelectorAll('.product-card'));
        products.sort((a, b) => {
            const priceA = this.extractPrice(a.querySelector('.product-price')?.textContent);
            const priceB = this.extractPrice(b.querySelector('.product-price')?.textContent);
            if (sortBy === 'price-low') {
                return priceA - priceB;
            } else if (sortBy === 'price-high') {
                return priceB - priceA;
            }
            return 0;
        });
        const container = document.querySelector('.products-grid');
        if (container) {
            products.forEach(product => container.appendChild(product));
        }
    });
}
function initAddToCart() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const productCard = button.closest('.product-card');
            if (!productCard) return;
            const productId = this.generateProductId(productCard);
            const productName = productCard.querySelector('.product-info h3')?.textContent;
            const productPrice = this.extractPrice(productCard.querySelector('.product-price')?.textContent);
            const productImage = productCard.querySelector('.product-image img')?.src;
            if (!productId || !productName || isNaN(productPrice) || !productImage) {
                this.showNotification('Failed to add product to cart', 'error');
                return;
            }
            this.addToCart({
                id: productId,
                name: productName,
                price: productPrice,
                img: productImage,
                quantity: 1
            });
        });
    });
}
function initAddToWishlist() {
    const wishlistButtons = document.querySelectorAll('.add-to-wishlist');
    wishlistButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            button.classList.toggle('active');
            const action = button.classList.contains('active') ? 'added to' : 'removed from';
            showNotification(`Product ${action} wishlist`);
        });
    });
}
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification cart-notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}
class ShopManager {
    constructor() {
        this.cart = this.getCart();
        this.init();
    }
    init() {
        this.initAddToCart();
        this.updateCartButtonStates();
        this.initSort();
    }
    getCart() {
        try {
            const cart = localStorage.getItem("cart");
            return cart ? JSON.parse(cart) : [];
        } catch (error) {
            console.error('Error getting cart:', error);
            return [];
        }
    }
    initAddToCart() {
        const addToCartButtons = document.querySelectorAll('.add-to-cart');
        addToCartButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const productCard = button.closest('.product-card');
                if (!productCard) return;
                const productId = this.generateProductId(productCard);
                const productName = productCard.querySelector('.product-info h3')?.textContent;
                const productPrice = this.extractPrice(productCard.querySelector('.product-price')?.textContent);
                const productImage = productCard.querySelector('.product-image img')?.src;
                if (!productId || !productName || isNaN(productPrice) || !productImage) {
                    this.showNotification('Failed to add product to cart', 'error');
                    return;
                }
                this.addToCart({
                    id: productId,
                    name: productName,
                    price: productPrice,
                    img: productImage,
                    quantity: 1
                });
            });
        });
    }
    initSort() {
        const sortSelect = document.querySelector('.sort-select');
        if (!sortSelect) return;
        sortSelect.addEventListener('change', (e) => {
            const sortBy = e.target.value;
            const products = Array.from(document.querySelectorAll('.product-card'));
            products.sort((a, b) => {
                const priceA = this.extractPrice(a.querySelector('.product-price')?.textContent);
                const priceB = this.extractPrice(b.querySelector('.product-price')?.textContent);
                if (sortBy === 'price-low') {
                    return priceA - priceB;
                } else if (sortBy === 'price-high') {
                    return priceB - priceA;
                }
                return 0;
            });
            const container = document.querySelector('.products-grid');
            if (container) {
                products.forEach(product => container.appendChild(product));
            }
        });
    }
    generateProductId(productCard) {
        const name = productCard.querySelector('.product-info h3')?.textContent;
        const price = productCard.querySelector('.product-price')?.textContent;
        if (!name || !price) return null;
        return `${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${price.replace(/[^0-9]/g, '')}`;
    }
    extractPrice(priceText) {
        if (!priceText) return NaN;
        return parseFloat(priceText.replace('₹', '').replace(/,/g, ''));
    }
    addToCart(product) {
        try {
            const existingItem = this.cart.find(item => item.id === product.id);
            if (existingItem) {
                this.showNotification('This item is already in your cart', 'info');
                return;
            }
            this.cart.push(product);
            localStorage.setItem("cart", JSON.stringify(this.cart));
            this.updateCartCount();
            this.updateCartButtonStates();
            this.showNotification('Product added to cart successfully!', 'success');
        } catch (error) {
            console.error('Error adding to cart:', error);
            this.showNotification('Failed to add product to cart', 'error');
        }
    }
    updateCartCount() {
        const cartCount = document.querySelector('.header-cart-count');
        if (cartCount) {
            cartCount.textContent = this.cart.length;
        }
    }
    updateCartButtonStates() {
        const addToCartButtons = document.querySelectorAll('.add-to-cart');
        addToCartButtons.forEach(button => {
            const productCard = button.closest('.product-card');
            if (!productCard) return;
            const productId = this.generateProductId(productCard);
            const isInCart = this.cart.some(item => item.id === productId);
            if (isInCart) {
                button.classList.add('in-cart');
                button.textContent = 'In Cart';
                button.disabled = true;
            } else {
                button.classList.remove('in-cart');
                button.textContent = 'Add to Cart';
                button.disabled = false;
            }
        });
    }
    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification cart-notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}
document.addEventListener('DOMContentLoaded', () => {
    new ShopManager();
}); 