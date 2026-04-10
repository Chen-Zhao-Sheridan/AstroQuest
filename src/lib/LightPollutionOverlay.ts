// Class was generated with claude ai

/// <reference types="@types/google.maps" />
export class LightPollutionOverlay extends google.maps.OverlayView {
  private bounds: google.maps.LatLngBounds;
  private imageUrl: string;
  private div: HTMLDivElement | null = null;
  private opacity: number;

  constructor(
    bounds: google.maps.LatLngBounds,
    imageUrl: string,
    opacity = 0.6
  ) {
    super();
    this.bounds = bounds;
    this.imageUrl = imageUrl;
    this.opacity = opacity;
  }

  /** Called once when overlay is added to the map */
  onAdd() {
    this.div = document.createElement("div");
    this.div.style.position = "absolute";
    this.div.style.pointerEvents = "none"; // don't block map interactions

    const img = document.createElement("img");
    img.src = this.imageUrl;
    img.style.width = "100%";
    img.style.height = "100%";
    img.style.opacity = String(this.opacity);
    img.style.mixBlendMode = "multiply"; // blends well over map tiles

    this.div.appendChild(img);

    // overlayLayer sits above tiles but below markers/UI
    const panes = this.getPanes()!;
    panes.overlayLayer.appendChild(this.div);
  }

  /** Called every time the map moves/zooms — reposition the div */
  draw() {
    if (!this.div) return;

    const overlayProjection = this.getProjection();
    const sw = overlayProjection.fromLatLngToDivPixel(
      this.bounds.getSouthWest()
    )!;
    const ne = overlayProjection.fromLatLngToDivPixel(
      this.bounds.getNorthEast()
    )!;

    this.div.style.left   = `${sw.x}px`;
    this.div.style.top    = `${ne.y}px`;
    this.div.style.width  = `${ne.x - sw.x}px`;
    this.div.style.height = `${sw.y - ne.y}px`;
  }

  onRemove() {
    this.div?.parentNode?.removeChild(this.div);
    this.div = null;
  }

  // --- Public API for programmatic control ---

  show() {
    if (this.div) this.div.style.display = "block";
  }

  hide() {
    if (this.div) this.div.style.display = "none";
  }

  setOpacity(value: number) {
    this.opacity = value;
    const img = this.div?.querySelector("img");
    if (img) img.style.opacity = String(value);
  }

  updateImage(newUrl: string) {
    this.imageUrl = newUrl;
    const img = this.div?.querySelector("img");
    if (img) img.src = newUrl;
  }
}