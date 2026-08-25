// src/js/components/Modal.js

export class Modal {
    constructor(elementOrOptions) {
        // If string, try to find in DOM
        if (typeof elementOrOptions === 'string') {
            this.modalElement = document.querySelector(elementOrOptions);
        } else if (elementOrOptions instanceof HTMLElement) {
            this.modalElement = elementOrOptions;
        } else {
            // It's an options object, we need to create it dynamically
            this.options = elementOrOptions;
            this.modalElement = this._createDOM(this.options);
        }

        if (!this.modalElement) {
            throw new Error('Modal: Elemento não encontrado ou opções inválidas.');
        }

        this.isOpen = false;
        this.focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
        
        this._bindEvents();
    }

    _createDOM(options) {
        const backdrop = document.createElement('div');
        backdrop.className = 'of-modal-backdrop';
        backdrop.setAttribute('role', 'dialog');
        backdrop.setAttribute('aria-modal', 'true');

        const modal = document.createElement('div');
        modal.className = `of-modal ${options.size ? 'of-modal-' + options.size : ''}`;

        // Header
        const header = document.createElement('div');
        header.className = 'of-modal-header';
        
        const title = document.createElement('h3');
        title.className = 'of-modal-title';
        title.textContent = options.title || 'Alerta';
        
        const controls = document.createElement('div');
        controls.className = 'of-modal-controls';

        const minBtn = document.createElement('button');
        minBtn.className = 'of-modal-control-btn of-modal-minimize';
        minBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line></svg>';
        minBtn.dataset.action = 'minimize';

        const maxBtn = document.createElement('button');
        maxBtn.className = 'of-modal-control-btn of-modal-maximize';
        maxBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>';
        maxBtn.dataset.action = 'maximize';

        const closeBtn = document.createElement('button');
        closeBtn.className = 'of-modal-control-btn of-modal-close';
        closeBtn.innerHTML = '&times;';
        closeBtn.setAttribute('aria-label', 'Fechar modal');
        closeBtn.dataset.dismiss = 'modal';

        controls.appendChild(minBtn);
        controls.appendChild(maxBtn);
        controls.appendChild(closeBtn);

        header.appendChild(title);
        header.appendChild(controls);

        // Body
        const body = document.createElement('div');
        body.className = 'of-modal-body';
        body.innerHTML = options.content || '';

        modal.appendChild(header);
        modal.appendChild(body);

        // Footer
        if (options.buttons) {
            const footer = document.createElement('div');
            footer.className = 'of-modal-footer';
            
            options.buttons.forEach(btnConfig => {
                const btn = document.createElement('button');
                btn.className = `of-btn ${btnConfig.class || 'of-btn-primary'}`;
                btn.textContent = btnConfig.text;
                if (btnConfig.onClick) {
                    btn.addEventListener('click', (e) => {
                        btnConfig.onClick(e, this);
                    });
                }
                footer.appendChild(btn);
            });
            modal.appendChild(footer);
        }

        backdrop.appendChild(modal);
        document.body.appendChild(backdrop);
        
        return backdrop;
    }

