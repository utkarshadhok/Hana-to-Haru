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
        const btnMenu = document.getElementById('btn-menu');
        const sidebar = document.getElementById('sidebar');
        const closeSidebar = document.getElementById('close-sidebar');
        if (btnMenu && sidebar) {
            btnMenu.addEventListener('click', () => {
                sidebar.style.transform = 'translateX(0)';
            });
        }
        if (closeSidebar && sidebar) {
            closeSidebar.addEventListener('click', () => {
                sidebar.style.transform = 'translateX(-100%)';
            });
        }
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
