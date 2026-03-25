import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await axios.post('/api/login', {
                email, password
            });
            localStorage.setItem('ACCESS_TOKEN', response.data.access_token);
            
            Swal.fire({
                icon: 'success',
                title: 'Login Berhasil',
                text: 'Selamat datang di Dashboard Admin!',
                timer: 1500,
                showConfirmButton: false
            }).then(() => {
                window.location.href = '/admin';
            })
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Login Gagal',
                text: error.response?.data?.message || 'Email atau password salah!',
                confirmButtonColor: '#0B2235'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
                <img 
                    src="assets\images\logoDisdikbud.png"
                    alt="Logo Pati"
                    className="mx-auto h-24 w-auto drop-shadow-md mb-4 transform hover:scale-105 transition"
                />
                <h2 className="text-center text-3xl font-extrabold text-[#0B2235]">
                    Login Admin
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Sistem Informasi Sekolah Kabupaten Pati
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10 border border-gray-100 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-[#FFC107]"></div>
                    <form className="space-y-6 mt-2" onSubmit={handleLogin}>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700">
                                Alamat Email
                            </label>
                            <div className="mt-1">
                                <input className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0B2235] focus:border-transparent transition" 
                                type="email" 
                                required
                                placeholder="admin@patikab.go.id" 
                                value={email} 
                                onChange={e => setEmail(e.target.value)} />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700">
                                Password
                            </label>
                            <div className="mt-1">
                                <input className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0B2235] focus:border-transparent transition"
                                required 
                                type="password"
                                placeholder="••••••••" value={password} 
                                onChange={e => setPassword(e.target.value)} 
                                />
                            </div>
                        </div>

                        <div className="pt-2">
                            <button 
                                type="submit"
                                disabled={isLoading}
                                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-bold text-white bg-[#0B2235] hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0B2235] transition transform ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-0.5'}`}
                            >
                                {isLoading ? (
                                    <span className="flex items-center gap-2">
                                        ⏳ Memproses...
                                    </span>
                                ) : (
                                    'Masuk'
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6 text-center">
                        <button 
                            type="button"
                            onClick={() => navigate('/')}
                            className="text-sm font-medium text-blue-600 hover:text-blue-500 hover:underline transition"
                        >
                            &larr; Kembali ke Halaman Utama
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}