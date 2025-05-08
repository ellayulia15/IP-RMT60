const express = require('express');
const router = express.Router();
const { sequelize, Package, Vehicle } = require('../models');
const { getAIResponse } = require('../helpers/openAI');

const parseUserIntent = (message) => {
    const keywords = {
        wisata: ['wisata', 'paket', 'tour', 'destinasi', 'liburan', 'ziarah'],
        kendaraan: ['kendaraan', 'mobil', 'transportasi', 'sewa', 'rental', 'bus', 'elf'],
        harga: ['harga', 'biaya', 'tarif', 'berapa']
    };

    const messageLower = message.toLowerCase();
    let intent = null;
    for (const [key, words] of Object.entries(keywords)) {
        if (words.some(word => messageLower.includes(word))) {
            intent = key;
            break;
        }
    }
    return intent;
};

const fetchDataByIntent = async (intent, message) => {
    try {
        switch (intent) {
            case 'wisata':
                const packages = await Package.findAll({
                    attributes: ['packageName', 'startPrice'],
                    where: sequelize.literal('LOWER("packageName") LIKE :search'),
                    replacements: { search: `%${message.toLowerCase()}%` }
                });

                return packages.map(pkg => ({
                    name: pkg.packageName,
                    price: `Rp${parseInt(pkg.startPrice).toLocaleString()}`
                }));

            case 'kendaraan':
                const vehicles = await Vehicle.findAll({
                    attributes: ['vehicleName', 'capacity', 'pricePerDay'],
                    where: sequelize.literal('LOWER("vehicleName") LIKE :search'),
                    replacements: { search: `%${message.toLowerCase()}%` }
                });

                return vehicles.map(v => ({
                    name: v.vehicleName,
                    capacity: v.capacity,
                    price: `Rp${v.pricePerDay.toLocaleString()}/hari`
                }));

            default:
                return [];
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
};

const formatResponse = (intent, message, data) => {
    if (data.length === 0) {
        switch (intent) {
            case 'wisata':
                return 'Berikut adalah semua paket wisata yang tersedia:\n' +
                    '• 4H3M ZIARAH MADURA-JATIM-JATENG-DIY\n' +
                    '• 3H2M ZIARAH MADURA-JATIM-JATENG-DIY\n' +
                    '• 3H2M YOGYAKARTA\n' +
                    '• 3H2M GILI KETAPANG-BROMO-MADAKARIPURA\n' +
                    '• 3H2M BATU MALANG\n' +
                    '• 3H2M BATU MALANG-BROMO\n' +
                    '• 3H2M BALI\n' +
                    '• 2H1M ZIARAH WALI 5 JATIM\n' +
                    '• Dan masih banyak lagi...\n\n' +
                    'Silakan tanyakan detail paket spesifik yang Anda minati.';

            case 'kendaraan':
                return 'Berikut adalah semua kendaraan yang tersedia:\n' +
                    '• Bus SHD (50 orang)\n' +
                    '• Bus HDD (50 orang)\n' +
                    '• Bus Medium (35-40 orang)\n' +
                    '• Elf/Hiace (19 orang)\n' +
                    '• Elf Giga (20 orang)\n' +
                    '• Mobil (7 orang)\n\n' +
                    'Silakan tanyakan detail kendaraan spesifik yang Anda minati.';

            default:
                return 'Maaf, saya tidak menemukan informasi spesifik yang Anda cari. Silakan tanyakan tentang paket wisata atau sewa kendaraan yang tersedia.';
        }
    }

    switch (intent) {
        case 'wisata':
            return `Berikut paket wisata yang sesuai:\n${data.map(pkg =>
                `• ${pkg.name} (Mulai dari ${pkg.price})`).join('\n')}`;

        case 'kendaraan':
            return `Berikut kendaraan yang tersedia:\n${data.map(v =>
                `• ${v.name} (Kapasitas: ${v.capacity} orang, Harga: ${v.price})`).join('\n')}`;

        default:
            return data;
    }
};

router.post('/', async (req, res) => {
    try {
        const { message } = req.body;
        if (!message || typeof message !== 'string') {
            return res.status(400).json({
                response: 'Mohon masukkan pesan yang valid.',
                type: 'error'
            });
        }

        const intent = parseUserIntent(message);
        let response;

        if (intent) {
            const data = await fetchDataByIntent(intent, message);
            response = formatResponse(intent, message, data);
        } else {
            response = await getAIResponse(message);
        }

        res.json({
            response,
            type: intent ? 'database' : 'ai'
        });
    } catch (error) {
        console.error('Error processing chat request:', error);
        res.status(500).json({
            response: 'Maaf, terjadi kesalahan dalam memproses permintaan Anda. Silakan coba lagi.',
            type: 'error'
        });
    }
});

module.exports = router;
