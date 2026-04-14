import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function SchoolDirectory() {
    const [schools, setSchools] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterLevel, setFilterLevel] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
        axios.get('/api/schools')
            .then(res => {
                const data = res.data.schools || res.data || [];
                setSchools(data);
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    const filteredSchools = schools.filter(school => {
        const matchName = school.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchLevel = filterLevel === '' || school.level === filterLevel;
        return matchName && matchLevel;
    })

    return (
        <div>

            {/* Navbar */}
            <nav className="bg-white shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                        <span className="text-2xl font-black text-slate-800">←</span>
                        <span className="font-bold text-slate-800">Kembali ke Beranda</span>
                    </div>
                </div>
            </nav>

            {/* Header */}
            <div className="bg-slate-900 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-3xl md:text-5xl font-bold mb-4">Direktori <span className="text-amber-400">Pendidikan</span></h1>
                    <p className="text-slate-300 max-w-2xl mx-auto text-lg">
                        Jelajahi daftar lengkap sekolah di wilayah Kabupaten Pati. Gunakan fitur pencarian untuk menemukan sekolah dengan cepat.
                    </p>
                </div>
            </div>

            {/* Search Bar & Filters */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
                <div className="bg-white rounded-xl shadow-lg p-4 flex flex-col md:flex-row gap-4 border border-slate-100">
                    <input
                        type="text"
                        placeholder="Cari nama sekolah..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-400 outline-none"
                    />
                    <select
                        value={filterLevel}
                        onChange={(e) => setFilterLevel(e.target.value)}
                        className="md:w-48 px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-400 outline-none font-medium text-slate-700"
                    >
                        <option value="">Semua Jenjang</option>
                        <option value="SD">Sekolah Dasar (SD)</option>
                        <option value="SMP">Sekolah Menengah Pertama (SMP)</option>
                    </select>
                </div>
            </div>

            {/* School List */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {loading ? (
                    <div className="text-center py-20 text-slate-500 font-medium animate-pulse">Memuat data sekolah...</div>
                ) : filteredSchools.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredSchools.map((school) => (
                            <div key={school.id} className="bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition overflow-hidden group">
                                <div className="h-48 bg-slate-200 overflow-hidden relative">
                                    <img 
                                        src={school.photo ? `/storage/${school.photo}` : "https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=800&auto=format&fit=crop"}
                                        alt={school.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                    />
                                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur text-slate-800 text-xs font-bold px-2 py-1 rounded shadow-sm">
                                        Akreditasi {school.accreditation || '-'}
                                    </div>
                                </div>
                                <div className="p-5">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase ${school.level === 'SD' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                                            {school.level || '-'}
                                        </span>
                                        <span className="text-[10px] font-bold px-2 py-1 rounded uppercase bg-slate-100 text-slate-700">
                                            {school.status || '-'}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-800 mb-1 line-clamp-1">{school.name}</h3>
                                    <p className="text-slate-500 text-sm mb-4 line-clamp-1 flex items-center gap-1">
                                        📍 {school.address}
                                    </p>
                                    <div className="grid grid-cols-2 gap-2 border-t border-slate-50 pt-4 text-center">
                                        <div className="bg-slate-50 rounded-lg py-2">
                                            <span className="block text-xl font-black text-slate-700">{school.student_2025 || 0}</span>
                                            <span className="text-[10px] text-slate-500 uppercase font-semibold">Siswa</span>
                                        </div>
                                        <div className="bg-slate-50 rounded-lg py-2">
                                            <span className="block text-xl font-black text-slate-700">{school.teachers_count || 0}</span>
                                            <span className="text-[10px] text-slate-500 uppercase font-semibold">Guru</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 text-slate-500 font-medium">Tidak ada sekolah yang cocok dengan pencarianmu.</div>
                )}
            </div>
        </div>
    );
}

