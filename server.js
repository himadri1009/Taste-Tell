// server.js
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require("path");

const app = express();
const PORT = process.env.PORT || 8800;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MySQL Database Connection
const db = mysql.createConnection({
    host: 'localhost', // Change if your DB is hosted elsewhere
    user: 'root', // Your MySQL username
    password: '', // Your MySQL password
    database: 'restaurant_db' // Your MySQL database name
});



// Connect to the database
db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to the database.');
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "./index.html"));
})

// Endpoint to handle order submissions
app.post('/add_orders', (req, res) => {
    const orderDetails = req.body;
    console.log('Order Details:', orderDetails); // Log the order details

    const sql = 'INSERT INTO orders (name, phone, email, order_type, address, city, pickup_time, payment_method, card_number, expiry_date, cvv, upi_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

    db.query(sql, [
        orderDetails.name,
        orderDetails.phone,
        orderDetails.email,
        orderDetails.orderType || null,
        orderDetails.address || null,
        orderDetails.city || null,
        orderDetails.pickupTime || null,
        orderDetails.paymentMethod,
        orderDetails.cardNumber || null,
        orderDetails.expiryDate || null,
        orderDetails.cvv || null,
        orderDetails.upiId || null
    ], (error, results) => {
        if (error) {
            console.error('Error inserting order:', error.code, error.sqlMessage); // Log error code and message
            return res.status(500).send('Error inserting order');
        }
        res.status(201).send({ message: 'Order submitted successfully!', orderId: results.insertId });
    });
});

// Endpoint to handle reservation submissions
app.post('/add_reservations', (req, res) => {
    const reservationDetails = req.body;
    console.log('Reservation Details:', reservationDetails); // Log the reservation details

    const sql = 'INSERT INTO reservations (name, phone, date, time, guests, banquet_hall, banquet_guests, event_type, pre_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';

    db.query(sql, [
        reservationDetails.name,
        reservationDetails.phone,
        reservationDetails.date,
        reservationDetails.time,
        reservationDetails.guests,
        reservationDetails.banquet_hall ? 1 : 0,
        reservationDetails.banquet_guests || null,
        reservationDetails.event_type || null,
        reservationDetails.pre_order ? 1 : 0
    ], (error, results) => {
        if (error) {
            console.error('Error inserting reservation:', error.code, error.sqlMessage); // Log error code and message
            return res.status(500).send('Error inserting reservation');
        }
        res.status(201).send({ message: 'Reservation submitted successfully!', reservationId: results.insertId });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});