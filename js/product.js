import { product1, product2 } from "./glide.js"
class VisualManager {
    constructor() {
        this.init();
    }
    init() {
        this.initializeFeatures([
            this.setupSliders,
            this.setupParallax,
            this.setupImageEffects,
            this.setupLazyLoading,
            this.setupAnimations
        ]);
    }
    async initializeFeatures(features) {
        for (const feature of features) {
            try {
                await feature.call(this);
            } catch (error) {
                console.error(`Error initializing feature: ${feature.name}`, error);
            }
        }
    }
    async setupSliders() {
        try {
            const { product1, product2 } = await import('./glide.js');
            if (product1) product1();
            if (product2) product2();
        } catch (error) {
            console.error('Error initializing sliders:', error);
        }
    }
    setupParallax() {
        const hero = document.querySelector('.hero-section');
        if (!hero) return;
        const handleScroll = () => {
            requestAnimationFrame(() => {
                hero.style.backgroundPositionY = `${window.pageYOffset * 0.5}px`;
            });
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
    }
    setupImageEffects() {
        this.setupImageZoom();
        this.setupImageSwap();
    }
    setupImageZoom() {
        const containers = document.querySelectorAll('.product-image');
        containers.forEach(container => {
            const img = container.querySelector('img');
            if (!img) return;
            const handleMouseMove = (e) => {
                const { left, top, width, height } = container.getBoundingClientRect();
                const x = ((e.clientX - left) / width) * 100;
                const y = ((e.clientY - top) / height) * 100;
                requestAnimationFrame(() => {
                    img.style.transformOrigin = `${x}% ${y}%`;
                });
            };
            container.addEventListener('mousemove', handleMouseMove);
            container.addEventListener('mouseenter', () => img.style.transform = 'scale(1.1)');
            container.addEventListener('mouseleave', () => {
                img.style.transform = 'scale(1)';
                img.style.transformOrigin = 'center';
            });
        });
    }
    setupImageSwap() {
        const containers = document.querySelectorAll('.product-image.dual-image');
        containers.forEach(container => {
            const [primaryImg, secondaryImg] = container.querySelectorAll('img');
            if (!primaryImg || !secondaryImg) return;
            container.addEventListener('mouseenter', () => {
                primaryImg.style.opacity = '0';
                secondaryImg.style.opacity = '1';
            });
            container.addEventListener('mouseleave', () => {
                primaryImg.style.opacity = '1';
                secondaryImg.style.opacity = '0';
            });
        });
    }
    setupLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        if (!images.length) return;
        const loadImage = (img) => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            img.style.opacity = '0';
            img.addEventListener('load', () => {
                requestAnimationFrame(() => {
                    img.style.transition = 'opacity 0.5s ease';
                    img.style.opacity = '1';
                });
            }, { once: true });
        };
        const imageObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) return;
                    loadImage(entry.target);
                    observer.unobserve(entry.target);
                });
            },
            {
                rootMargin: '50px',
                threshold: 0.1
            }
        );
        images.forEach(img => imageObserver.observe(img));
    }
    setupAnimations() {
        this.setupScrollAnimations();
        this.setupSmoothScroll();
    }
    setupScrollAnimations() {
        const elements = document.querySelectorAll('.animate-on-scroll');
        if (!elements.length) return;
        const scrollObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) return;
                    entry.target.classList.add('animated');
                    observer.unobserve(entry.target);
                });
            },
            {
                rootMargin: '0px',
                threshold: 0.1
            }
        );
        elements.forEach(element => scrollObserver.observe(element));
    }
    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (!target) return;
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            });
        });
    }
}
document.addEventListener('DOMContentLoaded', () => new VisualManager());