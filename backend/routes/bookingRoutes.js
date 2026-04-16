const router = require("express").Router();

let seats = {};

// Generate seats (A1–A10, B1–B10, C1–C10)
["A", "B", "C", "D"].forEach(row => {
    for (let i = 1; i <= 10; i++) {
        seats[`${row}${i}`] = false;
    }
});

// GET SEATS
router.get("/", (req, res) => {
    res.json(seats);
});

// BOOK SEAT
router.post("/book", (req, res) => {
    const { seatNumber } = req.body;

    if (seats[seatNumber]) {
        return res.status(400).json({ msg: "Seat already booked" });
    }

    seats[seatNumber] = true;

    res.json({ msg: "Seat booked successfully" });
});

module.exports = router;
