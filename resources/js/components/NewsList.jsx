import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";

const NewsList = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    
    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = async () => {
        try {
            const response = await fetch('/api/news');
            const data = await response.json();

            if (data.status === 'success') {
                setNews(data.news);
            }
        } catch (error) {
            console.error("Error fetching news:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-6">Memuat data berita...</div>;

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Manajemen Berita</h2>
                <button onClick={() => navigate('news/create')} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                    + Tambah Berita
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-100 border-b">
                            <th className="p-3">Judul Berita</th>
                            <th className="p-3">Status</th>
                            <th className="p-3">Tanggal Dibuat</th>
                            <th className="p-3">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {news && news.length > 0 ? (
                            news.map((item) => (
                                <tr key={item.id} className="border-b hover:bg-gray-50">
                                   <td className="p-3">{item.title}</td>
                                   <td className="p-3">
                                        <span className={`px-2 py-1 text-xs rounded-full ${item.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="p-3">{new Date(item.created_at).toLocaleDateString('id-ID')}</td>
                                    <td className="p-3 space-x-2">
                                        <button className="text-blue-500 hover:text-blue-700">Edit</button>
                                        <button className="text-red-500 hover:text-red-700">Hapus</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="p-3 text-center text-gray-500">
                                    Belum ada berita yang diterbitkan.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default NewsList;