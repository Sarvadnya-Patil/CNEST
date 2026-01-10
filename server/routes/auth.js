const router = require('express').Router();
const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Initial Setup (Run once or manually to create admin)
router.post('/register-root', async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        const newAdmin = new Admin({
            username: req.body.username,
            password: hashedPassword
        });
        const savedAdmin = await newAdmin.save();
        res.status(201).json(savedAdmin);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.post('/login', async (req, res) => {
    try {
        const admin = await Admin.findOne({ username: req.body.username });
        if (!admin) return res.status(404).json("Admin not found");

        const validPassword = await bcrypt.compare(req.body.password, admin.password);
        if (!validPassword) return res.status(400).json("Wrong password");

        const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.status(200).json({ token, username: admin.username });
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
