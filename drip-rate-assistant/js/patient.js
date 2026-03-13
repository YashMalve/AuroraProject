document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    const patientForm = document.getElementById('patient-form');

    // Auto-fill time of burn to current time minus 1 hour as default helper
    const timeOfBurnInput = document.getElementById('time-of-burn');
    if (timeOfBurnInput) {
        const now = new Date();
        now.setHours(now.getHours() - 1); // Default to 1 hour ago
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        timeOfBurnInput.value = now.toISOString().slice(0, 16);
    }

    if (patientForm) {
        patientForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent standard POST

            // Save basic inputs to pass to calculator
            const weight = document.getElementById('patient-weight-init').value;
            const mrn = document.getElementById('patient-id').value;
            const timeOfBurn = document.getElementById('time-of-burn').value;
            
            if (weight) {
                localStorage.setItem('patient_weight', weight);
            }
            if (mrn) {
                localStorage.setItem('patient_mrn', mrn);
            }
            if (timeOfBurn) {
                // Calculate hours since burn right now
                const burnDate = new Date(timeOfBurn);
                const current = new Date();
                let hoursSince = (current - burnDate) / (1000 * 60 * 60);
                if (hoursSince < 0) hoursSince = 0; // Prevent negative time
                
                localStorage.setItem('time_since_burn', hoursSince.toFixed(1));
            }

            // Redirect to main calculator
            window.location.href = 'index.html';
        });
    }
});
