import axios from "axios";
import React, {use, useEffect, useState} from "react";
import Swal from "sweetalert2";

export default function Settings() {
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    const [settings, setSettings] = useState({
        siteName: '',
        welcomeText: '',
        email: '',
        phone: '',
        address: '',
        siteLogo: ''
    })

    const [logoFile, setLogoFile] = useState(null);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
      try {
        const response = await axios.get('/api/settings');
        if (response.data && response.data.data) {
            const sanitizedData = {};
            Object.keys(response.data.data).forEach(key => {
                sanitizedData[key] = response.data.data[key] || '';
            });
            
            setSettings(prev => ({...prev, ...response.data.data}));
        }
      } catch (error) {
        console.error("Gagal mengambil data pengaturan:", error);
      } finally {
        setFetching(false);
      }
    };

    const handleChange = (e) => {
        setSettings({
            ...settings,
            [e.target.name]: e.target.value
        });
    };

    const handleFileChange = (e) => {
        setLogoFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('ACCESS_TOKEN');
            const formData = new FormData();

            Object.keys(settings).forEach(key => {
                if (key != 'siteLogo') {
                    formData.append(key, settings[key] || '');
                }
            });

            if (logoFile) {
                formData.append('siteLogo', logoFile);
            }

            await axios.post('/api/settings', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                    'Accept': 'application/json'
                }
            });

            Swal.fire({
                icon: 'success',
                title: 'Tersimpan',
                text: 'Pengaturan website berhasil diperbarui.',
                timer: 2000,
                showConfirmButton: false
            });

            fetchSettings();
        } catch (error) {
            console.error("Gagal menyimpan:", error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Gagal menyimpan pengaturan. Pastikan koneksi internet lancar.',
            });
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <div className="p-6 text-gray-500 font-semibold animate-pulse">Memuat pengaturan...</div>;

    return (
        <div className="p-6 bg-white rounded-lg shadow-md max-w-4xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Pengaturan Website</h2>
            <p className="text-gray-500 mb-6">Ubah informasi umum yang ditampilkan pada halaman depan pengunjung</p>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Informasi Dasar */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg border-b pb-2">Informasi Dasar</h3>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Website</label>
                            <input type="text" name="siteName" value={settings.siteName} onChange={handleChange} className="w-full border rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Teks Sambutan Beranda</label>
                            <textarea name="welcomeText" value={settings.welcomeText} onChange={handleChange} className="w-full border rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500"></textarea>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Logo Website</label>
                            <input type="file" accept="image/*" onChange={handleFileChange} className="w-full border rounded-md px-4 py-1.5 file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:bg-blue-50 file:text-blue-700"/>
                            {settings.siteLogo && !logoFile && (
                                <p className="text-xs text-green-600 mt-1">✓ Logo sudah terpasang.</p>
                            )}
                        </div>
                    </div>

                    {/* Kontak & Alamat */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg border-b pb-2">Kontak & Alamat</h3>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Resmi</label>
                            <input type="email" name="email" value={settings.email} onChange={handleChange} className="w-full border rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Kantor</label>
                            <textarea name="address" value={settings.address} onChange={handleChange} rows="2" className="w-full border rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500"></textarea>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Telepon</label>
                            <input type="text" name="phone" value={settings.phone} onChange={handleChange} className="w-full border rounded-md px-4 py-1.5 file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:bg-blue-50 file:text-blue-700"/>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4 border-t">
                        <button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow font-semibold">
                            {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </button>
                    </div>
                </div> 
            </form>
        </div>
    );
}