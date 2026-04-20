import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, CircleMarker, Circle, GeoJSON } from 'react-leaflet';
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

const blueIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12,41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const redIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12,41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

function LocateControl({ userPosition, setUserPosition }) {
    const map = useMap();

    const handleLocate = () => {
        map.locate().on("locationfound", function (e) {
            setUserPosition(e.latlng);
            map.flyTo(e.latlng, 14);
        }).on("locationerror", function (e) {
            alert("Akses lokasi ditolak atau tidak dapat ditemukan oleh browser")
        })
    }


    return (
        <>
            {/* Tombol Melayang di atas Peta */}
            <div className="absolute top-4 right-4 z-1000">
                <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        handleLocate();
                    }}
                    className="bg-white text-[#0B2235] hover:bg-gray-100 font-bold py-2 px-3 rounded shadow-md border border-gray-200 flex items-center gap-2 transition"
                    title="Temukan Lokasi Saya"
                >
                    <span>📍</span> Lokasi Saya
                </button>
            </div>

            {/* Jika lokasi ditemukan, tampilkan lingkaran biru */}
            {userPosition && (
                <CircleMarker 
                    center={userPosition} 
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
    const patiBounds = [[-7.1500, 110.8000],[-6.3500, 111.3500]];

    const [geoData, setGeoData] = useState(null);
    const [selectedDistrict, setSelectedDistrict] = useState(null);

    const [userPosition, setUserPosition] = useState(null);

    useEffect(() => {
        fetch('/data/batas_kecamatan_pati_kompres.json')
        .then(response => response.json())
        .then(data => setGeoData(data))
        .catch(error => console.error("Gagal memuat GeoJSON:", error));
    }, []);

    const geoJsonStyle = {
        color: '#FF5722',
        weight: 2,
        opacity: 0.6,
        fillColor: '#FFC107',
        fillOpacity: 0.05
    };

    const onEachFeature = (feature, layer) => {
        const namaKecamatan = feature.properties.district || feature.properties.WADMKC; 

        if(namaKecamatan) {
            layer.bindTooltip(namaKecamatan, { permanent: false, direction: 'center' });
        }

        layer.on({
            click: (e) => {
                const map = e.target._map;
                map.fitBounds(e.target.getBounds());

                setSelectedDistrict(namaKecamatan);    
            }
        });
    };

    const filteredSchools = selectedDistrict ? schools.filter(school => school.district.toLowerCase() === selectedDistrict.toLowerCase()) : schools;

    return (

        <div className="relative">
            {selectedDistrict && (
                <div className="absolute top-2 left-12 z-1000 bg-white p-2 rounded shadow text-sm">
                    Menampilkan sekolah di: <b>{selectedDistrict}</b>
                    <button 
                        onClick={() => setSelectedDistrict(null)}
                        className="ml-3 text-red-500 hover:text-red-700 underline"
                    >
                        Reset / Tampilkan Semua
                    </button>
                </div>
            )}

            <MapContainer center={position} zoom={11} minZoom={10} maxBounds={patiBounds} maxBoundsViscosity={1} style={{ height: "500px", width: "100%", borderRadius: "8px" }}>
                <TileLayer 
                    attribution="Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                />

                {geoData && (
                    <GeoJSON 
                        data={geoData} 
                        style={geoJsonStyle} 
                        onEachFeature={onEachFeature}    
                    />
                )}
                
                <LocateControl userPosition={userPosition} setUserPosition={setUserPosition}/>
                
                <MarkerClusterGroup
                    chunkedLoading={true}
                >
                {filteredSchools.map((school) => {
                    if (school.latitude && school.longitude) {
                    
                    const markerIcon = school.level === 'SD' ? redIcon : blueIcon;

                    let distanceText = null;
                    if (userPosition) {
                        const schoolLatLng = L.latLng(school.latitude, school.longitude);
                        const distanceInMeters = userPosition.distanceTo(schoolLatLng);
                        const distanceInKm = (distanceInMeters / 1000).toFixed(2);

                        const isNear = distanceInKm <= 3.00;
                        distanceText = (
                            <div className={`mt-1 p-1 rounded text-xs font-bold ${isNear ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                Jarak Zonasi: {distanceInKm} km
                            </div>
                        );
                    }

                    return (
                    <Marker key={school.id} position={[school.latitude, school.longitude]} icon={markerIcon}>
                        <Popup>
                            <div className='text-center'>
                                
                                <img 
                                    src={school.photo ? `/storage/${school.photo}` : "/assets/images/school.png"}
                                    alt={school.name}
                                    className='w-full h-24 object-cover rounded mb-2'
                                />
                                
                                <b className='text-sm'>{school.name}</b><br/>
                                <span className='text-xs text-gray-600'>{school.level} - {school.status}</span><br/>

                                {distanceText}

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
    </div>
    )
}