import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

export default function NewsForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        status: 'draft',
        image: null
    });
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        if (id) {
            fetchNewsDetail();
        }
    }, [id]);

    const fetchNewsDetail = async () => {
        try {
            const response = await axios.get(`/api/news/${id}`);
            const newsData = response.data.news;
            setFormData({
                title: newsData.title,
                content: newsData.content,
                status: newsData.status,
                image: null 
            });
            if (newsData.image) {
                setPreview(`/storage/${newsData.image}`); 
            }
        } catch (error) {
            console.error("Gagal mengambil data", error);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({
                ...formData,
                image: file
            });
            setPreview(URL.createObjectURL(file));
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = new FormData();
        data.append('title', formData.title);
        data.append('content', formData.content);
        data.append('status', formData.status);
        if (formData.image) {
            data.append('image', formData.image);
        }
        
        try {
            const token = localStorage.getItem('ACCESS_TOKEN');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            };

            if (id) {
                data.append('_method', 'PUT');
                await axios.post(`/api/news/${id}`, data, config);
            } else {
                await axios.post('/api/news', data, config);
            }

            Swal.fire({
                icon: 'success',
                title: 'Berhasil!',
                text: 'Berita baru berhasil ditambahkan.',
                showConfirmButton: false,
                timer: 2000
            });

            navigate('/admin', { state: { activeMenu: 'news' } });
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Gagal menambahkan berita. Cek kembali isian form',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8 flex justify-center items-start">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-3xl">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Tambah Berita Baru</h2>
                        <p className="text-gray-500 text-sm">Buat artikel atau pengumuman untuk portal website</p>
                    </div>
                    <button
                        onClick={() => navigate('/admin', { state: { activeMenu: 'news' } })}
                        className="text-gray-500 hover:text-gray-800 font-semibold"
                    >
                        Batal & Kembali
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Input Judul */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Judul Berita</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Contoh: Rapat Evaluasi Pendidikan 2026"
                        />
                    </div>

                    {/* Input Status & Gambar */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status Publikasi</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Contoh: Rapat Evaluasi Pendidikan 2026"
                        >
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Foto Berita</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    {/* Preview Gambar */}
                    {preview && (
                        <div className="mt-2">
                            <p className="text-sm text-gray-500 mb-1">Preview Sampul:</p>
                            <img src={preview} alt="Preview" className="h-40 w-auto rounded object-cover border"/>
                        </div>
                    )}
                    
                    {/* Input Konten Berita */}
                    <div>
                        <label></label>
                        <textarea
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            required
                            rows="8"
                            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Tuliskan isi berita di sini..."
                        ></textarea>
                    </div>
                    
                    {/* Tombol Simpan */}
                    <div className="flex justify-end pt-4 border-t">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`px-6 py-2 rounded-md font-semibold text-white transition shadow ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                        >
                            {loading ? 'Menyimpan...' : 'Simpan Berita'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}