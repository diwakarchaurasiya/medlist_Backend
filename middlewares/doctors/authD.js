const jwt = require('jsonwebtoken')
const Doctor = require('../../models/doctor_model')

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.header('Authorization')
        if (!token) {
            return res.status(401).json({ message: "Unauthenticated" })
        }
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        if (!payload) {
            return res.status(401).json({ message: "Unauthenticated" })
        }
        const doctor = await Doctor.findById(payload.id);
        req.doctor = doctor
        next()
    } catch (error) {
        console.log(error)
        return res.status(401).json({ message: "Unauthenticated" })
    }
}

module.exports = authMiddleware