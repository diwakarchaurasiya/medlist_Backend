const jwt = require('jsonwebtoken');
const Patient = require('../models/patient_model');
const Doctor = require('../models/doctor_model');

const authMiddleware = async (req, res, next) => {
    try {
        // Get token from headers
        const token = req.header('Authorization');
        if (!token) {
            return res.status(401).json({ message: "Unauthenticated" });
        }

        // Decode token
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        if (!payload || !payload.role || !payload.email) {
            return res.status(401).json({ message: "Invalid token payload" });
        }

        let user;
        if (payload.role === 'patient') {
            user = await Patient.findOne({ email: payload.email });
        } else if (payload.role === 'doctor') {
            user = await Doctor.findOne({ email: payload.email });
        } else {
            return res.status(403).json({ message: "Invalid role" });
        }

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Attach user info to request
        req.user = user;
        req.role = payload.role;
        next();
    } catch (error) {
        console.error("Auth Middleware Error:", error);
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

module.exports = authMiddleware;
