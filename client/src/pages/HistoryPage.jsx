import { useEffect, useState } from "react";
import axios from "axios";

export default function HistoryPage() {
    const [packageHistory, setPackageHistory] = useState([]);
    const [vehicleHistory, setVehicleHistory] = useState([]);

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
            alert("Riwayat pemesanan paket berhasil dihapus.");
        } catch (error) {
            console.error("Error deleting order:", error);
            alert("Gagal menghapus riwayat pemesanan paket.");
        }
    };

    const handleDeleteBooking = async (bookingId) => {
        try {
            const token = localStorage.getItem("access_token");
            const headers = { Authorization: `Bearer ${token}` };

            await axios.delete(`http://localhost:3000/booking/${bookingId}`, { headers });
            setVehicleHistory((prev) => prev.filter((booking) => booking.id !== bookingId));
            alert("Riwayat pemesanan kendaraan berhasil dihapus.");
        } catch (error) {
            console.error("Error deleting booking:", error);
            alert("Gagal menghapus riwayat pemesanan kendaraan.");
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
                throw new Error('Invalid gross_amount');
            }

            const response = await axios.post('http://localhost:3000/payment', {
                order_id: orderId,
                gross_amount: parseInt(grossAmount),
                type: type === "package" ? "order" : "booking"
            }, { headers });

            if (response.data.redirectUrl) {
                await axios.post('http://localhost:3000/payment/update-status', {
                    order_id: orderId
                }, { headers });

                if (type === "package") {
                    setPackageHistory((prev) =>
                        prev.map((order) =>
                            order.id === orderId ? { ...order, status: "Paid" } : order
                        )
                    );
                } else {
                    setVehicleHistory((prev) =>
                        prev.map((booking) =>
                            booking.id === orderId ? { ...booking, status: "Paid" } : booking
                        )
                    );
                }

                window.location.href = response.data.redirectUrl;
            } else {
                alert("URL pembayaran tidak tersedia.");
            }
        } catch (error) {
            console.error("Error initiating payment:", error.response?.data || error.message);
            alert("Gagal memproses pembayaran. Silakan coba lagi.");
        }
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">
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
                                    <button
                                        onClick={() => handleDeleteOrder(order.id)}
                                        className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                                    >
                                        Hapus
                                    </button>
                                    {order.status !== "Paid" && (
                                        <button
                                            onClick={() => handleRetryPayment(order.id, "package")}
                                            className="mt-2 ml-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                                        >
                                            Bayar
                                        </button>
                                    )}
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
                                    <button
                                        onClick={() => handleDeleteBooking(booking.id)}
                                        className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                                    >
                                        Hapus
                                    </button>
                                    {booking.status !== "Paid" && (
                                        <button
                                            onClick={() => handleRetryPayment(booking.id, "vehicle")}
                                            className="mt-2 ml-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                                        >
                                            Bayar
                                        </button>
                                    )}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500">Belum ada riwayat pemesanan sewa kendaraan.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
