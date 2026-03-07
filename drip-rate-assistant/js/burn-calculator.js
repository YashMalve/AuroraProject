/**
 * Interactive Burn Area Calculator (Rule of Nines)
 * Handles the rendering and interaction of the body map SVG
 * and computes the TBSA (Total Body Surface Area).
 */

class BurnCalculator {
    constructor() {
        this.container = document.getElementById('body-map-container');
        this.tbsaInput = document.getElementById('tbsa-input');
        this.selectedRegions = new Set();
        this.totalTBSA = 0;

        // Data for Rule of Nines regions using simple schematic geometric approximations
        // Grid is 200x320 for each figure (front/back)
        this.regions = [
            // FRONT
            { id: 'head-front', name: 'Head Front', val: 4.5, view: 'front', labelY: 35, d: 'M100,10 C80,10 80,50 100,50 C120,50 120,10 100,10 Z' },
            { id: 'neck-front', name: 'Neck Front', val: 0.5, view: 'front', labelY: 57, d: 'M90,50 L110,50 L110,65 L90,65 Z' },
            { id: 'torso-front', name: 'Torso Front', val: 18, view: 'front', labelY: 100, d: 'M70,65 L130,65 L125,160 L75,160 Z' },
            { id: 'arm-l-front', name: 'Left Arm Front', val: 4.5, view: 'front', labelY: 100, d: 'M40,75 L70,65 L65,140 L30,140 Z' }, // Screen Left (Patient Right)
            { id: 'arm-r-front', name: 'Right Arm Front', val: 4.5, view: 'front', labelY: 100, d: 'M130,65 L160,75 L170,140 L135,140 Z' }, // Screen Right (Patient Left)
            { id: 'leg-l-front', name: 'Left Leg Front', val: 9, view: 'front', labelY: 220, d: 'M75,160 L97,160 L97,300 L70,300 Z' },
            { id: 'leg-r-front', name: 'Right Leg Front', val: 9, view: 'front', labelY: 220, d: 'M103,160 L125,160 L130,300 L103,300 Z' },
            { id: 'genital', name: 'Genitals', val: 1, view: 'front', labelY: 165, d: 'M97,160 L103,160 L100,170 Z' },

            // BACK
            { id: 'head-back', name: 'Head Back', val: 4.5, view: 'back', labelY: 35, d: 'M100,10 C80,10 80,50 100,50 C120,50 120,10 100,10 Z' },
            { id: 'neck-back', name: 'Neck Back', val: 0.5, view: 'back', labelY: 57, d: 'M90,50 L110,50 L110,65 L90,65 Z' },
            { id: 'torso-back', name: 'Torso Back', val: 18, view: 'back', labelY: 100, d: 'M70,65 L130,65 L125,160 L75,160 Z' },
            { id: 'arm-l-back', name: 'Left Arm Back', val: 4.5, view: 'back', labelY: 100, d: 'M40,75 L70,65 L65,140 L30,140 Z' },
            { id: 'arm-r-back', name: 'Right Arm Back', val: 4.5, view: 'back', labelY: 100, d: 'M130,65 L160,75 L170,140 L135,140 Z' },
            { id: 'leg-l-back', name: 'Left Leg Back', val: 9, view: 'back', labelY: 220, d: 'M75,160 L97,160 L97,300 L70,300 Z' },
            { id: 'leg-r-back', name: 'Right Leg Back', val: 9, view: 'back', labelY: 220, d: 'M103,160 L125,160 L130,300 L103,300 Z' }
        ];

        this.init();
    }

    init() {
        this.renderSVG();
        this.attachEventListeners();
    }

    renderSVG() {
        const svgHTML = `
            <div class="body-figures">
                <div class="figure-wrapper">
                    <h3 class="figure-title">Anterior (Front)</h3>
                    <svg viewBox="0 0 200 320" class="body-svg">
                        ${this.generatePaths('front')}
                    </svg>
                </div>
                <div class="figure-wrapper">
                    <h3 class="figure-title">Posterior (Back)</h3>
                    <svg viewBox="0 0 200 320" class="body-svg">
                        ${this.generatePaths('back')}
                    </svg>
                </div>
            </div>
            <div class="tbsa-controls mt-3 flex-row">
                <button id="clear-tbsa-btn" class="btn flex-1" style="background-color: var(--bg-surface-elevated); border: 1px solid var(--border-color); color: var(--text-primary);">
                    Clear Selection
                </button>
            </div>
        `;
        this.container.innerHTML = svgHTML;
    }

    generatePaths(view) {
        return this.regions
            .filter(r => r.view === view)
            .map(r => {
                // Calculate rough centroid for label (lazy bounding box center)
                // For simplicity, we just use a fixed X based on the id to keep labels neat
                let labelX = 100;
                if (r.id.includes('arm-l')) labelX = 50;
                if (r.id.includes('arm-r')) labelX = 150;
                if (r.id.includes('leg-l')) labelX = 85;
                if (r.id.includes('leg-r')) labelX = 115;
                if (r.id === 'genital') labelX = 100;

                return `
                <g class="body-region-group" data-id="${r.id}" data-val="${r.val}">
                    <path d="${r.d}" class="body-region"></path>
                    <text x="${labelX}" y="${r.labelY}" class="region-label" text-anchor="middle" dominant-baseline="middle">${r.val}%</text>
                </g>
                `;
            }).join('');
    }

    attachEventListeners() {
        const groups = this.container.querySelectorAll('.body-region-group');
        groups.forEach(group => {
            group.addEventListener('click', (e) => {
                const id = group.dataset.id;
                const val = parseFloat(group.dataset.val);
                const path = group.querySelector('.body-region');

                if (this.selectedRegions.has(id)) {
                    this.selectedRegions.delete(id);
                    path.classList.remove('selected');
                    this.totalTBSA -= val;
                } else {
                    this.selectedRegions.add(id);
                    path.classList.add('selected');
                    this.totalTBSA += val;
                }

                // Fix floating point precision issues (e.g. 4.5 + 4.5 = 8.999...)
                this.totalTBSA = Math.round(this.totalTBSA * 10) / 10;
                this.updateTBSAInput();
            });
        });

        // Manual Input Overrides
        this.tbsaInput.addEventListener('change', (e) => {
            let val = parseFloat(e.target.value);
            if (isNaN(val)) val = 0;
            if (val < 0) val = 0;
            if (val > 100) val = 100;

            this.totalTBSA = val;
            this.tbsaInput.value = val;

            // If manual input is overridden, we can't perfectly map it back to regions
            // So we clear the region selections to avoid visual confusion
            this.clearSelections(false);

            if (window.parklandCalculator) window.parklandCalculator.calculate();
        });

        // Clear button
        document.getElementById('clear-tbsa-btn').addEventListener('click', () => {
            this.clearSelections(true);
        });
    }

    clearSelections(resetTotal = true) {
        this.selectedRegions.clear();
        this.container.querySelectorAll('.body-region').forEach(p => p.classList.remove('selected'));
        if (resetTotal) {
            this.totalTBSA = 0;
            this.updateTBSAInput();
        }
    }

    updateTBSAInput() {
        this.tbsaInput.value = this.totalTBSA;
        // Trigger event for standard listeners
        this.tbsaInput.dispatchEvent(new Event('input', { bubbles: true }));
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Export to window for access by other modules
    window.burnCalculator = new BurnCalculator();
});
