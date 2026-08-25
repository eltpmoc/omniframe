// src/js/components/GlobalSearch.js

export class GlobalSearch {
    /**
     * Inicializa a busca global.
     * @param {Object} options 
     * @param {string} options.targetSelector - Qual seletor CSS os itens "buscáveis" da página possuem (Ex: '.my-card')
     * @param {function} options.onSearch - Callback opcional para requisições externas/API
     */
    constructor(options = {}) {
        this.options = {
            targetSelector: '[data-searchable]',
            searchAttribute: 'data-search-term',
            hotkey: 'k', // Tecla de atalho junto com Ctrl/Cmd. Pode ser alterada para '/' ou 'Space' se o desenvolvedor preferir.
            onSearch: null, 
            ...options
        };

        this.isOpen = false;
        this.debounceTimeout = null;

        // Auto-criação da estrutura DOM se não existir
        this._ensureDOMExists();
        this.inputElement = this.panel.querySelector('.of-globalsearch-input');

        this._bindEvents();
    }

    _ensureDOMExists() {
        this.backdrop = document.querySelector('.of-globalsearch-backdrop');
        
        if (!this.backdrop) {
            this.backdrop = document.createElement('div');
            this.backdrop.className = 'of-globalsearch-backdrop';
            
            this.panel = document.createElement('div');
            this.panel.className = 'of-globalsearch-panel';

            const header = document.createElement('div');
            header.className = 'of-globalsearch-header';

            // SVG Magnifying Glass
            const icon = document.createElement('div');
            icon.className = 'of-globalsearch-icon';
            icon.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>';

            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'of-globalsearch-input';
            input.placeholder = 'Pesquise por qualquer coisa...';
            input.setAttribute('aria-label', 'Campo de busca global');

            const escHint = document.createElement('span');
            escHint.className = 'of-globalsearch-kbd';
            escHint.textContent = 'ESC';

            header.appendChild(icon);
            header.appendChild(input);
            header.appendChild(escHint);
            this.panel.appendChild(header);
            this.backdrop.appendChild(this.panel);

            document.body.appendChild(this.backdrop);
        } else {
            this.panel = this.backdrop.querySelector('.of-globalsearch-panel');
        }
    }

    _bindEvents() {
        // Escutar atalho Cmd + Hotkey (Mac) / Ctrl + Hotkey (Win)
        document.addEventListener('keydown', (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === this.options.hotkey.toLowerCase()) {
                e.preventDefault(); // Impede o comportamento padrão do navegador (como a busca do Chrome)
                this.toggle();
            }

            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });

        // Clique fora do painel
        this.backdrop.addEventListener('click', (e) => {
            if (e.target === this.backdrop) {
                this.close();
            }
        });

        // Capturar digitação com Debounce para o Callback (Se houver API) 
        // e Filtro direto no DOM de forma instantânea
        this.inputElement.addEventListener('input', (e) => {
            const query = e.target.value;
            
            // Filtro de DOM Local
            this._filterLocalDOM(query);

            // Callback customizado (API Mode)
            if (this.options.onSearch && typeof this.options.onSearch === 'function') {
                clearTimeout(this.debounceTimeout);
                this.debounceTimeout = setTimeout(() => {
                    this.options.onSearch(query);
                }, 300); // 300ms debounce
            }
        });

        // Botões visíveis que possam engatilhar (triggers manuais na UI)
        document.querySelectorAll('[data-toggle="globalsearch"]').forEach(btn => {
            btn.addEventListener('click', () => this.open());
        });
    }

    _filterLocalDOM(query) {
        if (!this.options.targetSelector) return;
        
        const elements = document.querySelectorAll(this.options.targetSelector);
        const lowerQuery = query.toLowerCase();

        elements.forEach(el => {
            // Verifica o data attribute explícito ou fallback pro textContent
            let searchSpace = el.getAttribute(this.options.searchAttribute) || el.textContent;
            searchSpace = searchSpace.toLowerCase();

            if (searchSpace.includes(lowerQuery)) {
                el.style.display = ''; // Volta ao default
            } else {
                el.style.display = 'none'; // Esconde o elemento
            }
        });
    }

    open() {
        if (this.isOpen) return;
        this.isOpen = true;
        this.backdrop.classList.add('is-open');
        document.body.style.overflow = 'hidden'; // Prevents background scroll
        
        // Focar no input automaticamente
        setTimeout(() => this.inputElement.focus(), 100);
    }

    close() {
        if (!this.isOpen) return;
        this.isOpen = false;
        this.backdrop.classList.remove('is-open');
        document.body.style.overflow = '';
        this.inputElement.value = '';
        this._filterLocalDOM(''); // Reseta filtros
    }

    toggle() {
        this.isOpen ? this.close() : this.open();
    }
}

// O Auto-init aqui cria o listener de forma silenciosa para que o Ctrl+K funcione do nada, 
// sem precisar invocar "new GlobalSearch()" manualmente
if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        if (!window.OmniFrameGlobalSearchInstance) {
            window.OmniFrameGlobalSearchInstance = new GlobalSearch();
        }
    });
}
