// src/js/components/DataTable.js

export class DataTable {
    /**
     * Inicializa a DataTable
     * @param {string|HTMLElement} element - Seletor CSS ou Elemento DOM da tabela
     * @param {Object} options - Configurações (ex: pageSize)
     */
    constructor(element, options = {}) {
        this.table = typeof element === 'string' ? document.querySelector(element) : element;
        if (!this.table) throw new Error("DataTable: Elemento não encontrado.");

        this.options = {
            pageSize: options.pageSize || 10,
            pageSizeOptions: [10, 25, 50, 100],
            ...options
        };

        this.currentPage = 1;
        this.searchTerm = '';
        this.sortCol = null;
        this.sortAsc = true;

        // Armazena as linhas originais para filtragem
        this.tbody = this.table.querySelector('tbody');
        this.originalRows = Array.from(this.tbody.querySelectorAll('tr'));
        this.filteredRows = [...this.originalRows];

        this.init();
    }

    init() {
        this.table.classList.add('of-datatable');
        this.wrapTable();
        this.buildHeader();
        this.buildFooter();
        this.attachSortListeners();
        this.render();
    }

    wrapTable() {
        this.wrapper = document.createElement('div');
        this.wrapper.className = 'of-datatable-wrapper';
        
        const container = document.createElement('div');
        container.className = 'of-datatable-table-container';
        
        this.table.parentNode.insertBefore(this.wrapper, this.table);
        container.appendChild(this.table);
        this.wrapper.appendChild(container);
    }

    buildHeader() {
        const header = document.createElement('div');
        header.className = 'of-datatable-header';

        // Seletor de tamanho de página
        const lengthCtrl = document.createElement('div');
        lengthCtrl.className = 'of-datatable-controls';
        
        const select = document.createElement('select');
        select.setAttribute('aria-label', 'Linhas por página');
        this.options.pageSizeOptions.forEach(size => {
            const opt = document.createElement('option');
            opt.value = size;
            opt.textContent = size;
            if (size === this.options.pageSize) opt.selected = true;
            select.appendChild(opt);
        });

        select.addEventListener('change', (e) => {
            this.options.pageSize = parseInt(e.target.value);
            this.currentPage = 1;
            this.render();
        });

        const lbl = document.createElement('span');
        lbl.textContent = 'Linhas por página: ';
        lengthCtrl.appendChild(lbl);
        lengthCtrl.appendChild(select);

        // Barra de busca
        const searchCtrl = document.createElement('div');
        searchCtrl.className = 'of-datatable-search';
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Buscar...';
        input.setAttribute('aria-label', 'Buscar na tabela');
        
        input.addEventListener('input', (e) => {
            this.searchTerm = e.target.value.toLowerCase();
            this.currentPage = 1;
            this.filterData();
        });

        searchCtrl.appendChild(input);

        header.appendChild(lengthCtrl);
        header.appendChild(searchCtrl);
        
        this.wrapper.insertBefore(header, this.wrapper.firstChild);
    }

    buildFooter() {
        this.footer = document.createElement('div');
        this.footer.className = 'of-datatable-footer';

        this.infoElement = document.createElement('div');
        this.infoElement.className = 'of-datatable-info';

        this.paginationElement = document.createElement('div');
        this.paginationElement.className = 'of-datatable-pagination';

        this.footer.appendChild(this.infoElement);
        this.footer.appendChild(this.paginationElement);
        this.wrapper.appendChild(this.footer);
    }

    attachSortListeners() {
        const headers = this.table.querySelectorAll('thead th');
        headers.forEach((th, index) => {
            th.addEventListener('click', () => {
                this.sortAsc = this.sortCol === index ? !this.sortAsc : true;
                this.sortCol = index;
                this.sortData();
            });
        });
    }

    filterData() {
        if (!this.searchTerm) {
            this.filteredRows = [...this.originalRows];
        } else {
            this.filteredRows = this.originalRows.filter(row => {
                return row.textContent.toLowerCase().includes(this.searchTerm);
            });
        }
        if(this.sortCol !== null) this.sortData(false);
        else this.render();
    }

    sortData(reRender = true) {
        if (this.sortCol === null) return;

        this.filteredRows.sort((a, b) => {
            const aText = a.children[this.sortCol].textContent.trim();
            const bText = b.children[this.sortCol].textContent.trim();
            
            const aNum = parseFloat(aText.replace(/[^\d.-]/g, ''));
            const bNum = parseFloat(bText.replace(/[^\d.-]/g, ''));

            if (!isNaN(aNum) && !isNaN(bNum)) {
                return this.sortAsc ? aNum - bNum : bNum - aNum;
            }

            return this.sortAsc ? aText.localeCompare(bText) : bText.localeCompare(aText);
        });

        if (reRender) this.render();
    }

    render() {
        this.tbody.innerHTML = '';
        
        const totalRows = this.filteredRows.length;
        const totalPages = Math.ceil(totalRows / this.options.pageSize) || 1;
        
        if (this.currentPage > totalPages) this.currentPage = totalPages;
        if (this.currentPage < 1) this.currentPage = 1;

        const start = (this.currentPage - 1) * this.options.pageSize;
        const end = Math.min(start + this.options.pageSize, totalRows);

        // Renderizar linhas
        for (let i = start; i < end; i++) {
            this.tbody.appendChild(this.filteredRows[i]);
        }

        // Atualizar info
        this.infoElement.textContent = totalRows === 0 
            ? 'Mostrando 0 até 0 de 0 registros'
            : `Mostrando ${start + 1} até ${end} de ${totalRows} registros`;

        // Atualizar paginação
        this.renderPagination(totalPages);
    }

    renderPagination(totalPages) {
        this.paginationElement.innerHTML = '';

        // Botão Anterior
        const prevBtn = document.createElement('button');
        prevBtn.className = 'of-datatable-page-btn';
        prevBtn.textContent = 'Anterior';
        prevBtn.disabled = this.currentPage === 1;
        prevBtn.addEventListener('click', () => {
            this.currentPage--;
            this.render();
        });
        this.paginationElement.appendChild(prevBtn);

        // Números (Simples)
        for (let i = 1; i <= totalPages; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.className = `of-datatable-page-btn ${i === this.currentPage ? 'active' : ''}`;
            pageBtn.textContent = i;
            pageBtn.addEventListener('click', () => {
                this.currentPage = i;
                this.render();
            });
            this.paginationElement.appendChild(pageBtn);
        }

        // Botão Próximo
        const nextBtn = document.createElement('button');
        nextBtn.className = 'of-datatable-page-btn';
        nextBtn.textContent = 'Próxima';
        nextBtn.disabled = this.currentPage === totalPages;
        nextBtn.addEventListener('click', () => {
            this.currentPage++;
            this.render();
        });
        this.paginationElement.appendChild(nextBtn);
    }
}
