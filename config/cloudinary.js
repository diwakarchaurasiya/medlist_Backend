const cloudinary = require('cloudinary').v2;
require('dotenv').config();

const connectCloudianry = async () => {
    await cloudinary.config({
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_SECRET_KEY
    });
};

module.exports = connectCloudianry;