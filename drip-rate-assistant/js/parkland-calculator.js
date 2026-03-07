/**
 * Parkland Formula Fluid Calculator
 * Computes fluid requirements and IV drip rates based on Weight, TBSA, and Time Since Burn.
 * 
 * Formula: 4ml * Weight(kg) * TBSA(%) = 24hr total
 * 1st half given in first 8 hours
 * 2nd half given in next 16 hours
 */

class ParklandCalculator {
    constructor() {
        // Inputs
        this.weightInput = document.getElementById('patient-weight');
        this.tbsaInput = document.getElementById('tbsa-input');
        this.timeInput = document.getElementById('time-since-burn');
        this.dropFactorSelect = document.getElementById('drop-factor');

        // Outputs
        this.totalOutput = document.getElementById('total-fluid-output');
        this.first8Output = document.getElementById('first-8h-fluid');
        this.next16Output = document.getElementById('next-16h-fluid');
        this.rateOutput = document.getElementById('drip-rate-output');

        // State
        this.totals = {
            total24h: 0,
            first8h: 0,
            next16h: 0,
            currentRate: 0
        };

        this.init();
    }

    init() {
        this.attachEventListeners();
    }

    attachEventListeners() {
        // Re-calculate when any relevant input changes
        const inputs = [this.weightInput, this.tbsaInput, this.timeInput, this.dropFactorSelect];
        inputs.forEach(input => {
            input.addEventListener('input', () => this.calculate());
            input.addEventListener('change', () => this.calculate());
        });
    }

    calculate() {
        const weight = parseFloat(this.weightInput.value);
        const tbsa = parseFloat(this.tbsaInput.value);
        const timeSinceBurn = parseFloat(this.timeInput.value);
        const dropFactor = parseInt(this.dropFactorSelect.value, 10);

        if (!weight || weight <= 0 || !tbsa || tbsa <= 0) {
            this.resetOutputs();
            return;
        }

        // 1. Total 24h Fluid
        const total = 4 * weight * tbsa;

        // 2. Halves
        const half = total / 2;

        this.totals.total24h = total;
        this.totals.first8h = half;
        this.totals.next16h = half;

        // 3. Drip Rate Calculation
        let rate = 0;

        // Ensure time is within valid ranges
        const safeTime = Math.max(0, Math.min(24, timeSinceBurn));

        if (safeTime < 8) {
            // First 8 hours phase
            // Rate is calculated to infuse the entirely of the first half over the REMAINING time of the 8h
            // e.g. if time is 2h, we must infuse the 8h amount over 6h.
            const remainingHours = 8 - safeTime;
            const remainingMinutes = remainingHours * 60;
            rate = (half * dropFactor) / remainingMinutes;
        } else if (safeTime < 24) {
            // Next 16 hours phase
            // Rate is calculated to infuse the second half over the REMAINING time of the 16h period
            const remainingHours = 24 - safeTime;
            const remainingMinutes = remainingHours * 60;
            rate = (half * dropFactor) / remainingMinutes;
        } else {
            // Past 24 hours
            rate = 0;
        }

        this.totals.currentRate = Math.round(rate);
        this.updateUI();

        // Notify tracker if exists
        if (window.resuscitationTracker) {
            window.resuscitationTracker.updateFromParkland(this.totals, safeTime);
        }
    }

    resetOutputs() {
        this.totals = { total24h: 0, first8h: 0, next16h: 0, currentRate: 0 };
        this.updateUI();

        if (window.resuscitationTracker) {
            window.resuscitationTracker.updateFromParkland(this.totals, parseFloat(this.timeInput.value) || 0);
        }
    }

    updateUI() {
        this.totalOutput.innerHTML = `${Math.round(this.totals.total24h).toLocaleString()} <small>ml</small>`;
        this.first8Output.innerHTML = `${Math.round(this.totals.first8h).toLocaleString()} <small>ml</small>`;
        this.next16Output.innerHTML = `${Math.round(this.totals.next16h).toLocaleString()} <small>ml</small>`;

        const rateVal = this.totals.currentRate;
        this.rateOutput.innerHTML = `${rateVal} <small>gtts/min</small>`;

        // Warn if drop rate is excessively high (e.g. over 1000)
        // This can happen if timeSinceBurn is e.g. 7.9 hours
        const card = this.rateOutput.parentElement;
        if (rateVal > 500) {
            card.classList.add('critical');
            card.style.borderColor = 'red';
        } else {
            card.classList.remove('critical');
            card.style.borderColor = '';
        }
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    window.parklandCalculator = new ParklandCalculator();
});
