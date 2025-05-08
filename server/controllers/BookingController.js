const { User, Booking, Vehicle } = require("../models");

module.exports = class BookingController {
    static async booking(req, res) {
        try {
            const { VehicleId } = req.params;
            const { startDate, endDate, originCity, destinationCity, distance } = req.body;
            const UserId = req.user.id;

            const vehicle = await Vehicle.findByPk(VehicleId);
            if (!vehicle) {
                return res.status(404).json({ message: "Kendaraan tidak ditemukan" });
            }

            const rentalDays = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
            const totalPrice = rentalDays * vehicle.pricePerDay;

            const booking = await Booking.create({
                UserId,
                VehicleId,
                startDate,
                endDate,
                originCity,
                destinationCity,
                distance,
                totalPrice,
                status: 'Pending',
                paymentUrl: null
            });

            res.status(201).json({
                message: "Pemesanan berhasil dibuat",
                booking,
            });
        } catch (error) {
            console.error("Error saat membuat booking:", error);
            res.status(500).json({ message: "Terjadi kesalahan pada server" });
        }
    }

    static async riwayat(req, res) {
        try {
            const userId = req.user.id;

            const bookings = await Booking.findAll({
                where: { UserId: userId },
                include: [
                    {
                        model: User,
                        attributes: ['fullName']
                    },
                    {
                        model: Vehicle,
                        attributes: ['vehicleName', 'capacity']
                    }
                ],
                order: [['createdAt', 'DESC']]
            });

            res.status(200).json(bookings);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async deleteBooking(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.id;

            const booking = await Booking.findOne({
                where: {
                    id,
                    UserId: userId
                }
            });

            if (!booking) {
                return res.status(404).json({ message: 'Booking tidak ditemukan' });
            }

            await booking.destroy();

            res.status(200).json({ message: 'Booking berhasil dihapus' });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}