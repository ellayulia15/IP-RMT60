const request = require('supertest');
const app = require('../app');
const { Vehicle } = require('../models');

let testVehicle;

beforeEach(async () => {
    testVehicle = await Vehicle.create({
        vehicleName: 'Test Vehicle',
        capacity: 4,
        pricePerDay: 500000,
        imageUrl: 'https://example.com/vehicle.jpg'
    });
});

afterEach(async () => {
    await Vehicle.destroy({ where: {} });
});

describe('VehicleController', () => {
    describe('GET /vehicles', () => {
        it('should return all vehicles', async () => {
            const res = await request(app).get('/vehicles');

            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBeTruthy();
            expect(res.body.length).toBeGreaterThan(0);
            expect(res.body[0]).toHaveProperty('vehicleName', 'Test Vehicle');
            expect(res.body[0]).toHaveProperty('capacity', 4);
            expect(res.body[0]).toHaveProperty('pricePerDay', 500000);
            expect(res.body[0]).toHaveProperty('imageUrl', 'https://example.com/vehicle.jpg');
        });

        it('should return empty array when no vehicles exist', async () => {
            await Vehicle.destroy({ where: {} });
            const res = await request(app).get('/vehicles');

            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBeTruthy();
            expect(res.body.length).toBe(0);
        });

        it('should return 500 if database error occurs', async () => {
            const originalFindAll = Vehicle.findAll;
            Vehicle.findAll = jest.fn().mockRejectedValue(new Error('Database error'));

            const res = await request(app).get('/vehicles');

            expect(res.status).toBe(500);
            expect(res.body).toHaveProperty('message', 'Internal server error');
            expect(res.body).toHaveProperty('error', 'Database error');

            Vehicle.findAll = originalFindAll;
        });
    });

    describe('GET /vehicles/:id', () => {
        it('should return a specific vehicle', async () => {
            const res = await request(app).get(`/vehicles/${testVehicle.id}`);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('vehicleName', 'Test Vehicle');
            expect(res.body).toHaveProperty('capacity', 4);
            expect(res.body).toHaveProperty('pricePerDay', 500000);
            expect(res.body).toHaveProperty('imageUrl', 'https://example.com/vehicle.jpg');
        });

        it('should return 400 when vehicle ID is missing', async () => {
            const res = await request(app).get('/vehicles/');

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('message', 'Vehicle ID is required');
            expect(res.body).toHaveProperty('error', 'Missing ID parameter');
        });

        it('should return 400 when vehicle ID is empty', async () => {
            const res = await request(app).get('/vehicles/ ');

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('message', 'Vehicle ID is required');
            expect(res.body).toHaveProperty('error', 'Missing ID parameter');
        });

        it('should return 400 when vehicle ID is not a number', async () => {
            const res = await request(app).get('/vehicles/abc');

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('message', 'Invalid vehicle ID format');
            expect(res.body).toHaveProperty('error', 'ID must be a positive integer');
        });

        it('should return 400 when vehicle ID is zero', async () => {
            const res = await request(app).get('/vehicles/0');

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('message', 'Invalid vehicle ID format');
            expect(res.body).toHaveProperty('error', 'ID must be a positive integer');
        });

        it('should return 400 when vehicle ID is negative', async () => {
            const res = await request(app).get('/vehicles/-1');

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('message', 'Invalid vehicle ID format');
            expect(res.body).toHaveProperty('error', 'ID must be a positive integer');
        });

        it('should return 400 when vehicle ID is a decimal', async () => {
            const res = await request(app).get('/vehicles/1.5');

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('message', 'Invalid vehicle ID format');
            expect(res.body).toHaveProperty('error', 'ID must be a positive integer');
        });

        it('should return 404 for non-existent vehicle', async () => {
            const res = await request(app).get('/vehicles/999999');

            expect(res.status).toBe(404);
            expect(res.body).toHaveProperty('message', 'Vehicle not found');
            expect(res.body).toHaveProperty('error', 'No vehicle found with ID 999999');
        });

        it('should return 500 if database error occurs', async () => {
            const originalFindByPk = Vehicle.findByPk;
            Vehicle.findByPk = jest.fn().mockRejectedValue(new Error('Database error'));

            const res = await request(app).get(`/vehicles/${testVehicle.id}`);

            expect(res.status).toBe(500);
            expect(res.body).toHaveProperty('message', 'Internal server error');
            expect(res.body).toHaveProperty('error', 'Database error');

            Vehicle.findByPk = originalFindByPk;
        });
    });
});