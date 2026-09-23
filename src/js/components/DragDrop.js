/**
 * DragDrop Engine v1.0
 * Lógica genérica de Arrastar e Soltar (HTML5) sem dependências externas.
 */

let instance = null;

export class DragDrop {
    constructor() {
        if (instance) {
            instance.init(); // Apenas re-escaneia a DOM
            return instance;
        }
        
        this.draggedElement = null;
        this.placeholder = null;
        
        // Marca que a primeira instância foi criada
        instance = this;
        
        this.init();
    }

    init() {
        // Encontra todos os elementos marcados como arrastáveis e ativa a API HTML5
        const draggables = document.querySelectorAll('[data-draggable="true"]');
        draggables.forEach(item => {
            // Apenas adiciona se ainda não for arrastável nativamente
            if (!item.hasAttribute('draggable')) {
                item.setAttribute('draggable', 'true');
                item.classList.add('of-draggable');
                this.attachDragEvents(item);
            }
        });

        // Encontra todas as zonas de soltura
        const dropzones = document.querySelectorAll('[data-dropzone="true"]');
        dropzones.forEach(zone => {
            if (!zone.classList.contains('of-dropzone')) {
                zone.classList.add('of-dropzone');
                this.attachDropEvents(zone);
            }
        });
    }

    attachDragEvents(item) {
        item.addEventListener('dragstart', (e) => {
            this.draggedElement = item;
            
            // Efeito visual no item que ficou pra trás
            setTimeout(() => {
                item.classList.add('is-dragging');
            }, 0);

            // Permite mover
            e.dataTransfer.effectAllowed = 'move';
            
            // Necessário pro Firefox
            e.dataTransfer.setData('text/plain', item.id || 'draggable-item');

            // Dispara evento customizado para o Kanban ouvir, por exemplo
            item.dispatchEvent(new CustomEvent('of:dragstart', { bubbles: true, detail: { item } }));
        });

        item.addEventListener('dragend', () => {
            if (this.draggedElement) {
                this.draggedElement.classList.remove('is-dragging');
            }
            this.draggedElement = null;
            
            // Remove as classes de dragover de todas as zonas
            document.querySelectorAll('.of-dropzone').forEach(z => z.classList.remove('is-dragover'));

            item.dispatchEvent(new CustomEvent('of:dragend', { bubbles: true, detail: { item } }));
        });
    }

    attachDropEvents(zone) {
        zone.addEventListener('dragover', (e) => {
            e.preventDefault(); // Necessário para permitir o drop
            e.dataTransfer.dropEffect = 'move';
            
            if (!zone.classList.contains('is-dragover')) {
                zone.classList.add('is-dragover');
            }

            // Lógica para saber em qual posição inserir o item (antes ou depois dos irmãos)
            const afterElement = this.getDragAfterElement(zone, e.clientY);
            if (this.draggedElement) {
                if (afterElement == null) {
                    zone.appendChild(this.draggedElement);
                } else {
                    zone.insertBefore(this.draggedElement, afterElement);
                }
            }
        });

        zone.addEventListener('dragleave', (e) => {
            // Se saiu da zona (mas não entrou num filho dela)
            if (e.target === zone) {
                zone.classList.remove('is-dragover');
            }
        });

        zone.addEventListener('drop', (e) => {
            e.preventDefault();
            zone.classList.remove('is-dragover');
            
            if (this.draggedElement) {
                zone.dispatchEvent(new CustomEvent('of:drop', { 
                    bubbles: true, 
                    detail: { item: this.draggedElement, zone } 
                }));
            }
        });
    }

    // Calcula exatamente entre quais itens o cursor do mouse está
    getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.of-draggable:not(.is-dragging)')];

        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    /**
     * Auto inicializa quando o DOM estiver pronto (opcional, pode ser importado via ES6)
     */
    static autoInit() {
        new DragDrop();
    }
}

// Auto init se o DOM já estiver carregado
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => DragDrop.autoInit());
} else {
    DragDrop.autoInit();
}
