import { describe, it, expect, beforeEach } from 'vitest';
import { FAB } from '../../src/js/components/FAB.js';

describe('Floating Action Button (FAB) Unit Tests', () => {
    
    beforeEach(() => {
        document.body.innerHTML = `
            <div class="of-fab-wrapper" id="myFab">
                <ul class="of-fab-menu">
                    <li class="of-fab-item"><button class="of-fab-btn" id="subBtn1">1</button></li>
                </ul>
                <button class="of-fab-btn of-fab-trigger" id="mainTrigger">+</button>
            </div>
        `;
    });

    it('should toggle is-open class on trigger click', () => {
        const fabInstance = new FAB('#myFab');
        const wrapper = document.getElementById('myFab');
        const trigger = document.getElementById('mainTrigger');

        expect(wrapper.classList.contains('is-open')).toBe(false);

        // Click to open
        trigger.click();
        expect(wrapper.classList.contains('is-open')).toBe(true);
        expect(trigger.getAttribute('aria-expanded')).toBe('true');

        // Click to close
        trigger.click();
        expect(wrapper.classList.contains('is-open')).toBe(false);
        expect(trigger.getAttribute('aria-expanded')).toBe('false');
    });

    it('should close when a sub-item is clicked', () => {
        const fabInstance = new FAB('#myFab');
        const wrapper = document.getElementById('myFab');
        const subBtn = document.getElementById('subBtn1');
        
        fabInstance.open();
        expect(wrapper.classList.contains('is-open')).toBe(true);

        subBtn.click();
        expect(wrapper.classList.contains('is-open')).toBe(false);
    });

    it('should close on Escape key', () => {
        const fabInstance = new FAB('#myFab');
        const wrapper = document.getElementById('myFab');
        
        fabInstance.open();
        expect(wrapper.classList.contains('is-open')).toBe(true);

        // Disparar evento de teclado ESC
        const event = new KeyboardEvent('keydown', { key: 'Escape' });
        document.dispatchEvent(event);

        expect(wrapper.classList.contains('is-open')).toBe(false);
    });
});
