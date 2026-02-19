import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12,41],
});
L.Marker.prototype.options.icon = DefaultIcon;

export default function MapComponent({ schools }){
    const position = [-6.7462, 111.0278];

    return (
        <MapContainer center={position} zoom={11} style={{ height: "500px", width: "100%", borderRadius: "8px" }}>
            <TileLayer 
                attribution='&copy; <a href="https://www.openstreetmap.com/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {schools.map((school) => {
                if (school.latitude && school.longitude) {
                return (
                <Marker key={school.id} position={[school.latitude, school.longitude]}>
                    <Popup>
                        <div className='text-center'>
                            {school.photo && (
                                <img 
                                    src={`/storage/${school.photo}`}
                                    alt={school.name}
                                    className='w-full h-24 object-cover rounded mb-2'
                                />
                            )}
                            <b className='text-sm'>{school.name}</b><br/>
                            <span className='text-xs text-gray-600'>{school.level} - {school.status}</span><br/>
                            <a href={`https://www.google.com/maps/dir/?api=1&destination=${school.latitude},${school.longitude}`} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className='text-blue-600 underline text-xs mt-1 block'>
                                Rute ke lokasi
                            </a>
                        </div>
                    </Popup>
                </Marker>
                );
            }
                return null;
            })}
        </MapContainer>
    )
}