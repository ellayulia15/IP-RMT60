import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';

function VehiclePage() {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState({ type: '', message: '' });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const response = await axios.get('http://localhost:3000/vehicles');
                setVehicles(response.data);
            } catch (error) {
                console.error('Error fetching vehicles:', error);
                setNotification({
                    type: 'error',
                    message: 'Gagal memuat data kendaraan. Silakan coba lagi nanti.'
                });
            } finally {
                setLoading(false);
            }
        };

        fetchVehicles();
    }, []);

    const handleRent = (vehicleId) => {
        const token = localStorage.getItem('access_token');
        if (!token) {
            setNotification({
                type: 'error',
                message: 'Anda harus login terlebih dahulu untuk menyewa kendaraan.'
            });
            setTimeout(() => {
                setNotification({ type: '', message: '' });
                navigate('/login');
            }, 2000);
            return;
        }
        navigate(`/booking/${vehicleId}`);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#A7D7A7] flex items-center justify-center">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <p className="text-gray-600">Memuat data kendaraan...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#A7D7A7] py-8">
            {notification.message && (
                <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${notification.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' :
                        'bg-red-100 text-red-800 border border-red-200'
                    }`}>
                    {notification.message}
                </div>
            )}

            <div className="container mx-auto px-4">
                <h1 className="text-3xl font-bold text-center text-[#2E8B57] mb-8">
                    Daftar Kendaraan
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {vehicles.map((vehicle) => (
                        <div
                            key={vehicle.id}
                            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                        >
                            <div className="p-6">
                                <h2 className="text-xl font-bold text-[#2E8B57] mb-2">
                                    {vehicle.vehicleName}
                                </h2>
                                <div className="text-gray-600 mb-4">
                                    <p>Kapasitas: {vehicle.capacity} orang</p>
                                    <p>Harga: Rp{vehicle.pricePerDay.toLocaleString()}/hari</p>
                                </div>
                                <button
                                    onClick={() => handleRent(vehicle.id)}
                                    className="w-full px-4 py-2 bg-[#2E8B57] text-white rounded hover:bg-[#276746] transition"
                                >
                                    Sewa Sekarang
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {vehicles.length === 0 && !loading && (
                    <div className="text-center text-gray-600">
                        Tidak ada kendaraan tersedia saat ini.
                    </div>
                )}
            </div>
        </div>
    );
}

export default VehiclePage;
