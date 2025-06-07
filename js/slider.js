class SliderManager {
    constructor(options) {
        this.container = options.container;
        this.slides = options.slides;
        this.dots = options.dots;
        this.prevButton = options.prevButton;
        this.nextButton = options.nextButton;
        this.currentSlide = 0;
        this.autoplayInterval = null;
        this.autoplayDelay = options.autoplayDelay || 5000;
        this.autoplay = options.autoplay || false;
        this.touchStartX = 0;
        this.touchEndX = 0;
        this.init();
    }
    init() {
        if (!this.validateElements()) return;
        this.setupEventListeners();
        this.setupAccessibility();
        this.showSlide(0);
        if (this.autoplay) this.startAutoplay();
    }
    initializeElements() {
        this.elements = {
            slides: document.getElementsByClassName("slider-item"),
            dots: document.getElementsByClassName("slider-dot"),
            prevButton: document.querySelector(".slider-prev"),
            nextButton: document.querySelector(".slider-next"),
            container: document.querySelector(".slider-container")
        };
    }
    validateElements() {
        if (!this.container || !this.slides || !this.dots || !this.prevButton || !this.nextButton) {
            console.error('Required elements not found');
            return false;
        }
        return true;
    }
    setupEventListeners() {
        this.prevButton.addEventListener('click', () => this.navigate('prev'));
        this.nextButton.addEventListener('click', () => this.navigate('next'));
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index));
        });
        this.container.addEventListener('touchstart', (e) => {
            this.touchStartX = e.touches[0].clientX;
        });
        this.container.addEventListener('touchend', (e) => {
            this.touchEndX = e.changedTouches[0].clientX;
            this.handleSwipe();
        });
        if (this.autoplay) {
            this.container.addEventListener('mouseenter', () => this.pauseAutoplay());
            this.container.addEventListener('mouseleave', () => this.startAutoplay());
        }
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
        document.addEventListener('visibilitychange', () => this.handleVisibilityChange());
    }
    setupAccessibility() {
        this.container.setAttribute('role', 'region');
        this.container.setAttribute('aria-label', 'Image Slider');
        this.slides.forEach((slide, index) => {
            slide.setAttribute('role', 'tabpanel');
            slide.setAttribute('aria-hidden', 'true');
            slide.setAttribute('tabindex', '-1');
        });
        this.prevButton.setAttribute('aria-label', 'Previous slide');
        this.nextButton.setAttribute('aria-label', 'Next slide');
        this.prevButton.setAttribute('role', 'button');
        this.nextButton.setAttribute('role', 'button');
        this.dots.forEach((dot, index) => {
            dot.setAttribute('role', 'tab');
            dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
            dot.setAttribute('tabindex', '0');
        });
    }
    showSlide(index) {
        if (index < 0) {
            index = this.slides.length - 1;
        } else if (index >= this.slides.length) {
            index = 0;
        }
        this.hideAllSlides();
        this.removeActiveDots();
        this.slides[index].classList.add('active');
        this.slides[index].setAttribute('aria-hidden', 'false');
        this.slides[index].setAttribute('tabindex', '0');
        this.dots[index].classList.add('active');
        this.dots[index].setAttribute('aria-selected', 'true');
        this.currentSlide = index;
        this.announceSlideChange(index);
    }
    hideAllSlides() {
        this.slides.forEach(slide => {
            slide.classList.remove('active');
            slide.setAttribute('aria-hidden', 'true');
            slide.setAttribute('tabindex', '-1');
        });
    }
    removeActiveDots() {
        this.dots.forEach(dot => {
            dot.classList.remove('active');
            dot.setAttribute('aria-selected', 'false');
        });
    }
    navigate(direction) {
        const newIndex = direction === 'next' ? this.currentSlide + 1 : this.currentSlide - 1;
        this.showSlide(newIndex);
    }
    goToSlide(index) {
        this.showSlide(index);
    }
    handleSwipe() {
        const threshold = 50;
        const swipeDistance = this.touchEndX - this.touchStartX;
        if (Math.abs(swipeDistance) > threshold) {
            if (swipeDistance > 0) {
                this.navigate('prev');
            } else {
                this.navigate('next');
            }
        }
    }
    handleKeyboard(e) {
        switch(e.key) {
            case 'ArrowLeft':
                this.navigate('prev');
                break;
            case 'ArrowRight':
                this.navigate('next');
                break;
            case 'Home':
                this.goToSlide(0);
                break;
            case 'End':
                this.goToSlide(this.slides.length - 1);
                break;
            default:
                return;
        }
        e.preventDefault();
    }
    handleVisibilityChange() {
        if (document.hidden) {
            this.pauseAutoplay();
        } else {
            if (this.autoplay) this.startAutoplay();
        }
    }
    startAutoplay() {
        if (this.autoplayInterval) return;
        this.autoplayInterval = setInterval(() => {
            this.navigate('next');
        }, this.autoplayDelay);
    }
    pauseAutoplay() {
        if (!this.autoplayInterval) return;
        clearInterval(this.autoplayInterval);
        this.autoplayInterval = null;
    }
    toggleAutoplay() {
        if (this.autoplayInterval) {
            this.pauseAutoplay();
        } else {
            this.startAutoplay();
        }
    }
    announceSlideChange(index) {
        const liveRegion = document.querySelector('.slider-live-region') || (() => {
            const region = document.createElement('div');
            region.className = 'slider-live-region visually-hidden';
            region.setAttribute('aria-live', 'polite');
            document.body.appendChild(region);
            return region;
        })();
        liveRegion.textContent = `Showing slide ${index + 1} of ${this.slides.length}`;
    }
}

const productsContainer = document.getElementById("product-list");

function initProductCarousel() {
    if (!productsContainer) return;
    const config = {
        perView: 4,
        gap: 20,
        autoplay: 3000,
        bound: true,
        breakpoints: {
            992: {
                perView: 3
            },
            768: {
                perView: 2
            },
            576: {
                perView: 1
            }
        }
    };
    new Glide('.product-carousel', config).mount();
}

// Initialize all sliders
document.addEventListener('DOMContentLoaded', () => {
    initProductCarousel();
    const sliderOptions = {
        container: document.querySelector('.slider'),
        items: 1,
        slideBy: 1,
        autoplay: true,
        autoplayTimeout: 5000,
        autoplayButtonOutput: false,
        nav: false,
        controls: true,
        controlsPosition: 'bottom',
        controlsText: ['<i class="bi bi-chevron-left"></i>', '<i class="bi bi-chevron-right"></i>'],
        responsive: {
            992: {
                items: 1
            },
            768: {
                items: 1
            },
            576: {
                items: 1
            }
        }
    };
    new SliderManager(sliderOptions);
});
