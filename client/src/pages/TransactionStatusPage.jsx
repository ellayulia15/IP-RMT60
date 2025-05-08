import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import axios from 'axios';

function TransactionStatusPage() {
    const location = useLocation();
    const { order_id } = location.state || {};
    const [status, setStatus] = useState(null);

    useEffect(() => {
        const fetchTransactionStatus = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/payment/status/${order_id}`);
                setStatus(response.data.status);
            } catch (error) {
                console.error('Error fetching transaction status:', error);
                setStatus('Error');
            }
        };

        if (order_id) {
            fetchTransactionStatus();
        }
    }, [order_id]);

    return (
        <div className="p-6 max-w-6xl mx-auto text-center">
            {status === 'Paid' ? (
                <div>
                    <h1 className="text-3xl font-bold text-green-600">Pembayaran Berhasil!</h1>
                    <p className="mt-4">Terima kasih telah melakukan pembayaran.</p>
                </div>
            ) : status === 'Pending' ? (
                <div>
                    <h1 className="text-3xl font-bold text-yellow-600">Pembayaran Pending</h1>
                    <p className="mt-4">Silakan selesaikan pembayaran Anda.</p>
                </div>
            ) : status === 'Failed' ? (
                <div>
                    <h1 className="text-3xl font-bold text-red-600">Pembayaran Gagal</h1>
                    <p className="mt-4">Silakan coba lagi atau hubungi layanan pelanggan kami.</p>
                </div>
            ) : (
                <div>
                    <h1 className="text-3xl font-bold text-gray-600">Memuat Status Pembayaran...</h1>
                </div>
            )}
        </div>
    );
}

export default TransactionStatusPage;
