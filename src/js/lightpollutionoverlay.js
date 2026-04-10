import { createLightPollutionOverlay } from "/src/lib/LightPollutionOverlay.ts";
// Wait for the <gmp-map> custom element to be fully upgraded
await customElements.whenDefined("gmp-map");

const mapEl = document.querySelector("gmp-map");

// Method A: grab innerMap directly
const map = mapEl.innerMap;

const overlay = createLightPollutionOverlay(0.6);
overlay.setMap(map);

// Expose globally so other scripts/islands can control it
window.lightPollutionOverlay = overlay;

// Controls
document
    .getElementById("toggle-overlay")
    .addEventListener("change", (e) => {
        e.target.checked ? overlay.show() : overlay.hide();
    });