import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function NewsDirectory() {
    const [news, setNews] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
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
        axios.get('/api/news')
            .then(res => {
                const data = res.data.news || res.data || [];
                const published = data.filter(n => n.status === 'published');
                setNews(published);
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

    const filteredNews = news.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                            <Link to="/sekolah" className="text-sm font-bold text-slate-600 hover:text-amber-500 transition-colors">Direktori Sekolah</Link>
                            <Link to="/berita" className="text-sm font-bold text-amber-500 transition-colors relative">Berita <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-amber-500"></span></Link>
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

            {/* Header Area */}
            <div className="bg-slate-900 text-white py-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-3xl md:text-5xl font-bold mb-4">Portal <span className="text-amber-400">Berita</span></h1>
                    <p className="text-slate-300 max-w-2xl mx-auto text-lg">
                        Informasi terkini, pengumuman, dan kegiatan seputar dunia pendidikan di Kabupaten Pati.
                    </p>
                </div>
            </div>

            {/* Search Bar */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
                <div className="bg-white rounded-xl shadow-lg p-4 border border-slate-100">
                    <input 
                        type="text" 
                        placeholder="Cari judul berita..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-400 outline-none"
                    />
                </div>
            </div>

            {/* News Grid List */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {loading ? (
                    <div className="text-center py-20 text-slate-500 font-medium animate-pulse">Memuat berita...</div>
                ) : filteredNews.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredNews.map((item) => (
                            <div 
                                key={item.id} 
                                onClick={() => navigate(`/news/${item.id}`)}
                                className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer group flex flex-col h-full"
                            >
                                <div className="h-56 bg-slate-200 overflow-hidden relative">
                                    <img 
                                        src={item.image ? `/storage/${item.image}` : "/assets/images/newspaper.png"} 
                                        alt={item.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                                    />
                                    <div className="absolute top-4 left-4">
                                        <span className="bg-amber-500 text-white text-xs font-bold px-3 py-1.5 rounded shadow-md">
                                            Info Publik
                                        </span>
                                    </div>
                                </div>
                                <div className="p-6 flex flex-col grow">
                                    <span className="text-xs text-slate-400 font-medium mb-3 flex items-center">
                                        📅 {new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </span>
                                    <h3 className="text-xl font-bold text-slate-800 mb-3 line-clamp-2 group-hover:text-amber-600 transition">
                                        {item.title}
                                    </h3>
                                    <p className="text-slate-500 text-sm line-clamp-3 mb-4">
                                        {item.content}
                                    </p>
                                    <div className="mt-auto pt-4 border-t border-slate-100">
                                        <span className="text-amber-600 text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                                            Baca Selengkapnya <span className="text-lg">→</span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
                        <p className="text-slate-500 font-medium">Tidak ada berita yang ditemukan.</p>
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