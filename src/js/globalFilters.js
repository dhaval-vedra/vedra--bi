// js/globalFilters.js
import { getRawData, getHeaders, applyFiltersAndSort } from '../store/DataHandler.js';
import { showMessage } from './utils.js';

export function initGlobalFilters() {
    const globalColSelect = document.getElementById('globalFilterCol');
    const globalValSelect = document.getElementById('globalFilterVal');
    const applyBtn = document.getElementById('globalApplyFilterBtn');
    const resetBtn = document.getElementById('globalResetFilterBtn');

    if (!globalColSelect || !globalValSelect || !applyBtn || !resetBtn) {
        console.warn('Global filter elements not found in DOM.');
        return;
    }

    // Populate Column selector when data is updated
    document.addEventListener('dataLoaded', populateColumnDropdown);
    document.addEventListener('dataLoadedFromFirebase', populateColumnDropdown);

    // Initial population if data already loaded
    populateColumnDropdown();

    // Event listener for column selection change
    globalColSelect.addEventListener('change', () => {
        const col = globalColSelect.value;
        if (!col) {
            globalValSelect.innerHTML = '<option value="">-- सभी मान (All) --</option>';
            globalValSelect.disabled = true;
            return;
        }

        const rawData = getRawData() || [];
        const uniqueValues = [...new Set(rawData.map(row => row[col] !== undefined && row[col] !== null ? String(row[col]).trim() : '').filter(val => val !== ''))].sort();

        globalValSelect.innerHTML = '<option value="">-- सभी मान (All) --</option>' + 
            uniqueValues.map(val => `<option value="${val}">${val}</option>`).join('');
        globalValSelect.disabled = false;
    });

    // Event listener for Apply Filter button
    applyBtn.addEventListener('click', () => {
        showMessage("ग्लोबल फ़िल्टर लागू किया जा रहा है...", "info");
        // Trigger the core DataHandler filter flow
        applyFiltersAndSort();
    });

    // Event listener for Reset Filter button
    resetBtn.addEventListener('click', () => {
        globalColSelect.value = '';
        globalValSelect.innerHTML = '<option value="">-- सभी मान (All) --</option>';
        globalValSelect.disabled = true;
        
        const startDate = document.getElementById('globalStartDate');
        const endDate = document.getElementById('globalEndDate');
        if (startDate) startDate.value = '';
        if (endDate) endDate.value = '';

        showMessage("ग्लोबल फ़िल्टर रीसेट कर दिया गया।", "success");
        applyFiltersAndSort();
    });
}

function populateColumnDropdown() {
    const globalColSelect = document.getElementById('globalFilterCol');
    if (!globalColSelect) return;

    const headers = getHeaders() || [];
    const currentValue = globalColSelect.value;

    globalColSelect.innerHTML = '<option value="">-- कॉलम चुनें (None) --</option>' +
        headers.map(h => `<option value="${h}">${h}</option>`).join('');

    if (headers.includes(currentValue)) {
        globalColSelect.value = currentValue;
    } else {
        const globalValSelect = document.getElementById('globalFilterVal');
        if (globalValSelect) {
            globalValSelect.innerHTML = '<option value="">-- सभी मान (All) --</option>';
            globalValSelect.disabled = true;
        }
    }
}
