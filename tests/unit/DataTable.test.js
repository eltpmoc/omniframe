import { describe, it, expect, beforeEach } from 'vitest';
import { DataTable } from '../../src/js/components/DataTable.js';

describe('DataTable Unit Tests', () => {
    let container;
    
    beforeEach(() => {
        // Setup a mock DOM
        document.body.innerHTML = `
            <table id="testTable">
                <thead>
                    <tr><th>Name</th><th>Age</th></tr>
                </thead>
                <tbody>
                    ${Array.from({ length: 100 }).map((_, i) => `<tr><td>Person ${i + 1}</td><td>${20 + i}</td></tr>`).join('')}
                </tbody>
            </table>
        `;
        container = document.getElementById('testTable');
    });

    it('should paginate to the first 10 items initially', () => {
        const dt = new DataTable('#testTable', { pageSize: 10 });
        
        // Assert current page is 1
        expect(dt.currentPage).toBe(1);
        
        // Assert only 10 rows are rendered in tbody
        const renderedRows = document.querySelectorAll('#testTable tbody tr');
        expect(renderedRows.length).toBe(10);
        
        // First row should be Person 1, last should be Person 10
        expect(renderedRows[0].textContent).toContain('Person 1');
        expect(renderedRows[9].textContent).toContain('Person 10');
    });

    it('should filter data correctly based on search term', () => {
        const dt = new DataTable('#testTable', { pageSize: 10 });
        
        // Simulate search for 'Person 99'
        const searchInput = document.querySelector('.of-datatable-search input');
        searchInput.value = 'Person 99';
        searchInput.dispatchEvent(new Event('input'));
        
        // Expect only 1 row to be visible
        const renderedRows = document.querySelectorAll('#testTable tbody tr');
        expect(renderedRows.length).toBe(1);
        expect(renderedRows[0].textContent).toContain('Person 99');
    });
});
