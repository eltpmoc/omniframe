# 06. Multimedia & Imagens

Manipular players multimídia direto na web é feio porque cada navegador desenha seu `<audio>` ou `<video>` de um jeito. O OmniFrame sobrescreve isso com um Player Premium (*Glassmorphism*).

*Requer: `media.css`, `carousel.css`, `Media.js`, `Carousel.js`*

## Player de Áudio e Vídeo

Envolva a sua tag `audio` ou `video` numa `div` com classe `.of-media-player` e ative o `data-media-player`. 

O Javascript `Media.js` detectará o arquivo original, removerá os controles feios do navegador, e injetará sua própria barra com botão Play estilizado e Slider interativo de progresso. Se for um Vídeo, a barra ficará transparente por cima da tela, surgindo apenas no "Hover".

```html
<!-- Custom Audio Player -->
<div class="of-media-player" data-media-player>
    <audio src="audio-podcast.mp3"></audio>
</div>

<!-- Custom Video Player -->
<div class="of-media-player" data-media-player>
    <video src="filme.mp4" poster="capa.jpg"></video>
</div>
```

## Carrossel Responsivo (Slides)

Um slideshow simples em puro Vanilla JS, leve e perfeitamente renderizado, sem precisar instalar swiper.js ou bibliotecas pesadas.

A semântica baseia-se num `.of-carousel` contendo a trilha `.of-carousel-inner`, itens (`.of-carousel-item`), as setas prev/next e bolinhas indicadoras.

```html
<div class="of-carousel" data-carousel>
    <div class="of-carousel-inner">
        <div class="of-carousel-item">
            <img src="foto1.jpg" alt="Foto 1">
        </div>
        <div class="of-carousel-item">
            <img src="foto2.jpg" alt="Foto 2">
        </div>
    </div>
    
    <!-- Controles -->
    <button class="of-carousel-control of-carousel-prev" aria-label="Anterior">...</button>
    <button class="of-carousel-control of-carousel-next" aria-label="Próximo">...</button>
    
    <!-- Indicadores -->
    <div class="of-carousel-indicators">
        <button class="of-carousel-indicator is-active" aria-label="Slide 1"></button>
        <button class="of-carousel-indicator" aria-label="Slide 2"></button>
    </div>
</div>
```

## Imagens

A tag `<img />` padrão estoura a tela. O OmniFrame possui classes de CSS (Utilitários) prontas para controle:

- `.of-img-fluid`: Força a imagem a nunca passar de 100% da largura do contêiner, mantendo a proporção.
- `.of-img-cover`: Faz um *object-fit: cover* (perfeito para encaixar num Panel sem distorcer).
- `.of-img-rounded`: Aplica os cantos arredondados do sistema.
- `.of-img-shadow`: Cria a sombra padrão do tema por trás da imagem.
