import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";

export default function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const checkLoginStatus = () => {
            const token = localStorage.getItem('access_token');
            setIsLoggedIn(!!token);
        };

        checkLoginStatus();

        const handleLoginStatusChange = (event) => {
            setIsLoggedIn(event.detail.isLoggedIn);
        };

        window.addEventListener('loginStatusChanged', handleLoginStatusChange);

        return () => {
            window.removeEventListener('loginStatusChanged', handleLoginStatusChange);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        setIsLoggedIn(false);

        window.dispatchEvent(new CustomEvent('loginStatusChanged', { detail: { isLoggedIn: false } }));
        navigate('/login');
    };

    return (
        <div className="bg-[#2E8B57] text-white shadow">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold">S Tour and Travel</h1>
                <nav className="space-x-4">
                    <Link to="/" className="hover:underline">Beranda</Link>
                    <Link to="/packages" className="hover:underline">Paket Wisata</Link>
                    <Link to="/vehicles/" className="hover:underline">Sewa Kendaraan</Link>

                    {isLoggedIn ? (
                        <>
                            <Link to="/profile" className="hover:underline">Profil</Link>
                            <Link to="/history" className="hover:underline">Riwayat</Link>
                            <button onClick={handleLogout} className="hover:underline">Keluar</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="hover:underline">Masuk</Link>
                        </>
                    )}
                </nav>
            </div>
        </div>
    );
}
