/**
 * Tracker & Monitors
 * Manages the First 8-Hour Fluid Tracker and the Urine Output Monitor
 */

class ResuscitationTracker {
    constructor() {
        // Elements
        this.statusText = document.getElementById('tracker-status-text');
        this.expectedBar = document.getElementById('expected-progress');
        this.actualBar = document.getElementById('actual-progress');
        this.actualInput = document.getElementById('actual-fluid');
        this.updateBtn = document.getElementById('update-fluid-btn');
        this.progressBarWrapper = document.querySelector('.progress-bar-wrapper');

        // State
        this.target8hFluid = 0;
        this.timeSinceBurn = 0;
        this.actualFluid = 0;

        this.init();
    }

    init() {
        this.updateBtn.addEventListener('click', () => {
            this.actualFluid = parseFloat(this.actualInput.value) || 0;
            this.evaluateProgress();
        });

        // Allow enter key to update
        this.actualInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.updateBtn.click();
            }
        });
    }

    // Called externally by ParklandCalculator when inputs change
    updateFromParkland(parklandTotals, timeSinceBurn) {
        this.target8hFluid = parklandTotals.first8h || 0;
        this.timeSinceBurn = timeSinceBurn || 0;
        this.evaluateProgress();

        // Also update UO monitor if weight changed
        if (window.urineMonitor) {
            window.urineMonitor.evaluate();
        }
    }

    evaluateProgress() {
        if (this.target8hFluid === 0) {
            this.statusText.textContent = "Awaiting Patient Data";
            this.expectedBar.style.width = '0%';
            this.actualBar.style.width = '0%';
            this.progressBarWrapper.style.borderColor = 'var(--border-color)';
            return;
        }

        // Expected fluid by this time point
        let expectedFluid = 0;
        if (this.timeSinceBurn <= 8) {
            expectedFluid = (this.target8hFluid / 8) * this.timeSinceBurn;
        } else {
            expectedFluid = this.target8hFluid;
        }

        // Calculate Percentages for the UI
        let expectedPercent = (expectedFluid / this.target8hFluid) * 100;
        let actualPercent = (this.actualFluid / this.target8hFluid) * 100;

        // Cap at 100% for visual sanity
        expectedPercent = Math.min(100, Math.max(0, expectedPercent));
        actualPercent = Math.min(100, Math.max(0, actualPercent));

        this.expectedBar.style.width = `${expectedPercent}%`;
        this.actualBar.style.width = `${actualPercent}%`;

        this.statusText.textContent = `${Math.round(this.actualFluid)}ml Delivered / ${Math.round(expectedFluid)}ml Expected`;

        // Warnings if tracking behind
        // Let's define behind schedule as actual being < 90% of expected
        // only if expected > 0
        if (expectedFluid > 50 && this.actualFluid < (expectedFluid * 0.9)) {
            this.progressBarWrapper.style.borderColor = 'var(--warning)';
            this.actualBar.style.backgroundColor = 'var(--warning)';
            // Add a visual pulse or indicator if desired
            this.statusText.innerHTML = `<i data-lucide="alert-circle" style="width: 14px; height: 14px; color: var(--warning); vertical-align: middle;"></i> <span style="color: var(--warning)">Behind Schedule: ${Math.round(this.actualFluid)}ml / ${Math.round(expectedFluid)}ml</span>`;
            if (window.lucide) lucide.createIcons();
        } else {
            this.progressBarWrapper.style.borderColor = 'var(--border-color)';
            this.actualBar.style.backgroundColor = 'var(--primary)';
        }
    }
}

class UrineMonitor {
    constructor() {
        this.uoInput = document.getElementById('hourly-urine');
        this.uoOutput = document.getElementById('uo-rate-output');
        this.warningBox = document.getElementById('uo-warning');
        this.weightInput = document.getElementById('patient-weight'); // Link to external input

        this.init();
    }

    init() {
        this.uoInput.addEventListener('input', () => this.evaluate());
        this.weightInput.addEventListener('input', () => this.evaluate());
    }

    evaluate() {
        const uoVol = parseFloat(this.uoInput.value);
        const weight = parseFloat(this.weightInput.value);

        if (isNaN(uoVol) || isNaN(weight) || weight <= 0) {
            this.uoOutput.textContent = "0.0";
            this.warningBox.classList.add('hidden');
            return;
        }

        const rate = uoVol / weight;
        this.uoOutput.textContent = rate.toFixed(1);

        if (rate < 0.5) {
            this.uoOutput.style.color = 'var(--warning)';
            this.warningBox.classList.remove('hidden');
        } else {
            this.uoOutput.style.color = 'var(--text-primary)';
            this.warningBox.classList.add('hidden');
        }
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    window.resuscitationTracker = new ResuscitationTracker();
    window.urineMonitor = new UrineMonitor();
});
