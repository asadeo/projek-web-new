import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function SchoolDirectory() {
    const [schools, setSchools] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterLevel, setFilterLevel] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const [settings, setSettings] = useState({
        siteName: 'Dinas Pendidikan dan Kebudayaan Kabupaten Pati',
        welcomeText: 'Dinas Pendidikan dan Kebudayaan (Disdikbud) Kabupaten Pati adalah organisasi perangkat daerah yang bertanggung jawab atas Sekolah dan Guru di Kabupaten Pati, Jawa Tengah.',
        email: 'disdikbud@patikab.go.id',
        phone: '(0295) 381456',
        address: 'Jl. P. Sudirman No. 1, Pati Lor, Kec. Pati, Kabupaten Pati, Jawa Tengah 59111',
        siteLogo: ''
    })

    useEffect(() => {
        window.scrollTo(0, 0);
        axios.get('/api/schools')
            .then(res => {
                const data = res.data.schools || res.data || [];
                setSchools(data);
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));

        axios.get('/api/settings')
            .then(res => {
                if (res.data && res.data.data){
                    setSettings(prev => ({...prev, ...res.data.data}));
                }
            })
            .catch(err => console.error("Gagal memuat data:", err));
    }, []);

    const filteredSchools = schools.filter(school => {
        const matchName = school.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchLevel = filterLevel === '' || school.level === filterLevel;
        return matchName && matchLevel;
    })

    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-amber-400 selection:text-slate-900">
            {/* NAVBAR */}
            <nav className="fixed w-full bg-white/90 backdrop-blur-md shadow-sm z-50 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <Link to="/" className="flex items-center gap-3 group cursor-pointer">
                            <img
                                src={settings.siteLogo ? `/storage/${settings.siteLogo}` : "/assets/images/logoDisdikbud.png"}
                                alt="Logo Disdikbud Pati"
                                className="h-10 w-auto drop-shadow-md group-hover:scale-105 transition-transform"
                            />
                            <div className="hidden md:block leading-tight">
                                <span className="block font-bold text-lg text-slate-800 group-hover:text-amber-500 transition-colors">Disdikbud Pati</span>
                                <span className="block font-medium text-xs text-slate-500">Peta Pendidikan Daerah</span>
                            </div>
                        </Link>
                        <div className="hidden md:flex items-center gap-10">
                            <Link to="/" className="text-sm font-bold text-slate-600 hover:text-amber-500 transition-colors">
                                Beranda
                            </Link>
                            <Link to="/sekolah" className="text-sm font-bold text-slate-600 hover:text-amber-500 transition-colors">
                                Direktori Sekolah
                            </Link>
                            <Link to="/berita" className="text-sm font-bold text-slate-600 hover:text-amber-500 transition-colors">
                                Berita
                            </Link>
                        </div>

                        {/* Mobile Toggle */}
                        <div className="md:hidden flex items-center">
                            <button 
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                aria-label="Toggle Menu"
                                className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-none transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    {isMobileMenuOpen ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> 
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /> 
                                    )}
                                </svg>
                            </button>
                        </div>

                        <div className={`md:hidden absolute w-full bg-white border-t border-slate-100 shadow-xl transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'opacity-100 visible top-20' : 'opacity-0 invisible -top-10 pointer-events-none'}`}>
                            <div className="flex flex-col px-6 py-4 gap-2">
                                <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="font-bold text-slate-700 hover:text-amber-500 border-b border-slate-50 pb-2">
                                    Beranda
                                </Link>
                                <Link to="/sekolah" onClick={() => setIsMobileMenuOpen(false)} className="font-bold text-slate-700 hover:text-amber-500 border-b border-slate-50 pb-2">
                                    Direktori Sekolah
                                </Link>
                                <Link to="/berita" onClick={() => setIsMobileMenuOpen(false)} className="font-bold text-slate-700 hover:text-amber-500 border-b border-slate-50 pb-2">
                                    Portal Berita
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Header */}
            <div className="bg-slate-900 text-white py-32">
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

            {/* FOOTER */}
            <footer className="bg-slate-950 pb-10 border-t-4 border-amber-500">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="border-t border-slate-800 pt-8 text-center md:flex justify-between items-center">
                        <p className="text-sm text-slate-500 mb-4 md:mb-0">
                            © {new Date().getFullYear()} {settings.siteName}. Hak Cipta Dilindungi.
                        </p>
                        <div className="flex justify-center gap-4 text-slate-500 text-sm font-medium">
                            <span>Sistem Informasi Geografis v1.0</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

