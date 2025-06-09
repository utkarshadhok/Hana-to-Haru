import headerFunc from "./header.js"
import productFunc from "./product.js"
import searchFunc from "./search.js"
class AppManager {
    constructor() {
        this.init();
    }
    init() {
        this.setupEventListeners();
        this.updateCartCount();
    }
    async loadProducts() {
        try {
            const response = await fetch("js/data.json");
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            if (data && Array.isArray(data)) {
                localStorage.setItem("products", JSON.stringify(data));
                this.products = data;
            } else {
                throw new Error('Invalid products data');
            }
        } catch (error) {
            console.error('Error loading products:', error);
            this.products = [];
            this.handleError(error);
        }
    }
    initializeModules() {
        if (this.products.length > 0) {
            productFunc(this.products);
            searchFunc(this.products);
            headerFunc();
        }
    }
    updateCartCount() {
        try {
            const cartCount = document.querySelector('.header-cart-count');
            if (!cartCount) return;
            const cart = localStorage.getItem("cart");
            const cartItems = cart ? JSON.parse(cart) : [];
            cartCount.textContent = cartItems.length;
        } catch (error) {
            console.error('Error updating cart count:', error);
        }
    }
    setupEventListeners() {
        const btnMenu = document.querySelector('#btn-menu');
        const mobileMenu = document.querySelector('.mobile-menu');
        const mobileMenuClose = document.querySelector('.mobile-menu-close');
        const overlay = document.querySelector('.overlay');
        let isMenuOpen = false;

        function toggleMobileMenu() {
            isMenuOpen = !isMenuOpen;
            mobileMenu.classList.toggle('active');
            overlay.classList.toggle('active');
            document.body.style.overflow = isMenuOpen ? 'hidden' : '';
        }

        function handleMenuClick(e) {
            e.stopPropagation();
            toggleMobileMenu();
        }

        function handleOverlayClick(e) {
            e.stopPropagation();
            if (isMenuOpen) {
                toggleMobileMenu();
            }
        }

        function handleDocumentClick(e) {
            if (isMenuOpen && !mobileMenu.contains(e.target) && e.target !== btnMenu) {
                toggleMobileMenu();
            }
        }

        btnMenu?.addEventListener('click', handleMenuClick);
        mobileMenuClose?.addEventListener('click', handleMenuClick);
        overlay?.addEventListener('click', handleOverlayClick);
        document.addEventListener('click', handleDocumentClick);

        const searchButton = document.querySelector('.search-button');
        const modalSearch = document.querySelector('.modal-search');
        const modalCloseButton = document.getElementById('close-modal-search');
        if (searchButton && modalSearch) {
            searchButton.addEventListener('click', () => {
                modalSearch.style.visibility = 'visible';
                modalSearch.style.opacity = '1';
            });
        }
        if (modalCloseButton && modalSearch) {
            modalCloseButton.addEventListener('click', () => {
                modalSearch.style.visibility = 'hidden';
                modalSearch.style.opacity = '0';
            });
        }

        const currentPath = window.location.pathname;
        const mobileNavLinks = document.querySelectorAll('.mobile-bottom-nav a');

        mobileNavLinks.forEach(link => {
            if (link.getAttribute('href') === currentPath.split('/').pop()) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        const productCards = document.querySelectorAll('.product-card');
        const observerOptions = {
            root: null,
            rootMargin: '50px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        productCards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            observer.observe(card);
        });
    }
    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    handleError(error) {
        const errorElement = document.createElement('div');
        errorElement.className = 'error-notification';
        errorElement.innerHTML = `
            <div class="error-content">
                <h3>Oops! Something went wrong</h3>
                <p>${error.message || 'An error occurred while loading the application.'}</p>
                <button onclick="window.location.reload()">Reload Page</button>
            </div>
        `;
        document.body.appendChild(errorElement);
    }
}
document.addEventListener('DOMContentLoaded', () => {
    new AppManager();
});
