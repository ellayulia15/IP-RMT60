require('dotenv').config();
const express = require('express')
const authentication = require('./middlewares/authentication');
const UserController = require('./controllers/UserController');
const PackageController = require('./controllers/PackageController');
const OrderController = require('./controllers/OrderController');

const app = express()
const port = 3000

const cors = require('cors');
app.use(cors());

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.post('/register', UserController.register)
app.post('/login', UserController.login)
app.post('/login/google', UserController.googleLogin)
app.get('/user', authentication, UserController.profile)
app.put('/user', authentication, UserController.editProfile)

app.get('/packages', PackageController.packages)
app.get('/packages/:id', PackageController.packageById)
app.get('/packages/:id/download', PackageController.downloadPdf)

app.post('/order', authentication, OrderController.order)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

module.exports = app