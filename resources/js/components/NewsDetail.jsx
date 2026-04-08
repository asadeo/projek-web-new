import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function NewsDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [news, setNews] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        window.scrollTo(0,0);

        axios.get(`/api/news/${id}`)
            .then(res => {
                setNews(res.data.news);
            })
            .catch(err => {
                console.error("Gagal mengambil data berita:", err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [id]);

    if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading...</div>;
    if (!news) return <div className="min-h-screen flex items-center justify-center text-gray-500">Berita tidak ditemukan.</div>

    return (
        <div className="min-h-screen bg-gray-50 pt-10 pb-20 px-4">
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                {/* Header Image */}
                <div className="w-full h-64 md:h-96 relative bg-gray-200">
                    <img
                        src={news.image ? `/storage/${news.image}` : "https://plus.unsplash.com/premium_photo-1661962692047-92900e3182b2?q=80&w=2070&auto=format&fit=crop"}
                        alt={news.title}
                        className="w-full h-full object-cover"
                    />
                    <button onClick={() => navigate(-1)} className="absolute top-4 left-4 bg-white/90 hover:bg-white text-gray-800 px-4 py-2 rounded-lg font-semibold shadow-sm backdrop-blur-sm transition flex items-center gap-2">
                        <span>←</span> Kembali ke Beranda
                    </button>
                </div>

                {/* News Content */}
                <div className="p-8 md:p-12">
                    <div className="mb-6 flex items-center">
                        <span className="bg-[#FFC107] text-[#0B2235] text-xs font-bold px-3 py-1 rounded uppercase tracking-wider">
                            Info Publik
                        </span>
                        <span className="text-gray-500 text-sm ml-4 font-medium">
                            {new Date(news.created_at).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </span>
                    </div>

                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 leading-tight">
                        {news.title}
                    </h1>

                    <div className="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap text-lg">
                        {news.content}
                    </div>
                </div>
            </div>
        </div>
    );
}