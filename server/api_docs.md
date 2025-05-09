# S Tour and Travel API Documentation

## Base URL
```
http://localhost:3000
```

## Authentication
Most endpoints require authentication using JWT token. Include the token in request header:
```
Authorization: Bearer <access_token>
```

## Endpoints

### 1. User Authentication

#### Register New User
- **URL**: `/register`
- **Method**: `POST`
- **Request Body**:
```json
{
    "fullName": "string",
    "email": "string",
    "password": "string"
}
```
- **Success Response**: 
  - **Code**: 201
  - **Content**: 
```json
{
    "id": "integer",
    "email": "string",
    "message": "User registered successfully"
}
```

#### Login with Email
- **URL**: `/login`
- **Method**: `POST`
- **Request Body**:
```json
{
    "email": "string",
    "password": "string"
}
```
- **Success Response**: 
  - **Code**: 200
  - **Content**: 
```json
{
    "access_token": "string"
}
```

#### Google OAuth Login
- **URL**: `/login/google`
- **Method**: `POST`
- **Request Body**:
```json
{
    "googleToken": "string"
}
```
- **Success Response**: 
  - **Code**: 200
  - **Content**: 
```json
{
    "access_token": "string"
}
```

### 2. User Profile Management

#### Get User Profile
- **URL**: `/user`
- **Method**: `GET`
- **Auth Required**: Yes
- **Success Response**: 
  - **Code**: 200
  - **Content**: 
```json
{
    "id": "integer",
    "nik": "string",
    "fullName": "string",
    "gender": "string",
    "email": "string",
    "profilePicture": "string",
    "phoneNumber": "string",
    "address": "string"
}
```

#### Update User Profile
- **URL**: `/user`
- **Method**: `PUT`
- **Auth Required**: Yes
- **Request Body**:
```json
{
    "nik": "string",
    "fullName": "string",
    "gender": "string",
    "phoneNumber": "string",
    "address": "string",
    "profilePicture": "string"
}
```
- **Success Response**: 
  - **Code**: 200
  - **Content**: Updated user object

### 3. Travel Packages

#### Get All Packages
- **URL**: `/packages`
- **Method**: `GET`
- **Success Response**: 
  - **Code**: 200
  - **Content**: Array of packages
```json
[
    {
        "id": "integer",
        "packageName": "string",
        "imageUrl": "string",
        "startPrice": "string",
        "pdfLink": "string"
    }
]
```

#### Get Package by ID
- **URL**: `/packages/:id`
- **Method**: `GET`
- **URL Parameters**: `id=[integer]`
- **Success Response**: 
  - **Code**: 200
  - **Content**: Package object

#### Download Package PDF
- **URL**: `/packages/:id/download`
- **Method**: `GET`
- **URL Parameters**: `id=[integer]`
- **Success Response**: 
  - **Code**: 200
  - **Content**: PDF file download

### 4. Vehicle Management

#### Get All Vehicles
- **URL**: `/vehicles`
- **Method**: `GET`
- **Success Response**: 
  - **Code**: 200
  - **Content**: Array of vehicles
```json
[
    {
        "id": "integer",
        "vehicleName": "string",
        "capacity": "integer",
        "pricePerDay": "integer"
    }
]
```

#### Get Vehicle by ID
- **URL**: `/vehicles/:id`
- **Method**: `GET`
- **URL Parameters**: `id=[integer]`
- **Success Response**: 
  - **Code**: 200
  - **Content**: Vehicle object

### 5. Orders and Bookings

#### Create Package Order
- **URL**: `/order/:PackageId`
- **Method**: `POST`
- **Auth Required**: Yes
- **URL Parameters**: `PackageId=[integer]`
- **Request Body**:
```json
{
    "bookingDate": "date"
}
```
- **Success Response**: 
  - **Code**: 201
  - **Content**: Order object

#### Create Vehicle Booking
- **URL**: `/booking/:VehicleId`
- **Method**: `POST`
- **Auth Required**: Yes
- **URL Parameters**: `VehicleId=[integer]`
- **Request Body**:
```json
{
    "startDate": "date",
    "endDate": "date",
    "originCity": "string",
    "destinationCity": "string",
    "distance": "integer"
}
```
- **Success Response**: 
  - **Code**: 201
  - **Content**: Booking object

#### Get Order History
- **URL**: `/order/history`
- **Method**: `GET`
- **Auth Required**: Yes
- **Success Response**: 
  - **Code**: 200
  - **Content**: Array of orders with package details

#### Get Booking History
- **URL**: `/booking/history`
- **Method**: `GET`
- **Auth Required**: Yes
- **Success Response**: 
  - **Code**: 200
  - **Content**: Array of bookings with vehicle details

#### Delete Order
- **URL**: `/order/:id`
- **Method**: `DELETE`
- **Auth Required**: Yes
- **URL Parameters**: `id=[integer]`
- **Success Response**: 
  - **Code**: 200
  - **Content**: Success message

#### Delete Booking
- **URL**: `/booking/:id`
- **Method**: `DELETE`
- **Auth Required**: Yes
- **URL Parameters**: `id=[integer]`
- **Success Response**: 
  - **Code**: 200
  - **Content**: Success message

### 6. Payment Processing

#### Create Payment Transaction
- **URL**: `/payment`
- **Method**: `POST`
- **Auth Required**: Yes
- **Request Body**:
```json
{
    "order_id": "string",
    "gross_amount": "integer",
    "type": "string"
}
```
- **Success Response**: 
  - **Code**: 201
  - **Content**: 
```json
{
    "redirectUrl": "string"
}
```

#### Check Payment Status
- **URL**: `/payment/status/:order_id`
- **Method**: `GET`
- **Auth Required**: Yes
- **URL Parameters**: `order_id=[string]`
- **Success Response**: 
  - **Code**: 200
  - **Content**: 
```json
{
    "status": "string"
}
```

#### Payment Notification Handler
- **URL**: `/payment/notification`
- **Method**: `POST`
- **Request Body**: Midtrans notification object
- **Success Response**: 
  - **Code**: 200
  - **Content**: OK

### 7. Chat Support

#### Send Chat Message
- **URL**: `/chat`
- **Method**: `POST`
- **Request Body**:
```json
{
    "message": "string"
}
```
- **Success Response**: 
  - **Code**: 200
  - **Content**: 
```json
{
    "response": "string",
    "type": "string"
}
```

### Error Responses

All endpoints can return the following error responses:

#### 400 Bad Request
```json
{
    "message": "Error description"
}
```

#### 401 Unauthorized
```json
{
    "message": "Invalid token"
}
```

#### 404 Not Found
```json
{
    "message": "Resource not found"
}
```

#### 500 Internal Server Error
```json
{
    "message": "Internal server error"
}
```