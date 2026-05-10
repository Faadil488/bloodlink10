import { useEffect, useRef, useState } from "react";
import { bloodBanks, hospitals, type Donor } from "@/lib/bloodlink-data";

type KeralaMapProps = {
  donors: Donor[];
  district?: string;
};

export function KeralaMap({ donors, district }: KeralaMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<unknown>(null);
  const userMarkerRef = useRef<import("leaflet").Marker | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [locationStatus, setLocationStatus] = useState<"idle" | "locating" | "visible" | "blocked">(
    "idle",
  );

  async function showUserLocation() {
    const map = mapRef.current as import("leaflet").Map | undefined;
    if (!map || !mapReady || typeof navigator === "undefined" || !navigator.geolocation) return;
    setLocationStatus("locating");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const L = await import("leaflet");
        const coords: [number, number] = [position.coords.latitude, position.coords.longitude];
        const marker = L.divIcon({
          className: "bloodlink-marker",
          html: '<span class="marker-user"><span></span></span>',
          iconSize: [30, 30],
          iconAnchor: [15, 15],
        });
        userMarkerRef.current?.remove();
        userMarkerRef.current = L.marker(coords, { icon: marker }).bindPopup("Your location").addTo(map);
        map.setView(coords, 13, { animate: true });
        setLocationStatus("visible");
      },
      () => setLocationStatus("blocked"),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    );
  }

  useEffect(() => {
    let cancelled = false;

    async function init() {
      if (!containerRef.current || mapRef.current || typeof window === "undefined") return;
      const L = await import("leaflet");
      if (cancelled || !containerRef.current) return;

      const map = L.map(containerRef.current, {
        zoomControl: false,
        scrollWheelZoom: true,
      }).setView([10.45, 76.35], 7);
      L.control.zoom({ position: "bottomright" }).addTo(map);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(map);
      mapRef.current = map;
      setMapReady(true);
    }

    init();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    let group: import("leaflet").LayerGroup | undefined;

    async function renderMarkers() {
      const map = mapRef.current as import("leaflet").Map | undefined;
      if (!map || !mapReady) return;
      const L = await import("leaflet");
      if (cancelled) return;
      const markerGroup = L.layerGroup().addTo(map);
      group = markerGroup;

      const donorIcon = (available: boolean) =>
        L.divIcon({
          className: "bloodlink-marker",
          html: `<span class="${available ? "marker-available" : "marker-unavailable"}"></span>`,
          iconSize: [22, 22],
          iconAnchor: [11, 11],
        });

      donors.forEach((donor) => {
        L.marker([donor.lat, donor.lng], { icon: donorIcon(donor.available) })
          .bindPopup(
            `<strong>${donor.name}</strong><br/>${donor.bloodGroup} · ${donor.area}<br/>${donor.available ? "Available now" : "Unavailable"}`,
          )
          .addTo(markerGroup);
      });

      hospitals.forEach((hospital) => {
        L.marker([hospital.lat, hospital.lng], {
          icon: L.divIcon({
            className: "bloodlink-marker",
            html: '<span class="marker-hospital">H</span>',
            iconSize: [26, 26],
            iconAnchor: [13, 13],
          }),
        })
          .bindPopup(`<strong>${hospital.name}</strong><br/>Hospital · ${hospital.district}`)
          .addTo(markerGroup);
      });

      bloodBanks.forEach((bank) => {
        L.marker([bank.lat, bank.lng], {
          icon: L.divIcon({
            className: "bloodlink-marker",
            html: '<span class="marker-bank">B</span>',
            iconSize: [26, 26],
            iconAnchor: [13, 13],
          }),
        })
          .bindPopup(`<strong>${bank.name}</strong><br/>Blood bank · ${bank.district}`)
          .addTo(markerGroup);
      });

      if (donors.length > 0) {
        const bounds = L.latLngBounds(donors.map((donor) => [donor.lat, donor.lng]));
        map.fitBounds(bounds.pad(0.35), { animate: true, maxZoom: district ? 11 : 8 });
      }

    }

    renderMarkers();
    return () => {
      cancelled = true;
      group?.remove();
    };
  }, [donors, district, mapReady]);

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className="h-[540px] w-full overflow-hidden rounded-[2rem] border border-border shadow-[var(--shadow-card)]"
        aria-label="Interactive donor map"
      />
      <button
        type="button"
        onClick={showUserLocation}
        className="absolute left-4 top-4 z-[500] rounded-full border border-border bg-card px-4 py-2 text-sm font-black text-foreground shadow-[var(--shadow-card)] backdrop-blur transition hover:-translate-y-0.5"
      >
        {locationStatus === "locating"
          ? "Finding you…"
          : locationStatus === "visible"
            ? "My location shown"
            : "Use my location"}
      </button>
      {locationStatus === "blocked" && (
        <div className="absolute left-4 top-16 z-[500] max-w-xs rounded-2xl bg-card px-4 py-3 text-sm font-bold text-muted-foreground shadow-[var(--shadow-card)]">
          Location permission is blocked. Enable it in your browser to show yourself on the map.
        </div>
      )}
    </div>
  );
}
