# 04. Navigation System

O sistema de Navegação do OmniFrame foi desenhado para criar Dashboards profissionais instantaneamente, garantindo paridade com o Bootstrap, porém 100% livre de jQuery ou pacotes JS pesados.

*Requer: `navbar.css`, `sidebar.css`, `dropdown.css`, `Sidebar.js`, `Dropdown.js`.*

## A Navbar (Barra Superior)

Para o topo da sua aplicação, use a `.of-navbar`. Ela possui lógica inteligente para esconder links e exibir o "Menu Hambúrguer" automaticamente em telas menores (abaixo de 992px).

```html
<nav class="of-navbar">
    <!-- Logotipo principal -->
    <a href="#" class="of-navbar-brand">MinhaApp</a>
    
    <!-- Botão Hambúrguer que abre a Sidebar ou o menu (Requer Sidebar.js se linkado a Sidebar) -->
    <button class="of-navbar-toggler" data-toggle="sidebar" data-target="#menuPrincipal" aria-label="Abrir Menu">
        ☰
    </button>
    
    <!-- Área que colapsa no mobile -->
    <div class="of-navbar-collapse">
        <ul class="of-navbar-nav">
            <li><a href="#" class="of-nav-link is-active">Início</a></li>
            <li><a href="#" class="of-nav-link">Relatórios</a></li>
        </ul>
    </div>
</nav>
```

## A Sidebar (Menu Lateral)

O `.of-sidebar` é o coração de layouts de software. 
Quando a janela do navegador estiver grande (Desktop), se você colocar a classe `.of-layout-has-sidebar` na tag `<body>`, a Sidebar empurrará o conteúdo para a direita, fixando-se lindamente na tela.
Quando a tela for de um Celular, ela esconde-se e vira um **Offcanvas**, deslizando sobre a tela ao ser chamada pelo botão `data-toggle="sidebar"`.

```html
<!-- HTML Básico da Sidebar -->
<aside class="of-sidebar" id="menuPrincipal">
    <div class="of-sidebar-header">
        <h1 class="of-sidebar-title">Painel</h1>
        <!-- Botão para fechar no Mobile -->
        <button class="of-close d-lg-none" data-dismiss="sidebar"></button>
    </div>
    <div class="of-sidebar-body">
        <ul class="of-sidebar-nav">
            <li><a href="#" class="of-sidebar-link is-active">Home</a></li>
            <li><a href="#" class="of-sidebar-link">Configurações</a></li>
        </ul>
    </div>
</aside>
```
*Não se esqueça de inicializar importando o `Sidebar.js` no seu projeto.*

## Dropdowns Contextuais

Um clássico. Clicar em um texto e ver um menu flutuar.

- O botão/link clicável **DEVE** ter `class="of-dropdown-toggle"` e `data-toggle="dropdown"`.
- Ele e o menu invisível **DEVEM** ser envolvidos por um container `.of-dropdown`.
- O `Dropdown.js` garante que cliques fora da janela fechem o dropdown.

```html
<div class="of-dropdown">
    <button class="of-btn of-btn-primary of-dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
        Minha Conta
    </button>
    <ul class="of-dropdown-menu">
        <li><a href="#" class="of-dropdown-item">Perfil</a></li>
        <li><a href="#" class="of-dropdown-item">Faturamento</a></li>
        <li class="of-dropdown-divider"></li>
        <li><a href="#" class="of-dropdown-item text-danger">Sair</a></li>
    </ul>
</div>
```

## Tabs (Abas Acessíveis)

Se precisa alternar conteúdo na mesma página, use o `Tabs.js`. O JavaScript toma conta das setas direcionais do teclado (Acessibilidade) e da transição.

```html
<div class="of-tabs" data-tabs>
    <div class="of-tabs-header" role="tablist">
        <button class="of-tab-btn is-active" data-target="#painel1" role="tab">Geral</button>
        <button class="of-tab-btn" data-target="#painel2" role="tab">Avançado</button>
    </div>
    <div class="of-tabs-content">
        <div id="painel1" class="of-tab-panel is-active" role="tabpanel">Conteúdo aba 1</div>
        <div id="painel2" class="of-tab-panel" role="tabpanel">Conteúdo aba 2</div>
    </div>
</div>
```
