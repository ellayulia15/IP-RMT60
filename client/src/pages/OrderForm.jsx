import { useParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import axios from "axios";

export default function OrderForm() {
    const { PackageId } = useParams();
    const [packageDetail, setPackageDetail] = useState(null);
    const [bookingDate, setBookingDate] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPackage = async () => {
            try {
                const { data } = await axios.get(`http://localhost:3000/packages/${PackageId}`);
                setPackageDetail(data);
            } catch (err) {
                console.error(err);
                alert("Gagal memuat data paket.");
            }
        };

        fetchPackage();
    }, [PackageId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("access_token");
            const { data } = await axios.post(
                "http://localhost:3000/order",
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

            alert("Pemesanan berhasil!");
            navigate("/order/history");
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Gagal membuat order.");
        }
    };

    if (!packageDetail) return <div className="text-center mt-10">Loading...</div>;

    return (
        <div className="max-w-xl mx-auto p-6 mt-8 border rounded shadow">
            <h1 className="text-2xl font-bold mb-4 text-[#2E8B57]">Form Pemesanan</h1>

            <p className="mb-2"><strong>Paket:</strong> {packageDetail.packageName}</p>
            <p className="mb-4"><strong>Harga mulai:</strong> Rp{parseInt(packageDetail.startPrice).toLocaleString()}</p>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block font-medium">Tanggal Pemesanan:</label>
                    <input
                        type="date"
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        className="border p-2 w-full rounded"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                >
                    Konfirmasi Pemesanan
                </button>
            </form>
        </div>
    );
}
