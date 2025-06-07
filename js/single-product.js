import { product3 } from "./glide.js"
import { thumbsActiveFunc } from "./single-product/thumbsActive.js"
import zoomFunc from "./single-product/zoom.js"
import colorsFunc from "./single-product/colors.js"
import valuesFunc from "./single-product/values.js"
import tabsFunc from "./single-product/tabs.js"
import commentsfunc from "./single-product/comments.js"

class SingleProductManager {
    constructor() {
        this.product = this.getProductDetails();
        this.cart = this.getCart();
        this.elements = {
            addToCartBtn: document.querySelector('.add-to-cart'),
            cartCount: document.querySelector('.header-cart-count'),
            quantity: document.querySelector('.quantity-input')
        };
        this.init();
    }
    init() {
        if (!this.product.id) {
            console.error('Product details not found');
            return;
        }
        this.updateCartButton();
        this.setupEventListeners();
    }
    getProductDetails() {
        if (!this.elements.productTitle || !this.elements.productPrice || !this.elements.productImage) {
            return {};
        }
        const name = this.elements.productTitle.textContent;
        const price = this.extractPrice(this.elements.productPrice.textContent);
        const img = this.elements.productImage.src;
        if (!name || isNaN(price) || !img) {
            return {};
        }
        return {
            id: this.generateProductId(name, price),
            name,
            price,
            img
        };
    }
    generateProductId(name, price) {
        return `${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${price}`;
    }
    extractPrice(priceText) {
        if (!priceText) return NaN;
        return parseFloat(priceText.replace('₹', '').replace(/,/g, ''));
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
    updateCartButton() {
        if (!this.elements.addToCartBtn) return;
        const isInCart = this.cart.some(item => item.id === this.product.id);
        if (isInCart) {
            this.disableCartButton();
        } else {
            this.enableCartButton();
        }
    }
    disableCartButton() {
        if (!this.elements.addToCartBtn) return;
        this.elements.addToCartBtn.disabled = true;
        this.elements.addToCartBtn.classList.add('in-cart');
        this.elements.addToCartBtn.textContent = "In Cart";
    }
    enableCartButton() {
        if (!this.elements.addToCartBtn) return;
        this.elements.addToCartBtn.disabled = false;
        this.elements.addToCartBtn.classList.remove('in-cart');
        this.elements.addToCartBtn.textContent = "Add to Cart";
    }
    setupEventListeners() {
        if (this.elements.addToCartBtn && !this.cart.some(item => item.id === this.product.id)) {
            this.elements.addToCartBtn.addEventListener("click", () => this.handleAddToCart());
        }
        if (this.elements.quantity) {
            this.elements.quantity.addEventListener("change", (e) => this.handleQuantityChange(e));
        }
    }
    handleAddToCart() {
        try {
            if (!this.product.id) {
                throw new Error('Product details not found');
            }
            const quantity = Number(this.elements.quantity?.value || 1);
            if (isNaN(quantity) || quantity < 1 || quantity > 10) {
                throw new Error('Invalid quantity');
            }
            const existingItem = this.cart.find(item => item.id === this.product.id);
            if (existingItem) {
                this.showNotification('This item is already in your cart', 'info');
                return;
            }
            this.cart.push({ 
                ...this.product, 
                quantity,
                addedAt: new Date().toISOString()
            });
            localStorage.setItem("cart", JSON.stringify(this.cart));
            if (this.elements.cartCount) {
                this.elements.cartCount.textContent = this.cart.length;
            }
            this.disableCartButton();
            this.showNotification('Product added to cart successfully!', 'success');
        } catch (error) {
            console.error('Error adding to cart:', error);
            this.showNotification('Failed to add product to cart. Please try again.', 'error');
        }
    }
    handleQuantityChange(e) {
        const value = parseInt(e.target.value);
        if (isNaN(value) || value < 1) {
            e.target.value = 1;
        } else if (value > 10) {
            e.target.value = 10;
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
    initializeModules() {
        try {
            thumbsActiveFunc();
            product3();
            zoomFunc();
            colorsFunc();
            valuesFunc();
            tabsFunc();
            commentsfunc();
        } catch (error) {
            console.error('Error initializing modules:', error);
        }
    }
}
document.addEventListener('DOMContentLoaded', () => {
    new SingleProductManager();
});


function thumbsActiveFunc() {
    const thumbs = document.querySelectorAll(".gallery-thumbs .img-fluid");
    const singleImage = document.querySelector("#single-image");

    thumbs.forEach((item) => {
        item.addEventListener("click", () => {
            thumbs.forEach((image) => image.classList.remove("active"));
            singleImage.src = item.src;
            item.classList.add("active");
        });
    });
}


function tabsFunc() {
    const btnTab = document.querySelectorAll(".tab-button");
    const content = document.querySelectorAll(".content");
    const tabButtons = document.querySelector(".tab-list");

    tabButtons.addEventListener("click", (e) => {
        e.preventDefault();
        const id = e.target.dataset.id;
        if (id) {
            btnTab.forEach((button) => button.classList.remove("active"));
            e.target.classList.add("active");
            content.forEach((item) => item.classList.remove("active"));
            const element = document.getElementById(id);
            element.classList.add("active");
        }
    });

    document.getElementById("desc").classList.add("active");
}


function commentReviewFunc() {
    const commentStars = document.querySelectorAll(".comment-form-rating .star");
    commentStars.forEach((star) => {
        star.addEventListener("click", (e) => {
            e.preventDefault();
            commentStars.forEach((item) => item.classList.remove("active"));
            star.classList.add("active");
            const activeStar = document.querySelectorAll(".stars .star.active i");
            localStorage.setItem("stars", JSON.stringify(activeStar.length));
        });
    });
}

function addNewCommentFunc() {
    const comments = [];
    const commentText = document.getElementById("form-review");
    const commentName = document.getElementById("name");
    const commentButton = document.querySelector(".form-submit input");
    const commentList = document.querySelector(".comment-list");
    
    let text = "";
    let name = "";

    commentText.addEventListener("input", (e) => text = e.target.value);
    commentName.addEventListener("input", (e) => name = e.target.value);

    commentButton.addEventListener("click", (e) => {
        e.preventDefault();
        const dateObj = new Date();
        const month = dateObj.getUTCMonth() + 1;
        const day = dateObj.getUTCDate();
        const year = dateObj.getUTCFullYear();
        
        const starsNumber = Number(localStorage.getItem("stars"));
        const stars = Array(starsNumber).fill('<li><i class="bi bi-star-fill"></i></li>').join('');
        
        comments.push({ text, name });
        
        const result = comments.map(item => `
            <li class="comment-item">
                <div class="comment-avatar">
                    <img src="img/avatars/avatar1.jpg" alt="">
                </div>
                <div class="comment-text">
                    <ul class="comment-stars">
                        ${stars}
                    </ul>
                    <div class="comment-meta">
                        <strong>${item.name}</strong>
                        <span>-</span>
                        <time>${day}/${month}/${year}</time>
                    </div>
                    <div class="comment-description">
                        <p>${item.text}</p>
                    </div>
                </div>
            </li>
        `).join('');

        commentList.innerHTML = result;
        commentText.value = "";
        commentName.value = "";
    });
}

function initSingleProduct() {
    thumbsActiveFunc();
    tabsFunc();
    commentReviewFunc();
    addNewCommentFunc();
}

export default initSingleProduct;
