import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';

function BookingForm() {
    const [formData, setFormData] = useState({
        startDate: '',
        endDate: '',
        originCity: '',
        destinationCity: '',
        distance: '',
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const VehicleId = 1;
            const token = localStorage.getItem('access_token');
            if (!token) {
                alert('Anda harus login terlebih dahulu!');
                return navigate('/login');
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
                alert('Pemesanan berhasil!');
                navigate('/vehicles');
            }
        } catch (error) {
            console.error('Gagal memesan kendaraan:', error);
            alert('Terjadi kesalahan saat memesan kendaraan.');
        }
    };

    return (
        <div className="min-h-screen bg-[#F5FFF5] font-sans text-gray-800 p-8 flex justify-center items-center">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded-lg shadow-md w-full max-w-md"
            >
                <h1 className="text-2xl font-bold text-[#2E8B57] mb-6 text-center">
                    Form Pemesanan Kendaraan
                </h1>
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
    );
}

export default BookingForm;
