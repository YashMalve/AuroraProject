/**
 * App initialization and theme orchestration
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide icons
    lucide.createIcons();

    // Theme Management
    initTheme();
    
    // Set up basic event listeners that span multiple modules
    setupGlobalListeners();
});

function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const moonIcon = document.querySelector('.theme-icon-moon');
    const sunIcon = document.querySelector('.theme-icon-sun');
    
    // Check saved theme or system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.documentElement.setAttribute('data-theme', 'dark');
        moonIcon.classList.add('hidden');
        sunIcon.classList.remove('hidden');
    }

    themeToggle.addEventListener('click', () => {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        
        if (isDark) {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            moonIcon.classList.remove('hidden');
            sunIcon.classList.add('hidden');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            moonIcon.classList.add('hidden');
            sunIcon.classList.remove('hidden');
        }
    });
}

function setupGlobalListeners() {
    // Auth Guard for Main Calculator
    const isAuthPage = window.location.pathname.endsWith('login.html') || window.location.pathname.endsWith('patient-details.html');
    if (!isAuthPage) {
        if (!localStorage.getItem('dr_email')) {
            window.location.href = 'login.html';
        }
        
        // Pre-fill Patient Data
        const weightInput = document.getElementById('patient-weight');
        const timeInput = document.getElementById('time-since-burn');
        
        if (weightInput && localStorage.getItem('patient_weight')) {
            weightInput.value = localStorage.getItem('patient_weight');
        }
        
        if (timeInput && localStorage.getItem('time_since_burn')) {
            timeInput.value = localStorage.getItem('time_since_burn');
        }
        
        // Add a logout button or patient info dynamically to header if we are on index.html
        const headerRight = document.querySelector('.header-right');
        if (headerRight && !document.getElementById('logout-btn')) {
            const mrn = localStorage.getItem('patient_mrn');
            const patientInfo = mrn ? `<div class="user-info mr-3 text-sm font-medium"><i data-lucide="user" class="inline-icon mr-1"></i> Patient: ${mrn}</div>` : '';
            
            headerRight.insertAdjacentHTML('afterbegin', patientInfo);
            
            const logoutHtml = `<a href="#" id="logout-btn" class="icon-btn ml-2 text-danger" title="Logout"><i data-lucide="log-out"></i></a>`;
            headerRight.insertAdjacentHTML('beforeend', logoutHtml);
            
            if (typeof lucide !== 'undefined') lucide.createIcons();
            
            document.getElementById('logout-btn').addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.clear();
                window.location.href = 'login.html';
            });
        }
    }

    // This will connect modules together later
    // For example, when TBSA input changes, re-calculate Parkland
    
    const tbsaInput = document.getElementById('tbsa-input');
    if (tbsaInput) {
        tbsaInput.addEventListener('input', () => {
            // Trigger Parkland calculation when implemented
            if (window.parklandCalculator) {
                window.parklandCalculator.calculate();
            }
        });
    }

    // Trigger initial calculation if data was pre-filled
    // We defer this slightly to ensure parklandCalculator is initialized in its own script
    setTimeout(() => {
        if (window.parklandCalculator && !isAuthPage) {
            window.parklandCalculator.calculate();
        }
    }, 100);
}
