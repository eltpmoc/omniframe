# 05. Componentes e Utilitários

Botões, Modais que se comportam como janelas, e Feedbacks essenciais.

*Requer: `modal.css`, `alerts.css`, `listgroup.css`, `utilities.css`, `Modal.js`, `Alert.js`*

## Botões e FAB

O OmniFrame tem botões premium já ajustados para "Pill Shape" (cantos redondos) com os tamanhos: `.of-btn-sm` e `.of-btn-lg`.

**Variantes principais:**
- `.of-btn-primary` e `.of-btn-secondary`: Cores sólidas de ação primária.
- `.of-btn-outline` e `.of-btn-ghost`: Menos interferência visual (ghost apenas tem cor de fundo no hover).
- `.of-btn-soft`: Translúcido, estilo "Neumorphism".
- `.of-btn-3d`: Fundo saliente com sombra forte que afunda magicamente no clique.

**FAB (Floating Action Button):**
Um botão flutuante de ações rápidas no canto inferior direito. Use o `FAB.js` junto de `fab.css`.
```html
<div class="of-fab-container">
    <button class="of-fab" data-toggle="fab">+</button>
    <div class="of-fab-menu">
        <!-- Ícones menores que pulam para fora -->
        <button class="of-fab-item">1</button>
        <button class="of-fab-item">2</button>
    </div>
</div>
```

## O Botão Global de Fechar (".of-close")
Se precisar de um "X" em qualquer lugar (fechar janelas, tags, alertas), use:
```html
<button class="of-close" aria-label="Fechar"></button>
```
Ele é gerado via SVG CSS, não precisa de fontes de ícone, e reage a estados de `disabled`. 

## Alertas Dismissíveis
Use para avisar o usuário sobre algo importante. Adicionar a classe `.of-alert-dismissible` com o botão `data-dismiss="alert"` permite fechar a barra com fade out via `Alert.js`.

```html
<div class="of-alert of-alert-success of-alert-dismissible" role="alert">
    <div class="of-alert-content">
        <h3 class="of-alert-title">Salvo com sucesso</h3>
        <p class="of-alert-text">Suas configurações foram atualizadas.</p>
    </div>
    <button class="of-close" data-dismiss="alert" aria-label="Fechar alerta"></button>
</div>
```

## List Groups
Agrupadores de listas contínuas coladas. Ótimos para mostrar menus laterais ou lista de configurações.

```html
<div class="of-list-group">
    <a href="#" class="of-list-group-item is-active">Geral (Ativo)</a>
    <a href="#" class="of-list-group-item">Privacidade</a>
    <a href="#" class="of-list-group-item is-disabled" aria-disabled="true">Beta (Desativado)</a>
</div>
```

## Super Modais (Window Mode)

Os modais do OmniFrame transcendem os clássicos do web design. Eles simulam "Janelas de Sistema Operacional".

- **Draggable:** O usuário pode clicar no título do modal e arrastá-lo livremente pela tela.
- **Min/Max:** Adicionando botões de `data-action="minimize"`, o modal encolhe para o rodapé (estilo "Janela de Bate Papo").

### Abrindo via DOM (data-attributes)
```html
<button class="of-btn" data-toggle="modal" data-target="#meuModal">Abrir Janela</button>

<div class="of-modal-backdrop" id="meuModal">
    <div class="of-modal">
        <!-- Se inserir a classe .of-modal-controls, adicione botões Min/Max/Close aqui! -->
        <div class="of-modal-header">
            <h3 class="of-modal-title">Configurações</h3>
            <button class="of-close" data-dismiss="modal"></button>
        </div>
        <div class="of-modal-body">
            Corpo do sistema...
        </div>
    </div>
</div>
```

### Abrindo via JavaScript Promissificado
Módulo extremamente útil. O Modal se cria *do nada* usando código e retorna uma `Promise` Javascript esperando a ação do usuário (Substituto perfeito para o tosco `alert()` e `confirm()` do JS).

```javascript
import { Modal } from './src/js/components/Modal.js';

Modal.confirm('Você tem certeza que deseja deletar este item?', 'Atenção').then((confirmou) => {
    if(confirmou) {
        console.log('Deletando...');
    }
});
```
