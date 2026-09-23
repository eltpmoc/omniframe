// src/js/components/ListBox.js

export class ListBox {
    constructor(selectElement, options = {}) {
        if (typeof selectElement === 'string') {
            this.originalSelect = document.querySelector(selectElement);
        } else {
            this.originalSelect = selectElement;
        }

        if (!this.originalSelect || this.originalSelect.tagName !== 'SELECT') {
            throw new Error('ListBox: Elemento base deve ser um <select>.');
        }

        this.options = {
            searchPlaceholder: options.searchPlaceholder || 'Pesquisar...',
            emptyText: options.emptyText || 'Nenhum item encontrado.',
            ...options
        };

        this._createDOM();
        this._bindEvents();
    }

    _createDOM() {
        // Hide original select
        this.originalSelect.style.display = 'none';

        // Main Wrapper
        this.wrapper = document.createElement('div');
        this.wrapper.className = 'of-listbox';

        // Search Area
        const searchDiv = document.createElement('div');
        searchDiv.className = 'of-listbox-search';
        this.searchInput = document.createElement('input');
        this.searchInput.type = 'text';
        this.searchInput.placeholder = this.options.searchPlaceholder;
        this.searchInput.setAttribute('aria-label', this.options.searchPlaceholder);
        searchDiv.appendChild(this.searchInput);

        // Options List
        this.list = document.createElement('ul');
        this.list.className = 'of-listbox-options';
        this.list.setAttribute('role', 'listbox');
        this.list.setAttribute('aria-label', 'Lista de opções');

        this.wrapper.appendChild(searchDiv);
        this.wrapper.appendChild(this.list);

        // Insert wrapper after original select
        this.originalSelect.parentNode.insertBefore(this.wrapper, this.originalSelect.nextSibling);

        this._renderOptions();
    }

    _renderOptions(filter = '') {
        this.list.innerHTML = '';
        const options = Array.from(this.originalSelect.options);
        
        const filteredOptions = options.filter(opt => 
            opt.text.toLowerCase().includes(filter.toLowerCase()) && opt.value !== '' && !opt.disabled
        );

        if (filteredOptions.length === 0) {
            const empty = document.createElement('li');
            empty.className = 'of-listbox-empty';
            empty.textContent = this.options.emptyText;
            this.list.appendChild(empty);
            return;
        }

        filteredOptions.forEach(opt => {
            const li = document.createElement('li');
            li.className = 'of-listbox-option';
            li.setAttribute('role', 'option');
            li.dataset.value = opt.value;
            li.textContent = opt.text;

            if (opt.selected) {
                li.classList.add('is-selected');
                li.setAttribute('aria-selected', 'true');
                // Checkmark
                const check = document.createElement('span');
                check.innerHTML = '✓';
                li.appendChild(check);
            } else {
                li.setAttribute('aria-selected', 'false');
            }

            this.list.appendChild(li);
        });
    }

    _bindEvents() {
        // Search Input
        this.searchInput.addEventListener('input', (e) => {
            this._renderOptions(e.target.value);
        });

        // Click on Option
        this.list.addEventListener('click', (e) => {
            const item = e.target.closest('.of-listbox-option');
            if (item) {
                const value = item.dataset.value;
                this.originalSelect.value = value;
                
                // Dispatch change event on original select
                const event = new Event('change', { bubbles: true });
                this.originalSelect.dispatchEvent(event);

                // Re-render to show selection checkmark
                this._renderOptions(this.searchInput.value);
            }
        });
    }
}

// Auto-init for data-attributes
if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const selects = document.querySelectorAll('select[data-listbox]');
        selects.forEach(select => {
            new ListBox(select);
        });
    });
}
