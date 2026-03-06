import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12,41],
});
L.Marker.prototype.options.icon = DefaultIcon;

function LocationMarker({ form, setForm }) {
    const [position, setPosition] = useState(null);
    useEffect(() => {
        if (form.latitude && form.longitude) {
            setPosition([form.latitude, form.longitude]);
        }
    }, [form.latitude, form.longitude]);

    const map = useMapEvents({
        click(e) {
            const { lat, lng } = e.latlng;
            setPosition([lat, lng]);
            setForm ((prevForm) => ({ 
                ...prevForm,
                latitude: lat,
                longitude: lng
            }));

            map.flyTo(e.latlng, map.getZoom());
        },
    });

    return position === null ? null : (
        <Marker position={position}>
            <Popup>Lokasi Sekolah</Popup>
        </Marker>
    )
}

export default function SchoolForm(){
    const navigate = useNavigate();
    const { id } = useParams();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newSchool, setNewSchool] = useState({
        npsn: '', name: '', level: 'SD', status: 'Negeri',
        address: '', latitude: '', longitude: '', district: '',
        student_2025: '', accreditation: 'Belum Terakreditasi',
    });

    useEffect(() => {
        if (id) {
            const fetchData = async () => {
                try {
                    const token = localStorage.getItem('ACCESS_TOKEN');
                    const res = await axios.get(`/api/schools/${id}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        }
                    });

                    let foundData = null;

                    if (res.data.school) {
                        foundData = res.data.school;
                    } else if (Array.isArray(res.data.schools)) {
                        foundData = res.data.schools.find(s => String(s.id) === String(id));
                    } else if (Array.isArray(res.data)) {
                        foundData = res.data.find(s => String(s.id) === String(id));
                    }

                    if (foundData) {
                        setNewSchool({
                            npsn: foundData.npsn,
                            name: foundData.name,
                            level: foundData.level,
                            status: foundData.status,
                            address: foundData.address,
                            latitude: foundData.latitude !== null ? foundData.latitude : '',
                            longitude: foundData.longitude !== null ? foundData.longitude : '',
                            district: foundData.district,
                            student_2025: foundData.student_2025,
                            accreditation: foundData.accreditation,
                        });
                    } else {
                        console.warn("Data sekolah tidak ditemukan dalam response API.");
                    }

                } catch (error) {
                    console.error("Gagal ambil data:", error);
                    if (error.response && error.response.status === 404) {
                        alert("Data sekolah tidak ditemukan!");
                        navigate('/dashboard');
                    }
                }
            };
            fetchData();
        }
    }, [id]);

    const handleInputChange = (e) => {
        setNewSchool({
            ...newSchool,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isSubmitting) return;

        setIsSubmitting(true);

        try {
            const token = localStorage.getItem('ACCESS_TOKEN');

            const formData = new FormData();
            formData.append('npsn', newSchool.npsn);
            formData.append('name', newSchool.name);
            formData.append('level', newSchool.level);
            formData.append('status', newSchool.status);
            formData.append('address', newSchool.address);
            formData.append('district', newSchool.district);
            formData.append('student_2025', newSchool.student_2025);
            formData.append('accreditation', newSchool.accreditation);
            formData.append('latitude', newSchool.latitude);
            formData.append('longitude', newSchool.longitude);
            if (newSchool.photo instanceof File) {
                formData.append('photo', newSchool.photo);
            }

            if (id){
                formData.append('_method', 'PUT');
                await axios.post(`/api/schools/${id}`, formData, {
                    headers: { 
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });
                alert('Berhasil memperbarui data sekolah!');
            } else {
                await axios.post('/api/schools', formData, {
                    headers: { 
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });
                alert('Berhasil menambahkan sekolah!');
            }

            navigate('/dashboard');

        } catch (error) {
            console.error("Error Detail:", error.response || error);
            if (error.response && error.response.data && error.response.data.message) {
                 alert(`Gagal: ${error.response.data.message}`);
            } else {
                 alert('Gagal menyimpan! Cek apakah NPSN sudah benar atau isian belum lengkap.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl p-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                        {id ? "Edit Data Sekolah" : "Tambah Sekolah Baru"}
                    </h2>
                    <button onClick={() => navigate('/dashboard')} className="text-gray-500 hover:text-gray-700">
                        &larr; Kembali
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-1 md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Foto Sekolah 
                        </label>
                        {newSchool.photo && typeof newSchool.photo === 'string' && (
                            <div className="mb-2">
                                <img src={`/storage/${newSchool.photo}`} alt="Preview" className="h-20 rounded shadow" />
                            </div>
                        )}
                        <input 
                            type="file" 
                            name="photo" 
                            onChange={(e) => {
                                setNewSchool({
                                    ...newSchool,
                                    photo: e.target.files[0],
                                })
                            }} 
                            className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500" 
                            accept="image/*"
                        />
                    </div>
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>NPSN</label>
                        <input type="text" name="npsn" value={newSchool.npsn} onChange={handleInputChange} required className='w-full border p-2 rounded focus:ring-2 focus:ring-blue-500' placeholder='Contoh: 20338911'/>
                    </div>
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>Nama Sekolah</label>
                        <input type="text" name="name" value={newSchool.name} onChange={handleInputChange} required className='w-full border p-2 rounded focus:ring-2 focus:ring-blue-500' placeholder='Contoh: SD Negeri 1 Pati'/>
                    </div>
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>Jenjang</label>
                        <select name="level" value={newSchool.level} onChange={handleInputChange} required className='w-full border p-2 rounded'>
                            <option value="SD">SD</option>
                            <option value="SMP">SMP</option>    
                        </select>
                    </div>
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>Status</label>
                        <select name="status" value={newSchool.status} onChange={handleInputChange} required className='w-full border p-2 rounded'>
                            <option value="Negeri">Negeri</option>
                            <option value="Swasta">Swasta</option>    
                        </select>
                    </div>
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>Kecamatan</label>
                        <input type="text" name="district" value={newSchool.district} onChange={handleInputChange} required className='w-full border p-2 rounded focus:ring-2 focus:ring-blue-500' placeholder='Contoh: Pati Kota'/>
                    </div>
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>Akreditasi</label>
                        <select name="accreditation" value={newSchool.accreditation} onChange={handleInputChange} required className='w-full border p-2 rounded'>
                            <option value="A">A</option>
                            <option value="B">B</option>    
                            <option value="C">C</option>
                            <option value="Belum Terakreditasi">Belum Terakreditasi</option>
                        </select>
                    </div>
                    <div className='col-span-1 md:col-span-2'>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>Alamat</label>
                        <input type="text" name="address" value={newSchool.address} onChange={handleInputChange} required className='w-full border p-2 rounded focus:ring-2 focus:ring-blue-500' placeholder='Contoh: Jl. Raya Pati No. 1'/>
                    </div>
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>Jumlah Siswa (2025)</label>
                        <input type="number" name="student_2025" value={newSchool.student_2025} onChange={handleInputChange} required className='w-full border p-2 rounded focus:ring-2 focus:ring-blue-500' placeholder='Contoh: 100'/>
                    </div>

                    <div className='col-span-1 md:col-span-2 mb-4'>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                            Pilih Lokasi sekolah (klik pada peta untuk menentukan lokasi)
                        </label>
                        <div>
                            <MapContainer 
                                center={newSchool.latitude && newSchool.longitude ? [newSchool.latitude, newSchool.longitude] : [-6.7462, 111.0278]}
                                zoom={13} 
                                style={{ height: "400px", width: "100%" }}>
                                <TileLayer 
                                    attribution='&copy; <a href="https://www.openstreetmap.com/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                <LocationMarker form={newSchool} setForm={setNewSchool} />
                            </MapContainer>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            *Geser peta dan klik lokasi tepat sekolah berada.
                        </p>
                    </div>

                    <div className='col-span-1 md:col-span-2 gap-4'>
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>Latitude</label>
                            <input 
                                type="text" 
                                name="latitude" 
                                value={newSchool.latitude || ''}
                                onChange={handleInputChange}
                                className='w-full border p-2 rounded bg-gray-100 focus:ring-2 focus:ring-blue-500'
                            />
                        </div>
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>Longitude</label>
                            <input 
                                type="text" 
                                name="longitude" 
                                value={newSchool.longitude || ''}
                                onChange={handleInputChange}
                                className='w-full border p-2 rounded bg-gray-100 focus:ring-2 focus:ring-blue-500'
                            />
                        </div>
                    </div>

                    <div className="col-span-1 md:col-span-2 pt-6 border-t flex justify-end gap-3">
                        <button type="button" onClick={() => navigate('/dashboard')} className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">
                            Batal
                        </button>
                        <button type="submit" disabled={isSubmitting} className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}>
                            {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}