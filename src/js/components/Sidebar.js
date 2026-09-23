// src/js/components/Sidebar.js

export class Sidebar {
    constructor(element) {
        if (typeof element === 'string') {
            this.sidebar = document.querySelector(element);
        } else {
            this.sidebar = element;
        }

        if (!this.sidebar) return;
        
        this.isOpen = false;
        this.backdrop = document.createElement('div');
        this.backdrop.className = 'of-sidebar-backdrop';
        
        // Só anexa o backdrop se a sidebar não for nativamente fixa (tela grande com of-layout-has-sidebar)
        document.body.appendChild(this.backdrop);

        this._bindEvents();
    }

    _bindEvents() {
        // Encontrar os botões que abrem esta sidebar
        const id = this.sidebar.id;
        if (id) {
            const togglers = document.querySelectorAll(`[data-toggle="sidebar"][data-target="#${id}"]`);
            togglers.forEach(t => {
                t.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.toggle();
                });
            });
        }

        // Fechar ao clicar no backdrop
        this.backdrop.addEventListener('click', () => {
            this.close();
        });

        // Fechar ao clicar no botão "close" interno
        const closeBtns = this.sidebar.querySelectorAll('[data-dismiss="sidebar"]');
        closeBtns.forEach(btn => {
            btn.addEventListener('click', () => this.close());
        });

        // Fechar ao apertar Esc
        document.addEventListener('keydown', (e) => {
            if (this.isOpen && e.key === 'Escape') {
                this.close();
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
        this.sidebar.classList.add('is-open');
        this.backdrop.classList.add('is-open');
        // Travar scroll do body no mobile
        if (window.innerWidth < 992) {
            document.body.style.overflow = 'hidden';
        }
        this.isOpen = true;
    }

    close() {
        this.sidebar.classList.remove('is-open');
        this.backdrop.classList.remove('is-open');
        document.body.style.overflow = '';
        this.isOpen = false;
    }
}

// Auto-init
if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const sidebars = document.querySelectorAll('.of-sidebar');
        sidebars.forEach(s => new Sidebar(s));
    });
}
