const express = require('express');
const cors = require('cors')
const app = express();
require('dotenv').config();
const port = process.env.PORT || 3000;
const connectDB = require('./config/mogodb.js');
const connectCloudinary = require('./config/cloudinary.js');
const doctorRoutes = require('./routes/doctor_routes.js');
const patientRoutes = require('./routes/patient_routes.js');
const cookieParser = require('cookie-parser');

// middlewares 
app.use(express.json());
app.use(cors({ credentials: true, }));
connectDB();
app.use(express.urlencoded({ extended: false }))
connectCloudinary();
app.use(cookieParser());


// api endpoints
// app.use("/", (req, res) => {
//     res.send("your server is running sucessfully");
// })

app.use("/api/doctor", doctorRoutes);
app.use("/api/patient", patientRoutes);




//port declearation

app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
    });
});
app.listen(port, () => {
    console.log("your server is running sucessfully on port :", port)
})