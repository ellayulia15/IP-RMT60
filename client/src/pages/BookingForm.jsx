import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import axios from 'axios';

function BookingForm() {
    const { VehicleId } = useParams();
    const [vehicleDetail, setVehicleDetail] = useState(null);
    const [formData, setFormData] = useState({
        startDate: '',
        endDate: '',
        originCity: '',
        destinationCity: '',
        distance: '',
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchVehicle = async () => {
            try {
                const { data } = await axios.get(`http://localhost:3000/vehicles/${VehicleId}`);
                setVehicleDetail(data);
            } catch (err) {
                console.error(err);
                setError("Gagal memuat data kendaraan. Silakan coba lagi nanti.");
            } finally {
                setLoading(false);
            }
        };

        fetchVehicle();
    }, [VehicleId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            const token = localStorage.getItem('access_token');
            if (!token) {
                setError("Anda harus login terlebih dahulu!");
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
                return;
            }

            const response = await axios.post(
                `http://localhost:3000/booking/${VehicleId}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 201) {
                setSuccess("Pemesanan berhasil! Mengalihkan ke halaman riwayat...");
                setTimeout(() => {
                    navigate('/history#vehicles');
                }, 2000);
            }
        } catch (error) {
            console.error('Gagal memesan kendaraan:', error);
            setError(error.response?.data?.message || "Terjadi kesalahan saat memesan kendaraan. Silakan coba lagi.");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#A7D7A7] font-sans text-gray-800 p-8 flex justify-center items-center">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <p className="text-gray-600">Memuat data...</p>
                </div>
            </div>
        );
    }

    if (!vehicleDetail) {
        return (
            <div className="min-h-screen bg-[#A7D7A7] font-sans text-gray-800 p-8 flex justify-center items-center">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <p className="text-red-600">{error || "Data kendaraan tidak ditemukan"}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#A7D7A7] font-sans text-gray-800 p-8 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold text-[#2E8B57] mb-6 text-center">
                    Form Pemesanan Kendaraan
                </h1>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md border border-red-200">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md border border-green-200">
                        {success}
                    </div>
                )}

                <div className="mb-4 p-4 bg-gray-50 rounded-md">
                    <p className="mb-2">
                        <strong className="text-gray-700">Kendaraan:</strong>
                        <span className="ml-2">{vehicleDetail.vehicleName}</span>
                    </p>
                    <p className="mb-2">
                        <strong className="text-gray-700">Harga per Hari:</strong>
                        <span className="ml-2">Rp{vehicleDetail.pricePerDay.toLocaleString()}</span>
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="mb-4">
                        <label htmlFor="startDate" className="block text-gray-700 font-medium mb-2">
                            Tanggal Mulai
                        </label>
                        <input
                            type="date"
                            id="startDate"
                            name="startDate"
                            value={formData.startDate}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E8B57]"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="endDate" className="block text-gray-700 font-medium mb-2">
                            Tanggal Selesai
                        </label>
                        <input
                            type="date"
                            id="endDate"
                            name="endDate"
                            value={formData.endDate}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E8B57]"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="originCity" className="block text-gray-700 font-medium mb-2">
                            Kota Asal
                        </label>
                        <input
                            type="text"
                            id="originCity"
                            name="originCity"
                            value={formData.originCity}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E8B57]"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="destinationCity" className="block text-gray-700 font-medium mb-2">
                            Kota Tujuan
                        </label>
                        <input
                            type="text"
                            id="destinationCity"
                            name="destinationCity"
                            value={formData.destinationCity}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E8B57]"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="distance" className="block text-gray-700 font-medium mb-2">
                            Jarak (km)
                        </label>
                        <input
                            type="number"
                            id="distance"
                            name="distance"
                            value={formData.distance}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E8B57]"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-[#2E8B57] text-white py-2 px-4 rounded-lg hover:bg-[#276746] transition"
                    >
                        Pesan Sekarang
                    </button>
                </form>
            </div>
        </div>
    );
}

export default BookingForm;
