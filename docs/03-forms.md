# 03. Forms & Inputs

O sistema de formulários do OmniFrame foca no alto contraste, suporte nato a estados de erro e utilitários modernos (Switches e Sliders).

*Requer: `forms.css`, `listbox.css`, `ListBox.js` (Opcional)*

## Grupos de Formulário Base

Recomendamos agrupar `labels` e `inputs` dentro de um `.of-form-group` para espaçamento consistente.

```html
<div class="of-form-group">
  <label class="of-label" for="meu-input">E-mail</label>
  <input type="email" id="meu-input" class="of-input" placeholder="exemplo@email.com">
</div>

<div class="of-form-group">
  <label class="of-label" for="minha-obs">Observações</label>
  <textarea id="minha-obs" class="of-textarea" rows="3"></textarea>
</div>
```

### Estados de Validação (Feedback Visual)

Aplica-se dinamicamente a classe `.is-invalid` ou `.is-valid` no `.of-input` ou `.of-textarea`. Você também pode anexar a mensagem abaixo.

```html
<div class="of-form-group">
  <input type="text" class="of-input is-invalid">
  <div class="of-feedback-invalid">Por favor, preencha este campo.</div>
</div>
```

## Checkboxes Customizados e Toggle Switches

O HTML nativo para seleções únicas/múltiplas é visualmente ultrapassado. O OmniFrame sobrescreve isso com `.of-checkbox` e `.of-radio`. Envolva-os em uma `.of-check-group` para alinhá-los com texto.

```html
<!-- Checkbox Padrão -->
<label class="of-check-group">
    <input type="checkbox" class="of-checkbox">
    <span>Lembrar de mim</span>
</label>

<!-- Toggle Switch (Modo Noturno iOS Style) -->
<label class="of-check-group">
    <input type="checkbox" class="of-switch" aria-label="Ativar Notificações">
    <span>Ativar Notificações</span>
</label>
```

## Range Slider (Controle Deslizante)

O `<input type="range">` nativo é feio. Ao aplicar `.of-range`, ele vira uma trilha lisa com um "thumb" estilizado e interativo.

```html
<label class="of-label" for="volume">Volume</label>
<input type="range" id="volume" class="of-range" min="0" max="100" value="50">
```

## ListBox Inteligente (Dropdown com Busca)

Se você tem um `<select>` enorme (ex: Cidades ou Categorias), usar o componente nativo em Desktop é ruim para usabilidade.

Com o script `ListBox.js` carregado, basta adicionar o atributo `data-listbox` a qualquer `<select>`. O framework **esconderá** o `<select>` nativo e desenhará na tela um lindo container flutuante com barra de pesquisa integrada.

```html
<select data-listbox name="framework">
    <option value="front">Frontend</option>
    <option value="back">Backend</option>
    <option value="db">Banco de Dados</option>
</select>
```
*Toda seleção refletirá no valor do `<select>` invisível automaticamente para o seu `submit` de formulário tradicional.*
