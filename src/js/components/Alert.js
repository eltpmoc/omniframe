// src/js/components/Alert.js

export class Alert {
    constructor(element) {
        if (typeof element === 'string') {
            this.alert = document.querySelector(element);
        } else {
            this.alert = element;
        }

        if (!this.alert) return;

        this._bindEvents();
    }

    _bindEvents() {
        const closeBtn = this.alert.querySelector('[data-dismiss="alert"]');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.close());
        }
    }

    close() {
        // Remove active class for animation
        this.alert.classList.add('is-closing');
        
        // Wait for CSS transition (assumes --of-transition-normal is ~300ms)
        setTimeout(() => {
            if (this.alert.parentNode) {
                this.alert.parentNode.removeChild(this.alert);
            }
        }, 300);
    }
}

// Auto-init for data-attributes
if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const alerts = document.querySelectorAll('.of-alert-dismissible');
        alerts.forEach(alert => new Alert(alert));
    });
}
