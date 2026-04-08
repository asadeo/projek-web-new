import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
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

    const totalSiswa = filteredSchools.reduce((total, school) => {
        return total + (Number(school.student_2025) || 0);   
    }, 0);

    return (
        <div className='min-h-screen bg-gray-50 flex flex-col'>
            <nav className="bg-linear-to-b from-[#20639B] from-50% to-[#0B2235] to-100% shadow-md z-10 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
                    <div className="flex justify-between h-20 items-center">

                        {/* LOGO */}
                        <div className="flex items-center gap-3">
                            <img
                                src={settings.siteLogo ? `/storage/${settings.siteLogo}` : "/assets/images/logoDisdikbud.png"}
                                alt="Logo"
                                className="h-12 w-auto drop-shadow-md"
                            />
                            <div className="flex flex-col">
                                <span className="font-bold text-white text-xl leading-tight drop-shadow-sm">DINAS PENDIDIKAN</span>
                                <span className="text-xs text-blue-100 font-semibold tracking-wider">KABUPATEN PATI</span>
                            </div>
                        </div>

                        {/* Menu Links */}
                        <div className='md:flex items-center gap-6'>
                            <a href='#' className='block px-2 py-2.5 rounded-lg text-white font-medium hover:bg-[#FFC107] transition duration-300'>Beranda</a>
                            <a href='#' className='block px-2 py-2.5 rounded-lg text-white font-medium hover:bg-[#FFC107] transition duration-300'>Peta Sebaran</a>
                            <a href='#' className='block px-2 py-2.5 rounded-lg text-white font-medium hover:bg-[#FFC107] transition duration-300'>Data Sekolah</a>
                            <a href='#' className='block px-2 py-2.5 rounded-lg text-white font-medium hover:bg-[#FFC107] transition duration-300'>Berita</a>
                            <a href='#' className='block px-2 py-2.5 rounded-lg text-white font-medium hover:bg-[#FFC107] transition duration-300'>Kontak</a>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className='relative pt-20 pb-32 px-4 text-center overflow-visible'>
                <div className="absolute inset-0 z-0" style={{ backgroundImage: "url('/assets/images/logoDisdikbud.png')", backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat", opacity: "0.5"}} ></div>
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                <div className="relative z-10 max-w-4xl mx-auto">
                    <h1 className="text-white text-3xl md:text-5xl font-bold mb-4 tracking-tight leading-tight">
                        {settings.siteName}
                    </h1>
                    <p className="text-white max-w-2xl mx-auto text-sm md:text-base px-4">
                        {settings.welcomeText}
                    </p>
                </div>
            </div>

            {/* Statistics Cards - Overlapping Hero */}
            <div className="relative z-20 max-w-5xl mx-auto px-4 -mt-16 mb-20">
                <div className='grid grid-cols-1 md:grid-cols-3 gap-10'>
                    {/* Card 1: Sekolah */}
                    <div className="bg-white rounded-xl shadow-xl p-6 flex flex-col items-center justify-center border border-gray-100 w-50">
                        <div className="bg-yellow-100 p-3 rounded-full mb-3 text-[#FFC107]">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        </div>
                        <span className="font-bold text-gray-800 text-lg">Sekolah</span>
                        <span className="text-[#F59E0B] font-bold text-xl">{schools.length}</span>
                    </div>

                    {/* Card 2: Siswa */}
                    <div className="bg-white rounded-xl shadow-xl p-6 flex flex-col items-center justify-center border border-gray-100">
                        <div className="bg-yellow-100 p-3 rounded-full mb-3 text-[#FFC107]">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </div>
                        <span className="font-bold text-gray-800 text-lg">Siswa (Estimasi)</span>
                        <span className="text-[#F59E0B] font-bold text-xl">{totalSiswa.toLocaleString('id-ID')}</span>
                    </div>

                    {/* Card 3: Guru */}
                    <div className="bg-white rounded-xl shadow-xl p-6 flex flex-col items-center justify-center border border-gray-100">
                        <div className="bg-yellow-100 p-3 rounded-full mb-3 text-[#FFC107]">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <span className="font-bold text-gray-800 text-lg">Guru</span>
                        <span className="text-[#F59E0B] font-bold text-xl">pending</span>
                    </div>
                </div>
            </div>

            {/* Services Section */}
            <div className="bg-gray-50 py-16 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Layanan Disdikbud Kabupaten Pati</h2>
                    <div className="w-24 h-1 bg-[#FFC107] mx-auto mb-4 rounded-full"></div>
                    <p className="text-gray-500 mb-12 max-w-2xl mx-auto">
                        Jenis Layanan di Disdikbud Kabupaten Pati
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {/* Service Card 1 */}
                        <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 flex flex-col items-center group">
                            <div className="bg-blue-50 text-blue-600 p-4 rounded-full mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <h3 className="font-bold text-gray-800 mb-3 text-sm uppercase tracking-wider">PENDIDIKAN MASYARAKAT</h3>
                            <p className="text-gray-500 text-xs leading-relaxed">
                                Layanan informasi seputar pendidikan masyarakat dan kesetaraan.
                            </p>
                        </div>

                        {/* Service Card 2 */}
                        <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 flex flex-col items-center group">
                            <div className="bg-blue-50 text-blue-600 p-4 rounded-full mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <h3 className="font-bold text-gray-800 mb-3 text-sm uppercase tracking-wider">DATA SISWA</h3>
                            <p className="text-gray-500 text-xs leading-relaxed">
                                Informasi dan pengelolaan data siswa di Kabupaten Pati.
                            </p>
                        </div>

                        {/* Service Card 3 */}
                        <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 flex flex-col items-center group">
                            <div className="bg-blue-50 text-blue-600 p-4 rounded-full mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3 className="font-bold text-gray-800 mb-3 text-sm uppercase tracking-wider">APLIKASI DATA</h3>
                            <p className="text-gray-500 text-xs leading-relaxed">
                                Akses berbagai aplikasi pendukung data pendidikan.
                            </p>
                        </div>

                        {/* Service Card 4 */}
                        <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 flex flex-col items-center group">
                            <div className="bg-blue-50 text-blue-600 p-4 rounded-full mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                </svg>
                            </div>
                            <h3 className="font-bold text-gray-800 mb-3 text-sm uppercase tracking-wider">JENIS LAYANAN LAIN</h3>
                            <p className="text-gray-500 text-xs leading-relaxed">
                                Layanan administrasi dan kepegawaian lainnya.
                            </p>
                        </div>
                    </div>

                    {/* Pagination Dots (Visual Only) */}
                    <div className="flex justify-center gap-2 mt-10">
                        <span className="w-8 h-2 bg-[#FFC107] rounded-full"></span>
                        <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
                        <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
                    </div>
                </div>
            </div>

            {/* Agenda Section */}
            <div className="bg-white py-16 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center gap-4 mb-8">
                        <h2 className="text-3xl font-bold text-gray-800">Agenda</h2>
                        <span className="bg-[#FFC107] text-white px-3 py-1 rounded text-xs font-bold uppercase tracking-wider">Upcoming</span>
                    </div>

                    <div className="flex flex-col md:flex-row gap-8 border border-gray-100 rounded-xl p-6 shadow-sm">
                        {/* Calendar Widget (Left) */}
                        <div className="md:w-1/3">
                            <div className="bg-white p-4 rounded-lg border border-gray-200">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="font-bold text-gray-700">May 2026</span>
                                    <div className="flex gap-2">
                                        <button className="text-gray-400 hover:text-blue-600">&lt;</button>
                                        <button className="text-gray-400 hover:text-blue-600">&gt;</button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-7 gap-1 text-center text-sm mb-2 text-gray-400 font-medium">
                                    <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
                                </div>
                                <div className="grid grid-cols-7 gap-1 text-center text-sm">
                                    {/* Empty cells for previous month */}
                                    <span className="p-2"></span><span className="p-2"></span><span className="p-2"></span><span className="p-2">1</span><span className="p-2">2</span>

                                    {/* Days */}
                                    {[...Array(31)].map((_, i) => (
                                        <span key={i} className={`p-2 rounded-full cursor-pointer hover:bg-blue-50 hover:text-blue-600 transition ${i + 3 === 12 ? 'bg-[#FFC107] text-white font-bold' : 'text-gray-700'}`}>
                                            {i + 3}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Event Details (Right) */}
                        <div className="md:w-2/3 flex flex-col items-center justify-center text-center p-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                            <p className="text-gray-500 mb-4 font-medium">Tidak ada kegiatan pada tanggal ini.</p>
                            <svg className="w-32 h-32 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* News (Berita) Section */}
            <div className="bg-gray-50 py-16 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-800">Berita DikBud Kabupaten Pati</h2>
                        <a href="#" className="text-blue-600 hover:text-blue-800 font-medium px-4 py-2 border border-blue-600 rounded-lg hover:bg-blue-50 transition">
                            Selengkapnya &rarr;
                        </a>
                    </div>
                    
                    {publicNews.length > 0 ? (
                        <div className="flex flex-col md:flex-row gap-8">
                        {/* Featured News (Left, Large) */}
                        <div onClick={() => navigate(`/news/${publicNews[0].id}`)} className="md:w-1/2 group cursor-pointer">
                            <div className="relative h-64 md:h-80 rounded-xl overflow-hidden mb-4 shadow-lg">
                                <img
                                    src={publicNews[0].image ? `/storage/${publicNews[0].image}` : "https://plus.unsplash.com/premium_photo-1661962692047-92900e3182b2?q=80&w=2070&auto=format&fit=crop"}
                                    alt={publicNews[0].title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                />
                                <div className="absolute top-4 left-4 bg-[#FFC107] text-black text-xs font-bold px-3 py-1 rounded">
                                    TERBARU
                                </div>
                            </div>
                            <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2 group-hover:text-blue-700 transition">
                                {publicNews[0].title || 'Judul Berita'}
                            </h3>
                            <p className="text-gray-500 text-sm mb-2 line-clamp-2">
                                {publicNews[0].content}
                            </p>
                            <span className="text-gray-400 text-xs">{new Date(publicNews[0].created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </div>

                        {/* Recent News List (Right) */}
                        <div className="md:w-1/2 flex flex-col gap-4">
                            {publicNews.slice(1,4).map((item) => (
                                <div key={item.id} onClick={() => navigate(`/news/${item.id}`)} className="flex gap-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition cursor-pointer border border-gray-100 group">
                                    <div className="w-24 h-24 shrink-0 rounded-lg overflow-hidden">
                                        <img
                                            src={item.image ? `/storage/${item.image}` : "https://images.unsplash.com/photo-1577896335477-1636d919864?q=80&w=200&auto=format&fit=crop"}
                                            alt={item.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                                        />
                                    </div>
                                    <div className="flex flex-col justify-center">
                                        <h4 className="font-bold text-gray-800 mb-1 group-hover:text-blue-700 transition line-clamp-2">
                                            {item.title}
                                        </h4>
                                        <span className="text-gray-400 text-xs mt-1">{new Date(publicNews[0].created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    ) : (
                        <div className="w-full text-center py-12 bg-white rounded-xl border border-gray-200">
                            <p className="text-gray-500">Belum ada berita yang diterbitkan saat ini.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Map Section */}
            <main className="w-full relative z-0">
                <div className="w-full">
                    {/* Header Peta */}
                    <div className="max-w-7xl mx-auto px-4 py-8 text-center">
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">Persebaran Sekolah Kabupaten Pati</h2>
                        <div className="w-24 h-1 bg-[#FFC107] mx-auto mb-4 rounded-full"></div>
                    </div>

                    <div className='max-w-4xl mx-auto px-4 mb-8'>
                        <div className='bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4'>
                            <div className='flex-grow'>
                                <label className='block text-xs font-bold text-gray-500 mb-1'>Cari Sekolah</label>
                                <div className='relative'>
                                    <span className='absolute left-3 top-2.5 text-gray-400'>
                                        <svg xmlns='http://www.w3.org/2000/svg' className='h-5 w-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'/>
                                        </svg>
                                    </span>
                                    <input 
                                        type='text'
                                        placeholder='Nama sekolah...'
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className='w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FFC107] focus:border-transparent text-gray-700'
                                    />
                                </div>
                            </div>
                            <div className='w-full md:w-48'>
                                <label className='block text-xs font-bold text-gray-500 mb-1 uppercase'>Jenjang</label>
                                <select
                                    value={filterLevel}
                                    onChange={(e) => setFilterLevel(e.target.value)}
                                    className='w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FFC107] focus:border-transparent text-gray-700 bg-white' 
                                >
                                    <option value="">Semua Jenjang</option>
                                    <option value="">Semua Jenjang</option>
                                    <option value="SD">SD</option>
                                    <option value="SMP">SMP</option>
                                </select>
                            </div>
                            <div className='w-full md:w-48'>
                                <label className='block text-xs font-bold text-gray-500 mb-1 uppercase'>Status</label>
                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className='w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FFC107] focus:border-transparent text-gray-700 bg-white' 
                                >
                                    <option value="">Semua Status</option>
                                    <option value="Negeri">Negeri</option>
                                    <option value="Swasta">Swasta</option>
                                </select>
                            </div>

                            <div className='flex items-end'>
                                <button
                                    onClick={resetFilter}
                                    className='px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-md font-medium transtition flex items-center gap-2'
                                >
                                    <svg xmlns='http://www.w' className='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                        <path strokeLinecap='' strokeLinejoin='' strokeWidth={2} d=''/>
                                    </svg>
                                    Reset
                                </button>
                            </div>
                        </div>

                        {(searchTerm || filterLevel || filterStatus) && (
                            <div className=''>
                                <span className=''>
                                    Ditemukan: {filteredSchools.length} Sekolah
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Komponen Peta */}
                    <div className="w-full h-[500px] relative z-0 p-4 mb-10">
                        <MapComponent 
                            schools={filteredSchools} 
                            onSelectSchool={(schools) => setSelectedSchool(schools)}    
                        />
                    </div>
                </div>
            </main>

            {selectedSchool && (
                <SchoolModal
                    school={selectedSchool}
                    onClose={() => setSelectedSchool(null)}
                />
            )}

            {/* Footer */}
            <footer className="bg-[#0B2235] text-white pt-16 pb-8 border-t-4 border-[#FFC107]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">

                        {/* Kolom 1: Identitas */}
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <img 
                                    src={settings.siteLogo ? `/storage/${settings.siteLogo}` : "/assets/images/logoDisdikbud.png"}
                                    alt="Logo"
                                    className="h-12 w-auto" />
                                <div>
                                    <h3 className="font-bold text-lg leading-none">DINAS PENDIDIKAN</h3>
                                    <span className="text-xs text-blue-300 tracking-widest">KABUPATEN PATI</span>
                                </div>
                            </div>
                            <p className="text-gray-400 text-sm leading-relaxed mb-6">
                                Mewujudkan layanan pendidikan yang merata, berkualitas, dan berkarakter untuk seluruh masyarakat Kabupaten Pati.
                            </p>
                            <div className="flex gap-4">
                                <a href="#" className="w-8 h-8 rounded bg-blue-900 flex items-center justify-center hover:bg-[#FFC107] hover:text-[#0B2235] transition">FB</a>
                                <a href="#" className="w-8 h-8 rounded bg-blue-900 flex items-center justify-center hover:bg-[#FFC107] hover:text-[#0B2235] transition">IG</a>
                                <a href="#" className="w-8 h-8 rounded bg-blue-900 flex items-center justify-center hover:bg-[#FFC107] hover:text-[#0B2235] transition">YT</a>
                            </div>
                        </div>

                        {/* Kolom 2: Tautan Cepat */}
                        <div>
                            <h4 className="text-[#FFC107] font-bold uppercase tracking-wider mb-6 border-b border-gray-700 pb-2 inline-block">Tautan Cepat</h4>
                            <ul className="space-y-3 text-sm text-gray-300">
                                <li><a href="#" className="hover:text-[#FFC107] transition flex items-center gap-2">› Profil Dinas</a></li>
                                <li><a href="#" className="hover:text-[#FFC107] transition flex items-center gap-2">› Data Sekolah</a></li>
                                <li><a href="#" className="hover:text-[#FFC107] transition flex items-center gap-2">› Unduhan Dokumen</a></li>
                                <li><a href="#" className="hover:text-[#FFC107] transition flex items-center gap-2">› PPDB Online</a></li>
                                <li><a href="#" className="hover:text-[#FFC107] transition flex items-center gap-2">› Pengaduan Masyarakat</a></li>
                            </ul>
                        </div>

                        {/* Kolom 3: Kontak */}
                        <div>
                            <h4 className="text-[#FFC107] font-bold uppercase tracking-wider mb-6 border-b border-gray-700 pb-2 inline-block">Hubungi Kami</h4>
                            <ul className="space-y-4 text-sm text-gray-300">
                                <li className="flex items-start gap-3">
                                    <span className="mt-1 text-[#FFC107]">📍</span>
                                    <span>
                                        {settings.address}
                                    </span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="text-[#FFC107]">📞</span>
                                    <span>{settings.phone}</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="text-[#FFC107]">✉️</span>
                                    <span>{settings.email}</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className='col-span-1'>
                        <h4 className='text-[#FFC107] font-bold uppercase text-sm tracking-wider mb-6 border-b border-gray-700 pb-2 inline-block'>Lokasi Kantor</h4>
                        <div className='w-full h-40 rounded-lg overflow-hidden border border-gray-600 shadow-lg'>
                            <iframe
                                src='https://maps.google.com/maps?width=100%25&height=600&hl=en&q=Dinas%20Pendidikan%20dan%20Kebudayaan%20Kabupaten%20Pati+(Dinas%20Pendidikan%20Pati)&t=&z=15&ie=UTF8&iwloc=B&output=embed'
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrad">
                            </iframe>
                            <a
                                href="https://maps.app.goo.gl/bFzg6UrhnWDuCfUU6"
                                target="_blank"
                                className="mt-2 text-[10px] text-blue-300 hover:text-[#FFC107] flex items-center gap-1"
                            >
                                ↗ Buka di Google Maps
                            </a>
                        </div>
                        {/* Copyright Bar */}
                        <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
                            <p>&copy; 2026 {settings.siteName}. Hak Cipta Dilindungi.</p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}