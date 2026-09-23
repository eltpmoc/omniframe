/**
 * Módulo de Configuração Global do OmniFrame
 * Permite customização dinâmica de variáveis CSS (temas, fontes, cores).
 */
export class Config {
    /**
     * Aplica customizações globais ao framework.
     * @param {Object} options Configurações de tema
     * @param {string} [options.primaryColor] - Cor principal para botões, inputs focados, links (ex: '#4f46e5')
     * @param {string} [options.secondaryColor] - Cor secundária do framework
     * @param {string} [options.fontFamily] - Tipo de fonte (ex: 'Roboto, sans-serif')
     * @param {string} [options.fontSize] - Tamanho base da fonte (ex: '16px' ou '1rem')
     * @param {string} [options.borderColor] - Cor base para bordas globais (ex: '#e2e8f0')
     */
    static setTheme(options = {}) {
        const root = document.documentElement;

        if (options.primaryColor) {
            root.style.setProperty('--of-primary', options.primaryColor);
            // Usando color-mix para gerar automaticamente a cor de hover (escurecendo 15%)
            root.style.setProperty('--of-primary-hover', `color-mix(in srgb, ${options.primaryColor}, black 15%)`);
            // Ajusta o glow/shadow colorido para focar inputs
            root.style.setProperty('--of-shadow-hover', `0 0 15px 0 color-mix(in srgb, ${options.primaryColor}, transparent 85%)`);
        }

        if (options.secondaryColor) {
            root.style.setProperty('--of-secondary', options.secondaryColor);
            // Usando color-mix para gerar automaticamente a cor de hover secundária
            root.style.setProperty('--of-secondary-hover', `color-mix(in srgb, ${options.secondaryColor}, black 15%)`);
        }

        if (options.fontFamily) {
            root.style.setProperty('--of-font-family', options.fontFamily);
        }

        if (options.fontSize) {
            root.style.setProperty('--of-font-size-base', options.fontSize);
            // Aplicar também ao root do documento para escalar utilitários baseados em rem
            root.style.fontSize = options.fontSize;
        }

        if (options.borderColor) {
            root.style.setProperty('--of-border-color', options.borderColor);
        }

        // Persistir configurações para uso entre páginas
        localStorage.setItem('omniframe_theme', JSON.stringify(options));
    }

    /**
     * Carrega as configurações salvas no localStorage
     */
    static loadTheme() {
        try {
            const saved = localStorage.getItem('omniframe_theme');
            if (saved) {
                const options = JSON.parse(saved);
                this.setTheme(options);
            }
        } catch (e) {
            console.error('Falha ao carregar o tema customizado:', e);
        }
    }

    /**
     * Reseta as customizações feitas no root do documento.
     */
    static resetTheme() {
        const root = document.documentElement;
        root.style.removeProperty('--of-primary');
        root.style.removeProperty('--of-primary-hover');
        root.style.removeProperty('--of-shadow-hover');
        root.style.removeProperty('--of-secondary');
        root.style.removeProperty('--of-secondary-hover');
        root.style.removeProperty('--of-font-family');
        root.style.removeProperty('--of-font-size-base');
        root.style.removeProperty('font-size');
        root.style.removeProperty('--of-border-color');
        localStorage.removeItem('omniframe_theme');
    }
}

// Auto-carregar o tema se já houver algo salvo
Config.loadTheme();
