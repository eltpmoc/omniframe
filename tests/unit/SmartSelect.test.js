import { describe, it, expect, beforeEach } from 'vitest';
import { SmartSelect } from '../../src/js/components/SmartSelect.js';

describe('SmartSelect Unit Tests', () => {
    let selectElement;
    
    beforeEach(() => {
        // Setup mock DOM
        document.body.innerHTML = `
            <select id="testSelect">
                <option value="" disabled selected>Selecione...</option>
                <option value="br">Brasil</option>
                <option value="us">Estados Unidos</option>
                <option value="fr">França</option>
            </select>
        `;
        selectElement = document.getElementById('testSelect');
    });

    it('should build custom DOM and hide native select', () => {
        const smart = new SmartSelect('#testSelect');
        
        // Native select is moved inside wrapper
        expect(selectElement.parentNode.classList.contains('of-smart-select-wrapper')).toBe(true);
        
        // Custom DOM exists
        expect(document.querySelector('.of-smart-select-trigger')).not.toBeNull();
        expect(document.querySelector('.of-smart-select-dropdown')).not.toBeNull();
    });

    it('should filter options based on search input', () => {
        const smart = new SmartSelect('#testSelect');
        
        // Expect 3 options (excluding the disabled placeholder)
        const options = document.querySelectorAll('.of-smart-select-option');
        expect(options.length).toBe(3);

        // Simulate search for 'Brasil'
        smart.filterOptions('Brasil');
        
        expect(options[0].style.display).toBe('block'); // Brasil
        expect(options[1].style.display).toBe('none');  // EUA
        expect(options[2].style.display).toBe('none');  // França
    });

    it('should update native select value when an option is clicked', () => {
        const smart = new SmartSelect('#testSelect');
        
        // Simulate click on 'Estados Unidos' (index 1 in the rendered list)
        const usOption = document.querySelectorAll('.of-smart-select-option')[1];
        smart.selectOption(usOption.dataset.value, usOption.textContent);
        
        // Verify native select value changed
        expect(selectElement.value).toBe('us');
        
        // Verify trigger text updated
        expect(document.querySelector('.of-smart-select-trigger').textContent).toBe('Estados Unidos');
    });
});
