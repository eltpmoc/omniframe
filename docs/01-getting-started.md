# 01. Getting Started (Iniciando)

O OmniFrame é modular por natureza. Você não precisa carregar o framework inteiro se for usar apenas botões e alertas. Mas, para uma experiência completa estilo "Bootstrap", sugerimos carregar os recursos base.

## Instalação (Sem Build Tools)

A forma mais simples de usar o OmniFrame é copiando a pasta `src` para o seu projeto e linkando no cabeçalho do seu HTML.

### 1. CSS Obrigatório
Qualquer uso do OmniFrame precisa, no mínimo, do arquivo de Variáveis Globais (`variables.css`), que injeta a paleta de cores e propriedades fundamentais no escopo `:root`.

```html
<head>
  <!-- OBRIGATÓRIO -->
  <link rel="stylesheet" href="path/to/src/css/variables.css">
  
  <!-- RECOMENDADO: Utilitários e Grid Básicos -->
  <link rel="stylesheet" href="path/to/src/css/layout.css">
  <link rel="stylesheet" href="path/to/src/css/typography.css">
  <link rel="stylesheet" href="path/to/src/css/utilities.css">
  
  <!-- COMPONENTES (Escolha apenas o que usar) -->
  <link rel="stylesheet" href="path/to/src/css/components/forms.css">
  <link rel="stylesheet" href="path/to/src/css/components/modal.css">
</head>
```

### 2. Importação do JavaScript (Módulos ES6)

Todo o JavaScript do OmniFrame foi escrito usando classes ECMAScript. Para utilizá-las, o seu bloco de `<script>` precisa declarar o atributo `type="module"`.

```html
<!-- Fim da sua tag <body> -->
<script type="module">
    // Importe exatamente o que vai usar
    import { Modal } from './src/js/components/Modal.js';
    import { Alert } from './src/js/components/Alert.js';
    import { Sidebar } from './src/js/components/Sidebar.js';
    import { Dropdown } from './src/js/components/Dropdown.js';

    // Os componentes se auto-inicializam ao encontrar atributos `data-*` 
    // específicos no seu HTML após o DOM carregar.
</script>
```

> **Atenção:** Como o JavaScript usa `import`, você não pode testar abrindo o arquivo `index.html` diretamente do disco duro (`file:///`). É necessário estar rodando um servidor local (como `npx serve`, `Live Server` do VSCode ou Apache/Nginx).

## Temas Dinâmicos (Dark Mode)

O OmniFrame possui suporte nativo e instantâneo a troca de temas (Light/Dark).
Por padrão, aplique o atributo `data-theme="light"` na tag `<html>`:

```html
<html lang="pt-BR" data-theme="light">
```

Para inverter todo o sistema de cores do OmniFrame para o modo escuro, basta usar JavaScript simples para alterar este atributo:

```javascript
document.documentElement.setAttribute('data-theme', 'dark');
```
Não há recarregamento de página; todas as variáveis CSS reagem instantaneamente.
