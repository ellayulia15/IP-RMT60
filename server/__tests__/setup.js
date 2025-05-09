const { sequelize } = require('../models');

beforeAll(async () => {
    // Sync all models with the database before running any tests
    await sequelize.sync({ force: true });
});

afterAll(async () => {
    // Only close the connection once after all tests are complete
    await sequelize.close();
});