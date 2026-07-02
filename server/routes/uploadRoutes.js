const express = require("express");
const streamifier = require("streamifier");
const cloudinary = require("../config/cloudinary");
const upload = require("../middleware/uploadMiddleware");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
    "/doctor-image",
    protect,
    authorizeRoles("admin"),
    upload.single("image"),
    async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ message: "No image uploaded" });
            }

            const streamUpload = () => {
                return new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream(
                        { folder: "clinicpro/doctors" },
                        (error, result) => {
                            if (result) resolve(result);
                            else reject(error);
                        }
                    );

                    streamifier.createReadStream(req.file.buffer).pipe(stream);
                });
            };

            const result = await streamUpload();

            res.json({
                message: "Image uploaded successfully",
                imageUrl: result.secure_url,
            });
        } catch (error) {
            res.status(500).json({
                message: "Image upload failed",
                error: error.message,
            });
        }
    }
);

module.exports = router;