import auth from "../middlewares/auth.js";
import express from 'express';
import multer from 'multer';
import cloudinary from "../config/cloudinary.js";

const uploadRouter = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

uploadRouter.post('/', auth, async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const b64 = Buffer.from(req.file.buffer).toString('base64');
        const dataURI = "data:" + req.file.mimetype + ";base64," + b64;

        const result = await cloudinary.uploader.upload(dataURI, {
            folder: 'grocery-shop',
            resource_type: 'auto',
        });

        res.json({ url: result.secure_url });

    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).json({ message: 'Server error during file upload' });
    }
})

export default uploadRouter;