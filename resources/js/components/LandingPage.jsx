import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import MapComponent from './MapComponent';
import SchoolModal from './SchoolModal';

export default function LandingPage() {
    const [schools, setSchools] = useState([]);
    const [selectedSchool, setSelectedSchool] = useState(null);
    const navigate = useNavigate();

    const [filteredSchools, setFilteredSchools] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterLevel, setFilterLevel] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const [settings, setSettings] = useState({
        siteName: 'Dinas Pendidikan dan Kebudayaan Kabupaten Pati',
        welcomeText: 'Dinas Pendidikan dan Kebudayaan (Disdikbud) Kabupaten Pati adalah organisasi perangkat daerah yang bertanggung jawab atas Sekolah dan Guru di Kabupaten Pati, Jawa Tengah.',
        email: 'disdikbud@patikab.go.id',
        phone: '(0295) 381456',
        address: 'Jl. P. Sudirman No. 1, Pati Lor, Kec. Pati, Kabupaten Pati, Jawa Tengah 59111',
        siteLogo: ''
    })
    const [publicNews, setPublicNews] = useState([]);

    useEffect(() => {
        axios.get('/api/schools')
            .then(res => {
                const data = res.data.schools || res.data || [];
                setSchools(data)
                setFilteredSchools(data);
            })
            .catch(err => console.error("Gagal memuat data:", err));

        axios.get('/api/settings')
            .then(res => {
                if (res.data && res.data.data){
                    setSettings(prev => ({...prev, ...res.data.data}));
                }
            })
            .catch(err => console.error("Gagal memuat data:", err));
        
        axios.get('/api/news')
            .then(res => {
                if (res.data && res.data.news){
                    const published = res.data.news.filter(n => n.status === 'published');
                    setPublicNews(published);
                }
            })
            .catch(err => console.error("Gagal memuat data:", err));
    }, []);

    useEffect(() => {
        let result = schools;

        if (searchTerm) {
            result = result.filter(school =>
                school.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (filterLevel) {
            result = result.filter(school => school.level === filterLevel);
        }

        if (filterStatus) {
            result = result.filter(school => school.status === filterStatus);
        }

        setFilteredSchools(result);
    }, [searchTerm, filterLevel, filterStatus, schools]);

    const resetFilter = () => {
        setSearchTerm('');
        setFilterLevel('');
        setFilterStatus('');
    }

    const totalSchools = schools.length;
    const totalStudents = schools.reduce((sum, school) => sum + (Number(school.student_2025) || 0), 0);
    const totalTeachers = schools.reduce((sum, school) => sum + (Number(school.teachers_count) || 0), 0);

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
                                <span className="block font-bold text-slate-800 text-lg group-hover:text-amber-500 transition-colors">{settings.siteName}</span>
                                <span className="block text-xs text-slate-500 font-medium">Peta Pendidikan Daerah</span>
                            </div>
                        </Link>

                        {/* Navigasi Desktop */}
                        <div className="hidden md:flex items-center gap-8">
                            <Link to="/" className="text-sm font-bold text-amber-500 transition-colors relative">Beranda<span className="absolute -bottom-1 left-0 w-full h-0.5 bg-amber-500"></span></Link>
                            <Link to="/peta" className="text-sm font-bold text-slate-600 hover:text-amber-500 transition-colors">
                                Peta GIS
                            </Link>
                            <Link to="/sekolah" className="text-sm font-bold text-slate-600 hover:text-amber-500 transition-colors">Direktori Sekolah</Link>
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

            {/* HERO SECTION */}
            <header className="relative pt-32 pb-40 lg:pt-48 lg:pb-56 overflow-hidden">
                <div className="absolute inset-0">
                    <img 
                        src="/assets/images/banner_new.webp"
                        alt="Background Banner"
                        className="w-full h-full object-cover object-center filter brightness-50"
                        onError={(e) => {e.target.src = "https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=2070&auto=format&fit=crop"}}
                    />
                    <div className="absolute inset-0 bg-linear-to-b from-slate-900/70 via-slate-900/50 to-slate-900/90"></div>
                </div>
                <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
                    <span className="inline-block py-1 px-3 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-bold tracking-widest uppercase mb-6 backdrop-blur-sm">
                        Sistem Informasi Geografis
                    </span>
                    <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6 leading-tight">
                        Peta Persebaran Sekolah <br/> <span className="text-amber-400">Kabupaten Pati</span> 
                    </h1>
                    <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto font-light leading-relaxed">
                        {settings.welcomeText}
                    </p>
                </div>
            </header>

            {/* Status Section */}
            <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 mb-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white/90 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-white/40 transform transition hover:-translate-y-1">
                        <div className="flex items-center gap-4">
                            <div className="p-4 bg-blue-100 rounded-xl text-blue-600">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
                            </div>
                            <div>
                                <h3 className="text-4xl font-black text-slate-800">{totalSchools}</h3>
                                <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Total Sekolah</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/90 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-white/40 transform transition hover:-translate-y-1">
                        <div className="flex items-center gap-4">
                            <div className="p-4 bg-blue-100 rounded-xl text-blue-600">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
                            </div>
                            <div>
                                <h3 className="text-4xl font-black text-slate-800">{totalStudents.toLocaleString('id-ID')}</h3>
                                <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Total Siswa (2025)</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/90 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-white/40 transform transition hover:-translate-y-1">
                        <div className="flex items-center gap-4">
                            <div className="p-4 bg-blue-100 rounded-xl text-blue-600">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                            </div>
                            <div>
                                <h3 className="text-4xl font-black text-slate-800">{totalTeachers.toLocaleString('id-ID')}</h3>
                                <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">Total Guru</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* GIS SECTION */}
            <section className="py-24 bg-white relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-5 pointer-events-none">
                    <svg className="absolute -top-24 -left-24 w-96 h-96 text-slate-900" fill="currentColor" viewBox="0 0 100 100">
                        <path d="M20,50 L40,20 L80,30 L90,70 L50,90 Z" />
                    </svg>
                    <svg className="absolute bottom-10 right-10 w-64 h-64 text-amber-500" fill="currentColor" viewBox="0 0 100 100">
                        <path d="M10,40 L30,10 L70,20 L80,80 L40,90 Z" />
                    </svg>
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="bg-slate-900 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row items-center border border-slate-800">
                        <div className="p-10 md:p-16 flex-1 text-center md:text-left">
                            <span className="inline-block py-1 px-3 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-bold tracking-widest uppercase mb-4">
                                Eksplorasi Interaktif
                            </span>
                            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6 leading-tight">
                                Jelajahi Peta Pendidikan <br className="hidden md:block" />
                                <span className="text-amber-400">Kabupaten Pati</span>
                            </h2>
                            <p className="text-slate-400 text-lg mb-8 leading-relaxed max-w-xl mx-auto md:mx-0">
                                Gunakan Sistem Informasi Geografis (GIS) kami untuk mencari lokasi sekolah, melihat radius zonasi, dan mendapatkan rute tercepat secara *real-time*.
                            </p>
                            
                            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                                <button 
                                    onClick={() => navigate('/peta')}
                                    className="px-8 py-4 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold rounded-xl shadow-lg shadow-amber-500/30 transition transform hover:-translate-y-1 flex items-center justify-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path></svg>
                                    Buka Peta GIS Sekarang
                                </button>
                                <button 
                                    onClick={() => navigate('/sekolah')}
                                    className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl border border-slate-700 transition flex items-center justify-center gap-2"
                                >
                                    Lihat Direktori Sekolah
                                </button>
                            </div>
                        </div>

                        <div className="w-full md:w-5/12 h-64 md:h-auto relative bg-slate-800 shrink-0">
                            <div className="absolute inset-0 bg-linear-to-r from-slate-900 via-transparent to-transparent z-10 hidden md:block"></div>
                            <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-transparent to-transparent z-10 md:hidden"></div>
                            
                            <img 
                                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2074&auto=format&fit=crop" 
                                alt="Ilustrasi Peta GIS" 
                                className="w-full h-full object-cover opacity-80"
                            />
                            
                            {/* Pin Animasi Buatan */}
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
                                <div className="relative flex items-center justify-center">
                                    <div className="absolute w-16 h-16 bg-amber-500/30 rounded-full animate-ping"></div>
                                    <div className="absolute w-10 h-10 bg-amber-500/40 rounded-full animate-pulse"></div>
                                    <svg className="relative w-8 h-8 text-amber-500 drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"></path></svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="text-amber-500 font-bold tracking-wider uppercase text-sm">Informasi Terkini</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2">Berita & Pengumuman</h2>
                        <div className="w-20 h-1 bg-amber-400 mx-auto mt-6 rounded-full"></div>
                    </div>

                    {publicNews.length > 0 ? (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div
                                onClick={() => navigate(`/news/${publicNews[0].id}`)}
                                className="lg:col-span-2 group cursor-pointer rounded-2xl overflow-hidden shadow-lg border border-slate-100 relative h-100 md:h-125"
                            >
                                <div>
                                    <img 
                                        src={publicNews[0].image ? `/storage/${publicNews[0].image}` : "/assets/images/newspaper.png"}
                                        alt={publicNews[0].title}
                                        className="w-full h-full object-cover transition duration-700 group-hover:scale-105 group-hover:opacity-80"
                                    />
                                </div>
                                <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-slate-900/40 to-transparent opacity-90"></div>
                                <div className="absolute bottom-0 left-0 p-8">
                                    <span className="inline-block px-3 py-1 bg-amber-500 text-white text-xs font-bold rounded mb-4">SOROTAN UTAMA</span>
                                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 leading-tight group-hover:text-amber-300 transition">
                                        {publicNews[0].title}
                                    </h3>
                                    <p className="text-slate-300 line-clamp-2 md:line-clamp-3 mb-4 text-sm md:text-base">
                                        {publicNews[0].content}
                                    </p>
                                    <div className="flex items-center text-slate-400 text-sm font-medium">
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                        {new Date(publicNews[0].created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </div>
                                </div>
                            </div>

                            {/* BERITA KECIL */}
                            <div className="flex flex-col gap-6 justify-between">
                                {publicNews.slice(1,4).map((item) => (
                                    <div key={item.id} onClick={() => navigate(`/news/${item.id}`)} className="flex gap-4 p-4 bg-white rounded-2xl shadow-sm hover:shadow-md transition cursor-pointer border border-slate-200 group h-full">
                                        <div className="w-24 h-24 md:w-28 md:h-28 shrink-0 overflow-hidden rounded-xl">
                                            <img 
                                                src={item.image ? `/storage/${item.image}` : "/assets/images/newspaper.png"}
                                                alt={item.title}
                                                className="w-full h-full object-cover transition duration-500 group-hover:scale-110"
                                            />
                                        </div>
                                        <div className="flex flex-col justify-center">
                                            <h4 className="font-bold text-slate-800 line-clamp-2 group-hover:text-amber-600 transition mb-2 leading-snug">
                                                {item.title}
                                            </h4>
                                            <span className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                                                {new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ):(
                        <div className="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                            <p className="text-slate-500 font-medium">Tidak ada berita atau pengumuman tersedia.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* FOOTER */}
            <footer className="bg-slate-950 pt-20 pb-10 border-t-4 border-amber-500">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                        <div className="lg:col-span-2">
                            <div className="flex items-center gap-3 mb-6">
                                <img 
                                    src={settings.siteLogo ? `/storage/${settings.siteLogo}` : "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Lambang_Kabupaten_Pati.png/486px-Lambang_Kabupaten_Pati.png"} 
                                    alt="Logo" 
                                    className="h-10 w-auto group-hover:scale-105 transition-transform" 
                                />
                                <h3 className="text-2xl font-bold text-white">{settings.siteName}</h3>
                            </div>
                            <p className="text-slate-400 leading-relaxed max-w-md">
                                Layanan sistem informasi geografis untuk memudahkan masyarakat dalam memantau persebaran data dan fasilitas sekolah di wilayah Kabupaten Pati secara transparan dan akurat.
                            </p>
                        </div>

                        <div>
                            <h4 className="text-lg font-bold text-white mb-6">Kontak Kami</h4>
                            <ul className="space-y-4 text-slate-400">
                                <li className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                    <span>{settings.address}</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <svg className="w-5 h-5 text-amber-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                                    <span>{settings.phone}</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <svg className="w-5 h-5 text-amber-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                                    <span>{settings.email}</span>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-lg font-bold text-white mb-6">Lokasi Disdikbud</h4>
                            <div className="h-40 w-full rounded-xl overflow-hidden border border-slate-800 relative group">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15848.564124041752!2d111.01778393524171!3d-6.7526497582979275!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e70d2378cca1721%3A0x48ef28f2b722f538!2sDinas%20Pendidikan%20dan%20Kebudayaan%20Kabupaten%20Pati!5e0!3m2!1sid!2sid!4v1772088694962!5m2!1sid!2sid"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Peta Lokasi Dinas Pendidikan Pati"
                                ></iframe>
                            </div>
                        </div>
                    </div>

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

            {/* Modal Detail Sekolah */}
            {selectedSchool && (
                <SchoolModal school={selectedSchool} onClose={() => setSelectedSchool(null)} />
            )}
        </div>
    );
}