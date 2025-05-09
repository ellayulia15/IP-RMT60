import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import axios from 'axios';

function TransactionStatusPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { order_id, returnUrl } = location.state || {};
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (!token || !order_id) {
            navigate('/');
            return;
        }

        const checkStatus = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/payment/status/${order_id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setStatus(response.data.status);

                if (response.data.status === 'Paid') {
                    await axios.post('http://localhost:3000/payment/update-status',
                        { order_id },
                        { headers: { Authorization: `Bearer ${token}` } }
                    );

                    setTimeout(() => {
                        navigate(returnUrl || '/history');
                    }, 3000);
                }
            } catch (error) {
                console.error('Error fetching transaction status:', error);
                setStatus('Error');
            } finally {
                setLoading(false);
            }
        };

        checkStatus();
        const interval = setInterval(checkStatus, 5000);

        return () => clearInterval(interval);
    }, [order_id, navigate, returnUrl]);

    return (
        <div className="min-h-screen bg-[#A7D7A7] flex items-center justify-center px-4">
            <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
                {loading ? (
                    <div>
                        <h1 className="text-2xl font-bold text-gray-600 mb-4">Memuat Status Pembayaran...</h1>
                        <p className="text-gray-500">Mohon tunggu sebentar...</p>
                    </div>
                ) : status === 'Paid' ? (
                    <div>
                        <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-green-600 mb-4">Pembayaran Berhasil!</h1>
                        <p className="text-gray-600 mb-4">Terima kasih telah melakukan pembayaran.</p>
                        <p className="text-sm text-gray-500">Anda akan dialihkan dalam beberapa detik...</p>
                    </div>
                ) : status === 'Pending' ? (
                    <div>
                        <div className="w-16 h-16 bg-yellow-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                            <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-yellow-600 mb-4">Pembayaran Pending</h1>
                        <p className="text-gray-600">Silakan selesaikan pembayaran Anda.</p>
                    </div>
                ) : (
                    <div>
                        <div className="w-16 h-16 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-red-600 mb-4">Pembayaran Gagal</h1>
                        <p className="text-gray-600 mb-4">Silakan coba lagi atau hubungi layanan pelanggan kami.</p>
                        <button
                            onClick={() => navigate(returnUrl || '/history')}
                            className="px-6 py-2 bg-[#2E8B57] text-white rounded hover:bg-[#276746] transition"
                        >
                            Kembali
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default TransactionStatusPage;
