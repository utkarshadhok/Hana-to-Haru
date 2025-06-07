class CartManager {
    constructor() {
        this.cart = this.getCart();
        this.elements = {
            cartProductsContainer: document.getElementById('cart-product'),
            subtotalElement: document.getElementById('subtotal'),
            cartTotalElement: document.getElementById('cart-total'),
            fastCargoCheckbox: document.getElementById('fast-cargo'),
            updateCartButton: document.querySelector('.update-cart button'),
            progressBar: document.querySelector('.progress'),
            progressBarTitle: document.querySelector('.progress-bar-title strong')
        };
        this.shippingThreshold = 2000; 
        this.fastCargoPrice = 199;
        this.init();
    }
    init() {
        this.renderCart();
        this.setupEventListeners();
        this.updateTotals();
        this.updateProgressBar();
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
    saveCart() {
        try {
            localStorage.setItem("cart", JSON.stringify(this.cart));
            this.updateCartCount();
        } catch (error) {
            console.error('Error saving cart:', error);
            this.showNotification('Failed to save cart changes', 'error');
        }
    }
    updateCartCount() {
        const cartCount = document.querySelector('.header-cart-count');
        if (cartCount) {
            cartCount.textContent = this.cart.length;
        }
    }
    renderCart() {
        if (!this.elements.cartProductsContainer) return;
        if (this.cart.length === 0) {
            this.elements.cartProductsContainer.innerHTML = `
                <tr>
                    <td colspan="6" class="empty-cart-message">
                        Your cart is empty. <a href="shop.html">Continue shopping</a>
                    </td>
                </tr>
            `;
            return;
        }
        this.elements.cartProductsContainer.innerHTML = this.cart.map(item => `
            <tr class="cart-item" data-id="${item.id}">
                <td class="cart-image">
                    <button type="button" class="remove-item"><i class="bi bi-x"></i></button>
                    <img src="${item.img}" alt="${item.name}">
                </td>
                <td>&nbsp;</td>
                <td class="product-name">${item.name}</td>
                <td class="product-price">₹${item.price.toLocaleString('en-IN')}</td>
                <td class="product-quantity">
                    <div class="quantity-controls">
                        <button type="button" class="quantity-button decrease">-</button>
                        <input type="number" value="${item.quantity}" min="1" max="10">
                        <button type="button" class="quantity-button increase">+</button>
                    </div>
                </td>
                <td class="product-subtotal">₹${(item.price * item.quantity).toLocaleString('en-IN')}</td>
            </tr>
        `).join('');
    }
    updateTotals() {
        const subtotal = this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const fastCargoChecked = this.elements.fastCargoCheckbox?.checked;
        const shipping = fastCargoChecked ? this.fastCargoPrice : 0;
        const total = subtotal + shipping;
        if (this.elements.subtotalElement) {
            this.elements.subtotalElement.textContent = `₹${subtotal.toLocaleString('en-IN')}`;
        }
        if (this.elements.cartTotalElement) {
            this.elements.cartTotalElement.textContent = `₹${total.toLocaleString('en-IN')}`;
        }
    }
    updateProgressBar() {
        if (!this.elements.progressBar || !this.elements.progressBarTitle) return;
        const subtotal = this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const percentage = Math.min((subtotal / this.shippingThreshold) * 100, 100);
        this.elements.progressBar.style.width = `${percentage}%`;
        if (subtotal >= this.shippingThreshold) {
            this.elements.progressBarTitle.textContent = "Your order is eligible for free delivery in Nagpur!";
        } else {
            const remaining = this.shippingThreshold - subtotal;
            this.elements.progressBarTitle.textContent = `₹${remaining.toLocaleString('en-IN')}`;
        }
    }
    updateItemQuantity(itemId, newQuantity) {
        const itemIndex = this.cart.findIndex(item => item.id === itemId);
        if (itemIndex === -1) return;
        newQuantity = Math.max(1, Math.min(10, newQuantity)); 
        this.cart[itemIndex].quantity = newQuantity;
        this.saveCart();
        this.renderCart();
        this.updateTotals();
        this.updateProgressBar();
    }
    removeItem(itemId) {
        this.cart = this.cart.filter(item => item.id !== itemId);
        this.saveCart();
        this.renderCart();
        this.updateTotals();
        this.updateProgressBar();
        this.showNotification('Item removed from cart', 'success');
    }
    setupEventListeners() {
        if (!this.elements.cartProductsContainer) return;
        this.elements.cartProductsContainer.addEventListener('click', (e) => {
            const cartItem = e.target.closest('.cart-item');
            if (!cartItem) return;
            const itemId = cartItem.dataset.id;
            if (e.target.closest('.remove-item')) {
                this.removeItem(itemId);
            } else if (e.target.closest('.decrease')) {
                const input = cartItem.querySelector('input[type="number"]');
                this.updateItemQuantity(itemId, Number(input.value) - 1);
            } else if (e.target.closest('.increase')) {
                const input = cartItem.querySelector('input[type="number"]');
                this.updateItemQuantity(itemId, Number(input.value) + 1);
            }
        });
        this.elements.cartProductsContainer.addEventListener('change', (e) => {
            if (e.target.type === 'number') {
                const cartItem = e.target.closest('.cart-item');
                if (!cartItem) return;
                this.updateItemQuantity(cartItem.dataset.id, Number(e.target.value));
            }
        });
        if (this.elements.fastCargoCheckbox) {
            this.elements.fastCargoCheckbox.addEventListener('change', () => {
                this.updateTotals();
            });
        }
        if (this.elements.updateCartButton) {
            this.elements.updateCartButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.renderCart();
                this.updateTotals();
                this.updateProgressBar();
                this.showNotification('Cart updated successfully', 'success');
            });
        }
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
    new CartManager();
}); 