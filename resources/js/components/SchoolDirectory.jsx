import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function SchoolDirectory() {
    const [schools, setSchools] = useState([]);
    const [filteredSchools, setFilteredSchools] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterLevel, setFilterLevel] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

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

    useEffect(() => {
        let result = schools;
        if (searchTerm) result = result.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));
        if (filterLevel) result = result.filter(s => s.level === filterLevel);
        if (filterStatus) result = result.filter(s => s.status === filterStatus);
        
        setFilteredSchools(result);
        setCurrentPage(1);
    }, [searchTerm, filterLevel, filterStatus, schools]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredSchools.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredSchools.length / itemsPerPage);

    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-amber-400 selection:text-slate-900">
            {/* NAVBAR */}
            <nav className="sticky top-0 w-full bg-white/90 backdrop-blur-md shadow-sm z-50 border-b border-slate-100 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-3 group">
                            <img 
                                src={settings.siteLogo ? `/storage/${settings.siteLogo}` : "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Lambang_Kabupaten_Pati.png/486px-Lambang_Kabupaten_Pati.png"} 
                                alt="Logo" 
                                className="h-10 w-auto group-hover:scale-105 transition-transform" 
                            />
                            <div className="hidden sm:block leading-tight">
                                <span className="block font-bold text-slate-800 text-lg group-hover:text-amber-500 transition-colors">Disdikbud Pati</span>
                                <span className="block text-xs text-slate-500 font-medium">Peta Pendidikan Daerah</span>
                            </div>
                        </Link>

                        {/* Navigasi Desktop */}
                        <div className="hidden md:flex items-center gap-8">
                            <Link to="/" className="text-sm font-bold text-slate-600 hover:text-amber-500 transition-colors">Beranda</Link>
                            <Link to="/peta" className="text-sm font-bold text-slate-600 hover:text-amber-500 transition-colors">
                                Peta GIS
                            </Link>
                            <Link to="/sekolah" className="text-sm font-bold text-amber-500 transition-colors relative">Direktori Sekolah<span className="absolute -bottom-1 left-0 w-full h-0.5 bg-amber-500"></span></Link>
                            <Link to="/berita" className="text-sm font-bold text-slate-600 hover:text-amber-500 transition-colors">Berita</Link>
                        </div>

                        {/* Mobile Toggle */}
                        <div className="md:hidden">
                            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 rounded-lg text-slate-600">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    {isMobileMenuOpen ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    )}
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden bg-white border-t border-slate-100 shadow-xl absolute w-full z-50">
                        <div className="flex flex-col px-6 py-4 gap-4 font-bold text-slate-700">
                            <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>Beranda</Link>
                            <Link to="/peta" onClick={() => setIsMobileMenuOpen(false)} className="text-amber-500">Peta GIS</Link>
                            <Link to="/sekolah" onClick={() => setIsMobileMenuOpen(false)}>Direktori</Link>
                            <Link to="/berita" onClick={() => setIsMobileMenuOpen(false)}>Berita</Link>
                        </div>
                    </div>
                )}
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
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4">
                    <input type="text" placeholder="Cari nama sekolah..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="flex-1 px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-400 outline-none bg-slate-50" />
                    <select value={filterLevel} onChange={(e) => setFilterLevel(e.target.value)} className="px-4 py-3 border border-slate-200 rounded-xl outline-none bg-slate-50">
                        <option value="">Semua Jenjang</option>
                        <option value="SD">SD</option>
                        <option value="SMP">SMP</option>
                    </select>
                    <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-4 py-3 border border-slate-200 rounded-xl outline-none bg-slate-50">
                        <option value="">Semua Status</option>
                        <option value="Negeri">Negeri</option>
                        <option value="Swasta">Swasta</option>
                    </select>
                </div>
            </div>

            {/* School List */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {loading ? (
                    <div className="text-center py-20 text-slate-500 font-medium animate-pulse">Memuat data sekolah...</div>
                ) : currentItems.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-10">
                            {currentItems.map(school => (
                                <div key={school.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition group">
                                    <div className="h-40 overflow-hidden bg-slate-100">
                                        <img src={school.photo ? `/storage/${school.photo}` : "/assets/images/school.png"} alt={school.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                                    </div>
                                    <div className="p-5">
                                        <div className="flex gap-2 mb-3">
                                            <span className="text-xs font-bold px-2 py-1 bg-amber-100 text-amber-700 rounded">{school.level}</span>
                                            <span className="text-xs font-bold px-2 py-1 bg-blue-100 text-blue-700 rounded">{school.status}</span>
                                        </div>
                                        <h3 className="font-bold text-slate-800 text-lg mb-1 truncate" title={school.name}>{school.name}</h3>
                                        <p className="text-sm text-slate-500 truncate mb-4">{school.district}</p>
                                        <button onClick={() => navigate('/peta', { state: {targetSchool: school }})} className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-sm font-semibold rounded-lg border border-slate-200 transition">
                                            Lihat di Peta
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination UI */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-4">
                                <button 
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 rounded-lg font-semibold border border-slate-200 text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                >
                                    Sebelumnya
                                </button>
                                <span className="text-sm font-medium text-slate-600">
                                    Halaman <span className="font-bold text-slate-900">{currentPage}</span> dari {totalPages}
                                </span>
                                <button 
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 rounded-lg font-semibold border border-slate-200 text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                >
                                    Selanjutnya
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-20 text-slate-500 font-medium bg-white rounded-2xl border border-dashed border-slate-300">
                        Tidak ada sekolah yang sesuai dengan pencarian.
                    </div>
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

