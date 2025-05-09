const midtransClient = require('midtrans-client');
const { Order, Booking } = require('../models');

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
            const transactionStatus = notification.transaction_status;
            const fraudStatus = notification.fraud_status;

            console.log(`Transaction notification received. Order ID: ${orderId}`);
            console.log(`Transaction status: ${transactionStatus}`);
            console.log(`Fraud status: ${fraudStatus}`);

            const [type, id] = orderId.split('-');

            if (transactionStatus === 'capture') {
                if (fraudStatus === 'challenge') {
                    await PaymentController.updateStatus(type, id, 'Pending');
                } else if (fraudStatus === 'accept') {
                    await PaymentController.updateStatus(type, id, 'Paid');
                }
            } else if (transactionStatus === 'settlement') {
                await PaymentController.updateStatus(type, id, 'Paid');
            } else if (transactionStatus === 'cancel' ||
                transactionStatus === 'deny' ||
                transactionStatus === 'expire') {
                await PaymentController.updateStatus(type, id, 'Failed');
            } else if (transactionStatus === 'pending') {
                await PaymentController.updateStatus(type, id, 'Pending');
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
            const [type, id] = order_id.split('-');
            await PaymentController.updateStatus(type, id, 'Paid');

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
            const { transaction_status, fraud_status } = response;

            let status;
            if (transaction_status === 'capture') {
                status = fraud_status === 'accept' ? 'Paid' : 'Pending';
            } else if (transaction_status === 'settlement') {
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

    static async updateStatus(type, id, status) {
        try {
            if (type === 'order') {
                await Order.update(
                    { status },
                    { where: { id } }
                );
            } else if (type === 'booking') {
                await Booking.update(
                    { status },
                    { where: { id } }
                );
            }
            console.log(`Updated ${type} ${id} status to ${status}`);
        } catch (error) {
            console.error(`Error updating ${type} status:`, error);
            throw error;
        }
    }
}

module.exports = PaymentController;
