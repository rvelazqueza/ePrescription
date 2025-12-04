import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { MapPin, Navigation, Loader2, AlertCircle, ZoomIn, ZoomOut, Maximize2, Hand } from "lucide-react";
import { toast } from "sonner";

interface LocationMapProps {
  latitude?: number;
  longitude?: number;
  center?: [number, number];
  onLocationSelect?: (lat: number, lon: number) => void;
  onLocationChange?: (lat: number, lon: number) => void;
  editable?: boolean;
}

export function LocationMap({ 
  latitude, 
  longitude, 
  center, 
  onLocationSelect, 
  onLocationChange,
  editable = true 
}: LocationMapProps) {
  // Coordenadas por defecto (San José, Costa Rica)
  const DEFAULT_LAT = 9.9281;
  const DEFAULT_LON = -84.0907;
  
  // Determinar la posición inicial
  const initialLat = center ? center[0] : (latitude || DEFAULT_LAT);
  const initialLon = center ? center[1] : (longitude || DEFAULT_LON);
    
  const [position, setPosition] = useState<[number, number]>([initialLat, initialLon]);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  // Cargar Leaflet dinámicamente
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Cargar CSS de Leaflet si no está cargado
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
      link.crossOrigin = '';
      document.head.appendChild(link);
    }

    // Cargar script de Leaflet
    if (!window.L) {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
      script.crossOrigin = '';
      script.async = true;
      script.onload = () => {
        setMapReady(true);
      };
      document.body.appendChild(script);
    } else {
      setMapReady(true);
    }
  }, []);

  // Inicializar el mapa cuando Leaflet esté listo
  useEffect(() => {
    if (!mapReady || !mapContainerRef.current || mapRef.current) return;

    const L = window.L;
    
    // Crear el mapa
    const map = L.map(mapContainerRef.current, {
      center: [position[0], position[1]],
      zoom: 13,
      zoomControl: false, // Desactivar controles por defecto
      attributionControl: true
    });

    // Agregar capa de tiles de OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    }).addTo(map);

    // Crear icono personalizado
    const customIcon = L.divIcon({
      className: 'custom-map-marker',
      html: `
        <div style="position: relative;">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="#2b6cb0" stroke="white" stroke-width="2" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3" fill="white"></circle>
          </svg>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40]
    });

    // Agregar marcador
    const marker = L.marker([position[0], position[1]], {
      icon: customIcon,
      draggable: editable
    }).addTo(map);

    // Si el marcador es arrastrable
    if (editable) {
      marker.on('dragend', function(e: any) {
        const newPos = e.target.getLatLng();
        const newLat = newPos.lat;
        const newLon = newPos.lng;
        
        setPosition([newLat, newLon]);
        
        if (onLocationChange) {
          onLocationChange(newLat, newLon);
        }
        if (onLocationSelect) {
          onLocationSelect(newLat, newLon);
        }

        toast.success("📍 Ubicación actualizada", {
          description: "Detectando dirección...",
          duration: 2000
        });
      });
    }

    // Evento de clic en el mapa
    if (editable) {
      map.on('click', function(e: any) {
        const lat = e.latlng.lat;
        const lon = e.latlng.lng;
        
        // Mover el marcador
        marker.setLatLng([lat, lon]);
        
        // Actualizar estado
        setPosition([lat, lon]);
        
        // Llamar a callbacks
        if (onLocationChange) {
          onLocationChange(lat, lon);
        }
        if (onLocationSelect) {
          onLocationSelect(lat, lon);
        }

        toast.success("📍 Ubicación seleccionada", {
          description: "Detectando dirección...",
          duration: 2000
        });
      });
    }

    mapRef.current = map;
    markerRef.current = marker;

    // Cleanup
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markerRef.current = null;
      }
    };
  }, [mapReady, editable]);

  // Actualizar posición del marcador cuando cambien las props
  useEffect(() => {
    if (!markerRef.current || !mapRef.current) return;
    
    const newLat = center ? center[0] : (latitude || DEFAULT_LAT);
    const newLon = center ? center[1] : (longitude || DEFAULT_LON);
    
    if (newLat !== position[0] || newLon !== position[1]) {
      setPosition([newLat, newLon]);
      markerRef.current.setLatLng([newLat, newLon]);
      mapRef.current.setView([newLat, newLon], mapRef.current.getZoom());
    }
  }, [center, latitude, longitude]);

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("❌ Geolocalización no disponible", {
        description: "Su navegador no soporta geolocalización. Use el mapa manualmente haciendo clic en su ubicación.",
        duration: 5000
      });
      return;
    }

    setIsGettingLocation(true);
    
    toast.info("🛰️ Obteniendo su ubicación GPS...", {
      description: "Esto puede tomar unos segundos. Asegúrese de haber dado permisos de ubicación.",
      duration: 3000
    });

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        
        console.log("✅ GPS obtenido exitosamente:", { lat, lon, accuracy: pos.coords.accuracy });
        
        setPosition([lat, lon]);
        
        // Actualizar mapa y marcador
        if (mapRef.current && markerRef.current) {
          markerRef.current.setLatLng([lat, lon]);
          mapRef.current.setView([lat, lon], 15); // Zoom más cercano al obtener ubicación
        }
        
        // Llamar al callback PRIMERO para actualizar coordenadas
        if (onLocationChange) {
          console.log("📡 Llamando a onLocationChange con:", lat, lon);
          onLocationChange(lat, lon);
        }
        if (onLocationSelect) {
          console.log("📡 Llamando a onLocationSelect con:", lat, lon);
          onLocationSelect(lat, lon);
        }
        
        setIsGettingLocation(false);
        toast.success("✅ ¡Ubicación GPS obtenida!", {
          description: `Precisión: ${Math.round(pos.coords.accuracy)}m. Detectando dirección...`,
          duration: 3000
        });
      },
      (error) => {
        setIsGettingLocation(false);
        
        // Logging detallado del error
        console.error("❌ Error de geolocalización detectado:");
        console.error("  • Código:", error.code);
        console.error("  • Mensaje:", error.message);
        console.error("  • PERMISSION_DENIED:", error.PERMISSION_DENIED);
        console.error("  • POSITION_UNAVAILABLE:", error.POSITION_UNAVAILABLE);
        console.error("  • TIMEOUT:", error.TIMEOUT);
        
        switch (error.code) {
          case 1: // PERMISSION_DENIED
            console.error("  ⚠️ Tipo de error: PERMISSION_DENIED (Usuario rechazó permisos)");
            
            // Detectar si es por política de permisos del navegador/documento
            const isPolicyError = error.message && error.message.includes("permissions policy");
            
            if (isPolicyError) {
              toast.error("🚫 Geolocalización deshabilitada", {
                description: (
                  <div className="space-y-2">
                    <p>La geolocalización está deshabilitada por política de seguridad del navegador o documento.</p>
                    <p className="text-xs">💡 <strong>Solución:</strong> Use el mapa para seleccionar manualmente su ubicación haciendo clic, o use los campos de selección de provincia/cantón/distrito.</p>
                  </div>
                ),
                duration: 10000
              });
            } else {
              toast.error("🚫 Permiso de ubicación denegado", {
                description: (
                  <div className="space-y-2">
                    <p>Debe permitir el acceso a su ubicación.</p>
                    <p className="text-xs">💡 <strong>Solución:</strong> Haga clic en el ícono de candado/información en la barra de direcciones y active permisos de ubicación.</p>
                  </div>
                ),
                duration: 8000
              });
            }
            break;
          case 2: // POSITION_UNAVAILABLE
            console.error("  ⚠️ Tipo de error: POSITION_UNAVAILABLE (GPS no disponible)");
            toast.warning("📡 Ubicación no disponible", {
              description: "No se pudo determinar su ubicación. Verifique que su dispositivo tenga GPS/Wi-Fi activo.",
              duration: 5000
            });
            break;
          case 3: // TIMEOUT
            console.error("  ⚠️ Tipo de error: TIMEOUT (Solicitud tardó demasiado)");
            toast.warning("⏱️ Tiempo de espera agotado", {
              description: "La solicitud de ubicación tardó demasiado. Intente nuevamente.",
              duration: 5000
            });
            break;
          default:
            console.error("  ⚠️ Tipo de error: DESCONOCIDO - Código:", error.code);
            toast.error("❌ Error al obtener ubicación", {
              description: "Use el mapa para seleccionar manualmente haciendo clic en su ubicación.",
              duration: 5000
            });
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 15000, // Aumentado a 15 segundos
        maximumAge: 0
      }
    );
  };

  const handleZoomIn = () => {
    if (mapRef.current) {
      mapRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapRef.current) {
      mapRef.current.zoomOut();
    }
  };

  const handleResetView = () => {
    if (mapRef.current && markerRef.current) {
      mapRef.current.setView([position[0], position[1]], 13);
    }
  };

  return (
    <div className="space-y-2">
      <div className="relative h-full w-full rounded-lg overflow-hidden border bg-muted/10" style={{ minHeight: "450px" }}>
        {/* Contenedor del mapa */}
        <div 
          ref={mapContainerRef} 
          className="w-full h-full"
          style={{ minHeight: "450px", cursor: editable ? 'crosshair' : 'default' }}
        />
        
        {/* Loading overlay */}
        {!mapReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/50 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Cargando mapa interactivo...</p>
            </div>
          </div>
        )}
        
        {/* Controles flotantes */}
        {editable && mapReady && (
          <>
            {/* Controles de zoom */}
            <div className="absolute top-2 right-2 flex flex-col gap-2 z-[1000]">
              <Button
                size="icon"
                variant="secondary"
                className="shadow-lg w-9 h-9"
                onClick={handleZoomIn}
                type="button"
                title="Acercar"
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Button
                size="icon"
                variant="secondary"
                className="shadow-lg w-9 h-9"
                onClick={handleZoomOut}
                type="button"
                title="Alejar"
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
              <Button
                size="icon"
                variant="secondary"
                className="shadow-lg w-9 h-9"
                onClick={handleResetView}
                type="button"
                title="Centrar en marcador"
              >
                <Maximize2 className="w-4 h-4" />
              </Button>
            </div>

            {/* Botón Mi ubicación */}
            <div className="absolute top-2 left-2 z-[1000]">
              <Button
                size="sm"
                variant="default"
                className="shadow-lg"
                onClick={handleGetCurrentLocation}
                type="button"
                disabled={isGettingLocation}
              >
                {isGettingLocation ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Obteniendo...
                  </>
                ) : (
                  <>
                    <Navigation className="w-4 h-4 mr-2" />
                    Mi ubicación
                  </>
                )}
              </Button>
            </div>

            {/* Instrucción flotante */}
            <div className="absolute bottom-2 left-2 bg-primary/95 backdrop-blur-sm px-3 py-2 rounded-md shadow-lg text-xs text-white z-[1000] flex items-center gap-2 max-w-[280px]">
              <Hand className="w-4 h-4 flex-shrink-0" />
              <div>
                <p className="font-medium">🖱️ Haga clic en el mapa</p>
                <p className="text-white/90">o arrastre el marcador 📍</p>
              </div>
            </div>
          </>
        )}
        
        {/* Indicador de coordenadas */}
        <div className="absolute bottom-2 right-2 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-md shadow-md text-xs font-mono text-muted-foreground z-[1000]">
          {position[0].toFixed(6)}, {position[1].toFixed(6)}
        </div>
      </div>

      {/* Instrucciones detalladas */}
      <div className="flex items-start gap-2 text-sm text-muted-foreground bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 p-3 rounded-md">
        <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0 text-primary" />
        <div className="flex-1">
          <p className="font-medium text-foreground mb-2">✨ Cuatro formas de seleccionar ubicación:</p>
          <div className="space-y-1.5 text-xs">
            <div className="flex items-start gap-2">
              <span className="text-primary font-bold min-w-[20px]">1️⃣</span>
              <span><strong>Haga clic en el mapa</strong> - El marcador se moverá al punto exacto que seleccione</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-600 font-bold min-w-[20px]">2️⃣</span>
              <span><strong>Arrastre el marcador 📍</strong> - Mantenga presionado y muévalo a donde desee</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-blue-600 font-bold min-w-[20px]">3️⃣</span>
              <span><strong>Botón "Mi ubicación"</strong> - GPS automático (requiere permisos del navegador)</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-purple-600 font-bold min-w-[20px]">4️⃣</span>
              <span><strong>Selección manual</strong> - Use los campos provincia, cantón y distrito más abajo</span>
            </div>
          </div>
          <div className="mt-3 flex items-start gap-2 text-xs bg-green-100 text-green-800 p-2 rounded border border-green-300">
            <AlertCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-bold">💡 Controles del mapa:</p>
              <ul className="mt-1 space-y-0.5 ml-2">
                <li>• <strong>Zoom:</strong> Use la rueda del mouse o los botones +/-</li>
                <li>• <strong>Mover:</strong> Arrastre el mapa con el mouse</li>
                <li>• <strong>Centrar:</strong> Use el botón ⛶ para volver al marcador</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
