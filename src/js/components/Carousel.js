// src/js/components/Carousel.js

export class Carousel {
    constructor(element) {
        if (typeof element === 'string') {
            this.carousel = document.querySelector(element);
        } else {
            this.carousel = element;
        }

        if (!this.carousel) return;

        this.inner = this.carousel.querySelector('.of-carousel-inner');
        this.items = this.carousel.querySelectorAll('.of-carousel-item');
        this.indicators = this.carousel.querySelectorAll('.of-carousel-indicator');
        this.prevBtn = this.carousel.querySelector('.of-carousel-prev');
        this.nextBtn = this.carousel.querySelector('.of-carousel-next');

        if (this.items.length === 0) return;

        this.currentIndex = 0;
        this.totalItems = this.items.length;

        this._bindEvents();
        this._updateView();
    }

    _bindEvents() {
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prev());
        }

        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.next());
        }

        if (this.indicators) {
            this.indicators.forEach((ind, index) => {
                ind.addEventListener('click', () => this.goTo(index));
            });
        }
    }

    _updateView() {
        const offset = -this.currentIndex * 100;
        this.inner.style.transform = `translateX(${offset}%)`;

        if (this.indicators) {
            this.indicators.forEach((ind, index) => {
                if (index === this.currentIndex) {
                    ind.classList.add('is-active');
                } else {
                    ind.classList.remove('is-active');
                }
            });
        }
    }

    next() {
        this.currentIndex = (this.currentIndex + 1) % this.totalItems;
        this._updateView();
    }

    prev() {
        this.currentIndex = (this.currentIndex - 1 + this.totalItems) % this.totalItems;
        this._updateView();
    }

    goTo(index) {
        if (index >= 0 && index < this.totalItems) {
            this.currentIndex = index;
            this._updateView();
        }
    }
}

// Auto-init for data-attributes
if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const carousels = document.querySelectorAll('[data-carousel]');
        carousels.forEach(c => new Carousel(c));
    });
}
