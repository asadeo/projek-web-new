import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import MapComponent from "./MapComponent";
import SchoolModal from "./SchoolModal";

export default function MapPage() {
    const [schools, setSchools] = useState([]);
    const [filteredSchools, setFilteredSchools] = useState([]);
    const [selectedSchool, setSelectedSchool] = useState(null);
    const location = useLocation();
    const targetSchool = location.state?.targetSchool || null;

    const [searchTerm, setSearchTerm] = useState('');
    const [filterLevel, setFilterLevel] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const [settings, setSettings] = useState({
        siteName: 'Dinas Pendidikan dan Kebudayaan Kabupaten Pati',
        welcomeText: '',
        email: '',
        phone: '',
        address: '',
        siteLogo: ''
    });

    useEffect(() => {
        axios.get('/api/schools')
            .then(res => {
                const data = res.data.schools || res.data || [];
                setSchools(data);
                setFilteredSchools(data);
            })
            .catch(err => console.error(err));

        axios.get('/api/settings')
            .then(res => {
                if (res.data && res.data.data) {
                    setSettings(prev => ({ ...prev, ...res.data.data }));
                }
            });
    }, []);

    useEffect(() => {
        let result = schools;
        if (searchTerm) {
            result = result.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));
        }
        if (filterLevel) {
            result = result.filter(s => s.level === filterLevel);
        }
        if (filterStatus) {
            result = result.filter(s => s.status === filterStatus);
        }
        setFilteredSchools(result);
    }, [searchTerm, filterLevel, filterStatus, schools]);

    const resetFilter = () => {
        setSearchTerm('');
        setFilterLevel('');
        setFilterStatus('');
    };

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
                            <Link to="/peta" className="text-sm font-bold text-amber-500 transition-colors relative">
                                Peta GIS
                                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-amber-500"></span>
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

            {/* Filter Bar */}
            <div className="bg-slate-50 border-b border-slate-200 p-3 z-40 shrink-0">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-3">
                    <input
                        type="text"
                        placeholder="Cari sekolah..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-1 px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-400"
                    />
                    <select value={filterLevel} onChange={(e) => setFilterLevel(e.target.value)} className="px-4 py-2 border border-slate-200 rounded-lg outline-none">
                        <option value="">Semua Jenjang</option>
                        <option value="SD">SD</option>
                        <option value="SMP">SMP</option>
                    </select>
                    <button onClick={resetFilter} className="px-4 py-2 bg-slate-200 text-slate-600 rounded-lg font-bold hover:bg-slate-300 transition">
                        Reset
                    </button>
                </div>
            </div>

            {/* Area Peta */}
            <div className="flex-1 relative z-10 mb-10">
                <MapComponent schools={filteredSchools} onSelectSchool={setSelectedSchool} targetSchool={targetSchool}/>
            </div>

            {selectedSchool && (
                <SchoolModal school={selectedSchool} onClose={() => setSelectedSchool(null)} />
            )}

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