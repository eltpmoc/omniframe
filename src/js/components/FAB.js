// src/js/components/FAB.js

export class FAB {
    constructor(elementOrSelector) {
        this.wrapper = typeof elementOrSelector === 'string' 
            ? document.querySelector(elementOrSelector) 
            : elementOrSelector;
            
        if (!this.wrapper) throw new Error('FAB: Elemento container (wrapper) não encontrado.');

        this.trigger = this.wrapper.querySelector('.of-fab-trigger');
        this.menu = this.wrapper.querySelector('.of-fab-menu');
        this.isOpen = false;

        this.init();
    }

    init() {
        if (!this.trigger) return;
        this._bindEvents();
    }

    _bindEvents() {
        // Toggle ao clicar no botão principal
        this.trigger.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevenir conflito com o click outside
            this.toggle();
        });

        // Fechar ao clicar numa opção secundária do menu
        if (this.menu) {
            this.menu.addEventListener('click', (e) => {
                const btn = e.target.closest('.of-fab-btn');
                if (btn) {
                    this.close();
                }
            });
        }

        // Click Outside para fechar (Mecânica de acessibilidade)
        document.addEventListener('click', (e) => {
            if (this.isOpen && !this.wrapper.contains(e.target)) {
                this.close();
            }
        });

        // Suporte ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });
    }

    toggle() {
        this.isOpen ? this.close() : this.open();
    }

    open() {
        this.isOpen = true;
        this.wrapper.classList.add('is-open');
        this.trigger.setAttribute('aria-expanded', 'true');
    }

    close() {
        this.isOpen = false;
        this.wrapper.classList.remove('is-open');
        this.trigger.setAttribute('aria-expanded', 'false');
    }
}

// Auto-init for data-attributes
if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('[data-toggle="fab"]').forEach(wrapper => {
            new FAB(wrapper);
        });
    });
}
