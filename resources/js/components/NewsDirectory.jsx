import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// import { Helmet } from 'react-helmet-async';

export default function NewsDirectory() {
    const [news, setNews] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

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
    }, []);

    const filteredNews = news.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            {/* <Helmet>
                <title>Kumpulan Berita - Disdikbud Kabupaten Pati</title>
                <meta name="description" content="Kumpulan berita, informasi, dan pengumuman terbaru dari Dinas Pendidikan dan Kebudayaan Kabupaten Pati." />
            </Helmet> */}

            {/* Simple Navbar */}
            <nav className="bg-white shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                        <span className="text-2xl font-black text-slate-800">←</span>
                        <span className="font-bold text-slate-800">Kembali ke Beranda</span>
                    </div>
                </div>
            </nav>

            {/* Header Area */}
            <div className="bg-slate-900 text-white py-16">
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
        </div>
    );
}