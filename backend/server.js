const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/hotelBookingDB")
    .then(() => console.log("MongoDB Connected ✅"))
    .catch(err => console.log("MongoDB Error ❌:", err));

const allowedHotels = [
    "Luxury Palace Hotel",
    "Sea View Resort",
    "Mountain Inn",
    "City Central Hotel",
    "Grand Lake Resort",
    "Forest Edge Inn"
];

const bookingSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    hotel: { type: String, required: true },
    guests: { type: Number, required: true },
    checkin: { type: String, required: true },
    checkout: { type: String, required: true },
    total: { type: Number, required: true }
}, { timestamps: true });

const Booking = mongoose.model("Booking", bookingSchema);

app.post("/api/book", async (req, res) => {
    try {

        if (!req.body.hotel) {
            return res.status(400).json({
                message: "Hotel is required ❌"
            });
        }

        const hotelFromUser = req.body.hotel.trim();

        if (!allowedHotels.includes(hotelFromUser)) {
            return res.status(400).json({
                message: "Invalid hotel selection ❌"
            });
        }

        const newBooking = new Booking({
            name: req.body.name,
            email: req.body.email,
            hotel: hotelFromUser,
            guests: req.body.guests,
            checkin: req.body.checkin,
            checkout: req.body.checkout,
            total: req.body.total
        });

        await newBooking.save();

        res.json({
            message: "Booking saved successfully 🎉"
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error saving booking ❌"
        });
    }
});

app.get("/api/bookings", async (req, res) => {
    try {
        const bookings = await Booking.find().sort({ createdAt: -1 });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching bookings ❌"
        });
    }
});

app.put("/api/bookings/:id", async (req, res) => {
    try {

        const updatedBooking = await Booking.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!updatedBooking) {
            return res.status(404).json({
                message: "Booking not found ❌"
            });
        }

        res.json({
            message: "Booking updated successfully ✏️"
        });

    } catch (error) {
        res.status(500).json({
            message: "Error updating booking ❌"
        });
    }
});

app.delete("/api/bookings/:id", async (req, res) => {
    try {

        const deleted = await Booking.findByIdAndDelete(req.params.id);

        if (!deleted) {
            return res.status(404).json({
                message: "Booking not found ❌"
            });
        }

        res.json({
            message: "Booking deleted successfully 🗑️"
        });

    } catch (error) {
        res.status(500).json({
            message: "Error deleting booking ❌"
        });
    }
});

app.get("/", (req, res) => {
    res.send("Hotel Booking Backend is Running 🚀");
});

app.listen(5000, () => {
    console.log("Server is running on http://localhost:5000 🚀");
});