import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, CircleMarker } from 'react-leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Moon, Sun, Map as MapIcon, Navigation, Shield, HeartPulse, Coffee, Home, Camera, Thermometer, Car, Flame, Eye } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// --- CUSTOM MAP ICONS ---
// We use divIcons with emojis/Tailwind to avoid missing image asset errors in Vite
const createIcon = (emoji: string) => L.divIcon({
  html: `<div class="text-2xl bg-black/40 backdrop-blur-md rounded-full w-10 h-10 flex items-center justify-center border border-white/20 shadow-xl">${emoji}</div>`,
  className: 'bg-transparent',
  iconSize: [40, 40],
  iconAnchor: [20, 20]
});

// --- MOCK NEPAL DATA ---
const MAP_DATA = {
  unesco: [{ id: 1, pos: [27.704, 85.318], name: "Kathmandu Durbar Square" }, { id: 2, pos: [27.721, 85.362], name: "Boudhanath Stupa" }],
  hotels: [{ id: 1, pos: [27.714, 85.313], name: "Thamel Eco Resort" }, { id: 2, pos: [28.209, 83.956], name: "Pokhara Grande" }],
  homestays: [{ id: 1, pos: [28.374, 83.826], name: "Ghandruk Gurung Homestay" }, { id: 2, pos: [27.725, 85.429], name: "Bhaktapur Heritage House" }],
  restaurants: [{ id: 1, pos: [27.715, 85.310], name: "Himalayan Java" }, { id: 2, pos: [28.212, 83.959], name: "Moondance Restaurant" }],
  hospitals: [{ id: 1, pos: [27.717, 85.324], name: "Bir Hospital" }, { id: 2, pos: [28.210, 83.990], name: "Manipal Teaching Hospital" }],
  police: [{ id: 1, pos: [27.712, 85.317], name: "Tourist Police HQ" }],
  viewpoints: [{ id: 1, pos: [28.400, 83.870], name: "Poon Hill Viewpoint (3,210m)" }],
  lakes: [{ id: 1, pos: [28.201, 83.945], name: "Phewa Lake" }, { id: 2, pos: [29.531, 82.080], name: "Rara Lake" }],
  hidden_gems: [{ id: 1, pos: [28.775, 83.766], name: "Upper Mustang Caves" }],
  // Trekking Route (Annapurna segment)
  routes: [
    [28.210, 83.959], [28.290, 83.850], [28.374, 83.826], [28.400, 83.870], [28.450, 83.900]
  ],
  // Traffic demo lines
  traffic: [
    { path: [[27.710, 85.310], [27.700, 85.320]], color: '#ef4444' }, // Red/Heavy
    { path: [[27.720, 85.330], [27.730, 85.340]], color: '#eab308' }  // Yellow/Moderate
  ],
  // Heatmap simulated points (popular zones)
  heatmap: [
    [27.714, 85.313], [27.715, 85.314], [27.716, 85.311], // Thamel density
    [28.210, 83.959], [28.209, 83.956] // Pokhara lakeside density
  ]
};

const LAYER_CONFIG = [
  { id: 'unesco', label: 'UNESCO Sites', icon: <Camera size={16}/>, emoji: '🛕' },
  { id: 'hotels', label: 'Hotels', icon: <Home size={16}/>, emoji: '🏨' },
  { id: 'homestays', label: 'Homestays', icon: <HeartPulse size={16}/>, emoji: '🏡' },
  { id: 'restaurants', label: 'Restaurants', icon: <Coffee size={16}/>, emoji: '🍲' },
  { id: 'hospitals', label: 'Hospitals', icon: <Shield size={16}/>, emoji: '🏥' },
  { id: 'police', label: 'Police', icon: <Navigation size={16}/>, emoji: '👮' },
  { id: 'viewpoints', label: 'Viewpoints', icon: <Eye size={16}/>, emoji: '🏔️' },
  { id: 'lakes', label: 'Lakes', icon: <MapIcon size={16}/>, emoji: '🌊' },
  { id: 'hidden_gems', label: 'Hidden Gems', icon: <MapIcon size={16}/>, emoji: '💎' },
];