    _bindEvents() {
        // Find close buttons
        const closeButtons = this.modalElement.querySelectorAll('[data-dismiss="modal"]');
        closeButtons.forEach(btn => {
            btn.addEventListener('click', () => this.close());
        });

        // O modal não deve mais fechar ao clicar fora, conforme regra de negócio.
        // Se precisar reativar no futuro, adicione a verificação de um atributo data-backdrop="true".

        const modalBox = this.modalElement.querySelector('.of-modal');
        const header = this.modalElement.querySelector('.of-modal-header');
        
        // Window Controls (Minimize / Maximize)
        const minBtn = this.modalElement.querySelector('[data-action="minimize"]');
        const maxBtn = this.modalElement.querySelector('[data-action="maximize"]');
        
        if (minBtn) {
            minBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                modalBox.classList.remove('is-maximized');
                modalBox.classList.toggle('is-minimized');
            });
        }

        if (maxBtn) {
            maxBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                modalBox.classList.remove('is-minimized');
                modalBox.classList.toggle('is-maximized');
                if (modalBox.classList.contains('is-maximized')) {
                    modalBox.style.transform = 'none'; // reset drag position
                }
            });
        }

        // Dragging Logic
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;
        let xOffset = 0;
        let yOffset = 0;

        if (header && modalBox) {
            header.addEventListener('mousedown', (e) => {
                if (e.target.closest('.of-modal-controls')) return; // Ignore clicks on buttons
                if (modalBox.classList.contains('is-maximized')) return;
                
                initialX = e.clientX - xOffset;
                initialY = e.clientY - yOffset;
                isDragging = true;
            });

            document.addEventListener('mouseup', () => {
                initialX = currentX;
                initialY = currentY;
                isDragging = false;
            });

            document.addEventListener('mousemove', (e) => {
                if (isDragging) {
                    e.preventDefault();
                    currentX = e.clientX - initialX;
                    currentY = e.clientY - initialY;
                    xOffset = currentX;
                    yOffset = currentY;
                    
                    if (!modalBox.classList.contains('is-minimized')) {
                        // Aplica transform incluindo o base do CSS caso não esteja animando a entrada
                        modalBox.style.transform = `translate(${currentX}px, ${currentY}px)`;
                    }
                }
            });
        }

        // Handle Escape key and Focus Trap
        this._handleKeyDown = this._handleKeyDown.bind(this);
    }

    _handleKeyDown(e) {
        if (e.key === 'Escape') {
            this.close();
            return;
        }

        if (e.key === 'Tab') {
            const focusableContent = this.modalElement.querySelectorAll(this.focusableElements);
            if (focusableContent.length === 0) return;

            const firstElement = focusableContent[0];
            const lastElement = focusableContent[focusableContent.length - 1];

            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    lastElement.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastElement) {
                    firstElement.focus();
                    e.preventDefault();
                }
            }
        }
    }

    open() {
        if (this.isOpen) return;
        this.modalElement.classList.add('is-open');
        this.isOpen = true;
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
        document.addEventListener('keydown', this._handleKeyDown);
        
        // Focus first element
        setTimeout(() => {
            const focusableContent = this.modalElement.querySelectorAll(this.focusableElements);
            if (focusableContent.length > 0) focusableContent[0].focus();
        }, 50);
    }

    close() {
        if (!this.isOpen) return;
        this.modalElement.classList.remove('is-open');
        this.isOpen = false;
        document.body.style.overflow = '';
        document.removeEventListener('keydown', this._handleKeyDown);

        // Se foi criado dinamicamente via JS (tem this.options), remover do DOM após transição
        if (this.options) {
            setTimeout(() => {
                if (this.modalElement.parentNode) {
                    this.modalElement.parentNode.removeChild(this.modalElement);
                }
            }, 300); // 300ms matches transition speed
        }
    }

    // Static Helpers (Smart Alerts com Promises)
    static confirm(message, title = 'Confirmação') {
        return new Promise((resolve) => {
            const modal = new Modal({
                title: title,
                content: `<p>${message}</p>`,
                size: 'sm',
                buttons: [
                    {
                        text: 'Cancelar',
                        class: 'of-btn-secondary',
                        onClick: (e, instance) => {
                            instance.close();
                            resolve(false);
                        }
                    },
                    {
                        text: 'Confirmar',
                        class: 'of-btn-primary',
                        onClick: (e, instance) => {
                            instance.close();
                            resolve(true);
                        }
                    }
                ]
            });
            modal.open();
        });
    }

    static alert(message, title = 'Alerta') {
        return new Promise((resolve) => {
            const modal = new Modal({
                title: title,
                content: `<p>${message}</p>`,
                size: 'sm',
                buttons: [
                    {
                        text: 'OK',
                        class: 'of-btn-primary',
                        onClick: (e, instance) => {
                            instance.close();
                            resolve(true);
                        }
                    }
                ]
            });
            modal.open();
        });
    }
}

// Auto-init for data-attributes
if (typeof window !== 'undefined') {
    document.addEventListener('click', (e) => {
        const trigger = e.target.closest('[data-toggle="modal"]');
        if (trigger) {
            const targetSelector = trigger.dataset.target;
            if (targetSelector) {
                const modal = new Modal(targetSelector);
                modal.open();
            }
        }
    });
}
