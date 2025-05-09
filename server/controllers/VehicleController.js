const { Vehicle } = require('../models')

module.exports = class VehicleController {
    static async vehicles(req, res) {
        try {
            const vehicles = await Vehicle.findAll({
                order: [['id', 'ASC']]
            });

            res.status(200).json(vehicles);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async vehicleById(req, res) {
        try {
            const { id } = req.params;
            const vehicle = await Vehicle.findByPk(id);

            if (!vehicle) {
                return res.status(404).json({ message: 'Kendaraan tidak ditemukan' });
            }

            res.status(200).json(vehicle);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}