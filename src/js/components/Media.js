// src/js/components/Media.js

export class Media {
    constructor(containerElement) {
        if (typeof containerElement === 'string') {
            this.container = document.querySelector(containerElement);
        } else {
            this.container = containerElement;
        }

        if (!this.container) {
            throw new Error('Media: Container não encontrado.');
        }

        this.mediaElement = this.container.querySelector('audio, video');
        if (!this.mediaElement) {
            throw new Error('Media: Tag <audio> ou <video> não encontrada dentro do container.');
        }

        this.isVideo = this.mediaElement.tagName === 'VIDEO';
        if (this.isVideo) {
            this.container.classList.add('is-video');
        } else {
            this.container.classList.add('is-audio');
        }

        this._createControls();
        this._bindEvents();
    }

    _createControls() {
        // Remove native controls
        this.mediaElement.removeAttribute('controls');

        this.controls = document.createElement('div');
        this.controls.className = 'of-media-controls';

        // Play/Pause Button
        this.playBtn = document.createElement('button');
        this.playBtn.className = 'of-media-play-btn';
        this.playBtn.setAttribute('aria-label', 'Play');
        this._setPlayIcon();

        // Timeline Area
        this.timeline = document.createElement('div');
        this.timeline.className = 'of-media-timeline';

        this.currentTimeEl = document.createElement('span');
        this.currentTimeEl.className = 'of-media-time';
        this.currentTimeEl.textContent = '0:00';

        this.progressBar = document.createElement('div');
        this.progressBar.className = 'of-media-progress-bar';
        this.progressFill = document.createElement('div');
        this.progressFill.className = 'of-media-progress-fill';
        this.progressBar.appendChild(this.progressFill);

        this.durationEl = document.createElement('span');
        this.durationEl.className = 'of-media-time';
        this.durationEl.textContent = '0:00';

        this.timeline.appendChild(this.currentTimeEl);
        this.timeline.appendChild(this.progressBar);
        this.timeline.appendChild(this.durationEl);

        this.controls.appendChild(this.playBtn);
        this.controls.appendChild(this.timeline);

        this.container.appendChild(this.controls);
    }

    _setPlayIcon() {
        this.playBtn.innerHTML = '<svg viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>';
    }

    _setPauseIcon() {
        this.playBtn.innerHTML = '<svg viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>';
    }

    _formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    }

    _bindEvents() {
        // Play/Pause
        this.playBtn.addEventListener('click', () => {
            if (this.mediaElement.paused) {
                this.mediaElement.play();
                this._setPauseIcon();
            } else {
                this.mediaElement.pause();
                this._setPlayIcon();
            }
        });

        // Click on video to play/pause
        if (this.isVideo) {
            this.mediaElement.addEventListener('click', () => {
                this.playBtn.click();
            });
        }

        // Update Time & Progress
        this.mediaElement.addEventListener('timeupdate', () => {
            const current = this.mediaElement.currentTime;
            const duration = this.mediaElement.duration;
            
            this.currentTimeEl.textContent = this._formatTime(current);
            if (duration) {
                const percent = (current / duration) * 100;
                this.progressFill.style.width = `${percent}%`;
            }
        });

        // Loaded Metadata
        this.mediaElement.addEventListener('loadedmetadata', () => {
            this.durationEl.textContent = this._formatTime(this.mediaElement.duration);
        });

        // Seek
        this.progressBar.addEventListener('click', (e) => {
            const rect = this.progressBar.getBoundingClientRect();
            const pos = (e.clientX - rect.left) / rect.width;
            this.mediaElement.currentTime = pos * this.mediaElement.duration;
        });

        // Ended
        this.mediaElement.addEventListener('ended', () => {
            this._setPlayIcon();
            this.progressFill.style.width = '0%';
        });
    }
}

// Auto-init for data-attributes
if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const medias = document.querySelectorAll('[data-media-player]');
        medias.forEach(media => {
            new Media(media);
        });
    });
}
