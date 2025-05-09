import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useDispatch, useSelector } from 'react-redux';
import { fetchPackageById } from '../store/slices/packagesSlice';

export default function PackageDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { selectedPackage: packageDetail, loading, error } = useSelector((state) => state.packages);
    const [notification, setNotification] = useState({ type: '', message: '' });

    useEffect(() => {
        dispatch(fetchPackageById(id));
    }, [dispatch, id]);

    const handleDownloadPdf = async () => {
        try {
            window.open(`http://localhost:3000/packages/${id}/download`, '_blank');
        } catch (err) {
            console.error(err);
            setNotification({
                type: 'error',
                message: 'Gagal mengunduh file PDF.'
            });
            setTimeout(() => setNotification({ type: '', message: '' }), 3000);
        }
    };

    const handleOrder = () => {
        const token = localStorage.getItem("access_token");
        if (!token) {
            setNotification({
                type: 'error',
                message: 'Anda harus login terlebih dahulu untuk memesan paket wisata.'
            });
            setTimeout(() => {
                setNotification({ type: '', message: '' });
                navigate("/login");
            }, 2000);
            return;
        }
        navigate(`/order/${id}`);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#A7D7A7] flex items-center justify-center">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <p className="text-gray-600">Memuat detail paket...</p>
                </div>
            </div>
        );
    }

    if (error || !packageDetail) {
        return (
            <div className="min-h-screen bg-[#A7D7A7] flex items-center justify-center">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="text-red-600">{error || "Data paket tidak ditemukan"}</div>
                    <button
                        onClick={() => navigate("/packages")}
                        className="mt-4 px-4 py-2 bg-[#2E8B57] text-white rounded hover:bg-[#276746] transition"
                    >
                        Kembali ke Daftar Paket
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#A7D7A7] py-8">
            {notification.message && (
                <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${notification.type === 'success'
                        ? 'bg-green-100 text-green-800 border border-green-200'
                        : 'bg-red-100 text-red-800 border border-red-200'
                    }`}>
                    {notification.message}
                </div>
            )}

            <div className="container mx-auto px-4">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    {packageDetail.imageUrl && (
                        <img
                            src={packageDetail.imageUrl}
                            alt={packageDetail.packageName}
                            className="w-full h-72 object-cover object-center"
                        />
                    )}

                    <div className="p-6">
                        <h1 className="text-3xl font-bold text-[#2E8B57] mb-4">
                            {packageDetail.packageName}
                        </h1>

                        <div className="mb-6">
                            <p className="text-2xl font-semibold text-gray-700">
                                Harga mulai dari: Rp{parseInt(packageDetail.startPrice).toLocaleString()}
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-4">
                            <button
                                onClick={handleOrder}
                                className="px-6 py-2 bg-[#2E8B57] text-white font-semibold rounded hover:bg-[#276746] transition"
                            >
                                Pesan Sekarang
                            </button>

                            <button
                                onClick={handleDownloadPdf}
                                className="px-6 py-2 border-2 border-[#2E8B57] text-[#2E8B57] font-semibold rounded hover:bg-[#2E8B57] hover:text-white transition"
                            >
                                Unduh Brosur
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
