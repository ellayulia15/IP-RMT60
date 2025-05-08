import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';

function PaymentPage() {
    const navigate = useNavigate();

    useEffect(() => {
        const initiatePayment = async () => {
            try {
                const response = await axios.post('http://localhost:3000/payment', {
                    order_id: 'ORDER123',
                    gross_amount: 100000,
                });

                if (response.data.redirectUrl) {
                    window.location.href = response.data.redirectUrl;
                } else {
                    alert('URL pembayaran tidak tersedia.');
                }
            } catch (error) {
                console.error('Payment initiation failed:', error.response?.data || error.message);
                navigate('/transaction-status', { state: { success: false } });
            }
        };

        initiatePayment();
    }, [navigate]);

    return <div>Redirecting to payment...</div>;
}

export default PaymentPage;
