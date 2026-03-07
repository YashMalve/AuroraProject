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
    // This will connect modules together later
    // For example, when TBSA input changes, re-calculate Parkland
    
    const tbsaInput = document.getElementById('tbsa-input');
    tbsaInput.addEventListener('input', () => {
        // Trigger Parkland calculation when implemented
        if (window.parklandCalculator) {
            window.parklandCalculator.calculate();
        }
    });
}
