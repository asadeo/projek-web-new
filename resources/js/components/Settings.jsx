import React, {use, useState} from "react";
import Swal from "sweetalert2";

export default function Settings() {
    const [loading, setLoading] = useState(false);
    const [settings, setSettings] = useState({
        siteName: 'Dinas Pendidikan dan Kebudayaan Kabupaten Pati',
        welcomeText: 'Selamat Datang di Portal Resmi Disdikbud Kabupaten Pati',
        email: 'dinas@patikab.go.id',
        phone: '(0295) 123456',
        address: 'Jl. Raya Pati, Kabupaten Pati, Jawa Tengah'
    })
}