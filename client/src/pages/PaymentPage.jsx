import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';

function PaymentPage() {
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initiatePayment = async () => {
            try {
                setLoading(true);
                const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/payment`, {
                    order_id: 'ORDER123',
                    gross_amount: 100000,
                });

                if (response.data.redirectUrl) {
                    window.location.href = response.data.redirectUrl;
                } else {
                    setError('URL pembayaran tidak tersedia. Silakan coba lagi nanti.');
                    setTimeout(() => {
                        navigate('/history');
                    }, 3000);
                }
            } catch (error) {
                console.error('Payment initiation failed:', error.response?.data || error.message);
                setError(error.response?.data?.message || 'Gagal memulai pembayaran. Silakan coba lagi.');
                setTimeout(() => {
                    navigate('/history');
                }, 3000);
            } finally {
                setLoading(false);
            }
        };

        initiatePayment();
    }, [navigate]);

    return (
        <div className="min-h-screen bg-[#A7D7A7] flex items-center justify-center px-4">
            <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
                {loading ? (
                    <div>
                        <h2 className="text-2xl font-bold text-[#2E8B57] mb-4">
                            Mempersiapkan Pembayaran
                        </h2>
                        <p className="text-gray-600">
                            Mohon tunggu sebentar...
                        </p>
                    </div>
                ) : error ? (
                    <div>
                        <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-red-100 rounded-full">
                            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-red-600 mb-4">
                            Terjadi Kesalahan
                        </h2>
                        <p className="text-gray-600 mb-4">{error}</p>
                        <p className="text-sm text-gray-500">
                            Anda akan dialihkan dalam beberapa detik...
                        </p>
                    </div>
                ) : (
                    <div>
                        <h2 className="text-2xl font-bold text-[#2E8B57] mb-4">
                            Mengalihkan ke Halaman Pembayaran
                        </h2>
                        <p className="text-gray-600">
                            Mohon tunggu sebentar...
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default PaymentPage;
