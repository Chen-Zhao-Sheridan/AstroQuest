/// <reference types="@types/google.maps" />

export function createLightPollutionOverlay(
  opacity = 0.6,
  year = 2023
) {
  class LightPollutionOverlay extends google.maps.OverlayView {
    private div: HTMLDivElement | null = null;
    private opacity: number;
    private year: number;

    constructor(opacity: number, year: number) {
      super();
      this.opacity = opacity;
      this.year = year;
    }

    private buildWmsUrl(
      bounds: google.maps.LatLngBounds,
      width: number,
      height: number
    ): string {
      const sw = bounds.getSouthWest();
      const ne = bounds.getNorthEast();

      // Google Maps uses EPSG:3857 (Web Mercator) — must convert from lat/lng
      const toMercatorX = (lng: number) =>
        (lng * 20037508.34) / 180;

      const toMercatorY = (lat: number) => {
        const y =
          Math.log(Math.tan(((90 + lat) * Math.PI) / 360)) /
          (Math.PI / 180);
        return (y * 20037508.34) / 180;
      };

      const minX = toMercatorX(sw.lng());
      const minY = toMercatorY(sw.lat());
      const maxX = toMercatorX(ne.lng());
      const maxY = toMercatorY(ne.lat());

      const params = new URLSearchParams({
        SERVICE: "WMS",
        VERSION: "1.1.1",
        REQUEST: "GetMap",
        LAYERS: "VIIRS_Black_Marble",   // swap layer name here
        STYLES: "",
        SRS: "EPSG:3857",
        BBOX: `${minX},${minY},${maxX},${maxY}`,
        WIDTH: String(Math.round(width)),
        HEIGHT: String(Math.round(height)),
        FORMAT: "image/png",
        TRANSPARENT: "true",
      });

      return `https://gibs.earthdata.nasa.gov/wms/epsg3857/best/wms.cgi?${params}`;
    }

    onAdd() {
      this.div = document.createElement("div");
      this.div.style.position = "absolute";
      this.div.style.pointerEvents = "none";
      this.div.style.display = "none";
      this.getPanes()!.overlayLayer.appendChild(this.div);
    }

    draw() {
      if (!this.div) return;

      const proj = this.getProjection();
      const map = this.getMap() as google.maps.Map;
      const bounds = map.getBounds();
      if (!bounds) return;

      const sw = proj.fromLatLngToDivPixel(bounds.getSouthWest())!;
      const ne = proj.fromLatLngToDivPixel(bounds.getNorthEast())!;

      const width = Math.abs(ne.x - sw.x);
      const height = Math.abs(sw.y - ne.y);

      // Replace image src on every draw (map pan/zoom)
      let img = this.div.querySelector("img") as HTMLImageElement;
      if (!img) {
        img = document.createElement("img");
        img.style.width = "100%";
        img.style.height = "100%";
        img.style.mixBlendMode = "multiply";
        this.div.appendChild(img);
      }

      img.src = this.buildWmsUrl(bounds, width, height);
      img.style.opacity = String(this.opacity);

      this.div.style.left = `${sw.x}px`;
      this.div.style.top = `${ne.y}px`;
      this.div.style.width = `${width}px`;
      this.div.style.height = `${height}px`;
    }

    onRemove() {
      this.div?.parentNode?.removeChild(this.div);
      this.div = null;
    }

    show() { if (this.div) this.div.style.display = "block"; }
    hide() { if (this.div) this.div.style.display = "none"; }

    setOpacity(value: number) {
      this.opacity = value;
      const img = this.div?.querySelector("img") as HTMLImageElement;
      if (img) img.style.opacity = String(value);
    }

    setYear(year: number) {
      this.year = year;
      this.draw(); // redraw with new layer
    }

    // setLayer(layerName: string) {
    //   this.layer = layerName;
    //   this.draw(); // triggers a fresh WMS request
    // }
  }
  return new LightPollutionOverlay(opacity, year);
}