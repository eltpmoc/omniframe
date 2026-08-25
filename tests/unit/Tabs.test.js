import { describe, it, expect, beforeEach } from 'vitest';
import { Tabs } from '../../src/js/components/Tabs.js';

describe('Tabs Unit Tests', () => {
    
    beforeEach(() => {
        document.body.innerHTML = `
            <div class="of-tabs-list">
                <button class="of-tab is-active" data-toggle="tab" data-target="#panel-1" id="tab-1">Aba 1</button>
                <button class="of-tab" data-toggle="tab" data-target="#panel-2" id="tab-2">Aba 2</button>
            </div>
            <div class="of-tab-panel is-active" id="panel-1">Painel 1</div>
            <div class="of-tab-panel" id="panel-2">Painel 2</div>
        `;
    });

    it('should initialize ARIA attributes correctly', () => {
        new Tabs('.of-tabs-list');

        const tab1 = document.getElementById('tab-1');
        const tab2 = document.getElementById('tab-2');
        const panel1 = document.getElementById('panel-1');
        const panel2 = document.getElementById('panel-2');

        expect(tab1.getAttribute('aria-selected')).toBe('true');
        expect(tab2.getAttribute('aria-selected')).toBe('false');

        expect(tab1.getAttribute('tabindex')).toBe('0');
        expect(tab2.getAttribute('tabindex')).toBe('-1');

        expect(panel1.getAttribute('role')).toBe('tabpanel');
        expect(panel1.getAttribute('aria-labelledby')).toBe('tab-1');
    });

    it('should switch tabs and update classes on activation', () => {
        const tabsInstance = new Tabs('.of-tabs-list');
        const tab2 = document.getElementById('tab-2');
        const panel1 = document.getElementById('panel-1');
        const panel2 = document.getElementById('panel-2');

        // Ativação manual da segunda aba
        tabsInstance.activateTab(tab2);

        expect(tab2.classList.contains('is-active')).toBe(true);
        expect(tab2.getAttribute('aria-selected')).toBe('true');

        // Validar painéis
        expect(panel1.classList.contains('is-active')).toBe(false);
        expect(panel2.classList.contains('is-active')).toBe(true);
    });
});
