const express = require("express");

const router = express.Router();

const {
    createDocument
} = require("../controllers/documentController");

const authMiddleware = require("../middleware/authmiddleware");

router.post("/", authMiddleware, createDocument);

module.exports = router;