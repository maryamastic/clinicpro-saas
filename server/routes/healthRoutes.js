const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.json({
        status: "OK",
        message: "ClinicPro API is running"
    });
});

module.exports = router;