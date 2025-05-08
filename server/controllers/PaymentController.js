const midtransClient = require('midtrans-client');

const snap = new midtransClient.Snap({
    isProduction: false,
    serverKey: process.env.MIDTRANS_SERVER_KEY,
});

const core = new midtransClient.CoreApi({
    isProduction: false,
    serverKey: process.env.MIDTRANS_SERVER_KEY,
    clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

class PaymentController {
    static async createTransaction(req, res) {
        const { order_id, gross_amount, type } = req.body;

        if (!order_id || !gross_amount || !type) {
            return res.status(400).json({ error: 'Data pembayaran tidak lengkap.' });
        }

        const parameter = {
            transaction_details: {
                order_id: `${type}-${order_id}`,
                gross_amount: parseInt(gross_amount),
            },
            credit_card: {
                secure: true,
            },
        };

        try {
            const transaction = await snap.createTransaction(parameter);
            res.status(201).json({ redirectUrl: transaction.redirect_url });
        } catch (error) {
            console.error('Error creating transaction:', error.message);
            res.status(500).json({ error: 'Payment initiation failed.' });
        }
    }

    static async handleNotification(req, res) {
        try {
            const notification = req.body;
            const orderId = notification.order_id;

            const response = await core.transaction.status(orderId);
            const { transaction_status, fraud_status } = response;

            console.log(`Transaction ID: ${orderId} | Status: ${transaction_status} | Fraud: ${fraud_status}`);

            if (transaction_status === 'capture') {
                if (fraud_status === 'accept') {
                    console.log(`Transaction ${orderId} captured and accepted.`);
                } else {
                    console.log(`Transaction ${orderId} captured but flagged as fraud.`);
                }
            } else if (transaction_status === 'settlement') {
                console.log(`Transaction ${orderId} successfully settled.`);
            } else if (transaction_status === 'pending') {
                console.log(`Transaction ${orderId} is pending.`);
            } else {
                console.log(`Transaction ${orderId} failed or cancelled.`);
            }

            res.status(200).send('OK');
        } catch (error) {
            console.error('Error processing notification:', error.message);
            res.status(500).send('Notification processing failed.');
        }
    }

    static async updateTransactionStatus(req, res) {
        const { order_id } = req.body;

        if (!order_id) {
            return res.status(400).json({ error: 'Order ID is required.' });
        }

        try {
            console.log(`Updating transaction status for order_id: ${order_id}`);

            res.status(200).json({ message: 'Transaction status updated to Paid.' });
        } catch (error) {
            console.error('Error updating transaction status:', error.message);
            res.status(500).json({ error: 'Failed to update transaction status.' });
        }
    }

    static async getTransactionStatus(req, res) {
        const { order_id } = req.params;

        if (!order_id) {
            return res.status(400).json({ error: 'Order ID is required.' });
        }

        try {
            const response = await core.transaction.status(order_id);
            const { transaction_status } = response;

            let status;
            if (transaction_status === 'capture' || transaction_status === 'settlement') {
                status = 'Paid';
            } else if (transaction_status === 'pending') {
                status = 'Pending';
            } else {
                status = 'Failed';
            }

            res.status(200).json({ status });
        } catch (error) {
            console.error('Error fetching transaction status:', error.message);
            res.status(500).json({ error: 'Failed to fetch transaction status.' });
        }
    }
}

module.exports = PaymentController;
