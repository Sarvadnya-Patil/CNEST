const router = require('express').Router();
const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register Admin (Requires Master Key)
router.post('/register', async (req, res) => {
    try {
        if (req.body.masterKey !== process.env.MASTER_KEY) {
            return res.status(403).json("Invalid Master Key");
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        const newAdmin = new Admin({
            username: req.body.username,
            password: hashedPassword
        });
        const savedAdmin = await newAdmin.save();

        // Return token so user can be logged in immediately
        const token = jwt.sign({ id: savedAdmin._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.status(201).json({ token, username: savedAdmin.username });
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
