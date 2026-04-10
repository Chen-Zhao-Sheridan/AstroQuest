import { createLightPollutionOverlay } from "/src/lib/LightPollutionOverlay.ts";
// Wait for the <gmp-map> custom element to be fully upgraded
await customElements.whenDefined("gmp-map");

const mapEl = document.querySelector("gmp-map");

// Method A: grab innerMap directly
const map = mapEl.innerMap;

const lpoverlay = createLightPollutionOverlay(0.6);
lpoverlay.setMap(map);
lpoverlay.hide();

// Expose globally so other scripts/islands can control it
window.lightPollutionOverlay = lpoverlay;

// Controls
var mapSettingsReveal = document.getElementById("map-settings-reveal");
var mapSettingsHide = document.getElementById("map-settings-hide");
var mapMain = document.getElementById("map-main");
var mapSettings = document.getElementById("map-settings");
mapSettingsReveal.addEventListener("click", () => {
    mapSettings.hidden = false;
    mapMain.hidden = true;
});
mapSettingsHide.addEventListener("click", () => {
    mapSettings.hidden = true;
    mapMain.hidden = false;
});

var lpOverlayToggle = document.getElementById("lp-overlay-toggle");
let visible = false;
lpOverlayToggle.addEventListener("click", () => {
    visible = !visible;
    visible ? lpoverlay.show() : lpoverlay.hide();
});
