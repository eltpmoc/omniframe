// src/js/components/SmartSelect.js

export class SmartSelect {
    /**
     * @param {string|HTMLElement} element - O select nativo a ser sequestrado
     * @param {Object} options - Configurações extras (ex: showSearch: boolean)
     */
    constructor(element, options = {}) {
        this.nativeSelect = typeof element === 'string' ? document.querySelector(element) : element;
        if (!this.nativeSelect || this.nativeSelect.tagName.toLowerCase() !== 'select') {
            throw new Error('SmartSelect: Elemento fornecido inválido. Deve ser um <select>.');
        }

        this.options = {
            showSearch: true,
            searchPlaceholder: 'Buscar...',
            emptyText: 'Nenhum resultado encontrado.',
            ...options
        };

        this.isOpen = false;
        this.optionItems = [];
        this.currentFocus = -1; // Navegação por teclado

        this.init();
    }

    init() {
        this._buildDOM();
        this._bindEvents();
        this._syncValueFromNative();
    }

    _buildDOM() {
        // Criar o wrapper
        this.wrapper = document.createElement('div');
        this.wrapper.className = 'of-smart-select-wrapper';

        // Inserir o wrapper antes do select nativo e mover o select para dentro dele
        this.nativeSelect.parentNode.insertBefore(this.wrapper, this.nativeSelect);
        this.wrapper.appendChild(this.nativeSelect);

        // Criar o Trigger (Botão principal)
        this.trigger = document.createElement('div');
        this.trigger.className = 'of-smart-select-trigger';
        this.trigger.tabIndex = 0; // Torna focável
        this.triggerText = document.createElement('span');
        this.triggerText.textContent = this.nativeSelect.options[this.nativeSelect.selectedIndex]?.text || 'Selecione...';
        this.trigger.appendChild(this.triggerText);

        // Criar o Dropdown
        this.dropdown = document.createElement('div');
        this.dropdown.className = 'of-smart-select-dropdown';

        // Criar a Busca (Opcional)
        if (this.options.showSearch) {
            this.searchContainer = document.createElement('div');
            this.searchContainer.className = 'of-smart-select-search';
            
            this.searchInput = document.createElement('input');
            this.searchInput.type = 'text';
            this.searchInput.placeholder = this.options.searchPlaceholder;
            
            this.searchContainer.appendChild(this.searchInput);
            this.dropdown.appendChild(this.searchContainer);
        }

        // Criar a Lista
        this.list = document.createElement('ul');
        this.list.className = 'of-smart-select-list';
        this.dropdown.appendChild(this.list);

        // Mensagem de vazio
        this.emptyMessage = document.createElement('div');
        this.emptyMessage.className = 'of-smart-select-empty';
        this.emptyMessage.textContent = this.options.emptyText;
        this.dropdown.appendChild(this.emptyMessage);

        this.wrapper.appendChild(this.trigger);
        this.wrapper.appendChild(this.dropdown);

        this._renderOptions();
    }

    _renderOptions() {
        this.list.innerHTML = '';
        this.optionItems = [];

        Array.from(this.nativeSelect.options).forEach((opt, index) => {
            if (opt.disabled && opt.value === "") return; // Ignora placeholders comuns como "Selecione..."

            const li = document.createElement('li');
            li.className = 'of-smart-select-option';
            li.textContent = opt.text;
            li.dataset.value = opt.value;
            li.dataset.index = index;

            if (opt.selected) {
                li.classList.add('is-selected');
            }

            this.list.appendChild(li);
            this.optionItems.push(li);
        });
    }

    _bindEvents() {
        // Toggle dropdown ao clicar no trigger
        this.trigger.addEventListener('click', () => this.toggle());
        
        // Teclado no trigger
        this.trigger.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.toggle();
            }
        });

        // Seleção ao clicar numa opção
        this.list.addEventListener('click', (e) => {
            const item = e.target.closest('.of-smart-select-option');
            if (item) {
                this.selectOption(item.dataset.value, item.textContent);
            }
        });

        // Fechar ao clicar fora
        document.addEventListener('click', (e) => {
            if (!this.wrapper.contains(e.target)) {
                this.close();
            }
        });

        // Filtro de Busca
        if (this.options.showSearch && this.searchInput) {
            this.searchInput.addEventListener('input', (e) => {
                this.filterOptions(e.target.value);
            });
        }
    }

    toggle() {
        this.isOpen ? this.close() : this.open();
    }

    open() {
        this.isOpen = true;
        this.wrapper.classList.add('is-open');
        
        // Focar no input de busca se existir
        if (this.options.showSearch && this.searchInput) {
            setTimeout(() => this.searchInput.focus(), 50);
        }
    }

    close() {
        this.isOpen = false;
        this.wrapper.classList.remove('is-open');
        
        // Resetar filtro de busca ao fechar
        if (this.options.showSearch && this.searchInput) {
            this.searchInput.value = '';
            this.filterOptions('');
        }
    }

    selectOption(value, text) {
        // Atualiza a interface
        this.triggerText.textContent = text;
        this.optionItems.forEach(item => {
            if (item.dataset.value === value) item.classList.add('is-selected');
            else item.classList.remove('is-selected');
        });

        // Sincroniza com o select nativo e dispara evento change
        this.nativeSelect.value = value;
        const event = new Event('change', { bubbles: true });
        this.nativeSelect.dispatchEvent(event);

        this.close();
    }

    _syncValueFromNative() {
        // Caso o valor do select nativo mude via script externo
        this.nativeSelect.addEventListener('change', () => {
            const selectedOpt = this.nativeSelect.options[this.nativeSelect.selectedIndex];
            if (selectedOpt) {
                this.triggerText.textContent = selectedOpt.text;
                this.optionItems.forEach(item => {
                    item.classList.toggle('is-selected', item.dataset.value === selectedOpt.value);
                });
            }
        });
    }

    filterOptions(term) {
        const lowerTerm = term.toLowerCase();
        let hasVisible = false;

        this.optionItems.forEach(item => {
            const text = item.textContent.toLowerCase();
            if (text.includes(lowerTerm)) {
                item.style.display = 'block';
                hasVisible = true;
            } else {
                item.style.display = 'none';
            }
        });

        // Mostrar/Ocultar mensagem de lista vazia
        this.list.style.display = hasVisible ? 'block' : 'none';
        this.emptyMessage.style.display = hasVisible ? 'none' : 'block';
    }
}

// Auto-init for data-attributes
if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('select[data-smart-select]').forEach(select => {
            new SmartSelect(select);
        });
    });
}
