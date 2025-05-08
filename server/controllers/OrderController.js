const { Order, User, Package } = require("../models");

module.exports = class OrderController {
    static async order(req, res) {
        try {
            const { PackageId, bookingDate } = req.body;
            const userId = req.user.id;

            if (!PackageId || !bookingDate) {
                return res.status(400).json({ message: 'Package and Booking Date are required!' });
            }

            const order = await Order.create({
                UserId: userId,
                PackageId: PackageId,
                bookingDate,
                status: 'Pending',
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

    static async history(req, res) {
        try {
            const userId = req.user.id;

            const orders = await Order.findAll({
                where: { UserId: userId },
                include: [
                    {
                        model: User,
                        attributes: ['fullName']
                    },
                    {
                        model: Package,
                        attributes: ['packageName', 'startPrice']
                    }
                ],
                order: [['createdAt', 'DESC']]
            });

            res.status(200).json(orders);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}