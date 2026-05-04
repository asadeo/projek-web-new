import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function NotFound() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center font-sans px-4">
            <div className="text-center max-w-lg">
                <h1 className="text-9xl font-black text-slate-200 mb-4 tracking-tighter">404</h1>
                <h2 className="text-3xl font-bold text-slate-800 mb-4">Ups! Tersesat ?</h2>
                <p className="text-slate-500 mb-8 leading-relaxed">
                    Halaman yang Anda cari sepertinya telah dipindahkan, dihapus, atau memang tidak pernah ada. Mari kembali ke jalur yang benar.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button 
                        onClick={() => navigate(-1)} 
                        className="px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                        <span>←</span> Kembali ke Sebelumnya
                    </button>
                    <Link 
                        to="/" 
                        className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl shadow-md shadow-amber-500/30 transition flex items-center justify-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                        Beranda Utama
                    </Link>
                </div>
            </div>
        </div>
    );
}