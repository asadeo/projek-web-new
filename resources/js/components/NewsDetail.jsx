import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

export default function NewsDetail() {
    const { id } = useParams();
    const [news, setNews] = useState(null);
    const [loading, setLoading] = useState(true);
    const [settings, setSettings] = useState({ siteName: 'Disdikbud Pati', siteLogo: '' });
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        window.scrollTo(0,0);

        axios.get(`/api/news/${id}`)
            .then(res => setNews(res.data.news))
            .catch(err => console.error("Gagal mengambil data berita:", err))
            .finally(() => setLoading(false));

        axios.get('/api/settings')
            .then(res => {
                if (res.data && res.data.data) {
                    setSettings(prev => ({ ...prev, ...res.data.data }));
                }
            });
    }, [id]);

    if (loading) return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-3xl mx-auto px-4 pt-32 pb-20 animate-pulse">
                <div className="h-4 bg-slate-200 rounded w-1/4 mb-8"></div>
                <div className="h-10 bg-slate-200 rounded w-3/4 mb-4"></div>
                <div className="h-10 bg-slate-200 rounded w-1/2 mb-8"></div>
                <div className="w-full h-96 bg-slate-200 rounded-2xl mb-8"></div>
                <div className="space-y-4">
                    <div className="h-4 bg-slate-200 rounded w-full"></div>
                    <div className="h-4 bg-slate-200 rounded w-full"></div>
                    <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                </div>
            </div>
        </div>
    );

    if (!news) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-500">
            <h2 className="text-2xl font-bold mb-4">Berita tidak ditemukan</h2>
            <Link to="/" className="px-6 py-2 bg-amber-500 text-white rounded-lg font-semibold hover:bg-amber-600 transition">
                Kembali ke Beranda
            </Link>
        </div>
    );

    return (
        <div className="min-h-screen bg-white font-sans selection:bg-amber-400 selection:text-slate-900">
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

            {/* Article konten */}
            <article className="max-w-3xl mx-auto px-4 pt-32 pb-24">
                <div className="flex items-center text-sm font-medium text-slate-500 mb-8 space-x-2">
                    <Link to="/" className="hover:text-amber-500 transition">Beranda</Link>
                    <Link to="/berita" className="hover:text-amber-500 transition">Berita</Link>
                    <span>/</span>
                    <span className="text-slate-800 truncate w-48 sm:w-auto">{news.title}</span>
                </div>

                {/* Article Header */}
                <header className="mb-10">
                    <div className="flex items-center gap-4 mb-6">
                        <span className="bg-amber-100 text-amber-700 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
                            Info Publik
                        </span>
                        <span className="text-slate-500 text-sm font-medium flex items-center gap-1.5">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                            {new Date(news.created_at).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </span>
                    </div>

                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 mb-6 leading-tight">
                        {news.title}
                    </h1>
                </header>

                {/* Featured Image */}
                <figure className="mb-12">
                    <img
                        src={news.image ? `/storage/${news.image}` : "https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=2070&auto=format&fit=crop"}
                        alt={news.title}
                        className="w-full rounded-2xl shadow-md object-cover max-h-125 border border-slate-100"
                    />
                </figure>

                {/* Main Content */}
                <div className="prose prose-lg prose-slate max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap selection:bg-amber-200">
                    {news.content}
                </div>

                {/* Article Footer */}
                <footer className="mt-16 pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-slate-500 font-medium">
                        Diterbitkan oleh <span className="text-slate-800 font-bold">Admin Disdikbud Pati</span>
                    </p>
                    <div className="flex gap-3">
                        <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-sm font-bold transition flex items-center gap-2">
                            Bagikan Artikel
                        </button>
                    </div>
                </footer>
            </article>
            
        </div>
    );
}