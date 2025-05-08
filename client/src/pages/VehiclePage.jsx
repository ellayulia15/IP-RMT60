import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';

function VehiclePage() {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const response = await axios.get('http://localhost:3000/vehicles');
                setVehicles(response.data);
            } catch (error) {
                console.error('Gagal memuat data kendaraan:', error);
                setErrorMessage('Gagal memuat data kendaraan. Silakan coba lagi nanti.');
            } finally {
                setLoading(false);
            }
        };

        fetchVehicles();
    }, []);

    const handleBooking = (vehicleId) => {
        try {
            const token = localStorage.getItem('access_token');
            if (!token) {
                setErrorMessage('Anda harus login terlebih dahulu!');
                return navigate('/login');
            }

            navigate(`/booking/${vehicleId}`);
        } catch (error) {
            console.error('Error navigating to booking page:', error);
            setErrorMessage('Terjadi kesalahan saat memproses permintaan. Silakan coba lagi.');
        }
    };

    return (
        <div className="min-h-screen bg-[#F5FFF5] font-sans text-gray-800 p-8">
            <h1 className="text-3xl font-bold text-[#2E8B57] text-center mb-8">Daftar Kendaraan</h1>

            {errorMessage && (
                <div className="mb-4 px-4 py-2 bg-red-100 text-red-700 rounded text-center">
                    {errorMessage}
                </div>
            )}

            {loading ? (
                <p className="text-center text-gray-600">Memuat data...</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow">
                        <thead>
                            <tr className="bg-[#2E8B57] text-white">
                                <th className="py-3 px-4 border">Nama Kendaraan</th>
                                <th className="py-3 px-4 border">Kapasitas</th>
                                <th className="py-3 px-4 border">Harga per Hari</th>
                                <th className="py-3 px-4 border">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vehicles.map(vehicle => (
                                <tr key={vehicle.id} className="text-center text-gray-700">
                                    <td className="py-3 px-4 border">{vehicle.vehicleName}</td>
                                    <td className="py-3 px-4 border">{vehicle.capacity} orang</td>
                                    <td className="py-3 px-4 border">Rp {vehicle.pricePerDay.toLocaleString()}</td>
                                    <td className="py-3 px-4 border">
                                        <button
                                            onClick={() => handleBooking(vehicle.id)}
                                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                                        >
                                            Sewa Sekarang
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default VehiclePage;