export default function SmartMap() {
  const [activeLayers, setActiveLayers] = useState<string[]>(['unesco', 'routes']);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showTraffic, setShowTraffic] = useState(false);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [showWeather, setShowWeather] = useState(false);

  const toggleLayer = (id: string) => {
    setActiveLayers(prev => prev.includes(id) ? prev.filter(l => l !== id) : [...prev, id]);
  };

  // Map Themes
  const MAP_LIGHT = "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";
  const MAP_DARK = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";

  return (
    <div className="relative w-full h-screen mt-0 overflow-hidden">
      
      {/* MAP ENGINE */}
      <div className="absolute inset-0 z-0">
        <MapContainer 
          center={[28.3949, 84.1240]} // Center of Nepal
          zoom={7} 
          className="w-full h-full bg-background-dark"
          zoomControl={false}
        >
          <TileLayer
            url={isDarkMode ? MAP_DARK : MAP_LIGHT}
            attribution='&copy; <a href="https://carto.com/">CartoDB</a>'
          />

          {/* Render Active Point Layers */}
          {LAYER_CONFIG.map(layer => (
            activeLayers.includes(layer.id) && MAP_DATA[layer.id as keyof typeof MAP_DATA]?.map((poi: any) => (
              <Marker key={`${layer.id}-${poi.id}`} position={poi.pos} icon={createIcon(layer.emoji)}>
                <Popup className="custom-popup">
                  <div className="font-display font-bold text-gray-900">{poi.name}</div>
                  <div className="text-xs text-gray-500 capitalize">{layer.label}</div>
                </Popup>
              </Marker>
            ))
          ))}

          {/* Animated Route Rendering */}
          {activeLayers.includes('routes') && (
            <Polyline 
              positions={MAP_DATA.routes as [number, number][]} 
              pathOptions={{ 
                color: '#d4af37', // Temple Gold
                weight: 4, 
                dashArray: '10, 15', 
                className: 'animated-route' // Linked to global CSS
              }} 
            />
          )}

          {/* Traffic Overlay */}
          {showTraffic && MAP_DATA.traffic.map((t, idx) => (
             <Polyline key={`traffic-${idx}`} positions={t.path as [number, number][]} pathOptions={{ color: t.color, weight: 5, opacity: 0.8 }} />
          ))}

          {/* Heatmap Simulation (Clustered Circles) */}
          {showHeatmap && MAP_DATA.heatmap.map((pos: any, idx) => (
            <CircleMarker 
              key={`heat-${idx}`} 
              center={pos} 
              radius={20} 
              pathOptions={{ fillColor: '#ef4444', color: 'transparent', fillOpacity: 0.3 }} 
            />
          ))}

          {/* Weather Overlay Demo (Static cloud over Pokhara) */}
          {showWeather && (
             <Marker position={[28.210, 83.959]} icon={createIcon('⛈️')}>
                <Popup><div className="font-bold text-gray-900">Heavy Rainfall Warning</div></Popup>
             </Marker>
          )}
        </MapContainer>
      </div>

      {/* OVERLAY UI: Layer Control Panel */}
      <div className="absolute top-24 left-6 z-10 w-72 pointer-events-none">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-panel bg-black/60 backdrop-blur-xl border border-white/10 rounded-3xl p-5 text-white shadow-2xl pointer-events-auto max-h-[80vh] overflow-y-auto custom-scrollbar"
        >
          <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
            <h3 className="font-display font-bold text-lg flex items-center gap-2">
              <Layers className="text-accent-temple-gold" size={20} />
              Command Map
            </h3>
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors"
            >
              {isDarkMode ? <Sun size={16} className="text-accent-temple-gold" /> : <Moon size={16} />}
            </button>
          </div>

          <div className="space-y-6">
            {/* Dynamic Overlays */}
            <div>
              <h4 className="text-xs font-bold text-white/40 uppercase tracking-wider mb-3">Live Intelligence</h4>
              <div className="space-y-2">
                <LayerToggle label="Animated Routes" active={activeLayers.includes('routes')} onClick={() => toggleLayer('routes')} icon={<Navigation size={14}/>} />
                <LayerToggle label="Live Weather" active={showWeather} onClick={() => setShowWeather(!showWeather)} icon={<Thermometer size={14}/>} />
                <LayerToggle label="Traffic Flow" active={showTraffic} onClick={() => setShowTraffic(!showTraffic)} icon={<Car size={14}/>} />
                <LayerToggle label="Density Heatmap" active={showHeatmap} onClick={() => setShowHeatmap(!showHeatmap)} icon={<Flame size={14}/>} />
              </div>
            </div>

            {/* POI Filters */}
            <div>
              <h4 className="text-xs font-bold text-white/40 uppercase tracking-wider mb-3">Points of Interest</h4>
              <div className="grid grid-cols-1 gap-2">
                <AnimatePresence>
                  {LAYER_CONFIG.map(layer => (
                    <LayerToggle 
                      key={layer.id} 
                      label={layer.label} 
                      active={activeLayers.includes(layer.id)} 
                      onClick={() => toggleLayer(layer.id)} 
                      icon={layer.icon} 
                    />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// Sub-component for slick animated toggles
function LayerToggle({ label, active, onClick, icon }: { label: string, active: boolean, onClick: () => void, icon: React.ReactNode }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all duration-300 ${
        active ? 'bg-accent-temple-gold/20 text-white border border-accent-temple-gold/30 shadow-[0_0_15px_rgba(212,175,55,0.1)]' : 'bg-transparent text-white/60 hover:bg-white/5 border border-transparent'
      }`}
    >
      <span className={active ? 'text-accent-temple-gold' : 'text-white/40'}>{icon}</span>
      <span className="font-medium">{label}</span>
      {active && (
        <motion.div layoutId="activeDot" className="ml-auto w-2 h-2 rounded-full bg-accent-temple-gold shadow-[0_0_8px_#d4af37]" />
      )}
    </button>
  );
}