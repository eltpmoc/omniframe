/**
 * Kanban Board v1.0
 * Um gerenciador de UI que escuta os eventos do DragDrop.js
 * e atualiza o estado/contadores das colunas automaticamente.
 */

import { DragDrop } from './DragDrop.js';

export class Kanban {
    constructor(boardSelector = '.of-kanban-board') {
        this.boards = document.querySelectorAll(boardSelector);
        this.init();
    }

    init() {
        if (this.boards.length === 0) return;

        // Garante que o Motor de Drag and Drop já varreu os itens
        DragDrop.autoInit();

        this.boards.forEach(board => {
            this.updateBadges(board);

            // Escuta quando um item é solto na zona (Evento gerado pelo DragDrop.js)
            board.addEventListener('of:drop', (e) => {
                const { item, zone } = e.detail;
                // Apenas por capricho: dar uma "piscada" no item para mostrar que foi salvo na nova coluna
                item.animate([
                    { transform: 'scale(1.02)', backgroundColor: 'var(--of-primary)', color: 'white' },
                    { transform: 'scale(1)', backgroundColor: '', color: '' }
                ], { duration: 300, easing: 'ease-out' });

                this.updateBadges(board);
            });
        });
    }

    updateBadges(board) {
        // Encontra todas as colunas
        const columns = board.querySelectorAll('.of-kanban-column');
        
        columns.forEach(col => {
            // Conta quantos post-its estão dentro da Dropzone daquela coluna
            const items = col.querySelectorAll('.of-kanban-body .of-post-it');
            const badge = col.querySelector('.of-kanban-badge');
            
            if (badge) {
                badge.textContent = items.length;
            }
        });
    }
}

// Auto init
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new Kanban());
} else {
    new Kanban();
}
