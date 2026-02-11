const router = require('express').Router();
const Notice = require('../models/Notice');
const Registration = require('../models/Registration');
const jwt = require('jsonwebtoken');
const xlsx = require('xlsx');
const multer = require('multer');
const path = require('path');
const mammoth = require('mammoth');
const fs = require('fs');

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// Middleware to verify token
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer TOKEN
    if (!token) return res.status(401).json("Access Denied");

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.admin = verified;
        next();
    } catch (err) {
        res.status(400).json("Invalid Token");
    }
};

// --- Utilities (Uploads) ---

// Upload generic file (image/doc)
router.post('/upload', verifyToken, upload.single('file'), (req, res) => {
    try {
        if (!req.file) return res.status(400).json("No file uploaded");
        // Return relative path
        const filePath = `/uploads/${req.file.filename}`;
        res.json({ path: filePath });
    } catch (err) {
        res.status(500).json(err);
    }
});

// Parse Word Document
router.post('/parse-word', verifyToken, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json("No file uploaded");

        // Convert to HTML
        const result = await mammoth.convertToHtml({ path: req.file.path });
        const html = result.value;
        const messages = result.messages;

        // Cleanup: delete temp file? Maybe keep it? Let's delete to save space
        // fs.unlinkSync(req.file.path); 

        res.json({ content: html });
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});


// --- Notices ---

// Get all notices (Public?) - Maybe let's keep it public for the main site
router.get('/notices', async (req, res) => {
    try {
        const notices = await Notice.find().sort({ date: -1 });
        res.json(notices);
    } catch (err) {
        console.error("Error fetching notices:", err);
        res.status(500).json({ message: err.message, stack: err.stack });
    }
});

// Get single notice (Public)
router.get('/notices/:id', async (req, res) => {
    try {
        const notice = await Notice.findById(req.params.id);
        if (!notice) return res.status(404).json("Notice not found");
        res.json(notice);
    } catch (err) {
        console.error("Error fetching notice:", err);
        res.status(500).json(err);
    }
});

// Create Notice (Protected)
router.post('/notices', verifyToken, async (req, res) => {
    const newNotice = new Notice(req.body);
    try {
        const savedNotice = await newNotice.save();
        res.status(201).json(savedNotice);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Update Notice (Protected)
router.patch('/notices/:id', verifyToken, async (req, res) => {
    try {
        const updatedNotice = await Notice.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.status(200).json(updatedNotice);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Delete Notice (Protected)
router.delete('/notices/:id', verifyToken, async (req, res) => {
    try {
        await Notice.findByIdAndDelete(req.params.id);
        res.status(200).json("Notice deleted");
    } catch (err) {
        res.status(500).json(err);
    }
});

// --- Registrations ---

// Create Registration (Public) - Now supports file uploads via multipart/form-data
// upload.any() allows multiple files with any field name
router.post('/registrations', upload.any(), async (req, res) => {
    try {
        // req.body contains text fields
        // req.files contains files

        // Parse "details" if it was sent as a JSON string (common in multipart)
        let details = {};
        if (req.body.details) {
            try {
                details = JSON.parse(req.body.details);
            } catch (e) {
                // simple key-value potentially?
                details = req.body.details;
            }
        } else {
            // If details were flat-mapped, we might need to reconstruct, 
            // but easier if frontend sends a 'details' string or we assume everything else is details
            // For now, let's look for specific fields not in schema
            Object.keys(req.body).forEach(key => {
                if (['name', 'email', 'event', 'details'].includes(key)) return;
                details[key] = req.body[key];
            });
        }

        // Handle uploaded files -> add their paths to details
        if (req.files && req.files.length > 0) {
            req.files.forEach(file => {
                // Use fieldname as label
                details[file.fieldname] = `/uploads/${file.filename}`;
            });
        }

        const newReg = new Registration({
            name: req.body.name,
            email: req.body.email,
            event: req.body.event,
            details: details
        });

        const savedReg = await newReg.save();
        res.status(201).json(savedReg);
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});

// Get Registrations (Protected) - Filter by Notice/Event
router.get('/registrations', verifyToken, async (req, res) => {
    try {
        const { noticeId } = req.query;
        const query = noticeId ? { 'details.noticeId': noticeId } : {};
        const regs = await Registration.find(query).sort({ createdAt: -1 });
        res.json(regs);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Download Excel (Protected)
router.get('/registrations/excel', verifyToken, async (req, res) => {
    try {
        const { noticeId } = req.query;
        const query = noticeId ? { 'details.noticeId': noticeId } : {};

        const regs = await Registration.find(query).lean();

        // If specific event, get form definitions to order columns nicely
        let formFields = [];
        if (noticeId) {
            const notice = await Notice.findById(noticeId);
            if (notice && notice.formFields) formFields = notice.formFields;
        }

        const data = regs.map(r => {
            const baseData = {
                Date: r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '',
            };

            // If we have specific form fields, prioritize them
            if (formFields.length > 0) {
                formFields.forEach(field => {
                    const val = r.details?.[field.label];
                    // If it's a file path, maybe make it clickable or just text? 
                    // Excel supports hyperlinks but might be complex. Text link is fine.
                    // Assuming relative path /uploads/..., make absolute if needed, or host relative
                    baseData[field.label] = val || '';
                });
            } else {
                // Fallback for generic export
                Object.assign(baseData, r);
                delete baseData._id;
                delete baseData.__v;
                delete baseData.updatedAt;

                // Flatten details if it exists and we assume it has useful info
                if (r.details) {
                    Object.assign(baseData, r.details);
                    delete baseData.details;
                }
            }
            return baseData;
        });

        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb, ws, "Registrations");

        const buf = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=registrations.xlsx');
        res.send(buf);

    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});

module.exports = router;
