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
}