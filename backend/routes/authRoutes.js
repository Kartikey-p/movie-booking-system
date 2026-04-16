const router = require("express").Router();

let users = [];

// REGISTER
router.post("/register", (req, res) => {
    const { name, email, password } = req.body;

    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
        return res.status(400).json({ msg: "User already exists" });
    }

    users.push({ name, email, password });

    res.json({ message: "User registered successfully" });
});

// LOGIN
router.post("/login", (req, res) => {
    const { email, password } = req.body;

    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        return res.status(400).json({ msg: "Invalid credentials" });
    }

    res.json({ message: "Login successful", user });
});

module.exports = router;