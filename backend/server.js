const express = require("express");
const path = require("path");
const app = express();

app.use(express.static(path.join(__dirname, "../")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../index.html"));
});

app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
});

app.use(express.json());

let bookings = [];

app.post("/api/book", (req, res) => {
    const bookingData = req.body;
    bookings.push(bookingData);

    res.json({
        message: "Booking saved successfully!",
        data: bookingData
    });
});