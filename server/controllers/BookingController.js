const { Booking, Vehicle } = require("../models");

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

    }
}