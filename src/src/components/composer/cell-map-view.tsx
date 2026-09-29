"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import { CheckCircle2, MapPin, Radio, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { CellSite } from "@/types/domain";

// Fix Leaflet default marker icon issue in Next.js
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const OnlineIcon = L.divIcon({
  className: "custom-marker",
  html: `<div style="background: #10b981; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3">
      <path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01"/>
    </svg>
  </div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

const OfflineIcon = L.divIcon({
  className: "custom-marker",
  html: `<div style="background: #ef4444; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  </div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

const SelectedIcon = L.divIcon({
  className: "custom-marker",
  html: `<div style="background: #3b82f6; width: 28px; height: 28px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 12px rgba(59,130,246,0.5); display: flex; align-items: center; justify-content: center;">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  </div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Cameroon coordinates
const CAMEROON_CENTER: [number, number] = [5.9631, 10.1591];
const CAMEROON_BOUNDS: [[number, number], [number, number]] = [
  [1.6, 8.4], // Southwest
  [13.1, 16.2], // Northeast
];

// Mock coordinates for demo cells (since real cells may not have coordinates)
const CELL_COORDS: Record<string, [number, number]> = {
  "YDE-001": [3.8480, 11.5021], // Yaoundé Centre
  "YDE-002": [3.8680, 11.5221], // Yaoundé Nord
  "DLA-001": [4.0511, 9.7679],  // Douala Centre
  "DLA-002": [4.0711, 9.7479],  // Douala Port
  "BFM-001": [5.4764, 10.4177], // Bafoussam
  "GAR-001": [9.3265, 13.3975], // Garoua
};

interface CellMapViewProps {
  cells: readonly CellSite[];
  selectedIds: string[];
  onToggleCell: (id: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
}

function MapController({ cells }: { cells: readonly CellSite[] }) {
  const map = useMap();

  useEffect(() => {
    if (cells.length > 0) {
      const coords = cells
        .map((c) => CELL_COORDS[c.cell_id])
        .filter(Boolean) as [number, number][];

      if (coords.length > 0) {
        const bounds = L.latLngBounds(coords);
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [cells, map]);

  return null;
}

export function CellMapView({
  cells,
  selectedIds,
  onToggleCell,
  onSelectAll,
  onDeselectAll,
}: CellMapViewProps) {
  const [mounted, setMounted] = useState(false);
  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex h-[400px] items-center justify-center rounded-xl border border-hairline bg-surface-sunken">
        <div className="text-center">
          <MapPin className="mx-auto size-8 text-ink-3" />
          <p className="mt-2 text-[13px] text-ink-3">Loading map...</p>
        </div>
      </div>
    );
  }

  const onlineCells = cells.filter((c) => c.status === "active");
  const offlineCells = cells.filter((c) => c.status !== "active");

  return (
    <div className="space-y-4">
      {/* Map controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-4 text-[12px]">
          <span className="flex items-center gap-1.5">
            <span className="size-3 rounded-full bg-emerald-500" />
            Online ({onlineCells.length})
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-3 rounded-full bg-red-500" />
            Offline ({offlineCells.length})
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-3 rounded-full bg-blue-500" />
            Selected ({selectedIds.length})
          </span>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onSelectAll}>
            Select all online
          </Button>
          <Button variant="outline" size="sm" onClick={onDeselectAll}>
            Clear selection
          </Button>
        </div>
      </div>

      {/* Map container */}
      <div className="overflow-hidden rounded-xl border border-hairline">
        <MapContainer
          center={CAMEROON_CENTER}
          zoom={6}
          style={{ height: "400px", width: "100%" }}
          className="z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapController cells={cells} />

          {cells.map((cell) => {
            const coords = CELL_COORDS[cell.cell_id];
            if (!coords) return null;

            const isOnline = cell.status === "active";
            const isSelected = selectedSet.has(cell.id);

            return (
              <Marker
                key={cell.id}
                position={coords}
                icon={isSelected ? SelectedIcon : isOnline ? OnlineIcon : OfflineIcon}
                eventHandlers={{
                  click: () => {
                    if (isOnline) onToggleCell(cell.id);
                  },
                }}
              >
                <Popup>
                  <div className="min-w-[200px] p-1">
                    <div className="flex items-center gap-2">
                      <Radio className="size-4 text-ink-2" />
                      <span className="font-semibold text-ink">{cell.name}</span>
                    </div>
                    <div className="mt-2 space-y-1 text-[12px]">
                      <p>
                        <span className="text-ink-3">Cell ID:</span>{" "}
                        <span className="font-mono">{cell.cell_id}</span>
                      </p>
                      <p>
                        <span className="text-ink-3">TAC:</span>{" "}
                        <span className="font-mono">{cell.tac}</span>
                      </p>
                      {cell.pci && (
                        <p>
                          <span className="text-ink-3">PCI:</span>{" "}
                          <span className="font-mono">{cell.pci}</span>
                        </p>
                      )}
                      {cell.earfcn && (
                        <p>
                          <span className="text-ink-3">EARFCN:</span>{" "}
                          <span className="font-mono">{cell.earfcn}</span>
                        </p>
                      )}
                      <p>
                        <span className="text-ink-3">Status:</span>{" "}
                        <span
                          className={cn(
                            "font-medium",
                            isOnline ? "text-emerald-600" : "text-red-500"
                          )}
                        >
                          {isOnline ? "Online" : "Offline"}
                        </span>
                      </p>
                    </div>
                    {isOnline && (
                      <Button
                        size="sm"
                        variant={isSelected ? "outline" : "default"}
                        className="mt-3 w-full"
                        onClick={() => onToggleCell(cell.id)}
                      >
                        {isSelected ? (
                          <>
                            <XCircle className="size-3.5" /> Deselect
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="size-3.5" /> Select
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </Popup>
              </Marker>
            );
          })}

          {/* Coverage circles for selected cells */}
          {cells
            .filter((c) => selectedSet.has(c.id))
            .map((cell) => {
              const coords = CELL_COORDS[cell.cell_id];
              if (!coords) return null;
              return (
                <Circle
                  key={`coverage-${cell.id}`}
                  center={coords}
                  radius={5000} // 5km coverage radius
                  pathOptions={{
                    color: "#3b82f6",
                    fillColor: "#3b82f6",
                    fillOpacity: 0.1,
                    weight: 2,
                  }}
                />
              );
            })}
        </MapContainer>
      </div>

      {/* Area summary */}
      {selectedIds.length > 0 && (
        <div className="rounded-lg border border-hairline bg-surface-sunken p-4">
          <h4 className="text-[11px] font-semibold tracking-[0.08em] text-ink-3 uppercase">
            Selected Area
          </h4>
          <p className="mt-1 text-[13px] text-ink">
            {selectedIds.length} cell{selectedIds.length !== 1 ? "s" : ""} selected ·{" "}
            Estimated coverage: ~{selectedIds.length * 5}km radius
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {cells
              .filter((c) => selectedSet.has(c.id))
              .map((cell) => (
                <span
                  key={cell.id}
                  className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2 py-0.5 text-[11px] font-medium text-blue-600"
                >
                  {cell.cell_id}
                  <button
                    type="button"
                    onClick={() => onToggleCell(cell.id)}
                    className="ml-0.5 rounded-full p-0.5 hover:bg-blue-500/20"
                  >
                    <XCircle className="size-3" />
                  </button>
                </span>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
