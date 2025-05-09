const request = require('supertest');
const app = require('../app');
const { Package } = require('../models');

let testPackage;

beforeEach(async () => {
    testPackage = await Package.create({
        packageName: 'Test Package',
        imageUrl: 'https://example.com/image.jpg',
        startPrice: 500000,
        pdfLink: 'https://drive.google.com/file/d/abc123/view'
    });
});

afterEach(async () => {
    await Package.destroy({ where: {} });
});

describe('PackageController', () => {
    describe('GET /packages', () => {
        it('should return all packages', async () => {
            const res = await request(app).get('/packages');

            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBeTruthy();
            expect(res.body.length).toBeGreaterThan(0);
            expect(res.body[0]).toHaveProperty('packageName', 'Test Package');
        });

        it('should return 500 if database error occurs', async () => {
            const Package = require('../models').Package;
            const originalFindAll = Package.findAll;
            Package.findAll = jest.fn().mockRejectedValue(new Error('Database error'));

            const res = await request(app).get('/packages');

            expect(res.status).toBe(500);
            expect(res.body).toHaveProperty('message', 'Internal server error');

            Package.findAll = originalFindAll;
        });
    });

    describe('GET /packages/:id', () => {
        it('should return a specific package', async () => {
            const res = await request(app).get(`/packages/${testPackage.id}`);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('packageName', 'Test Package');
            expect(res.body).toHaveProperty('startPrice', 500000);
        });

        it('should return 404 for non-existent package', async () => {
            const res = await request(app).get('/packages/999999');

            expect(res.status).toBe(404);
            expect(res.body).toHaveProperty('message', 'Package not found');
        });
    });

    describe('GET /packages/:id/download', () => {
        it('should redirect to download link for valid package', async () => {
            const res = await request(app).get(`/packages/${testPackage.id}/download`);

            expect(res.status).toBe(302); // HTTP redirect status
            expect(res.header.location).toContain('drive.google.com/uc?export=download');
        });

        it('should return 404 for non-existent package', async () => {
            const res = await request(app).get('/packages/999999/download');

            expect(res.status).toBe(404);
            expect(res.body).toHaveProperty('message', 'Package not found');
        });
    });
});