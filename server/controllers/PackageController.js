const { Package } = require('../models');
function extractFileId(url) {
    const match = url.match(/\/d\/(.+?)\//)
    return match ? match[1] : null
}
module.exports = class PackageController {
    static async packages(req, res) {
        try {
            const packages = await Package.findAll({
                order: [['id', 'ASC']]
            });

            res.status(200).json(packages);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async packageById(req, res) {
        try {
            const { id } = req.params;

            const foundPackage = await Package.findByPk(id);

            if (!foundPackage) {
                return res.status(404).json({ message: 'Package not found' });
            }

            res.status(200).json(foundPackage);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async downloadPdf(req, res) {
        try {
            const { id } = req.params
            const found = await Package.findByPk(id)
            if (!found) return res.status(404).json({ message: 'Package not found' })

            const fileId = extractFileId(found.pdfLink)
            const downloadLink = `https://drive.google.com/uc?export=download&id=${fileId}`
            res.redirect(downloadLink)
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' })
        }
    }
}