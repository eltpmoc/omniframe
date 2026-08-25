import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GlobalSearch } from '../../src/js/components/GlobalSearch.js';

describe('Global Search Unit Tests', () => {
    
    beforeEach(() => {
        // Clear previous state and timers
        document.body.innerHTML = `
            <div data-searchable>Card of Apple</div>
            <div data-searchable>Card of Banana</div>
            <div data-searchable>Card of Orange</div>
        `;
        // Clear globally appended singletons
        const oldBackdrop = document.querySelector('.of-globalsearch-backdrop');
        if (oldBackdrop) oldBackdrop.remove();
    });

    it('should open automatically on Ctrl+K', () => {
        const search = new GlobalSearch();
        expect(search.isOpen).toBe(false);

        // Simulando atalho Ctrl+K
        const event = new KeyboardEvent('keydown', { key: 'k', ctrlKey: true });
        document.dispatchEvent(event);

        expect(search.isOpen).toBe(true);
        expect(document.querySelector('.of-globalsearch-backdrop').classList.contains('is-open')).toBe(true);
    });

    it('should filter DOM elements locally', () => {
        const search = new GlobalSearch();
        const cards = document.querySelectorAll('[data-searchable]');
        
        // Input "apple"
        search.inputElement.value = 'apple';
        search.inputElement.dispatchEvent(new Event('input'));
        
        expect(cards[0].style.display).toBe(''); // Apple remains
        expect(cards[1].style.display).toBe('none'); // Banana hidden
        expect(cards[2].style.display).toBe('none'); // Orange hidden
    });

    it('should call onSearch callback if provided', async () => {
        vi.useFakeTimers();
        const mockCallback = vi.fn();
        const search = new GlobalSearch({ onSearch: mockCallback });
        
        search.inputElement.value = 'api request';
        search.inputElement.dispatchEvent(new Event('input'));

        // O callback possui debounce de 300ms, então não deve ser chamado instantaneamente
        expect(mockCallback).not.toHaveBeenCalled();

        // Avançar o tempo
        vi.advanceTimersByTime(300);

        expect(mockCallback).toHaveBeenCalledWith('api request');
        
        vi.useRealTimers();
    });
});
