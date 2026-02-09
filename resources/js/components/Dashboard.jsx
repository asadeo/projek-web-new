import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import MapComponent from './MapComponent';

export default function Dashboard() {
    const [user, setUser] = useState({});
    const [schools, setSchools] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [editSchoolId, setEditSchoolId] = useState(null);
    const [newSchool, setNewSchool] = useState({
        npsn: '',
        name: '',
        district: '',
        address: '',
        status: 'Negeri',
        level: 'SD',
        latitude: '',
        longitude: '',
        photo: '',
        accreditation: 'Belum Terakreditasi',
        student_2025: 0
    }); 


    const fetchData = async () => {
            try {
                const token = localStorage.getItem('ACCESS_TOKEN');

                if (!token) {
                    navigate('/login');
                    return;
                }

                const config = {
                    headers: { Authorization: `Bearer ${token}` }
                };

                const userRes = await axios.get('/api/user', config);
                setUser(userRes.data);
                
                const schoolRes = await axios.get('/api/schools', config);
                const schoolData = schoolRes.data.schools || schoolRes.data || [];
                setSchools(schoolData);

                setLoading(false);
            } catch (error) {
                console.error("Gagal ambil data:", error);
                if (error.response && error.response.status === 401) {
                    localStorage.removeItem('ACCESS_TOKEN');
                    navigate('/login');
                }
                setLoading(false);
            }
        };
        useEffect(() => {
            fetchData();
    }, []);

    const logoutHandler = async () => {
        try {
            const token = localStorage.getItem('ACCESS_TOKEN');
            await axios.post('/api/logout', {}, {
                headers: {
                    Authorization: `Bearer ${token}` 
                }
            });
            localStorage.removeItem('ACCESS_TOKEN');
            navigate('/login');
        } catch (error) {
            console.error("Gagal logout", error);
            localStorage.removeItem('ACCESS_TOKEN');
            navigate('/login');
        }
    };

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

            if (editSchoolId){
                await axios.put(`/api/schools/${editSchoolId}`, newSchool, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert('Berhasil memperbarui data sekolah!');
            } else {
                await axios.post('/api/schools', newSchool, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert('Berhasil menambahkan sekolah!');
            }
            
            setShowModal(false);
            setEditSchoolId(null);
            setNewSchool({
                npsn: '', name: '', level: 'SD', status: 'Negeri',
                district: '', address: '', latitude: '', longitude: '', photo: '', 
                accreditation: 'Belum Terakreditasi', student_2025: 0
            });
            fetchData();
        } catch (error) {
            console.error(error);
            alert('Gagal menyimpan! Cek apakah NPSN sudah benar atau isian belum lengkap.')
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (school) => {
        setEditSchoolId(school.id);
        setNewSchool({
            npsn: school.npsn,
            name: school.name,
            district: school.district,
            address: school.address,
            status: school.status,
            level: school.level,
            latitude: school.latitude || '',
            longitude: school.longitude || '',
            photo: school.photo || '',
            accreditation: school.accreditation,
            student_2025: school.student_2025
        });
        setShowModal(true);
    };

    const handleDelete = async (id, name) => {
        if (confirm(`Yakin ingin menghapus ${name}?`)) {
            try {
                const token = localStorage.getItem('ACCESS_TOKEN');
                await axios.delete(`/api/schools/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert('Data sekolah berhasil dihapus!');
                fetchData();
            } catch (error){
                alert('Gagal menghapus data sekolah!');
            }
        }
    };  

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* SIDEBAR KIRI */}
            <aside className="w-64 bg-gradient-to-b from-[#20639B] from-50% to-[#0B2235] to-100% text-white flex flex-col">
                <div className="p-6 text-center border-b border-slate-700">
                    <h1 className="text-2xl font-bold">DINAS PATI</h1>
                    <p className="text-xs text-slate-400 mt-1">Sistem Informasi Manajemen</p>
                </div>

                {/* Menu Navigasi */}
                <nav className="flex-1 p-4 space-y-2">
                    <p className="text-xs text-slate-400 uppercase mb-2">Menu</p>

                    <a href="#" className="block py-2.5 px-4 rounded bg-[#FFC107]/10 text-[#FFC107] font-semibold hover:bg-[#FFC107]/20 transition">
                        Dashboard
                    </a>
                    <a href="#" className="block py-2.5 px-4 rounded hover:bg-[#FFC107]/10 text-white hover:text-[#FFC107] transition">
                        Konten Website
                    </a>
                    <a href="#" className="block py-2.5 px-4 rounded hover:bg-[#FFC107]/10 text-white hover:text-[#FFC107] transition">    
                        Layanan Publik
                    </a>
                    <a href="#" className="block py-2.5 px-4 rounded hover:bg-[#FFC107]/10 text-white hover:text-[#FFC107] transition">
                        Data
                    </a>
                    <a href="#" className="block py-2.5 px-4 rounded hover:bg-[#FFC107]/10 text-white hover:text-[#FFC107] transition">
                        Pengaturan
                    </a>
                </nav>

                {/* Tombol Logout di Bawah */}
                <div className="p-4 border-t border-slate-700">
                    <button 
                        onClick={logoutHandler} 
                        className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded font-bold transition"
                    >
                        Logout
                    </button>
                </div>
            </aside>

            {/* --- KONTEN UTAMA (KANAN) --- */}
            <main className="flex-1 p-8 overflow-y-auto">
                {/* Header Konten */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800">Dashboard</h2>
                        <p className="text-gray-500">Selamat datang kembali, <span className="font-semibold text-blue-600">{user.name}</span>!</p>
                    </div>
                    <div className="bg-white p-2 rounded-full shadow">
                        <img src="https://ui-avatars.com/api/?name=Admin+Dinas&background=0D8ABC&color=fff" alt="Profile" className="w-10 h-10 rounded-full" />
                    </div>
                </div>

                {/* Kartu Statistik */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-blue-100 text-blue-500 mr-4">
                                <img src="assets/images/newspaper.png" className="w-6 h-6" alt="Newspaper Icon"/>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm">Total Berita</p>
                                <p className="text-2xl font-bold text-gray-800">12</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-green-100 text-green-500 mr-4">
                                
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm">Data Sekolah</p>
                                <p className="text-2xl font-bold text-gray-800">45</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow border-l-4 border-purple-500">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-purple-100 text-purple-500 mr-4">
                                👥
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm">Pengunjung Hari Ini</p>
                                <p className="text-2xl font-bold text-gray-800">1,204</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* HEADER TABEL */}
                <div className='mt-8 mb-4'>
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-800">Data Sekolah</h2>
                            <p className="text-gray-500">Daftar sekolah di Kabupaten Pati</p>
                        </div>
                    <div className='flex items-center gap-4'>
                        <button onClick={() =>{
                            setEditSchoolId(null);
                            setNewSchool({
                                npsn: '', name: '', level: 'SD', status: 'Negeri',
                                district: '', address: '', accreditation: 'belum Terakreditasi', student_2025: 0
                            });
                            setShowModal(true);
                        }}
                        className='bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded shadow flex items-center gap-2'>
                            + Tambah Sekolah
                        </button>
                        <div className="bg-white px-4 py-2 rounded shadow text-sm font-semibold text-blue-600">
                            Total: {schools.length} Sekolah
                        </div>
                    </div>
                    </div>
                </div>

                {/* TABEL DATA */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-100 text-slate-600 uppercase text-xs font-bold">
                            <tr>
                                <th className="p-4 border-b">NPSN</th>
                                <th className="p-4 border-b">Nama Sekolah</th>
                                <th className="p-4 border-b">Kecamatan</th>
                                <th className="p-4 border-b text-center">Jenjang</th>
                                <th className="p-4 border-b text-center">Akreditasi</th>
                                <th className="p-4 border-b text-center">Total Siswa (2025)</th>
                                <th className="p-4 border-b text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm text-gray-700">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-gray-400">Sedang memuat data...</td>
                                </tr>
                            ) : schools.length > 0 ? (
                                schools.map((school) => (
                                    <tr key={school.id} className="hover:bg-blue-50 transition border-b last:border-0">
                                        <td className="p-4 font-mono text-slate-500">{school.npsn}</td>
                                        <td className="p-4 font-bold text-slate-800">{school.name}</td>
                                        <td className="p-4">{school.district}</td>
                                        <td className="p-4 text-center">
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${school.level === 'SD' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                                {school.level}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded font-bold">{school.accreditation}</span>
                                        </td>
                                        <td className="p-4 text-center font-bold">{school.student_2025}</td>
                                        <td className='p-4 text-center flex justify-center gap-2'>
                                            <button 
                                                onClick={() => handleEdit(school)}
                                                className='bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm shadow'>
                                                Edit
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(school.id, school.name)}
                                                className='bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm shadow'>
                                                Hapus
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-red-400">Belum ada data sekolah.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                
                {/* TAMBAH SEKOLAH */}
                {showModal && (
                    <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
                        <div className='bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 relative'>
                            <div className='flex justify-between items-center mb-4 border-b pb-2'>
                                <h3 className='text-xl font-bold text-gray-800'>Tambah Data Sekolah</h3>
                                <button onClick={() => setShowModal(false)} className='text-gray-500 hover:text-red-500 text-xl font-bold'>&times;</button>
                            </div>
                            <form onSubmit={handleSubmit} className='grid grid-cols-1 md:grid-cols-2 gap-4'>
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
                                <div className='grid grid-cols-2 gap-4'>
                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 mb-1'>Latitude</label>
                                        <input 
                                            type="text" 
                                            name="latitude" 
                                            value={newSchool.latitude || ''}
                                            onChange={handleInputChange}
                                            className='w-full border p-2 rounded focus:ring-2 focus:ring-blue-500'
                                            placeholder='Contoh: -6.7465'
                                        />
                                    </div>
                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 mb-1'>Longitude</label>
                                        <input 
                                            type="text" 
                                            name="longitude" 
                                            value={newSchool.longitude || ''}
                                            onChange={handleInputChange}
                                            className='w-full border p-2 rounded focus:ring-2 focus:ring-blue-500'
                                            placeholder='Contoh: 110.8465'
                                        />
                                    </div>
                                </div>
                                <div className='col-span-1 md:col-span-2 flex justify-end gap-3 mt-4 pt-4 boder-t'>
                                    <button type="button" onClick={() => setShowModal(false)} className='bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-6 rounded shadow'>Batal</button>
                                    <button type="submit" className='bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded shadow'>Simpan</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                <MapComponent schools={schools} className="mt-6"/>
            </main>
        </div>
    );
}