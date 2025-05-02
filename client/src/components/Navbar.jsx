import { Link } from "react-router";

export default function Navbar() {
    return (
        <div className="bg-[#2E8B57] text-white shadow">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold">S Tour and Travel</h1>
                <nav className="space-x-4">
                    <Link to="/" className="hover:underline">Beranda</Link>
                    <Link to="/packages" className="hover:underline">Paket Wisata</Link>
                    <Link to="/register" className="hover:underline">Akun</Link>
                </nav>
            </div>
        </div>
    )
}