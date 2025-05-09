require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authentication = require('./middlewares/authentication');
const UserController = require('./controllers/UserController');
const PackageController = require('./controllers/PackageController');
const OrderController = require('./controllers/OrderController');
const VehicleController = require('./controllers/VehicleController');
const BookingController = require('./controllers/BookingController');
const PaymentController = require('./controllers/PaymentController');
const chatRoutes = require('./routes/chatRoutes');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/chat', chatRoutes);

app.post('/register', UserController.register);
app.post('/login', UserController.login);
app.post('/login/google', UserController.googleLogin);
app.get('/user', authentication, UserController.profile);
app.put('/user', authentication, UserController.editProfile);

app.get('/packages', PackageController.packages);
app.get('/packages/:id', PackageController.packageById);
app.get('/packages/:id/download', PackageController.downloadPdf);

app.get('/vehicles', VehicleController.vehicles);
app.get('/vehicles/:id', VehicleController.vehicleById);

app.post('/order/:PackageId', authentication, OrderController.order);
app.get('/order/history', authentication, OrderController.history);
app.delete('/order/:id', authentication, OrderController.deleteOrder);

app.post('/booking/:VehicleId', authentication, BookingController.booking);
app.get('/booking/history', authentication, BookingController.riwayat);
app.delete('/booking/:id', authentication, BookingController.deleteBooking);

app.post('/payment', authentication, PaymentController.createTransaction);
app.post('/payment/notification', PaymentController.handleNotification);
app.post('/payment/update-status', authentication, PaymentController.updateTransactionStatus);
app.get('/payment/status/:order_id', authentication, PaymentController.getTransactionStatus);

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

module.exports = app;