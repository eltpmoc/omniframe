// src/js/components/Tabs.js

export class Tabs {
    constructor(elementOrSelector) {
        this.tablist = typeof elementOrSelector === 'string' 
            ? document.querySelector(elementOrSelector) 
            : elementOrSelector;
            
        if (!this.tablist) throw new Error('Tabs: Elemento container da tablist não encontrado.');

        this.tabs = Array.from(this.tablist.querySelectorAll('[data-toggle="tab"]'));
        
        // Encontrar os painéis correspondentes
        this.panels = this.tabs.map(tab => {
            const targetId = tab.dataset.target || tab.getAttribute('href');
            return document.querySelector(targetId);
        }).filter(panel => panel !== null);

        this.init();
    }

    init() {
        this._setupA11y();
        this._bindEvents();
        
        // Ativar a primeira aba, caso nenhuma esteja ativa
        const hasActive = this.tabs.some(t => t.classList.contains('is-active'));
        if (!hasActive && this.tabs.length > 0) {
            this.activateTab(this.tabs[0]);
        }
    }

    _setupA11y() {
        this.tablist.setAttribute('role', 'tablist');

        this.tabs.forEach((tab, index) => {
            const targetId = tab.dataset.target || tab.getAttribute('href');
            const panel = document.querySelector(targetId);

            tab.setAttribute('role', 'tab');
            tab.setAttribute('tabindex', tab.classList.contains('is-active') ? '0' : '-1');
            tab.setAttribute('aria-selected', tab.classList.contains('is-active') ? 'true' : 'false');
            
            if (panel) {
                tab.setAttribute('aria-controls', panel.id);
                if (!tab.id) tab.id = `tab-${panel.id}`;
                panel.setAttribute('role', 'tabpanel');
                panel.setAttribute('aria-labelledby', tab.id);
                // Inicializa display baseado na classe is-active do tab
                if (tab.classList.contains('is-active')) {
                    panel.classList.add('is-active');
                }
            }
        });
    }

    _bindEvents() {
        this.tablist.addEventListener('click', (e) => {
            const tab = e.target.closest('[data-toggle="tab"]');
            if (tab) {
                e.preventDefault();
                this.activateTab(tab);
            }
        });

        // Navegação por setas (A11y WAI-ARIA)
        this.tablist.addEventListener('keydown', (e) => {
            const currentTab = e.target.closest('[data-toggle="tab"]');
            if (!currentTab) return;

            const currentIndex = this.tabs.indexOf(currentTab);
            let nextIndex = null;

            if (e.key === 'ArrowRight') {
                nextIndex = currentIndex === this.tabs.length - 1 ? 0 : currentIndex + 1;
            } else if (e.key === 'ArrowLeft') {
                nextIndex = currentIndex === 0 ? this.tabs.length - 1 : currentIndex - 1;
            } else if (e.key === 'Home') {
                nextIndex = 0;
            } else if (e.key === 'End') {
                nextIndex = this.tabs.length - 1;
            }

            if (nextIndex !== null) {
                e.preventDefault();
                const nextTab = this.tabs[nextIndex];
                nextTab.focus();
                this.activateTab(nextTab); // Optional: Activate on focus (standard behavior for many tab systems)
            }
        });
    }

    activateTab(targetTab) {
        if (targetTab.classList.contains('is-active')) return;

        // Desativar todas as abas e painéis
        this.tabs.forEach(tab => {
            tab.classList.remove('is-active');
            tab.setAttribute('aria-selected', 'false');
            tab.setAttribute('tabindex', '-1');
        });

        this.panels.forEach(panel => {
            panel.classList.remove('is-active');
        });

        // Ativar a nova aba
        targetTab.classList.add('is-active');
        targetTab.setAttribute('aria-selected', 'true');
        targetTab.setAttribute('tabindex', '0');

        // Ativar o novo painel
        const targetId = targetTab.dataset.target || targetTab.getAttribute('href');
        const targetPanel = document.querySelector(targetId);
        if (targetPanel) {
            targetPanel.classList.add('is-active');
        }

        // Disparar um evento customizado
        const event = new CustomEvent('of:tab-changed', {
            detail: { tab: targetTab, panel: targetPanel },
            bubbles: true
        });
        targetTab.dispatchEvent(event);
    }
}

// Auto-init for data-attributes
if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        // Encontra os containeres das abas
        const tablists = document.querySelectorAll('[role="tablist"], .of-tabs-list');
        tablists.forEach(list => {
            // Ignorar se já foi inicializado (opcional, pode ser checado por dataset)
            if (!list.dataset.tabsInitialized) {
                new Tabs(list);
                list.dataset.tabsInitialized = 'true';
            }
        });
    });
}
