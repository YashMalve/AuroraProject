document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    const loginForm = document.getElementById('login-form');
    const loginError = document.getElementById('login-error');
    
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent standard POST

            const emailInput = document.getElementById('doctor-email').value;
            const passwordInput = document.getElementById('doctor-password').value;

            // Basic client-side validation logic (mocking auth)
            if (emailInput && passwordInput.length >= 6) {
                // Success - Mock store user
                localStorage.setItem('dr_email', emailInput);
                
                // Redirect to Patient Details
                window.location.href = 'patient-details.html';
            } else {
                // Error
                if (loginError) {
                    loginError.classList.remove('hidden');
                }
            }
        });
    }
});
