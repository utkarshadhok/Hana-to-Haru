class HeaderManager {
    constructor() {
        this.init();
    }
    init() {
        this.initializeElements();
        if (this.validateElements()) {
            this.setupEventListeners();
            this.setupAccessibility();
            this.setupResponsive();
        }
    }
    initializeElements() {
        this.elements = {
            sidebar: document.querySelector("#sidebar"),
            btnOpenSidebar: document.querySelector("#btn-menu"),
            btnCloseSidebar: document.querySelector("#close-sidebar"),
            searchModal: document.querySelector(".modal-search"),
            searchModalWrapper: document.querySelector(".modal-wrapper"),
            btnOpenSearch: document.querySelector(".search-button"),
            btnCloseSearch: document.querySelector("#close-modal-search"),
            searchInput: document.querySelector(".modal-search .search input")
        };
    }
    validateElements() {
        const missingElements = Object.entries(this.elements)
            .filter(([key, element]) => !element)
            .map(([key]) => key);
        if (missingElements.length > 0) {
            console.error('Missing required elements:', missingElements);
            return false;
        }
        return true;
    }
    setupEventListeners() {
        this.elements.btnOpenSidebar.addEventListener("click", () => this.openSidebar());
        this.elements.btnCloseSidebar.addEventListener("click", () => this.closeSidebar());
        this.elements.btnOpenSearch.addEventListener("click", () => this.openSearchModal());
        this.elements.btnCloseSearch.addEventListener("click", () => this.closeSearchModal());
        document.addEventListener("click", (e) => this.handleOutsideClick(e));
        document.addEventListener("keydown", (e) => this.handleKeyPress(e));
        window.addEventListener("resize", () => this.handleResize());
    }
    setupAccessibility() {
        this.elements.btnOpenSidebar.setAttribute("aria-label", "Open menu");
        this.elements.btnCloseSidebar.setAttribute("aria-label", "Close menu");
        this.elements.sidebar.setAttribute("role", "navigation");
        this.elements.sidebar.setAttribute("aria-hidden", "true");
        this.elements.btnOpenSearch.setAttribute("aria-label", "Open search");
        this.elements.btnCloseSearch.setAttribute("aria-label", "Close search");
        this.elements.searchModal.setAttribute("role", "dialog");
        this.elements.searchModal.setAttribute("aria-hidden", "true");
        if (this.elements.searchInput) {
            this.elements.searchInput.setAttribute("aria-label", "Search products");
        }
    }
    setupResponsive() {
        this.handleResize();
    }
    openSidebar() {
        this.elements.sidebar.style.left = "0";
        this.elements.sidebar.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
        this.elements.btnOpenSidebar.setAttribute("aria-expanded", "true");
        this.elements.btnCloseSidebar.focus();
    }
    closeSidebar() {
        this.elements.sidebar.style.left = "-100%";
        this.elements.sidebar.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
        this.elements.btnOpenSidebar.setAttribute("aria-expanded", "false");
    }
    openSearchModal() {
        this.elements.searchModal.style.visibility = "visible";
        this.elements.searchModal.style.opacity = "1";
        this.elements.searchModal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
        if (this.elements.searchInput) {
            this.elements.searchInput.focus();
        }
    }
    closeSearchModal() {
        this.elements.searchModal.style.visibility = "hidden";
        this.elements.searchModal.style.opacity = "0";
        this.elements.searchModal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
    }
    handleOutsideClick(event) {
        const clickPath = event.composedPath();
        if (!clickPath.includes(this.elements.sidebar) && 
            !clickPath.includes(this.elements.btnOpenSidebar)) {
            this.closeSidebar();
        }
        if (!clickPath.includes(this.elements.searchModalWrapper) && 
            !clickPath.includes(this.elements.btnOpenSearch)) {
            this.closeSearchModal();
        }
    }
    handleKeyPress(event) {
        if (event.key === "Escape") {
            this.closeSidebar();
            this.closeSearchModal();
        }
    }
    handleResize() {
        const isMobile = window.innerWidth < 768;
        if (!isMobile && this.elements.sidebar.style.left === "0") {
            this.closeSidebar();
        }
        if (!isMobile) {
            this.elements.searchModal.style.transition = "all 0.3s ease";
        } else {
            this.elements.searchModal.style.transition = "all 0.2s ease";
        }
    }
}
export default function headerFunc() {
    return new HeaderManager();
}