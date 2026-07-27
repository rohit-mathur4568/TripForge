import React from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default leaflet marker icon path issue in Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function TripMap({ itinerary = [], centerLat, centerLng, destinationName }) {
  const defaultLat = centerLat || (itinerary[0]?.latitude) || 48.8566;
  const defaultLng = centerLng || (itinerary[0]?.longitude) || 2.3522;

  const positions = itinerary
    .filter((item) => item.latitude && item.longitude)
    .map((item) => [item.latitude, item.longitude]);

  return (
    <div className="relative w-full h-[400px] rounded-2xl overflow-hidden border border-slate-800 shadow-xl z-0">
      <MapContainer
        center={[defaultLat, defaultLng]}
        zoom={12}
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {itinerary.map((dayItem) => {
          if (!dayItem.latitude || !dayItem.longitude) return null;
          return (
            <Marker
              key={dayItem.day}
              position={[dayItem.latitude, dayItem.longitude]}
            >
              <Popup>
                <div className="p-1 font-sans">
                  <div className="text-xs font-bold text-cyan-600 uppercase">
                    Day {dayItem.day}
                  </div>
                  <div className="text-sm font-semibold text-slate-800">
                    {dayItem.title}
                  </div>
                  {dayItem.locationName && (
                    <div className="text-xs text-slate-500 mt-1">
                      📍 {dayItem.locationName}
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}

        {positions.length > 1 && (
          <Polyline positions={positions} color="#06b6d4" weight={4} dashArray="8, 8" />
        )}
      </MapContainer>

      <div className="absolute bottom-3 left-3 bg-slate-900/90 border border-slate-700/80 px-3 py-1.5 rounded-xl text-xs text-white backdrop-blur-md z-[1000] flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
        <span>Interactive Journey Map: {destinationName || "Destination Route"}</span>
      </div>
    </div>
  );
}
