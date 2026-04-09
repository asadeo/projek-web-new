import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Swal from 'sweetalert2';
import Settings from './Settings';
import NewsList from './NewsList';

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

    const handleDelete = async (id, name) => {
        Swal.fire({
            title: `Yakin ingin menghapus?`,
            text: `Data ${name} akan dihapus permanen!`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Ya, Hapus!',
            cancelButtonText: 'Batal'
        }).then(async (result) => {
            if (result.isConfirmed){
                try {
                    const token = localStorage.getItem('ACCESS_TOKEN');
                    await axios.delete(`/api/schools/${id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    Swal.fire(
                        'Terhapus!',
                        'Data sekolah berhasil dihapus.',
                        'success'
                    );
                    fetchData();
                } catch (error){
                    Swal.fire(
                        'Gagal!',
                        'Terjadi kesalahan saat menghapus data.',
                        'error'
                    );
                }
            }
        })
    };  

    const handleExportCSV = () => {
        if (filteredSchools.length == 0){
            alert("Tidak ada data untuk diexport!")
            return;
        }
        let csvContent = "NPSN,Nama Sekolah,Jenjang,Status,Kecamatan,Akreditasi,Jumlah Siswa(2025)\n";

        filteredSchools.forEach(school => {
            const row = [
                school.npsn,
                `"${school.name}"`,
                school.level,
                school.status,
                `"${school.district}"`,
                school.accreditation || "-",
                school.student_2025 || 0
            ].join(",");

            csvContent += row + "\n";
        })

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;'});
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "Data_Sekolah_Kabupaten_Pati.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

    };

    const filteredSchools = schools.filter(school => {
        const matchSearch = school.name.toLowerCase().includes(searchTerm.toLowerCase()) || school.npsn.includes(searchTerm);
        const matchLevel = filterLevel ? school.level === filterLevel : true;
        return matchSearch && matchLevel;
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredSchools.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredSchools.length / itemsPerPage);

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

                    <button onClick={() => setActiveMenu('dashboard')} className={`w-full text-left py-2.5 px-4 rounded transition ${activeMenu === 'dashboard' ? 'bg-[#FFC107]/10 text-[#FFC107] font-semibold' : 'hover:bg-[#FFC107]/10 text-white hover:text-[#FFC107]'}`}>
                        Dashboard
                    </button>
                    <button onClick={() => setActiveMenu('news')} className={`w-full text-left py-2.5 px-4 rounded transition ${activeMenu === 'news' ? 'bg-[#FFC107]/10 text-[#FFC107] font-semibold' : 'hover:bg-[#FFC107]/10 text-white hover:text-[#FFC107]'}`}>
                        Konten Website
                    </button>
                    <button href="#" className="block py-2.5 px-4 rounded hover:bg-[#FFC107]/10 text-white hover:text-[#FFC107] transition">    
                        Layanan Publik
                    </button>
                    <button href="#" className="block py-2.5 px-4 rounded hover:bg-[#FFC107]/10 text-white hover:text-[#FFC107] transition">
                        Data
                    </button>
                    <button onClick={() => setActiveMenu('settings')} className={`w-full text-left py-2.5 px-4 rounded transition ${activeMenu === 'settings' ? 'bg-[#FFC107]/10 text-[#FFC107] font-semibold' : 'hover:bg-[#FFC107]/10 text-white hover:text-[#FFC107]'}`}>
                        Pengaturan
                    </button>
                </nav>

                {/* Tombol Logout di Bawah */}
                <div className="p-4 border-t border-slate-700">
                    <button 
                        onClick={logoutHandler} 
                        className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded font-bold transition"
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

                    {/* HEADER TABEL */}
                    <div className='mt-8 mb-4'>
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-3xl font-bold text-gray-800">Data Sekolah</h2>
                                <p className="text-gray-500">Daftar sekolah di Kabupaten Pati</p>
                            </div>
                            <div className='flex items-centers gap-4'>
                                <button onClick={() => navigate('/schools/create')}
                                className='bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded shadow flex items-center gap-2 cursor-pointer'>
                                    + Tambah Sekolah
                                </button>
                                <div className="bg-white px-4 py-2 rounded shadow text-sm font-semibold text-blue-600">
                                    Total: {filteredSchools.length} Sekolah
                                </div>
                                <button 
                                    onClick={handleExportCSV}
                                    className='bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-lg shadow-md font-semibold flex items-center gap-2 transition transform hover:-translate-y-0.5 cursor-pointer'
                                >
                                    <span>Unduh CSV</span>
                                </button>
                            </div>
                        </div>
                        <div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4 mb-6'>
                            <div className='flex-1'>
                                <input
                                    type='text'
                                    placeholder='Cari NPSN atau Nama Sekolah...'
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className='w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none'
                                />
                            </div>
                            <div className='w-full md:w-48'>
                                <select
                                    value={filterLevel}
                                    onChange={(e) => setFilterLevel(e.target.value)}
                                    className='w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none'
                                >
                                    <option value="">Semua Jenjang</option>
                                    <option value="SD">SD</option>
                                    <option value="SMP">SMP</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* TABEL DATA */}
                    <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-100 text-slate-600 uppercase text-xs font-bold">
                                <tr>
                                    <th className="p-4 border-b">NPSN</th>
                                    <th className="p-4 border-b">Nama Sekolah</th>
                                    <th className="p-4 border-b">Kecamatan</th>
                                    <th className="p-4 border-b text-center">Jenjang</th>
                                    <th className="p-4 border-b text-center">Akreditasi</th>
                                    <th className="p-4 border-b text-center">Total Siswa (2025)</th>
                                    <th className="p-4 border-b text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm text-gray-700">
                                {loading ? (
                                    <tr>
                                        <td colSpan="6" className="p-8 text-center text-gray-400">Sedang memuat data...</td>
                                    </tr>
                                ) : currentItems.length > 0 ? (
                                    currentItems.map((school) => (
                                        <tr key={school.id} className="hover:bg-blue-50 transition border-b last:border-0">
                                            <td className="p-4 font-mono text-slate-500">{school.npsn}</td>
                                            <td className='p-4 font-bold text-slate-800 flex items-center gap-3'>
                                                <img src={school.photo ? `/storage/${school.photo}` : "/assets/images/school.png"} className='w-10 h-10 rounded-md object-cover border' alt='foto'/>
                                                <span>{school.name}</span>
                                            </td>
                                            <td className="p-4">{school.district}</td>
                                            <td className="p-4 text-center">
                                                <span className={`px-2 py-1 rounded text-xs font-bold ${school.level === 'SD' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                                    {school.level}
                                                </span>
                                            </td>
                                            <td className="p-4 text-center">
                                                <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded font-bold">{school.accreditation}</span>
                                            </td>
                                            <td className="p-4 text-center font-bold">{school.student_2025}</td>
                                            <td className='p-4 text-center flex justify-center gap-2'>
                                                <button 
                                                    onClick={() => navigate(`/schools/edit/${school.id}`)}
                                                    className='bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm shadow'>
                                                    Edit
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(school.id, school.name)}
                                                    className='bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm shadow'>
                                                    Hapus
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="p-8 text-center text-red-400">Belum ada data sekolah.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        {/* PAGINATION */}
                        {filteredSchools.length > 0 && (
                        <div className='flex flex-col sm:flex-row justify-between items-center p-4 bg-gray-50 border-t border-gray-200'>
                            <div className='text-sm text-gray-600 mb-4 sm:mb-0'>
                                Menampilkan <span className='font-bold text-gray-800'>{indexOfFirstItem + 1}</span> sampai <span className='font-bold text-gray-800'>{Math.min(indexOfLastItem, filteredSchools.length)}</span> dari <span className='font-bold text-gray-800'>{filteredSchools.length}</span> data
                            </div>

                            <div className='flex gap-2'>
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className='px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition'
                                >
                                    Sebelumnya
                                </button>

                                <div className='px-4 py-2 bg-blue-100 text-blue-800 font-bold rounded-md text-sm border border-blue-200'>
                                    {currentPage} / {totalPages || 1}
                                </div>
                                
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages || totalPages === 0}
                                    className='px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition'
                                >
                                    Selanjutnya
                                </button>

                            </div>


                        </div>
                        )}

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