import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import MapComponent from './MapComponent';

export default function LandingPage(){
    const [schools, setSchools] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('api/public/schools')
            .then(res => {
                setSchools(res.data.schools || res.data || [])
            })
            .catch(err => console.error(err));
    }, []);


    return(
        <div className='min-h-screen bg-gray-50 flex flex-col'>
            <nav className="bg-gradient-to-b from-[#20639B] from-50% to-[#0B2235] to-100% shadow-md z-10 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
                    <div className="flex justify-between h-20 items-center"> 

                        {/* LOGO */}
                        <div className="flex items-center gap-3">
                            <img 
                                src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Lambang_Kabupaten_Pati.png/486px-Lambang_Kabupaten_Pati.png" 
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

                        {/* Tombol Login */}
                        <div className="flex items-center">
                            <button 
                                onClick={() => navigate('/login')}
                                className="bg-[#FFC107] hover:bg-[#ffcd38] text-blue-900 px-6 py-2 rounded-full font-bold text-sm transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            >
                                Login Petugas
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className='bg-blue-900 text-white py-12 px-4 text-center relative overflow-hidden'>
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                <div className="relative z-10">
                    <h1 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight">
                        Selamat Datang Di Disdikbud Kab Pati
                    </h1>
                    <p className="text-blue-200 max-w-2xl mx-auto text-lg">
                        Dinas Pendidikan dan Kebudayaan (Disdikbud) Kabupaten Pati adalah organisasi perangkat daerah yang 
                        bertanggung jawab atas Sekolah dan Guru di Kabupaten Pati, Jawa Tengah.
                    </p>
                </div>
            </div>

            {/* Peta Section */}
            <main className="flex-grow max-w-7xl mx-auto w-full p-4 md:p-8 -mt-12 relative z-0">
                <div className="bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden">
                    <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
                        {/* <h2 className="font-bold text-gray-700 text-lg">Peta Lokasi Sekolah</h2>
                        <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">
                            Total: {schools.length} Sekolah
                        </span> */}
                    </div>
                    {/* Komponen Peta */}
                    {/* <MapComponent schools={schools} /> */}
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-[#0B2235] text-white pt-16 pb-8 border-t-4 border-[#FFC107]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
                        
                        {/* Kolom 1: Identitas */}
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Lambang_Kabupaten_Pati.png/486px-Lambang_Kabupaten_Pati.png" alt="Logo" className="h-12 w-auto"/>
                                <div>
                                    <h3 className="font-bold text-lg leading-none">DINAS PENDIDIKAN</h3>
                                    <span className="text-xs text-blue-300 tracking-widest">KABUPATEN PATI</span>
                                </div>
                            </div>
                            <p className="text-gray-400 text-sm leading-relaxed mb-6">
                                Mewujudkan layanan pendidikan yang merata, berkualitas, dan berkarakter untuk seluruh masyarakat Kabupaten Pati.
                            </p>
                            <div className="flex gap-4">
                                {/* Ikon Sosmed Placeholder */}
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
                                        Jl. P. Sudirman No. 1, Pati Lor,<br/>
                                        Kec. Pati, Kabupaten Pati,<br/>
                                        Jawa Tengah 59111
                                    </span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="text-[#FFC107]">📞</span>
                                    <span>(0295) 381456</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="text-[#FFC107]">✉️</span>
                                    <span>disdik@patikab.go.id</span>
                                </li>
                            </ul>
                        </div>

                        <div className='col-span-1'>
                            <h4 className='text-[#FFC107] font-bold uppercase text-sm tracking-wider mb-6 border-b border-gray-700 pb-2 inline-block'>Lokasi Kantor</h4>
                            <div className='w-full h-40 rounded-lg overflow-hidden border border-gray-600 shadow-lg'>
                                <iframe
                                    src='https://maps.google.com/maps?width=100%25&height=600&hl=en&q=Dinas%20Pendidikan%20dan%20Kebudayaan%20Kabupaten%20Pati+(Dinas%20Pendidikan%20Pati)&t=&z=15&ie=UTF8&iwloc=B&output=embed'
                                    width="100%"
                                    height="100%"
                                    style={{border:0}}
                                    allowFullScreen=""
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrad">
                                </iframe>
                            </div>
                            <a 
                                href="https://maps.app.goo.gl/bFzg6UrhnWDuCfUU6" 
                                target="_blank" 
                                className="mt-2 text-[10px] text-blue-300 hover:text-[#FFC107] flex items-center gap-1"
                            >
                                ↗ Buka di Google Maps
                            </a>

                        </div>
                    </div>

                    {/* Copyright Bar */}
                    <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
                        <p>&copy; 2026 Dinas Pendidikan dan Kebudayaan Kabupaten Pati. Hak Cipta Dilindungi.</p>
                    </div>
                </div>
            </footer>
        </div>

    );
}