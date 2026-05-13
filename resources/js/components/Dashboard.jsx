import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Swal from 'sweetalert2';
import Settings from './Settings';
import NewsList from './NewsList';
import SchooolList from './SchoolList';

export default function Dashboard() {
    const [user, setUser] = useState({});
    const [schools, setSchools] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    const location = useLocation();

    const [activeMenu, setActiveMenu] = useState(location.state?.activeMenu || 'dashboard');
    const [ searchTerm, setSearchTerm ] = useState('');
    const [filterLevel, setFilterLevel] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filterLevel]);

    const fetchData = async () => {
            try {
                const token = localStorage.getItem('ACCESS_TOKEN');

                if (!token) {
                    navigate('/login');
                    return;
                }

                const config = {
                    headers: { Authorization: `Bearer ${token}` }
                };

                const userRes = await axios.get('/api/user', config);
                setUser(userRes.data);
                
                const schoolRes = await axios.get('/api/schools', config);
                const schoolData = schoolRes.data.schools || schoolRes.data || [];
                setSchools(schoolData);

                setLoading(false);
            } catch (error) {
                console.error("Gagal ambil data:", error);
                if (error.response && error.response.status === 401) {
                    localStorage.removeItem('ACCESS_TOKEN');
                    navigate('/login');
                }
                setLoading(false);
            }
        };
        useEffect(() => {
            fetchData();
    }, []);

    const logoutHandler = async () => {
        try {
            const token = localStorage.getItem('ACCESS_TOKEN');
            await axios.post('/api/logout', {}, {
                headers: {
                    Authorization: `Bearer ${token}` 
                }
            });
            localStorage.removeItem('ACCESS_TOKEN');
            navigate('/login');
        } catch (error) {
            console.error("Gagal logout", error);
            localStorage.removeItem('ACCESS_TOKEN');
            navigate('/login');
        }
    };

    const totalSekolah = schools.length;
    const totalSD = schools.filter(school => school.level === 'SD').length;
    const totalSMP = schools.filter(school => school.level === 'SMP').length;
    const totalNegeri = schools.filter(school => school.status === 'Negeri').length;
    const totalSwasta = schools.filter(school => school.status === 'Swasta').length;

    const dataAkreditasi = [
        { name: 'Akreditasi A', jumlah: schools.filter(s => s.accreditation === 'A').length },
        { name: 'Akreditasi B', jumlah: schools.filter(s => s.accreditation === 'B').length },
        { name: 'Akreditasi C', jumlah: schools.filter(s => s.accreditation === 'C').length },
        { name: 'Belum/Lainnya', jumlah: schools.filter(s => s.accreditation === 'Belum Terakreditasi' || !s.accreditation).length }
    ]

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* SIDEBAR KIRI */}
            <aside className="w-64 bg-linear-to-b from-[#20639B] from-50% to-[#0B2235] to-100% text-white flex flex-col">
                <div className="p-6 text-center border-b border-slate-700">
                    <h1 className="text-2xl font-bold">DINAS PATI</h1>
                    <p className="text-xs text-slate-400 mt-1">Sistem Informasi Manajemen</p>
                </div>

                {/* Menu Navigasi */}
                <nav className="flex-1 p-4 space-y-2">
                    <p className="text-xs text-slate-400 uppercase mb-2">Menu</p>

                    <button onClick={() => setActiveMenu('dashboard')} className={`cursor-pointer w-full text-left py-2.5 px-4 rounded transition ${activeMenu === 'dashboard' ? 'bg-[#FFC107]/10 text-[#FFC107] font-semibold' : 'hover:bg-[#FFC107]/10 text-white hover:text-[#FFC107]'}`}>
                        Dashboard
                    </button>
                    <button onClick={() => setActiveMenu('news')} className={`cursor-pointer w-full text-left py-2.5 px-4 rounded transition ${activeMenu === 'news' ? 'bg-[#FFC107]/10 text-[#FFC107] font-semibold' : 'hover:bg-[#FFC107]/10 text-white hover:text-[#FFC107]'}`}>
                        Konten Website
                    </button>
                    <button onClick={() => setActiveMenu('schoolPage')} className={`cursor-pointer w-full text-left py-2.5 px-4 rounded transition ${activeMenu === 'schoolPage' ? 'bg-[#FFC107]/10 text-[#FFC107] font-semibold' : 'hover:bg-[#FFC107]/10 text-white hover:text-[#FFC107]'}`}>    
                        Data Sekolah
                    </button>
                    {/* <button href="#" className="block py-2.5 px-4 rounded hover:bg-[#FFC107]/10 text-white hover:text-[#FFC107] transition">
                        Data
                    </button> */}
                    <button onClick={() => setActiveMenu('settings')} className={`cursor-pointer w-full text-left py-2.5 px-4 rounded transition ${activeMenu === 'settings' ? 'bg-[#FFC107]/10 text-[#FFC107] font-semibold' : 'hover:bg-[#FFC107]/10 text-white hover:text-[#FFC107]'}`}>
                        Pengaturan
                    </button>
                </nav>

                {/* Tombol Logout di Bawah */}
                <div className="p-4 border-t border-slate-700">
                    <button 
                        onClick={logoutHandler} 
                        className="cursor-pointer w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded font-bold transition"
                    >
                        Logout
                    </button>
                </div>
            </aside>

            {/* --- KONTEN UTAMA (KANAN) --- */}
            <main className="flex-1 p-8 overflow-y-auto">
                {/* Header Konten */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800">{activeMenu === 'dashboard' ? 'Dashboard' : 'Konten Website'}</h2>
                        <p className="text-gray-500">Selamat datang kembali, <span className="font-semibold text-blue-600">{user.name}</span>!</p>
                    </div>
                    <div className="bg-white p-2 rounded-full shadow">
                        <img src="https://ui-avatars.com/api/?name=Admin+Dinas&background=0D8ABC&color=fff" alt="Profile" className="w-10 h-10 rounded-full" />
                    </div>
                </div>

            {activeMenu === 'dashboard' && (
                <>
                    {/* Kartu Statistik */}
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
                            <div className="flex items-center">
                                <div className="p-3 rounded-full bg-blue-100 text-blue-500 mr-4">
                                    <img src="assets/images/newspaper.png" className="w-6 h-6" alt="Newspaper Icon"/>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-500">Total Sekolah</p>
                                    <h3 className="text-2xl font-bold text-gray-800">{totalSekolah}</h3>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
                            <div className="flex items-center">
                                <div className="p-3 rounded-full bg-green-100 text-green-500 mr-4">
                                    
                                </div>
                                <div>
                                    <p className="text-gray-500 text-sm">Sekolah Dasar</p>
                                    <p className="text-2xl font-bold text-gray-800">{totalSD}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-purple-500">
                            <div className="flex items-center">
                                <div className="p-3 rounded-full bg-purple-100 text-purple-500 mr-4">
                                    👥
                                </div>
                                <div>
                                    <p className="text-gray-500 text-sm">Menengah Pertama</p>
                                    <p className="text-2xl font-bold text-gray-800">{totalSMP}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-center hover:shadow-md transition">
                            <div className="flex justify-between text-sm mb-1">
                                <span className="font-semibold text-gray-600">Negeri: {totalNegeri}</span>
                                <span className="font-semibold text-gray-600">Swasta: {totalSwasta}</span>
                            </div>
                            <div className="w-full bg-orange-200 rounded-full h-2.5 mt-2 flex overflow-hidden">
                                <div 
                                    className="bg-teal-500 h-2.5" 
                                    style={{ width: totalSekolah > 0 ? `${(totalNegeri / totalSekolah) * 100}%` : '0%' }}
                                    title={`Negeri: ${totalNegeri}`}
                                ></div>
                                <div 
                                    className="bg-orange-400 h-2.5" 
                                    style={{ width: totalSekolah > 0 ? `${(totalSwasta / totalSekolah) * 100}%` : '0%' }}
                                    title={`Swasta: ${totalSwasta}`}
                                ></div>
                            </div>
                        </div>
                    </div>

                    {/* CHART */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
                        <h3 className="text-lg font-bold text-gray-800 mb-6">Distribusi Akreditasi Sekolah</h3>
                        <div className="h-72 w-full">
                            <ResponsiveContainer>
                                <BarChart
                                    data={dataAkreditasi}
                                    margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb"/>
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}}/>
                                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}}/>
                                    <Tooltip
                                        cursor={{fill: '#f3f4f6'}}
                                        contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px 0px rgba(0, 0, 0, 0.1)'}}
                                    />
                                    <Bar dataKey="jumlah" fill="#0ea5e9" radius={[4, 4, 0, 0]} barSize={50}/>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </> 
            )}


            {activeMenu === 'schoolPage' && (
                <SchooolList />
            )}
            {activeMenu === 'news' && (
                <NewsList />
            )}
            {activeMenu === 'settings' && (
                <Settings />
            )}

            </main>
        </div>
    );
}