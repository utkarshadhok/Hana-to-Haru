document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navigation = document.querySelector('.header-center .navigation');
    const body = document.body;

    if (menuToggle && navigation) {
        menuToggle.addEventListener('click', function() {
            navigation.classList.toggle('active');
            body.classList.toggle('menu-open');
            menuToggle.classList.toggle('active');
        });

        document.addEventListener('click', function(event) {
            if (!navigation.contains(event.target) && !menuToggle.contains(event.target)) {
                navigation.classList.remove('active');
                body.classList.remove('menu-open');
                menuToggle.classList.remove('active');
            }
        });
    }

    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.mobile-bottom-nav a');
    
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (currentPath.endsWith(linkPath)) {
            link.classList.add('active');
        }
    });

    // Handle horizontal scroll for product sections
    const productSections = document.querySelectorAll('.homepage-product-section');
    productSections.forEach(section => {
        let isDown = false;
        let startX;
        let scrollLeft;

        section.addEventListener('mousedown', (e) => {
            isDown = true;
            section.classList.add('active');
            startX = e.pageX - section.offsetLeft;
            scrollLeft = section.scrollLeft;
        });

        section.addEventListener('mouseleave', () => {
            isDown = false;
            section.classList.remove('active');
        });

        section.addEventListener('mouseup', () => {
            isDown = false;
            section.classList.remove('active');
        });

        section.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - section.offsetLeft;
            const walk = (x - startX) * 2;
            section.scrollLeft = scrollLeft - walk;
        });
    });
}); 