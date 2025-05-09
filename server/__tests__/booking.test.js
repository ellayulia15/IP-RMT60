const request = require('supertest');
const app = require('../app');
const { User, Vehicle, Booking } = require('../models');
const { signToken } = require('../helpers/jwt');

let testUser;
let testVehicle;
let access_token;

beforeEach(async () => {
    testUser = await User.create({
        fullName: 'Test User',
        email: 'test@example.com',
        password: 'hashedpassword',
        authType: 'manual'
    });

    testVehicle = await Vehicle.create({
        vehicleName: 'Test Vehicle',
        capacity: 4,
        pricePerDay: 500000,
        imageUrl: 'https://example.com/vehicle.jpg'
    });

    access_token = signToken({ id: testUser.id });
});

afterEach(async () => {
    await Booking.destroy({ where: {} });
    await Vehicle.destroy({ where: {} });
    await User.destroy({ where: {} });
});

describe('BookingController', () => {
    describe('POST /booking/:VehicleId', () => {
        const bookingData = {
            startDate: '2025-06-01',
            endDate: '2025-06-03',
            originCity: 'Jakarta',
            destinationCity: 'Bandung',
            distance: 150
        };

        it('should create a booking successfully', async () => {
            const res = await request(app)
                .post(`/booking/${testVehicle.id}`)
                .set('Authorization', `Bearer ${access_token}`)
                .send(bookingData);

            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty('message', 'Pemesanan berhasil dibuat');
            expect(res.body.booking).toHaveProperty('UserId', testUser.id);
            expect(res.body.booking).toHaveProperty('VehicleId', testVehicle.id);
            expect(res.body.booking).toHaveProperty('totalPrice', 1000000); // 2 days * 500000
        });

        it('should return 404 for non-existent vehicle', async () => {
            const res = await request(app)
                .post('/booking/999999')
                .set('Authorization', `Bearer ${access_token}`)
                .send(bookingData);

            expect(res.status).toBe(404);
            expect(res.body).toHaveProperty('message', 'Kendaraan tidak ditemukan');
        });

        it('should return 401 without authentication', async () => {
            const res = await request(app)
                .post(`/booking/${testVehicle.id}`)
                .send(bookingData);

            expect(res.status).toBe(401);
        });
    });

    describe('GET /booking/history', () => {
        it('should return booking history for authenticated user', async () => {
            // Create a test booking first
            await Booking.create({
                UserId: testUser.id,
                VehicleId: testVehicle.id,
                startDate: '2025-06-01',
                endDate: '2025-06-03',
                originCity: 'Jakarta',
                destinationCity: 'Bandung',
                distance: 150,
                totalPrice: 1000000,
                status: 'Pending'
            });

            const res = await request(app)
                .get('/booking/history')
                .set('Authorization', `Bearer ${access_token}`);

            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBeTruthy();
            expect(res.body.length).toBeGreaterThan(0);
            expect(res.body[0]).toHaveProperty('UserId', testUser.id);
            expect(res.body[0]).toHaveProperty('User');
            expect(res.body[0]).toHaveProperty('Vehicle');
        });

        it('should return 401 without authentication', async () => {
            const res = await request(app).get('/booking/history');
            expect(res.status).toBe(401);
        });
    });

    describe('DELETE /booking/:id', () => {
        let testBooking;

        beforeEach(async () => {
            testBooking = await Booking.create({
                UserId: testUser.id,
                VehicleId: testVehicle.id,
                startDate: '2025-06-01',
                endDate: '2025-06-03',
                originCity: 'Jakarta',
                destinationCity: 'Bandung',
                distance: 150,
                totalPrice: 1000000,
                status: 'Pending'
            });
        });

        it('should delete booking successfully', async () => {
            const res = await request(app)
                .delete(`/booking/${testBooking.id}`)
                .set('Authorization', `Bearer ${access_token}`);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('message', 'Booking berhasil dihapus');

            // Verify booking is actually deleted
            const deletedBooking = await Booking.findByPk(testBooking.id);
            expect(deletedBooking).toBeNull();
        });

        it('should return 404 for non-existent booking', async () => {
            const res = await request(app)
                .delete('/booking/999999')
                .set('Authorization', `Bearer ${access_token}`);

            expect(res.status).toBe(404);
            expect(res.body).toHaveProperty('message', 'Booking tidak ditemukan');
        });

        it('should return 401 without authentication', async () => {
            const res = await request(app).delete(`/booking/${testBooking.id}`);
            expect(res.status).toBe(401);
        });

        it('should return 404 when trying to delete another user\'s booking', async () => {
            // Create another user and their token
            const anotherUser = await User.create({
                fullName: 'Another User',
                email: 'another@example.com',
                password: 'hashedpassword',
                authType: 'manual'
            });
            const anotherToken = signToken({ id: anotherUser.id });

            const res = await request(app)
                .delete(`/booking/${testBooking.id}`)
                .set('Authorization', `Bearer ${anotherToken}`);

            expect(res.status).toBe(404);
            expect(res.body).toHaveProperty('message', 'Booking tidak ditemukan');
        });
    });
});