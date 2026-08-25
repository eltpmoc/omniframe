# 02. Layout System

O OmniFrame possui um sistema de Grid próprio (baseado em CSS Flexbox e Grid nativos) criado para ser leve, previsível e sem *overrides* pesados.

*Requer: `layout.css`, `panels.css`*

## Containers
Para centralizar o conteúdo da sua página limitando a largura máxima, envolva seu layout em um `.of-container`.

```html
<div class="of-container">
  <!-- Conteúdo principal -->
</div>
```

## Sistema de Grid (12 Colunas)

O OmniFrame utiliza o padrão clássico de 12 colunas, facilitando a portabilidade para quem já vem do Bootstrap. 

O componente principal que invoca a matemática do Grid é o `.of-grid`. Dentro dele, você especifica o tamanho dos filhos usando as classes `.of-g-col-{1 a 12}`.

```html
<div class="of-grid">
  <!-- Duas colunas idênticas, ocupando 6 espaços de 12 cada (50%) -->
  <div class="of-g-col-6">Coluna 1 (50%)</div>
  <div class="of-g-col-6">Coluna 2 (50%)</div>

  <!-- Um layout 8 e 4 -->
  <div class="of-g-col-8">Conteúdo principal (Maior)</div>
  <div class="of-g-col-4">Sidebar / Widgets (Menor)</div>
</div>
```
A quebra de responsividade (stack) para mobile já está embutida no `.of-grid`.

## Panels e Cards

Para envolver conteúdo com destaque, sombras, e um background sólido diferenciado, use o `.of-panel` ou sua variante (alias) `.of-card`.

```html
<div class="of-card">
  <!-- Opcional: Imagem no Topo -->
  <img src="imagem.jpg" class="of-card-img-top" alt="...">
  
  <div class="of-card-header">Título do Painel</div>
  
  <div class="of-card-body">
    <p>Aqui vai o texto ou componente principal.</p>
  </div>
  
  <div class="of-card-footer">
    <button class="of-btn of-btn-primary">Ação</button>
  </div>
</div>
```

### Variantes de Scroll para Panels
Painéis frequentemente abrigam tabelas grandes ou listas. Para evitar que quebrem o layout da página principal, você pode aplicar modificadores de rolagem no `.of-panel-body`:

- `.of-panel-scroll-y`: Força limite de altura (max-height 400px padrão) e gera rolagem vertical.
- `.of-panel-scroll-x`: Permite deslizar o conteúdo excedente para os lados, perfeito para tabelas longas.

```html
<div class="of-card">
  <div class="of-card-header">Histórico</div>
  <!-- Para acessibilidade, sempre adicione tabindex=0 em regiões de scroll manual -->
  <div class="of-card-body of-panel-scroll-y" tabindex="0">
      <!-- Conteúdo super longo -->
  </div>
</div>
```
