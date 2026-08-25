// src/js/components/Dropdown.js

export class Dropdown {
    constructor(element) {
        if (typeof element === 'string') {
            this.toggleElement = document.querySelector(element);
        } else {
            this.toggleElement = element;
        }

        if (!this.toggleElement) return;

        this.dropdown = this.toggleElement.closest('.of-dropdown');
        if (!this.dropdown) {
            throw new Error('Dropdown: O toggle deve estar dentro de um container .of-dropdown');
        }

        this.isOpen = false;
        this._bindEvents();
    }

    _bindEvents() {
        // Toggle no clique do botão
        this.toggleElement.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation(); // Evita que feche imediatamente pelo event listener do document
            this.toggle();
        });

        // Fechar ao clicar fora
        document.addEventListener('click', (e) => {
            if (this.isOpen && !this.dropdown.contains(e.target)) {
                this.close();
            }
        });

        // Fechar ao apertar Esc
        document.addEventListener('keydown', (e) => {
            if (this.isOpen && e.key === 'Escape') {
                this.close();
                this.toggleElement.focus();
            }
        });
    }

    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    open() {
        // Fecha outros dropdowns abertos (comportamento estilo sanfona opcional, mas comum)
        const openDropdowns = document.querySelectorAll('.of-dropdown.is-open');
        openDropdowns.forEach(dd => {
            if (dd !== this.dropdown) dd.classList.remove('is-open');
        });

        this.dropdown.classList.add('is-open');
        this.toggleElement.setAttribute('aria-expanded', 'true');
        this.isOpen = true;
    }

    close() {
        this.dropdown.classList.remove('is-open');
        this.toggleElement.setAttribute('aria-expanded', 'false');
        this.isOpen = false;
    }
}

// Auto-init for data-attributes
if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        // Inicializar Dropdowns
        const dropdownToggles = document.querySelectorAll('[data-toggle="dropdown"]');
        dropdownToggles.forEach(toggle => new Dropdown(toggle));

        // Inicializar Navbar Toggler (Mobile)
        const navToggles = document.querySelectorAll('[data-toggle="collapse"]');
        navToggles.forEach(toggle => {
            toggle.addEventListener('click', () => {
                const targetSelector = toggle.dataset.target;
                if (targetSelector) {
                    const target = document.querySelector(targetSelector);
                    if (target) {
                        target.classList.toggle('is-open');
                    }
                }
            });
        });
    });
}
