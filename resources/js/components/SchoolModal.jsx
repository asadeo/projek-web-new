import React from "react";

export default function SchoolModal({ school, onClose }){
    if (!school) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden relative animate-fade-in">

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 z-10 transition"
                >
                    X
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2">
                    <div className="h-64 md:h-full bg-gray-200 relative">
                        {school.photo ? (
                            <img
                                src={`/storage/${school.photo}`}
                                alt={school.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-400">
                                <span className="text-4xl">🏫</span>
                            </div>
                        )}

                        <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/70 to-transparent p-4 text-white">
                            <span className="bg-[#FFC107] text-[#0B2235] text-xs font-bold px-2 py-1 rounded">
                                {school.level}
                            </span>
                        </div>
                    </div>
                        
                        <div className="p-6 md:p-8 overflow-y-auto max-h-[80vh]">
                            <h2 className="text-2xl font-bold text-[#0B2235] mb-2">{school.name}</h2>
                            <p className="text-gray-500 text-sm mb-6 flex items-center gap-1">
                                📍 {school.address}, Kec. {school.district}
                            </p>

                            <div className="space-y-4">
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <h3 className="text-sm font-bold text-blue-800 mb-2">Data Akademik</h3>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="block text-gray-500 text-xs">NPSN</span>
                                            <span className="font-semibold">{school.npsn}</span>
                                        </div>
                                        <div>
                                            <span className="block text-gray-500 text-xs">Status</span>
                                            <span className="font-semibold">{school.status}</span>
                                        </div>
                                        <div>
                                            <span className="block text-gray-500 text-xs">Akreditasi</span>
                                            <span className="font-semibold">{school.accreditation || '-'}</span>
                                        </div>
                                        <div>
                                            <span className="block text-gray-500 text-xs">Jumlah Siswa</span>
                                            <span className="font-semibold">{school.student_2025 || 0}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <a 
                                        href={`https://www.google.com/maps/dir/?api=1&destination=${school.latitude},${school.longitude}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center py-2.5 rounded-lg font-semibold transition shadow-md"
                                    >
                                        🗺️ Rute Lokasi
                                    </a>
                                </div>
                            </div>
                        </div>

                </div>

            </div>
        </div>
    )
}