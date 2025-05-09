import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

export default function HistoryPage() {
    const [packageHistory, setPackageHistory] = useState([]);
    const [vehicleHistory, setVehicleHistory] = useState([]);
    const [notification, setNotification] = useState({ type: '', message: '' });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchHistories = async () => {
            try {
                const token = localStorage.getItem("access_token");
                const headers = { Authorization: `Bearer ${token}` };

                const [packageRes, vehicleRes] = await Promise.all([
                    axios.get("http://localhost:3000/order/history", { headers }),
                    axios.get("http://localhost:3000/booking/history", { headers }),
                ]);

                setPackageHistory(packageRes.data);
                setVehicleHistory(vehicleRes.data);
            } catch (error) {
                console.error("Error fetching histories:", error);
                setNotification({
                    type: 'error',
                    message: 'Gagal memuat riwayat pemesanan. Silakan coba lagi nanti.'
                });
            } finally {
                setLoading(false);
            }
        };

        fetchHistories();
    }, []);

    const handleDeleteOrder = async (orderId) => {
        try {
            const token = localStorage.getItem("access_token");
            const headers = { Authorization: `Bearer ${token}` };

            await axios.delete(`http://localhost:3000/order/${orderId}`, { headers });
            setPackageHistory((prev) => prev.filter((order) => order.id !== orderId));
            setNotification({
                type: 'success',
                message: 'Riwayat pemesanan paket berhasil dihapus.'
            });

            setTimeout(() => setNotification({ type: '', message: '' }), 3000);
        } catch (error) {
            console.error("Error deleting order:", error);
            setNotification({
                type: 'error',
                message: 'Gagal menghapus riwayat pemesanan paket.'
            });
        }
    };

    const handleDeleteBooking = async (bookingId) => {
        try {
            const token = localStorage.getItem("access_token");
            const headers = { Authorization: `Bearer ${token}` };

            await axios.delete(`http://localhost:3000/booking/${bookingId}`, { headers });
            setVehicleHistory((prev) => prev.filter((booking) => booking.id !== bookingId));
            setNotification({
                type: 'success',
                message: 'Riwayat pemesanan kendaraan berhasil dihapus.'
            });

            setTimeout(() => setNotification({ type: '', message: '' }), 3000);
        } catch (error) {
            console.error("Error deleting booking:", error);
            setNotification({
                type: 'error',
                message: 'Gagal menghapus riwayat pemesanan kendaraan.'
            });
        }
    };

    const handleRetryPayment = async (orderId, type) => {
        try {
            const token = localStorage.getItem("access_token");
            const headers = { Authorization: `Bearer ${token}` };

            const grossAmount = type === "package"
                ? packageHistory.find((order) => order.id === orderId)?.Package.startPrice
                : vehicleHistory.find((booking) => booking.id === orderId)?.totalPrice;

            if (!grossAmount) {
                setNotification({
                    type: 'error',
                    message: 'Data pembayaran tidak valid.'
                });
                return;
            }

            const response = await axios.post('http://localhost:3000/payment', {
                order_id: orderId,
                gross_amount: parseInt(grossAmount),
                type: type === "package" ? "order" : "booking"
            }, { headers });

            if (response.data.redirectUrl) {
                navigate('/transaction-status', {
                    state: {
                        order_id: `${type === "package" ? "order" : "booking"}-${orderId}`,
                        returnUrl: '/history'
                    }
                });
                window.location.href = response.data.redirectUrl;
            } else {
                setNotification({
                    type: 'error',
                    message: 'URL pembayaran tidak tersedia.'
                });
            }
        } catch (error) {
            console.error("Error initiating payment:", error.response?.data || error.message);
            setNotification({
                type: 'error',
                message: 'Gagal memproses pembayaran. Silakan coba lagi.'
            });
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#A7D7A7] flex items-center justify-center">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <p className="text-gray-600">Memuat data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#A7D7A7] py-8">
            {notification.message && (
                <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${notification.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' :
                    notification.type === 'error' ? 'bg-red-100 text-red-800 border border-red-200' :
                        'bg-blue-100 text-blue-800 border border-blue-200'
                    }`}>
                    {notification.message}
                </div>
            )}

            <div className="max-w-6xl mx-auto px-4">
                <h1 className="text-3xl font-bold text-center text-[#2E8B57] mb-6">
                    Riwayat Pemesanan
                </h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Package History Section */}
                    <div className="bg-white shadow-md rounded p-4">
                        <h2 className="text-2xl font-semibold text-[#2E8B57] mb-4">
                            Pemesanan Paket Wisata
                        </h2>
                        {packageHistory.length > 0 ? (
                            <ul className="space-y-4">
                                {packageHistory.map((order) => (
                                    <li
                                        key={order.id}
                                        className="border-b pb-2 last:border-b-0"
                                    >
                                        <p className="font-bold text-lg">
                                            {order.Package.packageName}
                                        </p>
                                        <p>
                                            Harga Mulai: Rp
                                            {parseInt(order.Package.startPrice).toLocaleString()}
                                        </p>
                                        <p>Tanggal Pemesanan: {new Date(order.bookingDate).toLocaleDateString()}</p>
                                        <p>Status: {order.status}</p>
                                        <p>Pemesan: {order.User.fullName}</p>
                                        <div className="flex gap-2 mt-2">
                                            <button
                                                onClick={() => handleDeleteOrder(order.id)}
                                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                                            >
                                                Hapus
                                            </button>
                                            {order.status !== "Paid" && (
                                                <button
                                                    onClick={() => handleRetryPayment(order.id, "package")}
                                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                                                >
                                                    Bayar
                                                </button>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500">Belum ada riwayat pemesanan paket wisata.</p>
                        )}
                    </div>

                    {/* Vehicle History Section */}
                    <div className="bg-white shadow-md rounded p-4">
                        <h2 className="text-2xl font-semibold text-[#2E8B57] mb-4">
                            Pemesanan Sewa Kendaraan
                        </h2>
                        {vehicleHistory.length > 0 ? (
                            <ul className="space-y-4">
                                {vehicleHistory.map((booking) => (
                                    <li
                                        key={booking.id}
                                        className="border-b pb-2 last:border-b-0"
                                    >
                                        <p className="font-bold text-lg">
                                            {booking.Vehicle.vehicleName}
                                        </p>
                                        <p>
                                            Harga: Rp
                                            {parseInt(booking.totalPrice).toLocaleString()}
                                        </p>
                                        <p>Tanggal Pemesanan: {new Date(booking.startDate).toLocaleDateString()}</p>
                                        <p>Status: {booking.status}</p>
                                        <div className="flex gap-2 mt-2">
                                            <button
                                                onClick={() => handleDeleteBooking(booking.id)}
                                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                                            >
                                                Hapus
                                            </button>
                                            {booking.status !== "Paid" && (
                                                <button
                                                    onClick={() => handleRetryPayment(booking.id, "vehicle")}
                                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                                                >
                                                    Bayar
                                                </button>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500">Belum ada riwayat pemesanan sewa kendaraan.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
