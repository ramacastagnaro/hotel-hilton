import L from 'leaflet';
import { useEffect } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';

// ... (El código de configuración de los íconos que ya tenías)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

//componente es un "ayudante" para redibujar el mapa
function MapResizer() {
    const map = useMap();

    useEffect(() => {
        map.invalidateSize();
    }, [map]);

    return null; //No dibuja nada en la pantalla solo ejecuta la logica
}


function Map({ smallMap }) {
    const defaultPosition = [-24.782, -65.423];
    const zoomLevel = smallMap ? 10 : 13;
    const heightClass = 'h-full';

    return (
        <div className={heightClass}>
            <MapContainer
                center={defaultPosition}
                zoom={zoomLevel}
                style={{ height: '100%', width: '100%' }}
                dragging={!smallMap}
                zoomControl={!smallMap}
                scrollWheelZoom={!smallMap}
                doubleClickZoom={!smallMap}
            >
                <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' //api
                />

                <Marker position={defaultPosition}>
                <Popup>
                    Hotel Hilton. <br /> ¡Tu próxima estadía!
                </Popup>
                </Marker>

                <MapResizer />
                
            </MapContainer>
        </div>
    );
}

export default Map;