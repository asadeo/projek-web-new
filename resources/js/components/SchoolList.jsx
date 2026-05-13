import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const SchoolList = () => {
    const [schools, setSchools] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterLevel, setFilterLevel] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    const fetchSchools = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/schools');
            if (response.data && response.data.status === 'success') {
                setSchools(response.data.schools);
                if (onDataFetched) {
                    onDataFetched(response.data.schools);
                }
            }
        } catch (error) {
            console.error("Gagal mengambil data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSchools();
    }, []);

    const filteredSchools = schools.filter(school => {
        const matchSearch = school.name.toLowerCase().includes(searchTerm.toLowerCase()) || school.npsn.includes(searchTerm);
        const matchLevel = filterLevel === '' || school.level === filterLevel;
        return matchSearch && matchLevel;
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredSchools.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredSchools.length / itemsPerPage);

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

    const handleDelete = async (id, name) => {
        const result = await Swal.fire({
            title: 'Hapus data sekolah?',
            text: `Sekolah ${name} akan dihapus permanen.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            confirmButtonText: 'Ya, Hapus'
        });

        if (result.isConfirmed) {
            try {
                const token = localStorage.getItem('ACCESS_TOKEN');
                await axios.delete(`/api/schools/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                Swal.fire('Berhasil', 'Data dihapus', 'success');
                fetchSchools(); 
            } catch (error) {
                Swal.fire('Error', 'Gagal menghapus data', 'error');
            }
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h2 className="text-xl font-bold text-gray-800">Manajemen Data Sekolah</h2>
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
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

            {/* Filter & Search Bar */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <input 
                    type="text" 
                    placeholder="Cari Nama atau NPSN..." 
                    className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select 
                    className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                    value={filterLevel}
                    onChange={(e) => setFilterLevel(e.target.value)}
                >
                    <option value="">Semua Jenjang</option>
                    <option value="SD">SD</option>
                    <option value="SMP">SMP</option>
                </select>
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
                                <td colSpan="7" className="p-8 text-center text-gray-400">Sedang memuat data...</td>
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
                                            className='cursor-pointer bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm shadow'>
                                            Edit
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(school.id, school.name)}
                                            className='cursor-pointer bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm shadow'>
                                            Hapus
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="p-8 text-center text-red-400">Belum ada data sekolah yang cocok.</td>
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
        </div>
    );
};

export default SchoolList;