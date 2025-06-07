class FlowerSearch {
    constructor() {
        this.searchForm = document.querySelector('.search-form');
        this.searchInput = document.querySelector('#search-input');
        this.searchButton = document.querySelector('#search-button');
        this.searchResults = document.querySelector('.modal-search .results');
        this.searchModal = document.querySelector('.modal-search');
        this.closeButton = document.querySelector('#close-modal-search');
        this.products = document.querySelectorAll('.product-card');
        this.init();
    }
    init() {
        if (!this.searchInput || !this.searchResults) {
            console.warn('Search elements not found in the DOM');
            return;
        }
        this.setupEventListeners();
    }
    setupEventListeners() {
        this.searchForm?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.performSearch(this.searchInput.value);
        });
        let timeout = null;
        this.searchInput?.addEventListener('input', (e) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => this.performSearch(e.target.value), 300);
        });
        this.searchButton?.addEventListener('click', () => {
            this.performSearch(this.searchInput.value);
        });
        this.searchInput?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.performSearch(this.searchInput.value);
            }
        });
        this.closeButton?.addEventListener('click', () => {
            this.closeSearch();
        });
        document.addEventListener('click', (e) => {
            if (this.searchModal && !this.searchModal.contains(e.target) && 
                !e.target.closest('.search-button')) {
                this.closeSearch();
            }
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeSearch();
            }
        });
    }
    performSearch(query) {
        query = query.toLowerCase().trim();
        if (!query) {
            this.clearResults();
            return;
        }
        const results = Array.from(this.products).filter(product => {
            const title = product.querySelector('.product-title')?.textContent.toLowerCase() || '';
            const description = product.querySelector('.product-description')?.textContent.toLowerCase() || '';
            const price = product.querySelector('.product-price')?.textContent.toLowerCase() || '';
            return title.includes(query) || description.includes(query) || price.includes(query);
        });
        this.displayResults(results, query);
    }
    displayResults(results, query) {
        this.clearResults();
        if (results.length === 0) {
            const noResults = document.createElement('div');
            noResults.className = 'result-item no-results';
            noResults.innerHTML = `
                <div class="search-info">
                    <p>No products found matching "${query}"</p>
                    <p class="search-suggestions">Suggestions:</p>
                    <ul>
                        <li>Check the spelling of your search terms</li>
                        <li>Try using single words instead of phrases</li>
                        <li>Try more general terms</li>
                    </ul>
                </div>
            `;
            this.searchResults.appendChild(noResults);
            return;
        }
        results.forEach(product => {
            const resultItem = document.createElement('div');
            resultItem.className = 'result-item';
            const title = product.querySelector('.product-title')?.textContent || '';
            const price = product.querySelector('.product-price')?.textContent || '';
            const image = product.querySelector('img')?.src || '';
            const link = product.querySelector('a')?.href || '#';
            resultItem.innerHTML = `
                <a href="${link}" class="search-result-link">
                    <img src="${image}" class="search-thumb" alt="${title}" loading="lazy">
                    <div class="search-info">
                        <h4>${title}</h4>
                        <span class="search-price">${price}</span>
                    </div>
                </a>
            `;
            this.searchResults.appendChild(resultItem);
        });
    }
    clearResults() {
        if (this.searchResults) {
            this.searchResults.innerHTML = '';
        }
    }
    closeSearch() {
        if (this.searchModal) {
            this.searchModal.style.visibility = 'hidden';
            this.searchModal.style.opacity = '0';
            document.body.style.overflow = '';
        }
        this.clearResults();
        if (this.searchInput) {
            this.searchInput.value = '';
        }
    }
}
document.addEventListener('DOMContentLoaded', () => {
    new FlowerSearch();
});