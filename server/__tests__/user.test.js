const request = require('supertest');
const app = require('../app');
const { User } = require('../models');
const { hashPassword } = require('../helpers/bcrypt');
const { signToken } = require('../helpers/jwt');

let testUser;
let access_token;

beforeEach(async () => {
    testUser = await User.create({
        fullName: 'Test User',
        email: 'test@example.com',
        password: hashPassword('password123'),
        authType: 'manual'
    });
    access_token = signToken({ id: testUser.id });
});

afterEach(async () => {
    await User.destroy({ where: {} });
});

describe('UserController', () => {
    describe('POST /register', () => {
        it('should create a new user successfully', async () => {
            const res = await request(app)
                .post('/register')
                .send({
                    fullName: 'New User',
                    email: 'new@example.com',
                    password: 'password123'
                });

            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty('id');
            expect(res.body.email).toBe('new@example.com');
        });

        it('should return 400 if required fields are missing', async () => {
            const res = await request(app)
                .post('/register')
                .send({
                    email: 'new@example.com'
                });

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('message');
        });

        it('should return 400 if email is already registered', async () => {
            const res = await request(app)
                .post('/register')
                .send({
                    fullName: 'Another User',
                    email: 'test@example.com',
                    password: 'password123'
                });

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('message');
        });
    });

    describe('POST /login', () => {
        it('should login successfully with correct credentials', async () => {
            const res = await request(app)
                .post('/login')
                .send({
                    email: 'test@example.com',
                    password: 'password123'
                });

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('access_token');
        });

        it('should return 401 with incorrect password', async () => {
            const res = await request(app)
                .post('/login')
                .send({
                    email: 'test@example.com',
                    password: 'wrongpassword'
                });

            expect(res.status).toBe(401);
            expect(res.body.message).toBe('Invalid email/password');
        });

        it('should return 401 with non-existent email', async () => {
            const res = await request(app)
                .post('/login')
                .send({
                    email: 'nonexistent@example.com',
                    password: 'password123'
                });

            expect(res.status).toBe(401);
            expect(res.body.message).toBe('Invalid email/password');
        });
    });

    describe('POST /login/google', () => {
        it('should return 400 if google token is missing', async () => {
            const res = await request(app)
                .post('/login/google')
                .send({});

            expect(res.status).toBe(400);
            expect(res.body.message).toBe('Google token is required');
        });
    });

    describe('GET /user', () => {
        it('should return user profile with valid token', async () => {
            const res = await request(app)
                .get('/user')
                .set('Authorization', `Bearer ${access_token}`);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('fullName', 'Test User');
            expect(res.body).toHaveProperty('email', 'test@example.com');
            expect(res.body).not.toHaveProperty('password');
        });

        it('should return 401 with invalid token', async () => {
            const res = await request(app)
                .get('/user')
                .set('Authorization', 'Bearer invalid_token');

            expect(res.status).toBe(401);
        });
    });

    describe('PUT /user', () => {
        it('should update user profile successfully', async () => {
            const updateData = {
                fullName: 'Updated Name',
                gender: 'Male',
                phoneNumber: '1234567890',
                address: 'Test Address'
            };

            const res = await request(app)
                .put('/user')
                .set('Authorization', `Bearer ${access_token}`)
                .send(updateData);

            expect(res.status).toBe(200);
            expect(res.body.fullName).toBe(updateData.fullName);
            expect(res.body.gender).toBe(updateData.gender);
            expect(res.body.phoneNumber).toBe(updateData.phoneNumber);
            expect(res.body.address).toBe(updateData.address);
        });

        it('should return 401 with invalid token', async () => {
            const res = await request(app)
                .put('/user')
                .set('Authorization', 'Bearer invalid_token')
                .send({ fullName: 'Updated Name' });

            expect(res.status).toBe(401);
        });
    });
});