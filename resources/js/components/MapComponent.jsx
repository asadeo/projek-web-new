import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, CircleMarker } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
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

function LocateControl() {
    const map = useMap();
    const [position, setPosition] = useState(null);

    const handleLocate = () => {
        map.locate().on("locationfound", function (e) {
            setPosition(e.latlng);
            map.flyTo(e.latlng, 14);
        }).on("locationerror", function (e) {
            alert("Akses lokasi ditolak atau tidak dapat ditemukan oleh browser")
        })
    }


    return (
        <>
            {/* Tombol Melayang di atas Peta */}
            <div className="leaflet-top leaflet-right" style={{ top: '10px', right: '10px', position: 'absolute', zIndex: 1000 }}>
                <button 
                    onClick={handleLocate}
                    className="bg-white text-[#0B2235] hover:bg-gray-100 font-bold py-2 px-3 rounded shadow-md border border-gray-200 flex items-center gap-2 transition"
                    title="Temukan Lokasi Saya"
                >
                    <span>📍</span> Lokasi Saya
                </button>
            </div>

            {/* Jika lokasi ditemukan, tampilkan lingkaran biru */}
            {position && (
                <CircleMarker 
                    center={position} 
                    radius={8} 
                    pathOptions={{ color: 'white', fillColor: '#3b82f6', fillOpacity: 1, weight: 2 }}
                >
                    <Popup>
                        <div className="text-center">
                            <b>Lokasi Anda</b><br/>
                            <span className="text-xs text-gray-500">Radius terdekat untuk zonasi sekolah</span>
                        </div>
                    </Popup>
                </CircleMarker>
            )}
        </>
    );
}

export default function MapComponent({ schools, onSelectSchool }){
    const position = [-6.7462, 111.0278];

    return (
        <MapContainer center={position} zoom={11} style={{ height: "500px", width: "100%", borderRadius: "8px" }}>
            <TileLayer 
                attribution='&copy; <a href="https://www.openstreetmap.com/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            <LocateControl />
            
            <MarkerClusterGroup
                chunkedLoading={true}
            >
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

                            <button
                                onClick={() => onSelectSchool(school)}
                                className='text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded mt-2 w-full hover:bg-blue-200'
                            >
                                Lihat Detail Lengkap
                            </button>
                        </div>
                    </Popup>
                </Marker>
                );
            }
                return null;
            })}
            </MarkerClusterGroup>
        </MapContainer>
    )
}