const request = require('supertest');
const app = require('../app');
const { User, Package, Order } = require('../models');
const { signToken } = require('../helpers/jwt');

let testUser;
let testPackage;
let access_token;

beforeAll(async () => {
    await User.destroy({ where: {} });
    await Package.destroy({ where: {} });
    await Order.destroy({ where: {} });
});

beforeEach(async () => {
    testUser = await User.create({
        fullName: 'Test User',
        email: 'test@example.com',
        password: 'hashedpassword',
        authType: 'manual'
    });

    testPackage = await Package.create({
        packageName: 'Test Package',
        startPrice: 500000,
        imageUrl: 'https://example.com/image.jpg',
        description: 'Test package description',
        pdfLink: 'https://drive.google.com/file/d/1234567890/view'
    });

    access_token = signToken({ id: testUser.id });
});

afterEach(async () => {
    await Order.destroy({ where: {} });
    await Package.destroy({ where: {} });
    await User.destroy({ where: {} });
});

describe('OrderController', () => {
    describe('POST /order', () => {
        it('should create an order successfully', async () => {
            const orderData = {
                PackageId: testPackage.id,
                bookingDate: '2025-06-01'
            };

            const res = await request(app)
                .post('/order')
                .set('Authorization', `Bearer ${access_token}`)
                .send(orderData);

            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty('message', 'Order created successfully');
            expect(res.body.order).toHaveProperty('UserId', testUser.id);
            expect(res.body.order).toHaveProperty('PackageId', testPackage.id);
            expect(res.body.order).toHaveProperty('status', 'Pending');
            expect(res.body.order).toHaveProperty('User');
            expect(res.body.order).toHaveProperty('Package');
        });

        it('should return 400 if required fields are missing', async () => {
            const res = await request(app)
                .post('/order')
                .set('Authorization', `Bearer ${access_token}`)
                .send({ PackageId: testPackage.id });

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('message', 'Package and Booking Date are required!');
        });

        it('should return 404 if package not found', async () => {
            const res = await request(app)
                .post('/order')
                .set('Authorization', `Bearer ${access_token}`)
                .send({
                    PackageId: 99999,
                    bookingDate: '2025-06-01'
                });

            expect(res.status).toBe(404);
            expect(res.body).toHaveProperty('message', 'Package not found!');
        });

        it('should return 401 without authentication', async () => {
            const res = await request(app)
                .post('/order')
                .send({
                    PackageId: testPackage.id,
                    bookingDate: '2025-06-01'
                });

            expect(res.status).toBe(401);
        });
    });

    describe('GET /order/history', () => {
        it('should return order history for authenticated user', async () => {
            // Create a test order first
            await Order.create({
                UserId: testUser.id,
                PackageId: testPackage.id,
                bookingDate: '2025-06-01',
                status: 'Pending'
            });

            const res = await request(app)
                .get('/order/history')
                .set('Authorization', `Bearer ${access_token}`);

            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBeTruthy();
            expect(res.body.length).toBeGreaterThan(0);
            expect(res.body[0]).toHaveProperty('UserId', testUser.id);
            expect(res.body[0]).toHaveProperty('User');
            expect(res.body[0]).toHaveProperty('Package');
        });

        it('should return 401 without authentication', async () => {
            const res = await request(app).get('/order/history');
            expect(res.status).toBe(401);
        });
    });

    describe('DELETE /order/:id', () => {
        let testOrder;

        beforeEach(async () => {
            testOrder = await Order.create({
                UserId: testUser.id,
                PackageId: testPackage.id,
                bookingDate: '2025-06-01',
                status: 'Pending'
            });
        });

        it('should delete order successfully', async () => {
            const res = await request(app)
                .delete(`/order/${testOrder.id}`)
                .set('Authorization', `Bearer ${access_token}`);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('message', 'Order berhasil dihapus');

            // Verify order is actually deleted
            const deletedOrder = await Order.findByPk(testOrder.id);
            expect(deletedOrder).toBeNull();
        });

        it('should return 404 for non-existent order', async () => {
            const res = await request(app)
                .delete('/order/999999')
                .set('Authorization', `Bearer ${access_token}`);

            expect(res.status).toBe(404);
            expect(res.body).toHaveProperty('message', 'Order tidak ditemukan');
        });

        it('should return 401 without authentication', async () => {
            const res = await request(app).delete(`/order/${testOrder.id}`);
            expect(res.status).toBe(401);
        });

        it('should return 404 when trying to delete another user\'s order', async () => {
            const anotherUser = await User.create({
                fullName: 'Another User',
                email: 'another@example.com',
                password: 'hashedpassword',
                authType: 'manual'
            });
            const anotherToken = signToken({ id: anotherUser.id });

            const res = await request(app)
                .delete(`/order/${testOrder.id}`)
                .set('Authorization', `Bearer ${anotherToken}`);

            expect(res.status).toBe(404);
            expect(res.body).toHaveProperty('message', 'Order tidak ditemukan');
        });
    });
});