const { Order } = require("../models")

module.exports = class OrderController {
    static async order(req, res) {
        try {
            const { packageId, bookingDate } = req.body;
            const userId = req.user.id;

            if (!packageId || !bookingDate) {
                return res.status(400).json({ message: 'Package and Booking Date are required!' });
            }

            const order = await Order.create({
                UserId: userId,
                PackageId: packageId,
                bookingDate,
                status: 'pending',
                paymentUrl: null
            });

            res.status(201).json({
                message: 'Order created successfully',
                order
            });
        } catch (error) {
            console.log(error);
            if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
                res.status(400).json({ message: error.errors[0].message });
            } else {
                res.status(500).json({ message: 'Internal server error' });
            }
        }
    }

}