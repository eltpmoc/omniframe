import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { Modal } from '../../src/js/components/Modal.js';

describe('Modal Unit Tests', () => {
    beforeEach(() => {
        // Limpar o DOM antes de cada teste
        document.body.innerHTML = '';
    });

    afterEach(() => {
        // Resetar overflow do body e limpar DOM
        document.body.style.overflow = '';
        document.body.innerHTML = '';
    });

    it('should create and open a modal via static confirm (Promise)', async () => {
        // Criar a promise mas não aguardar ainda
        const confirmPromise = Modal.confirm('Mensagem de teste', 'Titulo Teste');
        
        // Verificar se o DOM foi injetado
        const backdrop = document.querySelector('.of-modal-backdrop');
        expect(backdrop).not.toBeNull();
        expect(backdrop.classList.contains('is-open')).toBe(true);
        expect(document.querySelector('.of-modal-title').textContent).toBe('Titulo Teste');

        // Simular o clique no botão de confirmar
        const confirmBtn = document.querySelectorAll('.of-modal-footer .of-btn-primary')[0];
        confirmBtn.click();

        // Aguardar o retorno da Promise
        const result = await confirmPromise;
        expect(result).toBe(true);
    });

    it('should resolve with false when confirm is cancelled', async () => {
        const confirmPromise = Modal.confirm('Mensagem');
        
        // Clicar em cancelar
        const cancelBtn = document.querySelectorAll('.of-modal-footer .of-btn-secondary')[0];
        cancelBtn.click();

        const result = await confirmPromise;
        expect(result).toBe(false);
    });

    it('should lock background scroll when open', () => {
        const modal = new Modal({ title: 'Test', content: 'Test' });
        modal.open();
        
        expect(document.body.style.overflow).toBe('hidden');
        
        modal.close();
        expect(document.body.style.overflow).toBe('');
    });
});
