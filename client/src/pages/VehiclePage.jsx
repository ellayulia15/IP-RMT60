import React, { useEffect, useState } from 'react';
import axios from 'axios';

function VehiclePage() {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchVehicles() {
            try {
                const response = await axios.get('http://localhost:3000/vehicles');
                setVehicles(response.data);
            } catch (error) {
                console.error('Gagal memuat data kendaraan:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchVehicles();
    }, []);

    return (
        <div className="min-h-screen bg-[#F5FFF5] font-sans text-gray-800 p-8">
            <h1 className="text-3xl font-bold text-[#2E8B57] text-center mb-8">Daftar Kendaraan</h1>
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
                            </tr>
                        </thead>
                        <tbody>
                            {vehicles.map(vehicle => (
                                <tr key={vehicle.id} className="text-center text-gray-700">
                                    <td className="py-3 px-4 border">{vehicle.vehicleName}</td>
                                    <td className="py-3 px-4 border">{vehicle.capacity} orang</td>
                                    <td className="py-3 px-4 border">Rp {vehicle.pricePerDay.toLocaleString()}</td>
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
