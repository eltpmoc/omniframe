# 07. Tabelas de Dados Ricas (DataTable e Search)

Exibir e lidar com grandes blocos de informação costumava requerer o uso de pesados plugins jQuery como DataTables. O OmniFrame v1.0 traz tudo isso em ES6 puro, com altíssima performance usando renderização de fragmentos DOM.

*Requer: `datatable.css`, `globalsearch.css`, `DataTable.js`, `GlobalSearch.js`.*

## DataTable (Tabela Inteligente)

Transforma um JSON em uma Tabela com **Busca**, **Paginação** e **Ordenação** automáticas. Tudo renderizado pelo motor do OmniFrame.

```html
<div id="minhaTabela"></div>

<script type="module">
    import { DataTable } from './src/js/components/DataTable.js';

    const colunas = [
        { key: 'id', title: 'ID', sortable: true },
        { key: 'nome', title: 'Nome', sortable: true },
        { key: 'email', title: 'E-mail', sortable: true },
        { key: 'status', title: 'Status', sortable: false } // Campo não ordenável
    ];

    const dadosMokados = [
        { id: 1, nome: "João", email: "joao@email.com", status: "Ativo" },
        { id: 2, nome: "Maria", email: "maria@email.com", status: "Inativo" }
        // ... coloque mil registros aqui, ele roda liso.
    ];

    const minhaTabela = new DataTable('#minhaTabela', {
        columns: colunas,
        data: dadosMokados,
        rowsPerPage: 10,
        searchable: true // Gera o Input de busca no topo!
    });
</script>
```

A Tabela injetará as setinhas de re-ordenamento nos cabeçalhos e todo o layout acessível, garantindo que usuários que usem teclado naveguem facilmente pela tabela.

## Global Search (Omni Search)

Pressione a combinação de teclas `Ctrl + /` ou `Cmd + /` em seu teclado, ou chame-o programaticamente, e você verá o Global Search (nosso "Spotlight"). 

Ele é uma barra gigante flutuante estilo *Command Palette* (Mac/MacOS). O `GlobalSearch.js` lê na própria página todas as caixas (DIVs ou Seções) que possuam o atributo `data-searchable`. Ele indexa o texto dentro do atributo `data-search-term="palavras chave..."`.

Quando o usuário digita na busca e clica em um resultado, a página faz scroll suave (Smooth Scroll) direto para o componente na tela e pisca-o com uma animação dourada de Destaque para o usuário!

### Como configurar as divisões para a Busca?

Basta envolver sua área (como um Cartão) nos atributos mágicos e invocar o Módulo:

```html
<!-- Crie um botão para invocar o Menu flutuante -->
<button data-toggle="globalsearch">Pesquisar... (Ctrl /)</button>

<!-- Em algum lugar da página, marque sua Div -->
<div id="secao-vendas" data-searchable data-search-term="financeiro vendas relatorios faturamento">
    <h3>Relatório de Vendas</h3>
    <p>Números sensíveis da empresa.</p>
</div>

<script type="module">
    import { GlobalSearch } from './src/js/components/GlobalSearch.js';
    
    // Apenas inicialize. Ele varrerá tudo sozinho!
</script>
```
