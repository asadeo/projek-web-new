import React, {useEffect, useState} from "react";

const NewList = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    
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
                <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                    + Tambah Berita
                </button>
            </div>

            <div className="overflow-x-auto">
                <table>
                    <thead>
                        <tr>
                            <th>Judul Berita</th>
                            <th>Status</th>
                            <th>Tanggal Dibuat</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {news && news.length > 0 ? (
                            news.map((item) => (
                                <tr>
                                   <td>{item.title}</td>
                                   <td>
                                        <span>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td>{new Date(item.created_at).toLocaleDateString('id-ID')}</td>
                                    <td>
                                        <button>Edit</button>
                                        <button>Hapus</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td>
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

export default NewList;