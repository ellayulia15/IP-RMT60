import { useParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import axios from "axios";

export default function OrderForm() {
    const { PackageId } = useParams();
    const [packageDetail, setPackageDetail] = useState(null);
    const [bookingDate, setBookingDate] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPackage = async () => {
            try {
                const { data } = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/packages/${PackageId}`);
                setPackageDetail(data);
            } catch (err) {
                console.error(err);
                setError("Gagal memuat data paket. Silakan coba lagi nanti.");
            } finally {
                setLoading(false);
            }
        };

        fetchPackage();
    }, [PackageId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            const token = localStorage.getItem("access_token");
            if (!token) {
                setError("Anda harus login terlebih dahulu!");
                setTimeout(() => {
                    navigate("/login");
                }, 2000);
                return;
            }

            await axios.post(
                `${process.env.REACT_APP_API_BASE_URL}/order/history`,
                {
                    PackageId: PackageId,
                    bookingDate,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setSuccess("Pemesanan berhasil! Mengalihkan ke halaman riwayat...");
            setTimeout(() => {
                navigate("/history#packages");
            }, 2000);

        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Gagal membuat pesanan. Silakan coba lagi.");
        }
    };

    if (loading) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center bg-[#A7D7A7]">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <p className="text-gray-600">Memuat data...</p>
                </div>
            </div>
        );
    }

    if (!packageDetail) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center bg-[#A7D7A7]">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <p className="text-red-600">{error || "Data paket tidak ditemukan"}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-8 bg-[#A7D7A7]">
            <div className="w-full max-w-xl bg-white p-6 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-4 text-[#2E8B57]">Form Pemesanan</h1>

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
                        <strong className="text-gray-700">Paket:</strong>
                        <span className="ml-2">{packageDetail.packageName}</span>
                    </p>
                    <p className="mb-2">
                        <strong className="text-gray-700">Harga mulai:</strong>
                        <span className="ml-2">Rp{parseInt(packageDetail.startPrice).toLocaleString()}</span>
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block font-medium mb-2 text-gray-700">Tanggal Pemesanan:</label>
                        <input
                            type="date"
                            value={bookingDate}
                            onChange={(e) => setBookingDate(e.target.value)}
                            className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-[#2E8B57]"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors duration-200"
                    >
                        Konfirmasi Pemesanan
                    </button>
                </form>
            </div>
        </div>
    );
}
