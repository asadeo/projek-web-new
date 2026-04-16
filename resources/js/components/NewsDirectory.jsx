import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function NewsDirectory(){
    const [news, setNews] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0,0);
        axios.get('/api/news')
            .then(res => {
                const data = res.data.news || res.data || [];
                const published = data.filter(n => n.status === 'published');
                setNews(published);
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    const filteredNews = news.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>

            {/* Navbar */}
            <nav className="bg-white shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                        <span className="text-2xl font-black text-slate-800">←</span>
                        <span className="font-bold text-slate-800">Kembali ke Beranda</span>
                    </div>
                </div>
            </nav>

            {/* Header */}
            <div className="bg-slate-900 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1><span></span></h1>
                    <p>

                    </p>
                </div>
            </div>
        </div>
    )
}