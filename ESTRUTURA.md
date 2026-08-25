# OmniFrame - Estrutura Recomendada do Repositório

Esta é a estrutura de pastas e arquivos sugerida para o framework no GitHub:

```text
OmniFrame/
├── .github/                 # Workflows do GitHub Actions (CI/CD)
├── dist/                    # Arquivos minificados para distribuição (CSS/JS)
│   ├── omniframe.min.css
│   └── omniframe.min.js
├── src/                     # Código fonte original
│   ├── css/
│   │   ├── variables.css    # Variáveis CSS globais (Light/Dark mode)
│   │   ├── reset.css        # CSS Reset e tipografia base
│   │   ├── grid.css         # Sistema de grid
│   │   ├── utilities.css    # Classes utilitárias
│   │   └── components/      # CSS de cada componente
│   │       ├── datatable.css
│   │       ├── modal.css
│   │       ├── forms.css
│   │       └── ...
│   ├── js/
│   │   ├── core/            # Utilitários JS internos
│   │   └── components/      # Classes JS de cada componente
│   │       ├── DataTable.js
│   │       ├── Modal.js
│   │       └── ...
│   └── index.js             # Arquivo principal que exporta os componentes
├── examples/                # Arquivos HTML demonstrando o uso de cada componente
│   ├── datatable.html
│   ├── forms.html
│   └── login-templates.html
├── docs/                    # Documentação do framework (pode ser servida via GitHub Pages)
├── package.json             # Dependências de desenvolvimento (bundlers como Vite/Rollup)
├── .gitignore
├── LICENSE
└── README.md
```
